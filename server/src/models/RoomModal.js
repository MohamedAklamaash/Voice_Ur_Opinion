"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roomModal = new mongoose_1.default.Schema({
    owner: {
        type: String,
        required: true
    },
    speakers: {
        type: [String],
        default: [],
    },
    title: {
        type: String,
        required: true,
    },
    roomType: {
        type: String,
        required: true,
        enum: ["social", "public", "private"]
    }
});
exports.RoomSchema = mongoose_1.default.model("rooms", roomModal);
