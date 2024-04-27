"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkAuth = (req, res) => {
    res.send(req.oidc.isAuthenticated()
        ? `Logged In: Authentication successful. Welcome to the San Juan Theater directory! Add '/api-docs' to the url to view API documentation!`
        : 'Logged out');
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