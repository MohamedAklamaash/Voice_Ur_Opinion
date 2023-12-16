"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = exports.activateUser = void 0;
const UserDataModel_1 = require("../models/UserDataModel");
const activateUser = async (req, res) => {
    const { name, email, userProfileUrl } = req.body;
    if (!name || !email) {
        return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
    }
    try {
        let user = await UserDataModel_1.UserSchema.findOne({ email });
        if (!user) {
            user = await UserDataModel_1.UserSchema.create({ name, email, activated: true, userProfileUrl });
            return res.status(201).json({ success: true, msg: "User created and activated successfully" });
        }
        user.activated = true;
        user.name = name;
        user.userProfileUrl = userProfileUrl; // Update userProfileUrl
        await user.save();
        return res.status(200).json({ success: true, msg: "User activated successfully" });
    }
    catch (error) {
        console.error("Error activating user:", error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
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
