import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    phone: { 
      type: String, 
      trim: true 
    },
    email: { 
      type: String, 
      trim: true,
      lowercase: true
    },
    contact: { 
      type: String, 
      trim: true  // backward compatibility (phone or email)
    },

    // NEW: Array of occasions/bookings (primary data source)
    occasions: [{
      occasion: { 
        type: String, 
        required: true 
      },
      date: { 
        type: Date, 
        required: true 
      },
      serviceUsed: { 
        type: String, 
        required: true 
      },
      notes: String  // optional: "Wedding event"
    }],

    sentToday: {
      type: String, // stores "Mon Jan 26 2026" to prevent duplicate daily sends
      index: true
    },

    // NEW: Prevent duplicate clients by phone/email
    phone: { 
      type: String, 
      trim: true,
      unique: true,
      sparse: true  // allows null values
    },
    email: { 
      type: String, 
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true  // allows null values
    },

    // Legacy fields (for backward compatibility during migration)
    serviceUsed: String,
    occasion: String,
    occasionDate: Date,

    preferredChannel: {
      type: String,
      enum: ["whatsapp", "email", "both"],
      default: "both",
    },
    sendDate: { type: Date }, // optional scheduling date (Day 5)
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
clientSchema.index({ name: "text", phone: "text", email: "text" });
clientSchema.index({ "occasions.occasion": 1 });
clientSchema.index({ "occasions.date": -1 });
clientSchema.index({ sendDate: 1 });

// Virtual for latest occasion (convenience)
clientSchema.virtual('latestOccasion').get(function() {
  return this.occasions?.[this.occasions.length - 1] || 
         { occasion: this.occasion, serviceUsed: this.serviceUsed };
});

const Client = mongoose.model("Client", clientSchema);
export default Client;
