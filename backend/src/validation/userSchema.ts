import Joi from 'joi';
import { UserStatus } from '@onyxdevtutorials/interview-prep-shared';

export const userSchema = Joi.object({
  id: Joi.number().integer().optional(),
  first_name: Joi.string().required(),
  middle_name: Joi.string().optional().allow(null),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid(...Object.values(UserStatus)).required(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  age: Joi.number().integer().optional(),
  street_address: Joi.string().optional().allow(null),
  city: Joi.string().optional().allow(null),
  favorite_song: Joi.string().optional().allow(null),
  favorite_color: Joi.string().optional().allow(null),
  version: Joi.number().integer().min(1).required(),
});

export const userCreateSchema = Joi.object({
  first_name: Joi.string().required(),
  middle_name: Joi.string().optional().allow(null),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid(...Object.values(UserStatus)).required(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  age: Joi.number().integer().optional(),
  street_address: Joi.string().optional().allow(null),
  city: Joi.string().optional(),
  favorite_song: Joi.string().optional(),
  favorite_color: Joi.string().optional(),
});

export const userPatchSchema = Joi.object({
  id: Joi.number().integer().optional(),
  first_name: Joi.string().optional(),
  middle_name: Joi.string().optional().allow(null),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  status: Joi.string().valid(...Object.values(UserStatus)).optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
  age: Joi.number().integer().optional(),
  street_address: Joi.string().optional().allow(null),
  city: Joi.string().optional(),
  favorite_song: Joi.string().optional(),
  favorite_color: Joi.string().optional(),
  version: Joi.number().integer().min(1).required(),
});
