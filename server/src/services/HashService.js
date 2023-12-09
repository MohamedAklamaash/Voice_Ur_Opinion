"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createHash = (otp) => {
    return crypto_1.default.createHmac("sha256", process.env.HASH_SECRET)
        .update(otp, "utf8")
        .digest("base64");
};
exports.createHash = createHash;
