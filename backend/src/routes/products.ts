import { Router, Request, Response, NextFunction } from 'express';
import { Product } from '@onyxdevtutorials/interview-prep-shared';
import { productSchema, productPatchSchema } from '../validation/productSchema';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    const products: Product[] = await db.select('*').from('products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // res.status(500).send('Error fetching products');
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const db = req.db;
    const product: Product = await db('products').where({ id }).first();
    if (!product) {
      return next(new NotFoundError('Product not found'));
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    // res.status(500).send('Error fetching product');
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  try {
    const db = req.db;
    const productToInsert = { ...value, version: 1 };
    const [product]: Product[] = await db('products')
      .insert(productToInsert)
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
    const currentProduct = await db('products').where({ id }).first();

    if (!currentProduct) {
      return next(new NotFoundError('Product not found'));
    }

    const updatedProduct = { 
      ...value, 
      version: currentProduct.version + 1
    };

    // If we don't find a product with the given id and "current" version, we know that the product has been updated by another request.
    const [product]: Product[] = await db('products')
      .where({ id, version: currentProduct.version })
      .update(updatedProduct)
      .returning('*');
    
    if (!product) {
      return next(new ConflictError('Conflict: Product has been updated by another request'));
    }
    
    res.status(200).json(product);
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
      const currentProduct = await db('products').where({ id }).first();

      if (!currentProduct) {
        return next(new NotFoundError('Product not found'));
      }

      const updatedProduct = {
        ...currentProduct,
        ...value,
        version: currentProduct.version + 1,
      };

      const [product]: Product[] = await db('products')
        .where({ id, version: currentProduct.version })
        .update(updatedProduct)
        .returning('*');

      if (!product) {
        return next(new ConflictError('Conflict: Product has been updated by another request'));
      }

      res.status(200).json(product);
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
      // If an id isn't matched, returns the number 0.
      // Some libraries might return an empty array. Not sure about that.
      if (!deletedProducts || deletedProducts.length === 0) {
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
