"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ImageIcon,
  View,
  Users,
  Star,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bell,
  Settings,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/before-after", label: "Before & After", icon: ImageIcon },
  { href: "/admin/walkthrough", label: "360° Walkthrough", icon: View },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[hsl(220,25%,97%)] flex">

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-[hsl(220,60%,12%)] flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shrink-0">
            <span className="font-heading font-bold text-accent-foreground text-sm">BC</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-heading font-bold text-white text-sm leading-none">BuildCraft</p>
              <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {isActive && <ChevronRight size={14} />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <ExternalLink size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">View Site</span>}
          </Link>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center gap-4 px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            {pathname !== "/admin" && (
              <>
                <ChevronRight size={14} />
                <span className="text-foreground font-medium capitalize">
                  {pathname.split("/").pop()?.replace("-", " ")}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-primary-foreground text-xs">AR</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
