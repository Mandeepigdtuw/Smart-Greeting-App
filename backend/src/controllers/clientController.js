import Client from "../models/Client.js";

export const createClient = async (req, res) => {
  try {
    const { name, phone, email, occasions, preferredChannel, sendDate } = req.body;

    // Convert sendDate string to Date
    if (sendDate) {
      req.body.sendDate = new Date(sendDate);
    }

    let occasionsArray = occasions;
    
    if (!occasionsArray || !Array.isArray(occasionsArray)) {
      const { serviceUsed, occasion, occasionDate } = req.body;
      occasionsArray = [{
        occasion: occasion || "Regular Trip",
        date: occasionDate || new Date(),
        serviceUsed: serviceUsed || "Taxi Service"
      }];
    }

    if (!occasionsArray.length) {
      return res.status(400).json({ error: "At least one occasion required" });
    }

    const query = {};
    if (phone) query.phone = phone;
    if (email) query.email = email;

    const client = await Client.findOneAndUpdate(
      query,
      {
        $setOnInsert: { 
          name, 
          preferredChannel
        },
        $set: { 
          sendDate: req.body.sendDate 
        },
        $push: { 
          occasions: { 
            $each: occasionsArray, 
            $position: 0  // newest first
          } 
        }
      },
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );


    res.status(201).json(client);
  } catch (err) {
    console.error("Create client error:", err.message);
    res.status(500).json({ error: "Failed to create client" });
  }
};

export const getClients = async (_req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error("Get clients error:", err.message);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};
