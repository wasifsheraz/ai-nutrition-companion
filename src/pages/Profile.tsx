import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, LogOut, Trash2, Download, Settings, Activity, Target, Dumbbell, Flame, BarChart3, UtensilsCrossed, CalendarDays, TrendingUp } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

const healthStats = [
  { label: "BMI", value: "26.8", sub: "Overweight", icon: Activity, color: "text-accent" },
  { label: "Daily Target", value: "1,800", sub: "calories", icon: Flame, color: "text-primary" },
  { label: "Goal", value: "Lose", sub: "Weight", icon: Target, color: "text-primary" },
  { label: "Activity", value: "Moderate", sub: "Level", icon: Dumbbell, color: "text-teal-400" },
];

const journeyStats = [
  { label: "Total meals logged", value: "47", icon: UtensilsCrossed },
  { label: "Recipes tried", value: "23", icon: BarChart3 },
  { label: "Avg health score", value: "7.2/10", icon: TrendingUp },
  { label: "Days tracked", value: "14", icon: CalendarDays },
  { label: "Current streak", value: "5 days", icon: Flame },
];

export default function Profile() {
  const navigate = useNavigate();
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Settings size={24} /> Profile & Settings</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static flex items-center gap-5 p-6 lg:p-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-2xl font-bold text-foreground shrink-0 shadow-lg shadow-primary/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-foreground">Ahmed</h2>
              <p className="text-sm text-muted-foreground">demo@nutriai.com</p>
              <p className="text-sm text-muted-foreground">Member since Dec 2024</p>
            </div>
            <button className="btn-ghost p-2"><Edit size={18} /></button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {healthStats.map((s, i) => (
              <div key={i} className="glass-card text-center space-y-2 p-4 lg:p-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto">
                  <s.icon size={20} className="text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </motion.div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
            <motion.div variants={fadeUp} className="glass-card-static space-y-3 p-5 lg:p-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Preferences</h3>
              {[
                { label: "Diet", value: "Halal" },
                { label: "Allergies", value: "Dairy, Shellfish" },
                { label: "Cuisines", value: "Pakistani, Indian, Chinese" },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-muted-foreground">{p.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground font-medium">{p.value}</span>
                    <button className="text-primary text-sm font-semibold">Change</button>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card-static space-y-3 p-5 lg:p-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2"><TrendingUp size={16} /> Your Journey</h3>
              {journeyStats.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><s.icon size={14} /> {s.label}</span>
                  <span className="text-sm text-foreground font-semibold">{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="glass-card-static space-y-4 p-5">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Settings</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Units</span>
              <div className="flex gap-2">
                {(["metric", "imperial"] as const).map(u => (
                  <motion.button key={u} whileTap={{ scale: 0.95 }} onClick={() => setUnits(u)} className={`chip text-sm py-2 ${units === u ? "chip-selected" : ""}`}>
                    {u === "metric" ? "Metric" : "Imperial"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <motion.button whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-3.5 text-sm flex items-center justify-center gap-2 font-medium">
              <Download size={18} /> Export My Data
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-3.5 text-sm flex items-center justify-center gap-2 text-destructive border-destructive/20 font-medium">
              <Trash2 size={18} /> Delete Account
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate("/")} className="btn-secondary w-full py-3.5 text-sm flex items-center justify-center gap-2 font-medium">
              <LogOut size={18} /> Sign Out
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="text-center space-y-1 py-6">
            <p className="text-sm text-muted-foreground/60">NutriAI v1.0</p>
            <p className="text-sm text-muted-foreground/40">Made with ❤️ for Hackathon 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
