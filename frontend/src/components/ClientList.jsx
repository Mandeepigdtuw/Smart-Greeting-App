import React, { useEffect, useState } from "react";
import { getClients, generateGreeting, sendToClient } from "../services/api";
import { sendGreetingEmail } from "../services/email";
import toast from "react-hot-toast";

console.log("EmailJS keys:", {
  public: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
});

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState({});

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await getClients();
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      alert("Failed to load clients. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // FIXED: WhatsApp with Email fallback
  const handleSendWhatsApp = async (client) => {
    try {
      setSending((prev) => ({ ...prev, [client._id]: "whatsapp" }));
      
      // NEW: Use latest occasion
      const latestOccasion = client.occasions?.[client.occasions.length - 1];
      
      const genRes = await generateGreeting({
        name: client.name,
        serviceUsed: latestOccasion?.serviceUsed || client.serviceUsed,
        occasion: latestOccasion?.occasion || client.occasion,
      });
      
      const result = await sendToClient({ 
        clientId: client._id, 
        message: genRes.data.message,
        useEmailFallback: true 
      });
      
      if (result.fallback === "email") {
        // WhatsApp failed → send EmailJS
        await sendGreetingEmail(client);
        toast.success(`📧 Email sent (WhatsApp unavailable)`);
      } else {
        toast.success(`📱WhatsApp sent to ${client.name}`);
      }
      
      fetchClients();
    } catch (err) {
      toast.error("Failed to send");
    } finally {
      setSending((prev) => ({ ...prev, [client._id]: false }));
    }
  };

  // KEEP: Pure EmailJS
  const handleSendEmail = async (client) => {
    try {
      setSending((prev) => ({ ...prev, [client._id]: "email" }));

      if (!client.email) {
        alert("This client has no email saved.");
        return;
      }

      let message;

      try {
        // NEW: Use latest occasion
        const latestOccasion = client.occasions?.[client.occasions.length - 1];
        
        const genRes = await generateGreeting({
          name: client.name,
          serviceUsed: latestOccasion?.serviceUsed || client.serviceUsed,
          occasion: latestOccasion?.occasion || client.occasion,
        });
        message = genRes.data.message;
      } catch (err) {
        console.error("AI generation failed, using fallback:", err);
        const latestOccasion = client.occasions?.[client.occasions.length - 1];
        message = `Hi ${client.name}, thank you for choosing our ${latestOccasion?.serviceUsed || client.serviceUsed || "services"} for your ${latestOccasion?.occasion || client.occasion || "special occasion"}.`;
      }

      await sendGreetingEmail({ ...client, message });
      toast.success(`📧Email sent to ${client.name}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      toast.error("Email failed");
    } finally {
      setSending((prev) => ({ ...prev, [client._id]: false }));
    }
  };

  /*const handleSendEmail = async (client) => {
    try {
      setSending((prev) => ({ ...prev, [client._id]: "email" }));
      await sendGreetingEmail(client);
      alert(`📧 Email sent to ${client.name}!`);
      fetchClients();
    } catch (err) {
      alert("Email failed");
    } finally {
      setSending((prev) => ({ ...prev, [client._id]: false }));
    }
  }; */

  // FIXED: EmailJS broadcast (no backend)
  const handleReminderAll = async () => {
    const confirmed = window.confirm("Send reminder email to ALL clients?");
    if (!confirmed) return;
    
    try {
      for (const client of clients) {
        await sendGreetingEmail(client);
      }
      alert(`📧 Reminder sent to ${clients.length} clients!`);
      fetchClients();
    } catch (err) {
      alert("❌ Broadcast failed");
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading clients...</p>;
  }

  if (!clients.length) {
    return <p className="text-sm text-slate-500">No clients yet.</p>;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-800">
          📱📧 Saved Clients ({clients.length})
        </h2>
        <button
          onClick={handleReminderAll}
          disabled={clients.length === 0}
          className="bg-orange-500 text-white px-4 py-2 text-sm rounded-md hover:bg-orange-600 disabled:opacity-50 font-semibold"
        >
          📢 Reminder to ALL (Email)
        </button>
      </div>
      
      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client._id} className="border p-4 rounded-lg hover:shadow-md">
            <div className="font-semibold text-slate-800">{client.name}</div>
            <div className="text-sm text-slate-600 mb-2">
              📱 {client.phone || client.contact} | 📧 {client.email}
            </div>
            
            {/* NEW: Show booking history */}
            <div className="text-xs text-slate-500 mb-3 space-y-1">
              <div className="font-medium text-slate-700">📋 Booking History:</div>
              {client.occasions?.map((occ, i) => (
                <div key={i} className="flex items-center gap-2">
                  📅 <span className="font-mono text-xs">{occ.date}</span>
                  <span>• {occ.occasion}</span>
                  <span>({occ.serviceUsed})</span>
                </div>
              )) || (
                <div className="italic text-slate-400">
                  {client.occasion} - {client.serviceUsed} 
                  <span className="text-xs ml-1">(legacy)</span>
                </div>
              )}
            </div>
            
            {/* DUAL BUTTONS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSendWhatsApp(client)}
                disabled={sending[client._id]}
                className="bg-green-500 text-white py-2 text-sm rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending[client._id] === "whatsapp" ? "📱 WhatsApp..." : "📱 WhatsApp"}
              </button>
              
              <button
                onClick={() => handleSendEmail(client)}
                disabled={sending[client._id]}
                className="bg-blue-500 text-white py-2 text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending[client._id] === "email" ? "📧 Email..." : "📧 Email"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientList;
