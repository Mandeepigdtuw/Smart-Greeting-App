import "dotenv/config";


import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import connectDB from "./config/db.js";
import { startSchedulers } from "./jobs/scheduler.js";


const app = express();

connectDB();
startSchedulers();

app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRoutes);
app.use("/api/messages", messageRoutes);

import "./scheduler/greetingScheduler.js"; // auto-runs cron


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Server running on ${PORT}`));
