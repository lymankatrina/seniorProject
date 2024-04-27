"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const checkAuth = (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.sendFile(path_1.default.join(__dirname, '../../public/views/loggedIn.html'));
    }
    else {
        res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
    }
};
const callback = (req, res) => {
    res.send(`Authentication successful. Welcome to the San Juan Theater Directory! Add '/api-docs' to the url to view API documentation!`);
};
const getProfile = (req, res) => {
    res.status(200).json({
        userProfile: req.oidc.user,
        title: 'Profile page'
    });
};
exports.default = { callback, checkAuth, getProfile };
//# sourceMappingURL=auth.js.map