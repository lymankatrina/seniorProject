import { Request, Response, NextFunction } from 'express';
import { body, Result, validationResult } from 'express-validator';
import { collections } from '../services/database.services';

const userValidationRules = () => {
  const rules = [
    body('firstName').notEmpty().isLength({ min: 2, max: 20 }).withMessage('Valid first name is required'),
    body('lastName').notEmpty().isLength({ min: 2, max: 20 }).withMessage('Valid last name is required'),
    body('userName').notEmpty().withMessage('Valid user name is required'),
    body('phone')
      .notEmpty()
      .matches(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/)
      .withMessage('Enter a valid US Phone Number'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must be a valid email')
      .custom(async (value, { req }) => {
        if (req.method === 'POST') {
          const existingUser = await collections.users.findOne({ email: value });
          if (existingUser) {
            throw new Error('Email already in use');
          }
        } else if (req.method === 'PUT') {
          const existingUser = await collections.users.findOne({ email: value });
          if (existingUser && existingUser._id.toString() !== req.params.id) {
            throw new Error('Email already in use');
          }
        }
        return true;
      }),
    body('isAdmin').notEmpty().isBoolean().withMessage('Enter true if the user is an Admin')
  ];

  return rules;
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result: Result = validationResult(req);
  const errors = result.array();
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors.map((error) => ({ [error.param]: error.msg })) });
  }

  next();
};

export { userValidationRules, validate };
