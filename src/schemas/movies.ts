import * as mongoDB from 'mongodb';
import type { Db } from 'mongodb';
import { MOVIE_CERTIFICATIONS } from '../types/movieCertifications';
import { getEnv } from '../config/env'

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
      'trailer'],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
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
        minimum: 1888,
        maximum: 3000,
        description: "'year' the movie was produced must be in the format YYYY"
      },
      certification: {
        bsonType: 'string',
        enum: [...MOVIE_CERTIFICATIONS],
        description: 'Must be a valid movie certification'
      },
      releaseDate: {
        bsonType: 'date',
        description: "'releaseDate' is required and must be a BSON date"
      },
      genres: {
        bsonType: 'string',
        description: 'Genre is required and is a string'
      },
      runtime: {
        bsonType: 'string',
        pattern: '^[0-9]+h\\s+[0-5]?[0-9]m$',
        description: 'Enter run time in hours and minutes (example: 2h 16m)'
      },
      poster: {
        bsonType: 'string',
        description: 'Image must be a url link to a publicly shared image'
      },
      trailer: {
        bsonType: 'string',
        description: 'Trailer must be a url link to an official trailer'
      },
      // Optional fields
      imdbScore: {
        bsonType: ['double', 'int' ],
        minimum: 0,
        maximum: 10,
        description: 'IMDB score should be a number between 0 and 10'
      },
      rottenTomatoes: {
        bsonType: 'string',
        pattern: '^(100|\\d{1,2})%$',
        description: 'Rotten tomatoes should be a percentage from 0% to 100%'
      },
      fandangoAudienceScore: {
        bsonType: 'string',
        pattern: '^(100|\\d{1,2})%$',
        description: 'Fandango audience score should be a percentage from 0% to 100%'
      }
    }
  };

  const collectionName = getEnv('MOVIES_COLLECTION_NAME');

  const validator = { 
    $jsonSchema: jsonSchema 
  };

  try {
    await db.command({
      collMod: collectionName,
      validator
    });
  } catch (error) {
    if (
      error instanceof mongoDB.MongoServerError &&
      error.codeName === 'NamespaceNotFound'
    ) {
      await db.createCollection(
        collectionName,
        { validator }
      );
      return;
    }
    throw error;
  }
}