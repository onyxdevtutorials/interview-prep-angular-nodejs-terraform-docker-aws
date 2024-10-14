import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import knex from 'knex';
import knexConfig from './knex';

const envFile =
  process.env['NODE_ENV'] === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: envFile });

const app = express();
const port = process.env['PORT'] || 3000;

app.use(bodyParser.json());

console.log('DATABASE_URL:', process.env['DATABASE_URL']);

// knex handles pooling
const db = knex(knexConfig[process.env['NODE_ENV'] || 'development']);

// Test route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/products', async (req, res) => {
  try {
    const products = await db.select('*').from('products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Get individual product
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db('products').where({ id }).first();
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});

app.post('/products', async (req, res) => {
  const { name, price } = req.body;
  try {
    const [product] = await db('products')
      .insert({ name, price })
      .returning('*');
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
});

// Update product using PUT method
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const [product] = await db('products')
      .where({ id })
      .update({ name, price })
      .returning('*');
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

// Update product using PATCH method
app.patch('/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [product] = await db('products')
      .where({ id })
      .update(updates)
      .returning('*');
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db('products').where({ id }).del().returning('*');
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
