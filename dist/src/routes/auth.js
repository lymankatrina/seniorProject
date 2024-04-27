"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const express_openid_connect_1 = require("express-openid-connect");
exports.authRouter = express_1.default.Router();
exports.authRouter.get('/', auth_1.default.checkAuth);
exports.authRouter.get('/landingpage', auth_1.default.callback);
exports.authRouter.get('/profile', (0, express_openid_connect_1.requiresAuth)(), auth_1.default.getProfile);
//# sourceMappingURL=auth.js.map