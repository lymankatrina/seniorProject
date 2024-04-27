"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const express_openid_connect_1 = require("express-openid-connect");
const permissionMiddleware_1 = require("../middleware/permissionMiddleware");
exports.userRouter = express_1.default.Router();
const controller = new users_1.UsersController();
exports.userRouter.get('/all', (0, express_openid_connect_1.requiresAuth)(), permissionMiddleware_1.validUserEmail, controller.getUsers);
exports.userRouter.post('/new', (0, express_openid_connect_1.requiresAuth)(), permissionMiddleware_1.validUserEmail, permissionMiddleware_1.validAdmin, controller.postUsers);
exports.default = exports.userRouter;
//# sourceMappingURL=users.js.map