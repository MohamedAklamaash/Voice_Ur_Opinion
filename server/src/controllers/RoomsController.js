"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoom = exports.deleteARoom = exports.getAllRooms = exports.getRoomDetails = exports.createARoom = void 0;
const RoomModal_1 = require("../models/RoomModal");
const UserDataModel_1 = require("../models/UserDataModel");
//create a room,join a room,owner can update the room details,delete the room,get room details
const createARoom = async (req, res) => {
    try {
        const { email, title, roomType } = req.body;
        if (!email || !title || !roomType) {
            return res.status(404).json({ success: false, msg: "Need data for resource authorization" });
        }
        const owner = await UserDataModel_1.UserSchema.findOne({ email });
        if (!owner) {
            return res.status(404).json({ success: false, msg: "Email's user not Found", owner });
        }
        const data = await RoomModal_1.RoomSchema.create({
            title, owner: owner?.name, roomType, speakers: [owner?.name]
        });
        return res.status(200).json({ success: true, msg: "Room created successfully", data });
    }
    catch (error) {
        console.log("Error in creating the room");
    }
};
exports.createARoom = createARoom;
const getRoomDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await RoomModal_1.RoomSchema.findById(id);
        if (!data) {
            return res.status(404).json({ success: false, msg: "No room found" });
        }
        let userData = [];
        await Promise.all(data.speakers.map(async (name) => {
            const user = await UserDataModel_1.UserSchema.findOne({ name });
            // the users that aren't activated will be null
            if (user != null) {
                userData.push(user);
            }
        }));
        return res.status(201).json({ success: true, data, userData });
    }
    catch (error) {
        console.log("Error in getting room details", error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
exports.getRoomDetails = getRoomDetails;
//need to show only public rooms
const getAllRooms = async (req, res) => {
    try {
        const data = await RoomModal_1.RoomSchema.find({ roomType: "public" });
        if (!data) {
            return res.status(404).json({ success: false, msg: "No room exists" });
        }
        if (data.length === 0) {
            return res.status(404).json({ success: false, msg: "No public rooms exist" });
        }
        return res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.log("Error in getting all rooms");
    }
};
exports.getAllRooms = getAllRooms;
const deleteARoom = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await RoomModal_1.RoomSchema.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ success: false, msg: "No room found with this id" });
        }
        return res.status(200).json({ success: true, msg: "Room deleted successfully" });
    }
    catch (error) {
        console.log("Error in deleting the room");
    }
};
exports.deleteARoom = deleteARoom;
const updateRoom = async (req, res) => {
    try {
        const { email } = req.body;
        const { id } = req.params;
        const userData = await UserDataModel_1.UserSchema.findOne({ email });
        const roomData = await RoomModal_1.RoomSchema.findById(id);
        if (roomData?.owner === userData?.name) {
            // Check if roomData is not null before updating
            if (roomData) {
                roomData.updateOne({ $set: req.body });
                await roomData.save();
                return res.status(201).json({ success: true, roomData });
            }
        }
        else {
            return res.status(401).json({ success: false, msg: "Cannot update because this user is not the owner of this room" });
        }
    }
    catch (error) {
        console.log("Error in updating the room:", error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};
exports.updateRoom = updateRoom;
