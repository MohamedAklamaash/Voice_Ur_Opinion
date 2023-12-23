"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveARoom = exports.joinRoom = void 0;
const RoomModal_1 = require("../models/RoomModal");
const UserDataModel_1 = require("../models/UserDataModel");
const joinRoom = async (req, res) => {
    try {
        const { email } = req.body;
        const { roomId } = req.params;
        if (!email) {
            return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
        }
        const roomData = await RoomModal_1.RoomSchema.findById(roomId);
        if (!roomData) {
            return res.status(404).json({ success: false, msg: "No such Room exists" });
        }
        const userData = await UserDataModel_1.UserSchema.findOne({ email });
        if (!userData) {
            return res.status(404).json({ success: false, msg: "User doesn't exist" });
        }
        if (!roomData.speakers.includes(userData.name)) {
            await roomData.updateOne({ $push: { speakers: userData.name } });
            await roomData.save();
            return res.status(201).json({ success: true, msg: "User joined Room successfully", userData });
        }
        else {
            return res.status(301).json({ success: false, msg: "User already exists in the Room" });
        }
    }
    catch (error) {
        console.log("Error in Joining the Room");
    }
};
exports.joinRoom = joinRoom;
const leaveARoom = async (req, res) => {
    try {
        const { email } = req.body;
        const { roomId } = req.params;
        if (!email) {
            return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
        }
        const roomData = await RoomModal_1.RoomSchema.findById(roomId);
        if (!roomData) {
            return res.status(404).json({ success: false, msg: "No such Room exists" });
        }
        const userData = await UserDataModel_1.UserSchema.findOne({ email });
        if (!userData) {
            return res.status(404).json({ success: false, msg: "User doesn't exist" });
        }
        if (roomData.speakers.includes(userData.name)) {
            await roomData.updateOne({ $pull: { speakers: userData.name } });
            await roomData.save();
            return res.status(201).json({ success: true, msg: "User Left Room successfully" });
        }
        else {
            return res.status(301).json({ success: false, msg: "User doesn't exist in the Room" });
        }
    }
    catch (error) {
        console.log("Error in leaving the room");
    }
};
exports.leaveARoom = leaveARoom;
