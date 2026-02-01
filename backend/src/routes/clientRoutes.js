import express from "express";
import { createClient, getClients } from "../controllers/clientController.js";

const router = express.Router();

router.post("/", createClient); // POST /api/clients
router.get("/", getClients);    // GET /api/clients

export default router;
