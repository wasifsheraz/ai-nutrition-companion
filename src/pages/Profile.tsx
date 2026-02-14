import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, LogOut, Trash2, Download } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

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
      <div className="px-5 py-6 lg:p-10 max-w-lg mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-xl font-display font-bold text-foreground">⚙️ Profile & Settings</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static flex items-center gap-4 p-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-xl font-bold text-foreground shrink-0 shadow-lg shadow-primary/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground">Ahmed</h2>
              <p className="text-[11px] text-muted-foreground">demo@nutriai.com</p>
              <p className="text-[11px] text-muted-foreground">Member since Dec 2024</p>
            </div>
            <button className="btn-ghost text-xs p-1.5"><Edit size={14} /></button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
            {healthStats.map((s, i) => (
              <div key={i} className="glass-card text-center space-y-1 p-3.5">
                <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
                <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static space-y-2.5 p-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Preferences</h3>
            {[
              { label: "Diet", value: "Halal" },
              { label: "Allergies", value: "Dairy, Shellfish" },
              { label: "Cuisines", value: "Pakistani, Indian, Chinese" },
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-xs text-muted-foreground">{p.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground font-medium">{p.value}</span>
                  <button className="text-primary text-[11px] font-semibold">Change</button>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static space-y-2.5 p-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">📊 Your Journey</h3>
            {journeyStats.map((s, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs text-foreground font-semibold">{s.value}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static space-y-3 p-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Settings</h3>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Units</span>
              <div className="flex gap-1">
                {(["metric", "imperial"] as const).map(u => (
                  <motion.button key={u} whileTap={{ scale: 0.95 }} onClick={() => setUnits(u)} className={`chip text-[11px] py-1.5 ${units === u ? "chip-selected" : ""}`}>
                    {u === "metric" ? "Metric" : "Imperial"}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2.5">
            <motion.button whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2 font-medium">
              <Download size={16} /> Export My Data
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2 text-destructive border-destructive/20 font-medium">
              <Trash2 size={16} /> Delete Account
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate("/")} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2 font-medium">
              <LogOut size={16} /> Sign Out
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="text-center space-y-1 py-4">
            <p className="text-[11px] text-muted-foreground/60">NutriAI v1.0</p>
            <p className="text-[11px] text-muted-foreground/40">Made with ❤️ for Hackathon 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
