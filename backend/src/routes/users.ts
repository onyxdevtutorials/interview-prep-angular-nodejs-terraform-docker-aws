import { Router, Request, Response, NextFunction } from 'express';
import knex from 'knex';
import knexConfig from '../knex';
import { User } from '@shared/types/user';
import { userSchema, userPatchSchema } from '../validation/userSchema';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';

const router = Router();
const db = knex(knexConfig[process.env['NODE_ENV'] || 'development']);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: User[] = await db.select('*').from('users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
});

// Get individual user
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user: User = await db('users').where({ id }).first();
    if (!user) {
      return next(new NotFoundError('User not found'));
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    // res.status(500).send('Error fetching user');
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  try {
    const [user]: User[] = await db('users').insert(value).returning('*');
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  try {
    const [user]: User[] = await db('users')
      .where({ id })
      .update(value)
      .returning('*');
    if (!user) {
      return next(new NotFoundError('User not found'));
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
});

// Patch user
router.patch(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { error, value } = userPatchSchema.validate(req.body, {
      presence: 'optional',
    });
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }

    try {
      const [user]: User[] = await db('users')
        .where({ id })
        .update(value)
        .returning('*');
      if (!user) {
        return next(new NotFoundError('User not found'));
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      next(error);
    }
  }
);

// Delete user
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const deletedUsers: User[] = await db('users')
        .where({ id })
        .del()
        .returning('*');
      if (deletedUsers.length === 0) {
        return next(new NotFoundError('User not found'));
      } else {
        res.status(204).json(deletedUsers[0]);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
    }
  }
);

export default router;
