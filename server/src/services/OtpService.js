"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const OtpController_1 = require("../controllers/OtpController");
const UserLoginModel_1 = require("../models/UserLoginModel");
const HashService_1 = require("./HashService");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.SENDER_EMAIL}`,
        pass: `${process.env.SENDER_PASS}`
    }
});
const sendMail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(404).json({ success: false, msg: "Enter Valid Credentials" });
    }
    const otp = (0, OtpController_1.getOtp)();
    const mailOptions = {
        from: `${process.env.SENDER_EMAIL}`,
        to: `${email}`,
        subject: "Use This OTP to sign-in to Voice Your Opinion",
        text: `This is the ${otp} to Voice Your Opinion.Hope You enjoy our Service.`
    };
    await transporter.sendMail(mailOptions, async function (err, info) {
        if (err) {
            return res.status(404).json({ success: false, msg: "Error in sending mail" });
        }
        else {
            const hashedOtp = (0, HashService_1.createHash)(otp);
            const user = await UserLoginModel_1.UserloginSchema.findOne({ email });
            if (!user) {
                // If user does not exist, create a new entry
                const data = await UserLoginModel_1.UserloginSchema.create({ email, hashedOtp });
                return res.status(200).json({ success: true, msg: "Mail sent successfully", user: data });
            }
            else {
                // If user already exists, update the hashed OTP
                user.hashedOtp = hashedOtp;
                await user.save();
                return res.status(200).json({ success: true, msg: "Mail sent successfully", user });
            }
        }
    });
};
exports.sendMail = sendMail;
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(404).json({ success: false, msg: "Valid credentials not found" });
    }
    const data = await UserLoginModel_1.UserloginSchema.find({ email });
    if (!data) {
        return res.status(404).json({ success: false, msg: "User not Found!" });
    }
    const isValidOtp = data[0]?.hashedOtp === (0, HashService_1.createHash)(otp);
    if (isValidOtp) {
        return res.status(200).json({ success: true, email });
    }
    else {
        return res.status(501).json({ success: false, msg: "OTP is not Valid" });
    }
};
exports.verifyOtp = verifyOtp;
