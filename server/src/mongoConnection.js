"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoConnection = async () => {
    await mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@voice-your-opinion.cgd6dgo.mongodb.net/Voive-Your-Opinion?retryWrites=true&w=majority`).then(() => {
        console.log("Mongo DB is connected successfully!");
    }).catch((err) => {
        console.log("Error in connecting to Mongo DB");
    });
};
exports.mongoConnection = mongoConnection;
