import React, { useState, useEffect } from "react";
import { createClient } from "../services/api";
import { generateGreeting } from "../services/api";
import toast from "react-hot-toast";
import { OCCASIONS } from "../constants/occasions.js"; // NEW: import occasions list

const initialForm = {
  name: "",
  phone: "",
  email: "",
  occasions: [{ occasion: "", date: "", serviceUsed: "" }] // NEW: array instead of single fields
};

function ClientForm({ onClientCreated }) {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  // NEW: Load existing client for editing (if passed as prop)
  useEffect(() => {
    if (onClientCreated) {
      setForm(initialForm);
    }
  }, [onClientCreated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: Update occasion fields in array
  const updateOccasionField = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      occasions: prev.occasions.map((occ, i) =>
        i === index ? { ...occ, [field]: value } : occ
      )
    }));
  };

  // NEW: Add new occasion row
  const addOccasion = () => {
    setForm(prev => ({
      ...prev,
      occasions: [...prev.occasions, { occasion: "", date: "", serviceUsed: "" }]
    }));
  };

  // NEW: Remove occasion row
  const removeOccasion = (index) => {
    if (form.occasions.length > 1) {
      setForm(prev => ({
        ...prev,
        occasions: prev.occasions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleGeneratePreview = async () => {
    try {
      setLoadingPreview(true);
      setPreview("");

      // NEW: Use first/latest occasion for preview
      const latestOccasion = form.occasions[form.occasions.length - 1];

      const res = await generateGreeting({
        name: form.name,
        serviceUsed: latestOccasion.serviceUsed,
        occasion: latestOccasion.occasion,
      });

      setPreview(res.data.message);
    } catch (err) {
      console.error("Preview error:", err);
      alert("Failed to generate preview.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call backend API
      const response = await createClient(form);

      console.log("Saved client:", response.data);
      toast.success("Client saved successfully");
    

      setForm(initialForm);

      // If parent component passes onClientCreated, notify it:
      if (onClientCreated) {
        onClientCreated(response.data);
      }
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Failed to save client. Check console for details.");
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Client data:", form); // Day 1: just log
  //   alert("Client saved locally (in state only)!");
  //   setForm(initialForm);
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Rohan Sharma"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Phone (WhatsApp)
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
          placeholder="+91XXXXXXXXXX"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
          placeholder="name@example.com"
        />
      </div>

      {/* NEW: Booking History Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          📋 Booking History (Add all occasions)
        </label>
        {form.occasions.map((occ, index) => (
          <div key={index} className="border p-3 rounded-lg mb-3 bg-slate-50">
            <div className="flex gap-2 items-end mb-2">
              {/* Occasion Dropdown */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Occasion {index + 1}
                </label>
                <select
                  name={`occasion-${index}`}
                  value={occ.occasion}
                  onChange={(e) => updateOccasionField(index, "occasion", e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
                  required
                >
                  <option value="">Select occasion</option>
                  {OCCASIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name={`date-${index}`}
                  value={occ.date}
                  onChange={(e) => updateOccasionField(index, "date", e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
                  required
                />
              </div>

              {/* Service */}
              <div className="flex-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Service Used
                </label>
                <input
                  type="text"
                  name={`service-${index}`}
                  placeholder="Airport Taxi, Outstation, etc."
                  value={occ.serviceUsed}
                  onChange={(e) => updateOccasionField(index, "serviceUsed", e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
                />
              </div>

              {/* Remove Button */}
              {form.occasions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOccasion(index)}
                  className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addOccasion}
          className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 border border-dashed border-indigo-300 rounded-md hover:bg-indigo-50"
        >
          + Add Another Booking
        </button>
      </div>

      {/* Auto‑send Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Auto‑send Date & Time
        </label>
        <input
          type="datetime-local"
          name="sendDate"
          value={form.sendDate || ""}
          onChange={(e) => {
            // Prevent form submit + convert to ISO string for backend
            e.preventDefault();
            setForm(prev => ({
              ...prev,
              sendDate: e.target.value ? e.target.value : ""
            }));
          }}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          step="1"  // allows seconds
        />
        {form.sendDate && (
          <p className="text-xs text-slate-500 mt-1">
            Will auto‑send: {new Date(form.sendDate).toLocaleString()}
          </p>
        )}
      </div>



      {/* NEW: Buttons row */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleGeneratePreview}
          disabled={!form.name || !form.occasions[0]?.occasion || loadingPreview}
          className="flex-1 rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingPreview ? "Generating..." : "Preview AI Greeting"}
        </button>

        <button
          type="submit"
          className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save Client
        </button>
      </div>

      {preview && (
        <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500">
              AI Greeting Preview
            </span>
            <button
              type="button"
              onClick={() => setPreview("")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          </div>
          <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {preview}
          </p>
        </div>
      )}       
      
    </form>
  );
}

export default ClientForm;
