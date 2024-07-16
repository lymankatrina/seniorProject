import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Movie from '../models/movies';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['_id', 'title', 'tagLine', 'overview', 'year', 'certification', 'releaseDate', 'genres', 'runtime', 'poster', 'trailer'],
    additionalProperties: false,
    properties: {
      _id: {},
      title: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'title' is required and is a string"
      },
      tagLine: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'tagline' is required and is a string"
      },
      overview: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 850,
        description: "'overview' is required and is a string"
      },
      year: {
        bsonType: 'int',
        maximum: 3000,
        exclusiveMaximum: true,
        minimum: 1888,
        exclusiveMinimum: true,
        description: "'year' the movie was produced must be in the format YYYY"
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
        bsonType: 'string',
        description: 'Genre is required and is a string'
      },
      runtime: {
        bsonType: 'string',
        pattern: '^([0-9]+h\\s+[0-59]+m)$',
        description: 'Enter run time in hours and minutes (example: 2h 16m)'
      },
      imdbScore: {
        bsonType: 'double',
        minimum: 0.0,
        maximum: 10.0,
        description: 'IMDB score should be a number between 0.0 and 10'
      },
      rottenTomatoes: {
        bsonType: 'string',
        pattern: '^(100|\\d{1,2})%$',
        description: 'Rotten tomatoes should be a percentage from 1% to 100%'
      },
      fandangoAudienceScore: {
        bsonType: 'string',
        pattern: '^(100|\\d{1,2})%$',
        description: 'Fandango audience score should be a percentage from 1% to 100%'
      },
      poster: {
        bsonType: 'string',
        description: 'Image must be a url link to a publicly shared image'
      },
      trailer: {
        bsonType: 'string',
        description: 'Trailer must be a url link to an official trailer'
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
