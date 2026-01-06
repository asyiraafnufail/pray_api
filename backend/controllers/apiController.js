const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

exports.generateKey = async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  try {
    const logCheck = await pool.query(
      'SELECT COUNT(*) FROM generation_logs WHERE ip_address = $1 AND created_at = CURRENT_DATE',
      [ip]
    );
    if (parseInt(logCheck.rows[0].count) >= 3) {
      return res.status(429).json({ error: 'Daily limit for generating keys reached (3/day).' });
    }
    await pool.query('INSERT INTO generation_logs (ip_address) VALUES ($1)', [ip]);
    const newKey = uuidv4();
    await pool.query('INSERT INTO api_keys (key_string) VALUES ($1)', [newKey]);
    res.json({ apiKey: newKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSchedule = async (req, res) => {
  const { key, cityId } = req.query;
  if (!key) return res.status(401).json({ error: 'API Key required' });

  try {
    const keyCheck = await pool.query('SELECT * FROM api_keys WHERE key_string = $1', [key]);
    if (keyCheck.rows.length === 0) return res.status(403).json({ error: 'Invalid API Key' });

    const keyData = keyCheck.rows[0];
    const now = new Date();
    let lastRequestDate = keyData.last_request_timestamp ? new Date(keyData.last_request_timestamp) : null;
    let newCount = keyData.request_count;

    const isSameDay = lastRequestDate && now.toDateString() === lastRequestDate.toDateString();

    if (!isSameDay) {
      newCount = 1;
    } else {
      if (keyData.request_count >= 10) {
        return res.status(429).json({ error: 'Daily request limit exceeded (10/day)' });
      }
      newCount++;
    }

    await pool.query(
      'UPDATE api_keys SET request_count = $1, last_request_timestamp = $2 WHERE id = $3',
      [newCount, now, keyData.id]
    );

    const schedule = await pool.query(
      'SELECT c.name as city, p.date, p.subuh, p.dzuhur, p.ashar, p.maghrib, p.isya FROM prayer_times p JOIN cities c ON p.city_id = c.id WHERE p.city_id = $1',
      [cityId]
    );

    res.json(schedule.rows[0] || { message: 'No schedule found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};