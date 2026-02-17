import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import emailjs from "@emailjs/browser"; // Default import
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";


function App() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const { isLoggedIn, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleClientCreated = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  // Not logged in → show auth screens instead of dashboard
  if (!isLoggedIn) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Add / Update Client
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Save client details, booking history and scheduling information.
          </p>
          <ClientForm onClientCreated={handleClientCreated} />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <ClientList key={refreshFlag} />
        </section>
      </div>
    </Layout>
  );

}

export default App;
