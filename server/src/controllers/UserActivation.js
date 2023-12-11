"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = exports.activateUser = void 0;
const UserDataModel_1 = require("../models/UserDataModel");
const activateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
    }
    const data = await UserDataModel_1.UserSchema.findOne({ email });
    const activated = true;
    if (!data) {
        const user = await UserDataModel_1.UserSchema.create({ name, email, activated });
        await user.save();
        return res.status(201).json({ success: true, msg: "User created and activated Successfully" });
    }
    data.activated = true;
    await data.save();
    return res.status(200).json({ success: true, msg: "User activated Successfully" });
};
exports.activateUser = activateUser;
const deactivateUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
        }
        const data = await UserDataModel_1.UserSchema.findOne({ email });
        if (!data) {
            return res.status(201).json({ success: false, msg: "User not Found" });
        }
        data.activated = false;
        await data.save();
        return res.status(201).json({ success: true, msg: "User deactivated Successfully" });
    }
    catch (error) {
        console.log("error in deactivating the user");
    }
};
exports.deactivateUser = deactivateUser;
