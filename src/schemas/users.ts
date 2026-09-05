import * as mongoDB from 'mongodb';
import type { Db } from 'mongodb';

import { COLLECTION_NAMES } from '../config/collectionNames';

export async function applySchemaValidation(
  db: Db
): Promise<void> {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id', 
      'firstName', 
      'lastName',
      'userName', 
      'email', 
      'isAdmin'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      firstName: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 75,
        description: 'First name must be between 1 and 75 characters'
      },
      lastName: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 75,
        description: 'Last name must be between 1 and 75 characters'
      },
      userName: {
        bsonType: 'string',
        minLength: 1,
        description: 'User name is required'
      },
      email: {
        bsonType: 'string',
        description: 'email is required and must be valid'
      },
      isAdmin: {
        bsonType: 'bool',
        description: 'Indicates whether the user is an administrator'
      },
      // Optional fields
        phone: {
        bsonType: 'string',
        description: 'phone must be a valid US phone number'
      }
    }
  };

    const collectionName = 
      COLLECTION_NAMES.users;
  
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
        } else {  
        throw error;
      }
    }
    // Enforce unique email addresses at the database level
    await db.collection(collectionName).createIndex(
      { email: 1 },
      { unique: true }
    );
  }
