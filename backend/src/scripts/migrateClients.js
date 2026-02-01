// Run once: node src/scripts/migrateClients.js
import mongoose from "mongoose";
import Client from "../models/Client.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const migrateClients = async () => {
  try {
    // Find clients with legacy fields but no occasions array
    const legacyClients = await Client.find({
      $or: [
        { occasion: { $exists: true } },
        { serviceUsed: { $exists: true } }
      ],
      "occasions.0": { $exists: false }
    });

    console.log(`Found ${legacyClients.length} clients to migrate`);

    for (const client of legacyClients) {
      if (client.occasion && client.serviceUsed) {
        client.occasions = [{
          occasion: client.occasion,
          date: client.occasionDate || new Date(),
          serviceUsed: client.serviceUsed
        }];
        
        // Clear legacy fields (optional)
        // delete client.occasion;
        // delete client.occasionDate;
        // delete client.serviceUsed;
        
        await client.save();
        console.log(`Migrated: ${client.name}`);
      }
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrateClients();
