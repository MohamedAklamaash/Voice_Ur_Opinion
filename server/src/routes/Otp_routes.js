"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OtpService_1 = require("../services/OtpService");
const router = express_1.default.Router();
router.route("/send-otp").post(OtpService_1.sendMail);
router.route("/verify-otp").post(OtpService_1.verifyOtp);
exports.default = router;
