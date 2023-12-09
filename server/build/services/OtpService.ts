import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { getOtp } from "../controllers/OtpController";
import { UserloginSchema } from "../models/UserLoginModel";
import { createHash } from "./HashService";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.SENDER_EMAIL}`,
        pass: `${process.env.SENDER_PASS}`
    }
})

export const sendMail = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(404).json({ success: false, msg: "Enter Valid Credentials" });
    }
    const otp = getOtp();
    const mailOptions = {
        from: `${process.env.SENDER_EMAIL}`,
        to: `${email}`,
        subject: "Use This OTP to sign-in to Voice Your Opinion",
        text: `This is the ${otp}.Hope You enjoy our Service.`
    }

    transporter.sendMail(mailOptions, async function (err, info) {
        if (err) {
            return res.status(404).json({ success: false, msg: "Error in sending mail" });
        } else {
            const hashedOtp = createHash(otp);
            const user = await UserloginSchema.findOne({ email });

            if (!user) {
                // If user does not exist, create a new entry
                const data = await UserloginSchema.create({ email, hashedOtp });
                return res.status(200).json({ success: true, msg: "Mail sent successfully", user: data });
            } else {
                // If user already exists, update the hashed OTP
                user.hashedOtp = hashedOtp;
                await user.save();
                return res.status(200).json({ success: true, msg: "Mail sent successfully", user });
            }
        }
    });

}

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(404).json({ success: false, msg: "Valid credentials not found" });
    }
    const data = await UserloginSchema.find({ email });

    if (!data) {
        return res.status(404).json({ success: false, msg: "User not Found!" });
    }
    const isValidOtp: boolean = data[0]?.hashedOtp === createHash(otp);

    if (isValidOtp) {
        return res.status(200).json({ success: true, email });
    }
    else {
        return res.status(501).json({ success: false, msg: "OTP is not Valid" });
    }
}