"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
class OtpGenerator {
    getOtp() {
        const otpLength = 4;
        const allowedCharacters = "0123456789";
        let otp = "";
        for (let i = 0; i < otpLength; i++) {
            const index = Math.floor(Math.random() * allowedCharacters.length);
            const randomChar = allowedCharacters.charAt(index);
            otp += randomChar;
        }
        return otp;
    }
    sendSms() {
        const twilio = new twilio_1.Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN, {});
    }
}
module.exports = new OtpGenerator();
