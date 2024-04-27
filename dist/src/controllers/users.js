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
exports.UsersController = void 0;
const mongodb_1 = require("mongodb");
const database_services_1 = require("../services/database.services");
class UsersController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield database_services_1.collections.users.find().toArray();
                res.status(200).send(users);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getUsersById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const query = { _id: new mongodb_1.ObjectId(id) };
                const user = yield database_services_1.collections.users.findOne(query);
                if (user) {
                    res.status(200).send(user);
                }
                else {
                    res.status(404).send(`Unable to find a user with id: ${id}`);
                }
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getAllEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emails = yield database_services_1.collections.users.find({}, { projection: { email: 1 } }).toArray();
                return emails;
            }
            catch (error) {
                return error.message;
            }
        });
    }
    getUserByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_services_1.collections.users.findOne({ email: userEmail });
                return result;
            }
            catch (error) {
                console.log('error getting user email');
            }
        });
    }
    postUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = req.body;
                const result = yield database_services_1.collections.users.insertOne(newUser);
                result
                    ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
                    : res.status(500).send({ error: 'Failed to create a new user' });
            }
            catch (error) {
                console.error(error);
                res.status(400).send({ error: error.message });
            }
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const updatedUser = req.body;
                const query = { _id: new mongodb_1.ObjectId(id) };
                const result = yield database_services_1.collections.users.updateOne(query, { $set: updatedUser });
                result ? res.status(200).send(`Successfully updated user with id ${id}`) : res.status(304).send(`User with id: ${id} not updated`);
            }
            catch (error) {
                console.error(error.message);
                res.status(400).send(error.message);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const query = { _id: new mongodb_1.ObjectId(id) };
                const result = yield database_services_1.collections.users.deleteOne(query);
                if (result && result.deletedCount) {
                    res.status(202).send(`Successfully removed user with id ${id}`);
                }
                else if (!result) {
                    res.status(400).send(`Failed to remove user with id ${id}`);
                }
                else if (!result.deletedCount) {
                    res.status(404).send(`User with id ${id} does not exist`);
                }
            }
            catch (error) {
                console.error(error.message);
                res.status(500).send(error.message);
            }
        });
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.js.map