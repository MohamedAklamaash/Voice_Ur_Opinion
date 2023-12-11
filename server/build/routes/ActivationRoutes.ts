import express, { Router } from "express";
import { activateUser, deactivateUser } from "../controllers/UserActivation";

const router: Router = express.Router();

router.route("/activateUser").post(activateUser);
router.route("/deactivateUser").put(deactivateUser);

export default router;