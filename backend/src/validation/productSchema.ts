import Joi from 'joi';
import { ProductStatus } from '@onyxdevtutorials/interview-prep-shared';

export const productSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().integer().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  quantity: Joi.number().integer().optional(),
  color: Joi.string().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  version: Joi.number().integer().min(1).required(),
});

export const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().integer().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  color: Joi.string().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  quantity: Joi.number().integer().optional(),
});

export const productPatchSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().integer().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
  quantity: Joi.number().integer().optional(),
  color: Joi.string().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  version: Joi.number().integer().min(1).required(),
});
