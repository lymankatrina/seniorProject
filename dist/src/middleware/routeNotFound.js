"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
function routeNotFound(req, res, next) {
    const error = new Error('Route Not Found');
    return res.status(404).json({ error: error.message });
}
exports.routeNotFound = routeNotFound;
//# sourceMappingURL=routeNotFound.js.map