import express from "express";
import { generateGreeting, sendToClient, reminderToAll } from "../controllers/messageController.js";

const router = express.Router();

router.post("/generate", generateGreeting);
router.post("/send-to-client", sendToClient);   
router.post("/reminder-all", reminderToAll);

export default router;
