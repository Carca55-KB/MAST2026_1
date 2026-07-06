const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error:', err));

pool.query(`
    CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(45),
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`).catch(err => console.error('Table creation error:', err));

app.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    pool.query('INSERT INTO visitors (ip) VALUES ($1)', [ip]).catch(() => {});
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as visits FROM visitors');
        res.json({ visits: result.rows[0].visits });
    } catch (err) {
        res.json({ visits: 0 });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
