"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_services_1 = require("./services/database.services");
const index_1 = __importDefault(require("./routes/index"));
const routeNotFound_1 = require("./middleware/routeNotFound");
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv.config();
const host = process.env.PROD_HOSTNAME;
const port = process.env.SERVER_PORT || 3000;
const app = (0, express_1.default)();
(0, database_services_1.connectToDatabase)()
    .then(() => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use(authMiddleware_1.authMiddleware);
    app.use(express_1.default.static('public'));
    app.use('/', index_1.default);
    app.use(routeNotFound_1.routeNotFound);
    app.listen(port, () => {
        console.log(`Server started at ${host} port ${port}`);
    });
})
    .catch((error) => {
    console.error('Database connection failed', error);
    process.exit();
});
//# sourceMappingURL=server.js.map