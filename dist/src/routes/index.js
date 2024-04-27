"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("./users");
const auth_1 = require("./auth");
const swagger_1 = require("./swagger");
const routes = (0, express_1.Router)();
routes.use('/', auth_1.authRouter);
routes.use('/', swagger_1.swaggerRouter);
routes.use('/users', users_1.userRouter);
exports.default = routes;
//# sourceMappingURL=index.js.map