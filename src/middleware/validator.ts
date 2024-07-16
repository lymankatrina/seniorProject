import { Request, Response, NextFunction } from 'express';
import { param, body, Result, validationResult, ValidationChain } from 'express-validator';
import { collections } from '../services/database.services';
import { ObjectId } from 'mongodb';

const validateEmailRule = () => {
  const rules = [param('email').notEmpty().isEmail().withMessage('Valid email is required')];
  return rules;
};

const capitalizeFirstWords = (value: string): string => {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

const userValidationRules = () => {
  const rules = [
    body('firstName')
      .notEmpty()
      .withMessage('Valid first name is required')
      .isLength({ max: 75 })
      .withMessage('First name must be less than 75 characters')
      .matches(/^[A-Za-z\-\'\s]+$/)
      .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
      .notEmpty()
      .withMessage('Valid last name is required')
      .isLength({ max: 75 })
      .withMessage('Last name must be less than 75 characters')
      .matches(/^[A-Za-z\-\'\s]+$/)
      .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('userName').notEmpty().withMessage('Valid user name is required'),
    body('phone')
      .optional({checkFalsy:true})
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
        const userId = req.params.id;
        const existingUser = await collections.users.findOne({ email: value });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new Error('Email already in use');
        }
      }),
    body('isAdmin').notEmpty().withMessage('Enter true if the user is an Admin').isBoolean().withMessage('isAdmin must be a boolean value')
  ];
  return rules;
};

const movieValidationRules = () => {
  const rules = [
    body('title')
      .isString()
      .withMessage('Movie title is required and is a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('Movie title max length is 85 characters'),
    body('tagLine')
      .isString()
      .withMessage('tagLine is required and is a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('tagline max length is 85 characters'),
    body('overview')
      .isString()
      .withMessage('Overview is required and is a string')
      .trim()
      .isLength({ min: 1, max: 850 })
      .withMessage('Overview max length is 850 characters'),
    body('year').isInt({ min: 1888, max: 3000 }).withMessage('Movie year is required and should be YYYY'),
    body('certification')
      .isString()
      .trim()
      .isIn(['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'])
      .withMessage('Must be either G, PG, PG-13, R, NC-17, or Not Rated'),
    body('releaseDate')
      .isString()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Release Date is required and should be YYYY-MM-DD'),
    body('genres').notEmpty().withMessage('Genres is required').isString().withMessage('Genres is a string'),
    body('runtime')
      .isString()
      .trim()
      .matches(/^([0-9]+h\s+[0-5]?[0-9]+m)$/)
      .withMessage('runtime is required and should be in the format 1h 55m'),
    body('imdbScore').optional().isFloat({ min: 0.0, max: 10.0 }).withMessage('IMDB Score should be an integer between 0.0 and 10.0'),
    body('rottenTomatoes')
      .optional()
      .isString()
      .trim()
      .matches(/^(100(\.0+)?|(\d{1,2})(\.\d+)?)%$/)
      .withMessage('rottenTomatoes should be between 1% and 100%'),
    body('fandangoAudienceScore')
      .optional()
      .isString()
      .trim()
      .matches(/^(100(\.0+)?|(\d{1,2})(\.\d+)?)%$/)
      .withMessage('fandangoAudienceScore should be between 1% and 100%'),
    body('poster').isURL().withMessage('Poster must be a URL link to a publicly shared image'),
    body('trailer').isURL().withMessage('Trailer must be a URL link to a publicly shared official trailer')
  ];
  return rules;
};

const eventValidationRules = () => {
  const rules = [
    body('title').isString().trim().isLength({ min: 1, max: 85 }).withMessage('Event title is required and must be less than 85 characters'),
    body('tagline').isString().trim().isLength({ min: 1, max: 85 }).withMessage('Event tagline is required and must be less than 85 characters'),
    body('description').isString().trim().isLength({ min: 1, max: 850 }).withMessage('Description is required and must be less than 850 characters'),
    body('startDate')
      .isString()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Start date is required and must be in the format YYYY-MM-DD'),
    body('endDate')
      .isString()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('End date is required and must be in the format YYYY-MM-DD'),
    body('startTime')
      .isString()
      .trim()
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('startTime is required and should be in the hh:mm AM/PM format'),
    body('endTime')
      .isString()
      .trim()
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('endTime is required and should be in the hh:mm AM/PM format'),
    body('image').isURL().withMessage('Image must be a link to a publicly shared image'),
    body('link').isURL().withMessage('Link must be a url link to a shareable source'),
    body('type').trim().isString().withMessage('Type of event is required'),
    body('postStartDate')
      .isString()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Post start date must be valid'),
    body('postEndDate')
      .isString()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Post end date must be valid'),
    body('status').trim().toLowerCase().isIn(['public', 'private']).withMessage('Status is required and must be public or private')
  ];
  return rules;
};

const newsValidationRules = () => {
  const rules = [
    body('title').isString().trim().isLength({ min: 1, max: 85 }).withMessage('News title is required and must be less than 85 characters'),
    body('tagline').isString().trim().isLength({ min: 1, max: 85 }).withMessage('News tagline is required and must be less than 85 characters'),
    body('description').isString().trim().isLength({ min: 1, max: 850 }).withMessage('Description is required and must be less than 850 characters'),
    body('date')
      .isString()
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Date is required and must be in the format YYYY-MM-DD'),
    body('image').isURL().withMessage('Image must be a link to a publicly shared image'),
    body('link').isURL().withMessage('Link must be a url link to a shareable source'),
    body('status').trim().toLowerCase().isIn(['public', 'private']).withMessage('Status is required and must be public or private'),
    body('isActive').isBoolean().withMessage('isActive must be true or false')
  ];
  return rules;
};

const ticketValidationRules = () => {
  const rules = [
    body('date').exists().withMessage('Date is required and must be in the format YYYY-MM-DD'),
    body('movieId').exists().withMessage('MovieId should be a valid ObjectId string'),
    body('showtimeId').exists().withMessage('ShowtimeId must be a valid ObjectId string'),
    body('time').exists().withMessage('Time is required'),
    body('seatNumber')
  ];
  return rules;
};

const showtimeValidationRules = () => {
  const rules = [
    body('movieId').exists().withMessage('Movie Id is required').isMongoId().withMessage('Movie Id must be a valid object Id'),
    body('startDate')
      .trim()
      .isString()
      .withMessage('Start date is required')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Start date must be in the format YYYY-MM-DD'),
    body('endDate')
      .trim()
      .isString()
      .withMessage('End date is required')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('End date must be in the format YYYY-MM-DD'),
    body('time')
      .trim()
      .isString()
      .withMessage('Time is required')
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('Time should be in the hh:mm AM/PM format'),
    body('type').trim().isString().withMessage('Type of show is required'),
    body('ticketsAvailable')
      .trim()
      .notEmpty()
      .withMessage('Number of tickets available is required')
      .isInt({ min: 1, max: 225 })
      .withMessage('Tickets Available must be a number between 1 and 225')
  ];
  return rules;
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result: Result = validationResult(req);
  const errors = result.array();
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors.map((error) => ({ [error.path]: error.msg })) });
  }

  next();
};

export {
  validateEmailRule,
  userValidationRules,
  movieValidationRules,
  eventValidationRules,
  newsValidationRules,
  ticketValidationRules,
  showtimeValidationRules,
  validate
};
