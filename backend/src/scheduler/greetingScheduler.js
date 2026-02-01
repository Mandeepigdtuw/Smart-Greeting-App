import cron from "node-cron";
import Client from "../models/Client.js";
import { generateGreetingWithGemini } from "../config/gemini.js";
import { sendGreetingEmailBackend } from "../services/email.js";

console.log("🕐 Scheduler loaded");

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🕐 Scheduler running...");
  
  const now = new Date();
  const today = now.toDateString();

  const clientsToSend = await Client.find({
    sendDate: { $lte: now },
    sentToday: { $ne: today }
  }).limit(10);

  console.log(`📨 Found ${clientsToSend.length} clients to send`);

  for (const client of clientsToSend) {
    try {
      const latestOccasion = client.occasions?.[client.occasions.length - 1];
      
      if (!latestOccasion || !client.email) {
        console.log(`⏭️ Skipping ${client.name} (no occasion/email)`);
        continue;
      }

      const message = await generateGreetingWithGemini({
        name: client.name,
        serviceUsed: latestOccasion.serviceUsed,
        occasion: latestOccasion.occasion,
      });

      await sendGreetingEmailBackend({ 
        name: client.name,
        email: client.email, 
        message,
        serviceUsed: latestOccasion.serviceUsed,
        occasion: latestOccasion.occasion 
      });

      // Mark sent
      client.sentToday = today;
      await client.save();

      console.log(`✅ Auto-sent to ${client.name} (${latestOccasion.occasion})`);
    } catch (err) {
      console.error(`❌ Auto-send failed: ${client.name}`, err.message);
    }
  }
});

