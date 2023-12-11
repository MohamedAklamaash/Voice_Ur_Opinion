"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomsController_1 = require("../controllers/RoomsController");
const RoomServices_1 = require("../services/RoomServices");
const router = express_1.default.Router();
//room controllers
router.route("/createARoom").post(RoomsController_1.createARoom);
router.route("/getRoomDetails/:id").get(RoomsController_1.getRoomDetails);
router.route("/getAllRooms").get(RoomsController_1.getAllRooms);
router.route("/deleteARoom/:id").delete(RoomsController_1.deleteARoom);
router.route("/updateRoom/:id").put(RoomsController_1.updateRoom);
//room services
router.route("/joinRoom/:roomId").put(RoomServices_1.joinRoom);
router.route("/leaveRoom/:roomId").put(RoomServices_1.leaveARoom);
exports.default = router;
