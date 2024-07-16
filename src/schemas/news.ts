import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import News from '../models/news';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['_id', 'title', 'tagline', 'description', 'date', 'image', 'link', 'status', 'isActive'],
    additionalProperties: false,
    properties: {
      _id: {},
      title: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'title' is required and is a string"
      },
      tagline: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'title' is required and is a string"
      },
      description: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 850,
        description: "'description' is required and is a string"
      },
      date: {
        bsonType: 'date',
        description: "'date' is required and must be in the format YYYY-MM-DD"
      },
      image: {
        bsonType: 'string',
        description: 'Image must be a url link to a publicly shared image'
      },
      link: {
        bsonType: 'string',
        description: 'Link must be a url link to a shareable source'
      },
      status: {
        bsonType: 'string',
        enum: ['Public', 'Private'],
        description: 'Status must be Public or Private'
      },
      isActive: {
        bsonType: 'bool',
        description: 'Must be true or false'
      }
    }
  };

  await db
    .command({
      collMod: process.env.NEWS_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.NEWS_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
