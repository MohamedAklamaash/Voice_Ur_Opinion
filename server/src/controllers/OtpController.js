"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtp = void 0;
const getOtp = () => {
    const otpLength = 4;
    const allowedCharacters = "0123456789";
    let otp = "";
    for (let i = 0; i < otpLength; i++) {
        const index = Math.floor(Math.random() * allowedCharacters.length);
        const randomChar = allowedCharacters.charAt(index);
        otp += randomChar;
    }
    return otp;
};
exports.getOtp = getOtp;
