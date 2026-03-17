"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FolderKanban, ImageIcon, View, Users, Star,
  TrendingUp, Eye, CheckCircle, Clock, ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Total Projects", value: "8", change: "+2 this month", icon: FolderKanban, color: "bg-blue-50 text-blue-600" },
  { label: "Pending Reviews", value: "3", change: "Awaiting approval", icon: Star, color: "bg-amber-50 text-amber-600" },
  { label: "Team Members", value: "4", change: "Active", icon: Users, color: "bg-green-50 text-green-600" },
  { label: "360° Rooms", value: "4", change: "Configured", icon: View, color: "bg-purple-50 text-purple-600" },
];

const quickActions = [
  { href: "/admin/projects", label: "Add New Project", icon: FolderKanban, desc: "Upload photos & details", color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50" },
  { href: "/admin/before-after", label: "Update Before/After", icon: ImageIcon, desc: "Change comparison images", color: "border-green-200 hover:border-green-400 hover:bg-green-50" },
  { href: "/admin/walkthrough", label: "Edit 360° Rooms", icon: View, desc: "Manage virtual tour images", color: "border-purple-200 hover:border-purple-400 hover:bg-purple-50" },
  { href: "/admin/team", label: "Manage Team", icon: Users, desc: "Add or edit team members", color: "border-orange-200 hover:border-orange-400 hover:bg-orange-50" },
  { href: "/admin/reviews", label: "Approve Reviews", icon: Star, desc: "3 reviews waiting", color: "border-amber-200 hover:border-amber-400 hover:bg-amber-50" },
];

const recentActivity = [
  { icon: CheckCircle, text: "Review from Layla Ahmed approved", time: "2 hours ago", color: "text-green-500" },
  { icon: FolderKanban, text: "Project \"Sunset Hills Villa\" added", time: "1 day ago", color: "text-blue-500" },
  { icon: Users, text: "Team member Sara Mahmoud updated", time: "3 days ago", color: "text-orange-500" },
  { icon: Star, text: "New review from Robert Williams submitted", time: "4 days ago", color: "text-amber-500" },
  { icon: ImageIcon, text: "Before/After images updated", time: "1 week ago", color: "text-purple-500" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Good morning, Ahmed 👋</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with BuildCraft today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground">{s.value}</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="font-heading text-lg font-bold text-foreground mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.07 }}
              >
                <Link
                  href={action.href}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all group ${action.color}`}
                >
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                    <action.icon size={18} className="text-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground group-hover:text-foreground">{action.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="font-heading text-lg font-bold text-foreground mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
              >
                <a.icon size={16} className={`mt-0.5 shrink-0 ${a.color}`} />
                <div>
                  <p className="text-sm text-foreground leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Site links */}
      <div className="bg-primary rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="font-heading font-bold text-primary-foreground text-lg">Your site is live</p>
          <p className="text-primary-foreground/60 text-sm mt-1">localhost:3000 • All sections active</p>
        </div>
        <Link href="/" target="_blank" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition">
          View Site <ArrowUpRight size={16} />
        </Link>
      </div>

    </div>
  );
}
