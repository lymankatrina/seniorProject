import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { CONTENT_STATUSES } from '../types/contentStatuses';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'title',
      'tagline',
      'description',
      'date',
      'image',
      'link',
      'status',
      'isActive'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      title: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'title' must be between 1 and 85 characters"
      },
      tagline: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'tagline' must be between 1 and 85 characters"
      },
      description: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 850,
        description: "'description' must be between 1 and 850 characters"
      },
      date: {
        bsonType: 'date',
        description: "'date' must be in the format YYYY-MM-DD"
      },
      image: {
        bsonType: 'string',
        description: 'Image must be a url to a publicly shared image'
      },
      link: {
        bsonType: 'string',
        description: 'Link must be a valid url'
      },
      status: {
        bsonType: 'string',
        enum: [...CONTENT_STATUSES],
        description: 'Status must be public or private'
      },
      isActive: {
        bsonType: 'bool',
        description: 'Must be true or false'
      }
    }
  };

    const collectionName = 
      process.env.NEWS_COLLECTION_NAME;
  
      if (!collectionName) {
        throw new Error(
          'NEWS_COLLECTION_NAME environment variable is missing'
        );
      }
  
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
        ){
          await db.createCollection(
            collectionName,
            { validator }
          );
  
          return;
        }
  
        throw error;
      }
    }
