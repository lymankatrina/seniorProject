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
exports.getUserIdFromEmail = void 0;
const users_1 = require("../controllers/users");
const controller = new users_1.UsersController();
const getUserIdFromEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.oidc.user.email;
    const user = yield controller.getUserByEmail(userEmail);
    return String(user._id);
});
exports.getUserIdFromEmail = getUserIdFromEmail;
//# sourceMappingURL=helpers.js.map