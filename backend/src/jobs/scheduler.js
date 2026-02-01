// uses node-cron for scheduling tasks, here to send msgs to client on diff occasions
import cron from "node-cron";
import Client from "../models/Client.js";
import { sendWhatsAppText } from "../config/whatsapp.js";

export const startSchedulers = () => {
  // Daily at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("🔔 Running daily greetings...");

    const today = new Date();
    const todayStr = today.toDateString();

    const dueClients = await Client.find({
      occasionDate: { $eq: todayStr },
      preferredChannel: "whatsapp"
    });

    console.log(`Found ${dueClients.length} clients due today`);

    for (const client of dueClients) {
      try {
        const message = `Hi ${client.name}, Happy ${client.occasion}! Thank you for using ${client.serviceUsed || 'our services'}. Warm regards!`;
        
        const to = client.contact.replace(/\s+/g, "");
        await sendWhatsAppText({ to, body: message });
        
        console.log(`✅ Sent to ${client.name}`);
      } catch (err) {
        console.error(`❌ Failed ${client.name}:`, err.message);
      }
    }
  });
};
