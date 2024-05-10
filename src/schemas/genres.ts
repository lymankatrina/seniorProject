import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Genres from '../models/genres';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['_id', 'genre'],
    additionalProperties: false,
    properties: {
      _id: {
        description: 'A unique identifier automatically assigned by mongoDB for a genre'
      },
      genre: {
        bsonType: 'string',
        description: 'Movie Genres'
      }
    }
  };

  await db
    .command({
      collMod: process.env.GENRES_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.GENRES_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
