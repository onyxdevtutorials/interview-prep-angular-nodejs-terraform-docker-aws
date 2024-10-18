import Joi from 'joi';

export const userSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid('pending', 'active', 'inactive').required(),
});

export const userPatchSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  status: Joi.string().valid('pending', 'active', 'inactive').optional(),
});
