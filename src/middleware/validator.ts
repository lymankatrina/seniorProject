import { Request, Response, NextFunction } from 'express';
import { param, body, Result, validationResult, ValidationChain } from 'express-validator';
import { collections } from '../services/database.services';
import { ObjectId } from 'mongodb';
import { MOVIE_CERTIFICATIONS } from '../types/movieCertifications';
import { TICKET_STATUSES } from '../types/ticketStatuses';
import { CONTENT_STATUSES } from '../types/contentStatuses';
import { PRODUCT_TYPES } from '../types/productTypes';
import { PRODUCT_STATUSES } from '../types/productStatuses';
import { SHOWTIME_TYPES } from '../types/showtimeTypes';
import { EVENT_TYPES } from '../types/eventTypes';

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
      .trim()
      .isLength({ min: 1, max: 75 })
      .withMessage('First name must be between 1 and 75 characters')
      .matches(/^[A-Za-z\s'-]+$/)
      .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
      .notEmpty()
      .withMessage('Valid last name is required')
      .isLength({ min: 1, max: 75 })
      .withMessage('Last name must be between 1 and 75 characters')
      .matches(/^[A-Za-z\s'-]+$/)
      .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
    body('userName')
      .notEmpty()
      .withMessage('Valid user name is required'),
    body('phone')
      .optional({ checkFalsy: true })
      .matches(/^(\([0-9]{3}\)\s|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/)
      .withMessage('Enter a valid US Phone Number'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must be a valid email')
      .custom(async (value, { req }) => {
        const userId = req.params?.id;
        const existingUser = await collections.users.findOne({ email: value });
        if (
          existingUser && 
          existingUser._id.toString() !== userId
        ) {
          throw new Error('Email already in use');
        }
      }),
    body('isAdmin')
      .exists()
      .withMessage('isAdmin is required')
      .isBoolean()
      .withMessage('isAdmin must be a boolean value')
      .toBoolean()
  ];
  return rules;
};

const movieFieldValidationRules = (isUpdate = false) => {
  const field = (name: string) => {
    const chain = body(name);
    return isUpdate ? chain.optional() : chain;
  };
  return [
    field('title')
      .isString()
      .withMessage('Movie title is required and must be a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('Movie title must be between 1 and 85 characters'),
    field('tagLine')
      .isString()
      .withMessage('TagLine is required and must be a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('Tagline must be between 1 and 85 characters'),
    field('overview')
      .isString()
      .withMessage('Overview is required and must be a string')
      .trim()
      .isLength({ min: 1, max: 850 })
      .withMessage('Overview must be between 1 and 850 characters'),
    field('year')
      .isInt({ min: 1888, max: 3000 })
      .withMessage('Movie year must be between 1888 and 3000')
      .toInt(),
    field('certification')
      .isString()
      .withMessage('Certification must be a string')
      .trim()
      .isIn([...MOVIE_CERTIFICATIONS])
      .withMessage('Certification must be a valid movie certification'),
    field('releaseDate')
      .isString()
      .withMessage('Release Date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Release Date must be YYYY-MM-DD'),
    field('genres')
      .isString()
      .withMessage('Genres must be a string')
      .trim()
      .notEmpty()
      .withMessage('Genres cannot be empty'),
    field('runtime')
      .isString()
      .withMessage('runtime must be a string')
      .trim()
      .matches(/^[0-9]+h\s+[0-5]?[0-9]m$/)
      .withMessage('runtime must be in the format 1h 55m'),
    body('imdbScore')
      .optional({ values: 'falsy' })
      .isFloat({ min: 0, max: 10 })
      .withMessage('IMDB Score must be a number between 0 and 10')
      .toFloat(),
    body('rottenTomatoes')
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .matches(/^(100|\d{1,2})%$/)
      .withMessage('rottenTomatoes must be between 0% and 100%'),
    body('fandangoAudienceScore')
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .matches(/^(100|\d{1,2})%$/)
      .withMessage('Fandango audience score must be between 0% and 100%'),
    field('poster')
      .isString()
      .trim()
      .isURL()
      .withMessage('Poster must be a URL to a publicly shared image'),
    field('trailer')
      .isString()
      .trim()
      .isURL()
      .withMessage('Trailer must be a URL to an official trailer')
  ];  
};

const movieValidationRules = () => {
  return movieFieldValidationRules(false);
};

const updateMovieValidationRules = () => {
  return movieFieldValidationRules(true);
};

const eventFieldValidationRules = (isUpdate = false) => {
  const field = (name: string) => {
    const chain = body(name);
    return isUpdate ? chain.optional() : chain;
  };
  return [
    field('title')
      .isString()
      .withMessage('Event title must be a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('Event title must be between 1 and 85 characters'),
    field('tagline')
      .isString()
      .withMessage('Event tagline must be a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('Event tagline must be between 1 and 85 characters'),
    field('description')
      .isString()
      .withMessage('Event description must be a string')
      .trim()
      .isLength({ min: 1, max: 850 })
      .withMessage('Event description must be between 1 and 850 characters'),
    field('startDate')
      .isString()
      .withMessage('Start date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Start date must be in the format YYYY-MM-DD'),
    field('endDate')
      .isString()
      .withMessage('End date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('End date must be in the format YYYY-MM-DD')
      .custom((endDate, { req }) => {
        if (
          req.body.startDate && 
          endDate < req.body.startDate
        ) {
          throw new Error(
            'End date must be on or after start date'
          );
        }
        return true;
      }),
    field('startTime')
      .isString()
      .withMessage('Start Time must be a string')
      .trim()
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('Start Time must be in the hh:mm AM/PM format'),
    field('endTime')
      .isString()
      .withMessage('End Time must be a string')
      .trim()
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('endTime must be in the hh:mm AM/PM format'),
    field('image')
      .isString()
      .trim()
      .isURL()
      .withMessage('Image link must be a valid URL to a publicly shared image'),
    field('link')
      .isString()
      .trim()
      .isURL()
      .withMessage('Link must be a valid URL link to a shareable source'),
    field('type')
      .isString()
      .withMessage('Event type must be a string')
      .trim()
      .toLowerCase()
      .isIn([...EVENT_TYPES])
      .withMessage('Event type must be a valid event type'),
    field('postStartDate')
      .isString()
      .withMessage('Post start date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Post start date must be in the format YYYY-MM-DD'),
    field('postEndDate')
      .isString()
      .withMessage('Post end date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Post end date must be in the format YYYY-MM-DD')
      .custom((postEndDate, { req }) => {
        if (
          req.body.postStartDate && 
          postEndDate < req.body.postStartDate
        ) {
          throw new Error(
            'Post end date must be on or after post start date'
          );
        }
        return true;
      }),
    field('status')
      .isString()
      .withMessage('Status must be a string')
      .trim()
      .toLowerCase()
      .isIn([...CONTENT_STATUSES])
      .withMessage('Status must be a valid content status')
  ];
};

const eventValidationRules = () => {
  return eventFieldValidationRules(false);
};

const updateEventValidationRules = () => {
  return eventFieldValidationRules(true);
};

const newsFieldValidationRules = (isUpdate = false) => {
  const field = (name: string) => {
    const chain = body(name);
    return isUpdate ? chain.optional() : chain;
  };
  return [
    field('title')
      .isString()
      .withMessage('News title must be a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('News title must be between 1 and 85 characters'),
    field('tagline')
      .isString()
      .withMessage('News tagline must be a string')
      .trim()
      .isLength({ min: 1, max: 85 })
      .withMessage('News tagline must be between 1 and 85 characters'),
    field('description')
      .isString()
      .withMessage('News description must be a string')
      .trim()
      .isLength({ min: 1, max: 850 })
      .withMessage('News description must be between 1 and 850 characters'),
    field('date')
      .isString()
      .withMessage('Date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Date must be in the format YYYY-MM-DD'),
    field('image')
      .isString()
      .trim()
      .isURL()
      .withMessage('Image must be a URL to a publicly shared image'),
    field('link')
      .isString()
      .trim()
      .isURL()
      .withMessage('Link must be a URL to a shareable source'),
    field('status')
      .isString()
      .withMessage('Status must be a string')
      .trim()
      .toLowerCase()
      .isIn([...CONTENT_STATUSES])
      .withMessage('Status must be a valid content status'),
    field('isActive')
      .isBoolean()
      .withMessage('isActive must be true or false')
      .toBoolean()
  ];
};

const newsValidationRules = () => {
  return newsFieldValidationRules(false);
};

const updateNewsValidationRules = () => {
  return newsFieldValidationRules(true);
};

const surveyFieldValidationRules = (isUpdate = false) => {
  const field = (name: string) => {
    const chain = body(name);
    return isUpdate ? chain.optional() : chain;
  };
  return [
    field('surveyLink')
      .isString()
      .withMessage('Survey link must be a string')
      .trim()
      .isURL()
      .withMessage('Survey link must be a valid URL'),
    field('isActive')
      .isBoolean()
      .withMessage('isActive must be true or false')
      .toBoolean()
  ];
};

const surveyValidationRules = () => {
  return surveyFieldValidationRules(false);
};

const updateSurveyValidationRules = () => {
  return surveyFieldValidationRules(true);
};

const ticketValidationRules = () => {
  const rules = [
    body('movieId')
      .exists()
      .withMessage('Movie ID is required')
      .isMongoId()
      .withMessage('Movie ID must be a valid ObjectId'),
    body('showtimeId')
      .exists()
      .withMessage('Showtime ID must be a valid ObjectId')
      .isMongoId()
      .withMessage('Showtime ID must be a valid ObjectId'),
    body('date')
      .exists()
      .withMessage('Date is required')
      .isString()
      .trim()
      .matches(/^\d{4}-\d(2)-\d{2}$/)
      .withMessage('Date must be in the format YYYY-MM-DD'),
    body('time')
      .exists()
      .withMessage('Time is required')
      .isString()
      .trim()
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('Time must be in the hh:mm AM/PM format'),
    body('status')
      .exists()
      .withMessage('Ticket status is required')
      .isIn([...TICKET_STATUSES])
      .withMessage('Ticket status must be available, reserved, or sold'),
    body('ticketNumber')
      .exists()
      .withMessage('Ticket number is required')
      .isInt({ min: 1 })
      .withMessage('Ticket number must be a positive whole number')
      .toInt()
  ];
  return rules;
};

const showtimeFieldValidationRules = (
  isUpdate = false
) => {
  const field = (name: string) => {
    const chain = body(name);
    return isUpdate
      ? chain.optional()
      : chain;
  };
  return [
    field('movieId')
      .isMongoId()
      .withMessage('Movie Id must be a valid object Id'),
    field('startDate')
      .isString()
      .withMessage('Start date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Start date must be in the format YYYY-MM-DD'),
    field('endDate')
      .isString()
      .withMessage('End date must be a string')
      .trim()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('End date must be in the format YYYY-MM-DD')
      .custom((endDate, {req}) => {
        if (
          req.body.startDate && 
          endDate < req.body.startDate
      ) {
        throw new Error(
          'End date must be on or after start date'
          );
        }
      return true;
      }),
    field('time')
      .isString()
      .withMessage('Time must be a string')
      .trim()
      .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .withMessage('Time should be in the hh:mm AM/PM format'),
    field('showtimeType')
      .isString()
      .withMessage('Showtime type must be a string')
      .isIn([...SHOWTIME_TYPES])
      .withMessage('Showtime type must be valid'),
    field('seatCapacity')
      .isInt({ min: 1, max: 225 })
      .withMessage('Seating capacity must be a whole number between 1 and 225')
      .toInt()
  ];
};

const showtimeValidationRules = () => {
  return showtimeFieldValidationRules(false);
};

const updateShowtimeValidationRules = () => {
  return showtimeFieldValidationRules(true);
};

const productValidationRules = () => {
  return [
    body('name')
      .exists()
      .withMessage('Product name is required')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Product name must be between 1 and 100 characters'),
    body('description')
      .exists()
      .withMessage('Product description is required')
      .isString()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Product description must be between 1 and 500 characters'),
    body('productType')
      .exists()
      .withMessage('Product type is required')
      .isIn([...PRODUCT_TYPES])
      .withMessage('Product type must be snack, drink, or swag'),
    body('priceInCents')
      .exists()
      .withMessage('Product price is required')
      .isInt({ min: 0 })
      .withMessage('Product price must be a non-negative whole number')
      .toInt(),
    body('inventory')
      .exists()
      .withMessage('Inventory is required')
      .isInt({ min: 0 })
      .withMessage('Inventory must be a non-negative whole number')
      .toInt(),
    body('image')
      .exists()
      .withMessage('Product image is required')
      .isURL()
      .withMessage('Product image must be a valid URL'),
    body('status')
      .exists()
      .withMessage('Product status is required')
      .isIn([...PRODUCT_STATUSES])
      .withMessage('Product status must be active or inactive')
  ];
};

const cartTicketValidationRules = () => {
  return [
    body('ticketIds')
      .isArray({ min: 1 })
      .withMessage('ticketIds must be a non-empty array'),

    body('ticketIds.*')
      .isMongoId()
      .withMessage('Each ticketId must be a valid MongoDB ObjectId')
  ];
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
  updateMovieValidationRules,
  eventValidationRules,
  updateEventValidationRules,
  newsValidationRules,
  updateNewsValidationRules,
  surveyValidationRules,
  updateSurveyValidationRules,
  ticketValidationRules,
  showtimeValidationRules,
  updateShowtimeValidationRules,
  productValidationRules,
  cartTicketValidationRules,
  validate
};
