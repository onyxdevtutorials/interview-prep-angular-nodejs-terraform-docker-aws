import { Router, Request, Response, NextFunction } from 'express';
import knex from 'knex';
import knexConfig from '../knex';
import { Product } from '@shared/types/product';
import { productSchema, productPatchSchema } from '../validation/productSchema';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';

const router = Router();
const db = knex(knexConfig[process.env['NODE_ENV'] || 'development']);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products: Product[] = await db.select('*').from('products');
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
