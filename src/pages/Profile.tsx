import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, LogOut, Trash2, Download } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const healthStats = [
  { label: "BMI", value: "26.8", sub: "Overweight ⚠️", color: "text-accent" },
  { label: "Daily Target", value: "1,800", sub: "calories", color: "text-primary" },
  { label: "Goal", value: "Lose", sub: "Weight ⬇️", color: "text-primary" },
  { label: "Activity", value: "Moderate", sub: "🏃", color: "text-teal-400" },
];

const journeyStats = [
  { label: "Total meals logged", value: "47" },
  { label: "Recipes tried", value: "23" },
  { label: "Avg health score", value: "7.2/10" },
  { label: "Days tracked", value: "14" },
  { label: "Current streak", value: "5 days 🔥" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  return (
    <AppLayout>
      <div className="p-6 lg:p-12 max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground">⚙️ Profile & Settings</h1>
          </motion.div>

          {/* Profile Card */}
          <motion.div variants={fadeUp} className="glass-card-static flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-2xl font-bold text-foreground shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground">Ahmed</h2>
              <p className="text-xs text-muted-foreground">demo@nutriai.com</p>
              <p className="text-xs text-muted-foreground">Member since Dec 2024</p>
            </div>
            <button className="btn-ghost text-xs"><Edit size={14} /></button>
          </motion.div>

          {/* Health Overview */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            {healthStats.map((s, i) => (
              <div key={i} className="glass-card text-center space-y-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Preferences */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Preferences</h3>
            {[
              { label: "Diet", value: "Halal" },
              { label: "Allergies", value: "Dairy, Shellfish" },
              { label: "Cuisines", value: "Pakistani, Indian, Chinese" },
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-xs text-muted-foreground">{p.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground">{p.value}</span>
                  <button className="text-primary text-xs">Change</button>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Journey Stats */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-3">
            <h3 className="text-sm font-semibold text-foreground">📊 Your Journey</h3>
            {journeyStats.map((s, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs text-foreground font-medium">{s.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Settings */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Settings</h3>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Units</span>
              <div className="flex gap-1">
                {(["metric", "imperial"] as const).map(u => (
                  <button key={u} onClick={() => setUnits(u)} className={`chip text-xs ${units === u ? "chip-selected" : ""}`}>
                    {u === "metric" ? "Metric" : "Imperial"}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="space-y-3">
            <button className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2">
              <Download size={16} /> Export My Data
            </button>
            <button className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2 text-destructive border-destructive/20">
              <Trash2 size={16} /> Delete Account
            </button>
            <button onClick={() => navigate("/")} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2">
              <LogOut size={16} /> Sign Out
            </button>
          </motion.div>

          {/* App Info */}
          <motion.div variants={fadeUp} className="text-center space-y-1 py-4">
            <p className="text-xs text-muted-foreground">NutriAI v1.0</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ for Hackathon 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
