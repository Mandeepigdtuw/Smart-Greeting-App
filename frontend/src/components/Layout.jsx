// src/components/Layout.jsx
import React from "react";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight">
            Smart <span className="text-amber-400">Greeting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Taxi client greetings dashboard
          </p>
        </div>
        <nav className="flex-1 px-4 py-4 text-sm space-y-2">
          <div className="px-3 py-2 rounded-md bg-slate-800 flex items-center gap-2">
            <span>📋</span>
            <span>Clients & Bookings</span>
          </div>
          <div className="px-3 py-2 rounded-md text-slate-400 flex items-center gap-2">
            <span>📊</span>
            <span>Analytics (coming soon)</span>
          </div>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-800">
          Built for Pabla Taxi · {new Date().getFullYear()}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white flex items-center justify-between px-6 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Client Greeting Control Center
            </h2>
            <p className="text-xs text-slate-500">
              Save clients once, auto‑send greetings and reminders.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
