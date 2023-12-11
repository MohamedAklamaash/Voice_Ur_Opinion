"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserActivation_1 = require("../controllers/UserActivation");
const router = express_1.default.Router();
router.route("/activateUser").post(UserActivation_1.activateUser);
router.route("/deactivateUser").put(UserActivation_1.deactivateUser);
exports.default = router;
