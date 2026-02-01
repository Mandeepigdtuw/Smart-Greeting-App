import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendWhatsAppText = async ({ to, body }) => {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { preview_url: false, body },
  };

  const headers = {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await axios.post(url, payload, { headers });
    return res.data;
  } catch (error) {
    console.error("WhatsApp error:", error.response?.data || error.message);
    throw error;
  }
};
