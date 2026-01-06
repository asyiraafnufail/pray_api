const pool = require('../config/db');

exports.getAllCities = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cities');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};