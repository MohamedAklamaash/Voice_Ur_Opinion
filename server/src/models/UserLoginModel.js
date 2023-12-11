"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserloginSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const loginSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedOtp: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000)
    }
}, {
    timestamps: true
});
exports.UserloginSchema = mongoose_1.default.model("login", loginSchema);
