import { Router, Request, Response, NextFunction } from 'express';
import { Product } from '@onyxdevtutorials/interview-prep-shared';
import { productSchema, productPatchSchema } from '../validation/productSchema';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    // console.log('Database connection in route handler:', db.client.config);
    // const tables = await db.raw(
    //   'SELECT name FROM sqlite_master WHERE type="table"'
    // );
    // console.log('Tables in database from products route:', tables);
    const products: Product[] = await db.select('*').from('products');
    // console.log('Fetched products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Get individual product
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const db = req.db;
    // console.log('Database connection in route handler:', db.client.config);
    const product: Product = await db('products').where({ id }).first();
    if (!product) {
      return next(new NotFoundError('Product not found'));
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  try {
    const db = req.db;
    const [product]: Product[] = await db('products')
      .insert(value)
      .returning('*');
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
});

// Update product using PUT method
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  try {
    const db = req.db;
    const [product]: Product[] = await db('products')
      .where({ id })
      .update(value)
      .returning('*');
    if (!product) {
      return next(new NotFoundError('Product not found'));
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
});

// Update product using PATCH method
router.patch(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { error, value } = productPatchSchema.validate(req.body, {
      presence: 'optional',
    });
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    try {
      const db = req.db;
      const [product]: Product[] = await db('products')
        .where({ id })
        .update(value)
        .returning('*');
      if (!product) {
        return next(new NotFoundError('Product not found'));
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      next(error);
    }
  }
);

// Delete product
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const db = req.db;
      const deletedProducts: Product[] = await db('products')
        .where({ id })
        .del()
        .returning('*');
      if (deletedProducts.length === 0) {
        return next(new NotFoundError('Product not found'));
      } else {
        res.status(204).json(deletedProducts[0]);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      next(error);
    }
  }
);

export default router;
