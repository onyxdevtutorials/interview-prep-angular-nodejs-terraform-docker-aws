import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const port = process.env['PORT'] || 3000;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
