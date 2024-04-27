"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySchemaValidation = void 0;
function applySchemaValidation(db) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield db
            .command({
            collMod: process.env.USERS_COLLECTION_NAME,
            validator: jsonSchema
        })
            .catch((error) => __awaiter(this, void 0, void 0, function* () {
            if (error.codeName === 'NamespaceNotFound') {
                yield db.createCollection(process.env.USERS_COLLECTION_NAME, { validator: jsonSchema });
            }
        }));
    });
}
exports.applySchemaValidation = applySchemaValidation;
//# sourceMappingURL=users.js.map