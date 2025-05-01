import express from "express";
import { assignPosition } from "../controllers/admin.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/assign-position", verifyToken, assignPosition);

export default router;