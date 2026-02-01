import { sendWhatsAppText } from "../config/whatsapp.js";
import Client from "../models/Client.js";
import { generateGreetingWithGemini } from "../config/gemini.js";

// POST /api/messages/generate
export const generateGreeting = async (req, res) => {
  try {
    const { name, serviceUsed, occasion } = req.body;

    const message = await generateGreetingWithGemini({
      name,
      serviceUsed,
      occasion,
    });

    return res.json({ message });
  } catch (err) {
    console.error("Gemini error:", err.message);

    // NEW: Better fallback using provided data
    const fallback = `Hi ${req.body.name}, Happy ${req.body.occasion}! Thank you for using ${req.body.serviceUsed || "our services"}. Looking forward to serving you again!`;
    return res.json({ message: fallback });
  }
};

// src/controllers/messageController.js
// export const generateMessage = async (req, res) => {
//   try {
//     const { name, serviceUsed, occasion } = req.body;
//
//     if (!name || !occasion) {
//       return res.status(400).json({ error: "name and occasion are required" });
//     }
//
//     // Mock AI response for Day 4 (remove when you add OpenAI payment)
//     const messages = [
//       `Hi ${name}, wishing you a very happy ${occasion}! Thank you for using our ${serviceUsed || 'services'}. Warm regards, Smart Greeting Team.`,
//       `Dear ${name}, Happy ${occasion}! Grateful for your trust in ${serviceUsed || 'our services'}. Wishing you a prosperous year ahead.`,
//       `${name}, a joyful ${occasion} to you! Thanks for choosing ${serviceUsed || 'us'} for your needs. Best wishes!`
//     ];
//
//     // Pick a random message for variety
//     const message = messages[Math.floor(Math.random() * messages.length)];
//
//     res.json({ message });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Failed to generate message" });
//   }
// };

// send to specific client
export const sendToClient = async (req, res) => {
  const { clientId, message, useEmailFallback = true } = req.body;
  
  try {
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ error: "Client not found" });
    
    const to = (client.phone || client.contact || "").replace(/\s+/g, "");
    
    // TRY WHATSAPP FIRST (your existing code)
    try {
      const result = await sendWhatsAppText({ to, body: message });
      return res.json({ success: true, method: "whatsapp" });
    } catch (whatsappErr) {
      console.log("WhatsApp failed → Email fallback");
      
      if (useEmailFallback) {
        return res.status(206).json({ fallback: "email" });
      }
      throw whatsappErr;
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to send" });
  }
};

// export const sendToClient = async (req, res) => {
//   try {
//     const { clientId, message } = req.body;
//     const client = await Client.findById(clientId);
//
//     if (!client) return res.status(404).json({ error: "Client not found" });
//
//     const to = client.contact.replace(/\s+/g, "");
//     const result = await sendWhatsAppText({ to, body: message });
//
//     res.json({ success: true, client: client.name, result });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to send WhatsApp" });
//   }
// };
// 
// reminder broadcast
export const reminderToAll = async (req, res) => {
  try {
    const clients = await Client.find({});
    const results = [];

    for (const client of clients) {
      // NEW: Use latest occasion for personalized reminder
      const latestOccasion = client.occasions?.[client.occasions.length - 1];
      const serviceUsed = latestOccasion?.serviceUsed || client.serviceUsed || 'services';
      
      const message = `Hi ${client.name}, hope you're doing great! Need our ${serviceUsed} again? Reply YES for a call.`;
      
      const to = (client.phone || client.contact || "").replace(/\s+/g, "");
      if (to) {
        await sendWhatsAppText({ to, body: message });
        results.push({ client: client.name, status: "sent" });
      }
    }

    res.json({ success: true, count: results.length });
  } catch (err) {
    res.status(500).json({ error: "Broadcast failed" });
  }
};
