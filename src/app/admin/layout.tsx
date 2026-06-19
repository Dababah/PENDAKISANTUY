"use client";
// src/app/admin/layout.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, LayoutDashboard, Package, CalendarDays, BookOpen, LogOut, Menu, X } from "lucide-react";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    // Simple client-side check; production should use proper auth
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";
    if (pass === adminPass) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Password salah!");
    }
  }

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Mountain className="w-7 h-7 text-forest-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">PendakiSantuy</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Password Admin</label>
            <input
              type="password"
              className="input"
              placeholder="Masukkan password..."
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleLogin} className="w-full btn-primary">
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored === "true") setAuthed(true);
  }, []);

  function logout() {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Booking", icon: BookOpen },
    { href: "/admin/calendar", label: "Kalender", icon: CalendarDays },
    { href: "/admin/equipment", label: "Alat", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-forest-900 text-white flex flex-col transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-forest-800">
          <div className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-forest-300" />
            <div>
              <p className="font-bold text-sm">PendakiSantuy</p>
              <p className="text-xs text-forest-400">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-forest-600 text-white"
                  : "text-forest-300 hover:bg-forest-800 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-forest-800">
          <button onClick={logout} className="flex items-center gap-2 text-forest-400 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-forest-800 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        <header className="bg-white border-b border-stone-100 px-4 h-14 flex items-center gap-3 sticky top-0 z-30">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-stone-700">Admin Command Center</span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
