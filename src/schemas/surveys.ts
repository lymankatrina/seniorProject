import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'surveyLink',
      'isActive'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique identifier automatically assigned by MongoDB'
      },
      surveyLink: {
        bsonType: 'string',
        description: 'Survey Link must be a valid URL'
      },
      isActive: {
        bsonType: 'bool',
        description: 'Indicates whether the survey is currently active'
      }
    }
  };

    const collectionName = 
      process.env.SURVEYS_COLLECTION_NAME;
  
      if (!collectionName) {
        throw new Error(
          'SURVEYS_COLLECTION_NAME environment variable is missing'
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
