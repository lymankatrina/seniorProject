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
exports.validAdmin = exports.validUserEmail = exports.validEmail = void 0;
const users_1 = require("../controllers/users");
const controller = new users_1.UsersController();
const getEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield controller.getAllEmails();
    return users.map((user) => user.email);
});
const validEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.oidc.user.email;
    try {
        const validEmails = yield getEmails();
        if (!Array.isArray(validEmails)) {
            throw new Error('Emails data is not an array');
        }
        return validEmails.includes(email);
    }
    catch (error) {
        console.error('Error fetching or processing emails:', error);
        return false;
    }
});
exports.validEmail = validEmail;
const validUserEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidUser = yield validEmail(req);
    if (!isValidUser) {
        res.status(403).send('Access denied.');
        return;
    }
    next();
});
exports.validUserEmail = validUserEmail;
const validAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.oidc.user.email;
    const user = yield controller.getUserByEmail(email);
    if (!user || !user.isAdmin) {
        res.status(403).send('Access denied');
        return;
    }
    next();
});
exports.validAdmin = validAdmin;
//# sourceMappingURL=permissionMiddleware.js.map