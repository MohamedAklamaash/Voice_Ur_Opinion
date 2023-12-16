"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        default: ""
    },
    activated: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        default: "",
        unique: true,
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    userProfileUrl: {
        type: String,
        default: ""
    }
});
exports.UserSchema = mongoose_1.default.model("userActivation", UserModel);
