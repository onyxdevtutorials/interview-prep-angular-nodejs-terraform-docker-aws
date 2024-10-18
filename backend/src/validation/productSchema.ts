import Joi from 'joi';
import { ProductStatus } from '@shared/types/productStatus';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().integer().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
});

export const productPatchSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().integer().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
});
