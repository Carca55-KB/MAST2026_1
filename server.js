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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/setup', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS f1_drivers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                team VARCHAR(100),
                number INTEGER,
                country VARCHAR(50)
            )
        `);
        
        const checkData = await pool.query('SELECT COUNT(*) FROM f1_drivers');
        if (checkData.rows[0].count === '0') {
            await pool.query(`
                INSERT INTO f1_drivers (name, team, number, country) VALUES
                ('Charles Leclerc', 'Ferrari', 16, 'Monaco'),
                ('Carlos Sainz', 'Ferrari', 55, 'Spain'),
                ('Max Verstappen', 'Red Bull', 1, 'Netherlands'),
                ('Lewis Hamilton', 'Mercedes', 44, 'United Kingdom'),
                ('Lando Norris', 'McLaren', 4, 'United Kingdom')
            `);
        }
        
        res.json({ message: 'Tabella creata e popolata con dati finti!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/drivers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM f1_drivers');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
