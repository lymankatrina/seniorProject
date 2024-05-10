import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import User from '../models/users';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['_id', 'firstName', 'lastName', 'phone', 'email', 'isAdmin'],
    additionalProperties: false,
    properties: {
      _id: {},
      firstName: {
        bsonType: 'string',
        description: "'firstName' is required and is a string",
        nullable: false
      },
      lastName: {
        bsonType: 'string',
        description: "'lastName' is required and is a string",
        nullable: false
      },
      phone: {
        bsontType: 'string',
        description: "'phone' is required and is a string",
        nullable: false
      },
      email: {
        bsonType: 'string',
        format: 'email',
        uniqueItems: true,
        description: "'email' is required and must be valid",
        nullable: false
      },
      isAdmin: {
        bsonType: 'bool',
        description: "'isAdmin' is boolean and is required",
        nullable: false
      }
    }
  };

  await db
    .command({
      collMod: process.env.USERS_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.USERS_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
