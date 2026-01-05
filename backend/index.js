const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const app = express();
const PORT = 5555;

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

app.get('/api/cities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cities');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-key', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;

  try {
    const logCheck = await pool.query(
      'SELECT COUNT(*) FROM generation_logs WHERE ip_address = $1 AND created_at = CURRENT_DATE',
      [ip]
    );

    const generationCount = parseInt(logCheck.rows[0].count);

    if (generationCount >= 3) {
      return res.status(429).json({ error: 'Daily limit for generating keys reached (3day).' });
    }

    await pool.query('INSERT INTO generation_logs (ip_address) VALUES ($1)', [ip]);

    const newKey = uuidv4();
    await pool.query('INSERT INTO api_keys (key_string) VALUES ($1)', [newKey]);
    
    res.json({ apiKey: newKey, limit: '10 requests/day' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/schedule', async (req, res) => {
  const apiKey = req.query.key;
  const cityId = req.query.cityId;

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key required' });
  }

  try {
    const keyCheck = await pool.query('SELECT * FROM api_keys WHERE key_string = $1', [apiKey]);
    
    if (keyCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid API Key' });
    }

    const keyData = keyCheck.rows[0];
    const now = new Date();
    
    let lastRequestDate = null;
    if (keyData.last_request_timestamp) {
      lastRequestDate = new Date(keyData.last_request_timestamp);
    }

    let newCount = keyData.request_count;

    const isSameDay = lastRequestDate && 
      now.getDate() === lastRequestDate.getDate() &&
      now.getMonth() === lastRequestDate.getMonth() &&
      now.getFullYear() === lastRequestDate.getFullYear();

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

    if (schedule.rows.length === 0) {
      return res.status(404).json({ message: 'No schedule found for this city' });
    }
    
    const data = {
      ...schedule.rows[0],
      request_limit: '10/day',
      remaining_requests: 10 - newCount
    };

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});