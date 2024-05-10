import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Movie from '../models/movies';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'title',
      'tagLine',
      'overview',
      'year',
      'certification',
      'releaseDate',
      'genres',
      'runtime',
      'poster',
      'trailer',
      'isPremier',
      'startDate',
      'endDate',
      'isActive'
    ],
    additionalProperties: false,
    properties: {
      _id: {},
      title: {
        bsonType: 'string',
        description: "'title' is required and is a string"
      },
      tagLine: {
        bsonType: 'string',
        description: "'tagline' is required and is a string"
      },
      overview: {
        bsontType: 'string',
        description: "'overview' is required and is a string"
      },
      year: {
        bsonType: 'int',
        description: "'year' is required and must be in the format YYYY"
      },
      certification: {
        bsonType: 'string',
        enum: ['R', 'PG-13', 'PG', 'G', 'NC-17'],
        description: 'Must be either G, PG, PG-13, R, or NC-17'
      },
      releaseDate: {
        bsonType: 'date',
        description: "'Release Date' is required and must be YYYY-MM-DD"
      },
      genres: {
        bsonType: 'array',
        items: {
          bsonType: 'string',
          enum: [
            'Action',
            'Adult',
            'Adventure',
            'Animation',
            'Biography',
            'Comedy',
            'Crime',
            'Documentary',
            'Drama',
            'Faith and Spirituality',
            'Family',
            'Fantasy',
            'Film Noir',
            'Game Show',
            'History',
            'Horror',
            'Musical',
            'Music',
            'Mystery',
            'News',
            'Reality-TV',
            'Romance',
            'Sci-Fi',
            'Short',
            'Sport',
            'Talk-Show',
            'Thriller',
            'War',
            'Western'
          ]
        },
        description: 'Must include at least one valid Genre'
      },
      runtime: {
        bsonType: 'string',
        pattern: '^([0-9]+h\\s+[0-59]+m)$',
        description: 'Enter run time in hours and minutes (example: 2h 16m)'
      },
      imdbScore: {
        bsonType: 'int',
        pattern: '^(10(\\.0)?|[0-9](\\.[0-9])?)$',
        description: 'IMDB score should be a between 0.0 and 10'
      },
      rottenTomatoes: {
        bsonType: 'string',
        pattern: '^(100|\\d{1,2})%$',
        description: 'Rotten tomatoes should be a percentage from 1% to 100%'
      },
      image: {
        bsonType: 'string',
        description: 'Image must be a url link to a publicly shared image'
      },
      trailer: {
        bsonType: 'string',
        description: 'Trailer must be a url link to an official trailer'
      },
      isPremier: {
        bsonType: 'bool',
        description: 'Must be true or false'
      },
      startDate: {
        bsonType: 'date',
        description: 'Start Date must be valid'
      },
      endDate: {
        bsonType: 'date',
        description: 'End Date must be valid'
      },
      isActive: {
        bsonType: 'bool',
        description: 'Enter true or false'
      }
    }
  };

  await db
    .command({
      collMod: process.env.MOVIES_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.MOVIES_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
