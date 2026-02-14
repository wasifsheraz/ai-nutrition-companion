import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, LogOut, Trash2, Download, Settings, Activity, Target, Dumbbell, Flame, BarChart3, UtensilsCrossed, CalendarDays, TrendingUp } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } },
};

const healthStats = [
  { label: "BMI", value: "26.8", sub: "Overweight", icon: Activity, color: "text-accent" },
  { label: "Daily Target", value: "1,800", sub: "calories", icon: Flame, color: "text-primary" },
  { label: "Goal", value: "Lose", sub: "Weight", icon: Target, color: "text-primary" },
  { label: "Activity", value: "Moderate", sub: "Level", icon: Dumbbell, color: "text-sky-400" },
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
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-3xl mx-auto relative">
        <motion.div
          animate={{ opacity: [0.01, 0.025, 0.01] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-50px] left-[-100px] w-[300px] h-[300px] bg-primary rounded-full blur-[120px] pointer-events-none"
        />

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 relative z-10">
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-1.5"><ChevronLeft size={18} /></button>
            <h1 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <div className="icon-box-sm"><Settings size={14} className="text-primary" strokeWidth={1.5} /></div>
              Profile & Settings
            </h1>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -2 }} className="glass-card-static flex items-center gap-4 p-4 lg:p-6">
            <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0 shadow-lg shadow-primary/12">
              A
            </motion.div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base lg:text-lg font-bold text-foreground">Ahmed</h2>
              <p className="text-xs text-muted-foreground">demo@nutriai.com</p>
              <p className="text-xs text-muted-foreground">Member since Dec 2024</p>
            </div>
            <button className="btn-ghost p-1.5"><Edit size={14} strokeWidth={1.5} /></button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {healthStats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.25 }} className="glass-card text-center space-y-1.5 p-3 lg:p-4">
                <div className="icon-box-sm mx-auto"><s.icon size={14} className="text-primary" strokeWidth={1.5} /></div>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                <p className={`text-lg font-bold font-display ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-3 lg:space-y-0">
            <motion.div variants={fadeUp} className="glass-card-static space-y-2 p-4 lg:p-5">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Preferences</h3>
              {[
                { label: "Diet", value: "Halal" },
                { label: "Allergies", value: "Dairy, Shellfish" },
                { label: "Cuisines", value: "Pakistani, Indian, Chinese" },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0">
                  <span className="text-xs text-muted-foreground">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground font-medium">{p.value}</span>
                    <button className="text-primary text-xs font-semibold hover:underline">Change</button>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card-static space-y-2 p-4 lg:p-5">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5"><TrendingUp size={12} strokeWidth={1.5} /> Your Journey</h3>
              {journeyStats.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5"><s.icon size={11} strokeWidth={1.5} /> {s.label}</span>
                  <span className="text-xs text-foreground font-semibold">{s.value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="glass-card-static space-y-3 p-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Settings</h3>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Units</span>
              <div className="flex gap-1.5">
                {(["metric", "imperial"] as const).map(u => (
                  <motion.button key={u} whileTap={{ scale: 0.95 }} onClick={() => setUnits(u)} className={`chip text-xs py-1.5 ${units === u ? "chip-selected" : ""}`}>
                    {u === "metric" ? "Metric" : "Imperial"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2">
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-medium">
              <Download size={14} strokeWidth={1.5} /> Export My Data
            </motion.button>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 text-destructive border-destructive/12 font-medium">
              <Trash2 size={14} strokeWidth={1.5} /> Delete Account
            </motion.button>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/")} className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-medium">
              <LogOut size={14} strokeWidth={1.5} /> Sign Out
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="text-center space-y-0.5 py-4">
            <p className="text-[10px] text-muted-foreground/40">NutriAI v1.0</p>
            <p className="text-[10px] text-muted-foreground/20">Made with care for Hackathon 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
