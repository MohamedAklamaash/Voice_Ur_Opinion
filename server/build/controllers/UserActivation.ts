import { UserSchema } from "../models/UserDataModel";
import { Request, Response } from "express";

export const activateUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
    }
    const data = await UserSchema.findOne({ email });
    const activated = true;
    if (!data) {
        const user = await UserSchema.create({ name, email, activated });
        await user.save();
        return res.status(201).json({ success: true, msg: "User created and activated Successfully" });
    }
    data.activated = true;
    await data.save();
    return res.status(200).json({ success: true, msg: "User activated Successfully" });
}

export const deactivateUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
        }
        const data = await UserSchema.findOne({ email });
        if (!data) {
            return res.status(201).json({ success: false, msg: "User not Found" })
        }

        data.activated = false;
        await data.save();
        return res.status(201).json({ success: true, msg: "User deactivated Successfully" });
    } catch (error) {
        console.log("error in deactivating the user");
    }
}