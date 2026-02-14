import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Brain, Share2, CalendarDays, Target } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const dailyCals = [
  { day: "Mon", cal: 1780, ok: true },
  { day: "Tue", cal: 1850, ok: false },
  { day: "Wed", cal: 1700, ok: true },
  { day: "Thu", cal: 1800, ok: true },
  { day: "Fri", cal: 1680, ok: true },
  { day: "Sat", cal: 2200, ok: false },
  { day: "Sun", cal: 1750, ok: true },
];

const macros = [
  { label: "Protein", avg: 85, target: 90, color: "bg-primary" },
  { label: "Carbs", avg: 180, target: 200, color: "bg-teal-400" },
  { label: "Fat", avg: 55, target: 60, color: "bg-cyan-400" },
  { label: "Fiber", avg: 22, target: 25, color: "bg-accent" },
];

const mealGrid = [
  ["✅", "✅", "✅"],
  ["✅", "✅", "✅"],
  ["✅", "✅", "✅"],
  ["✅", "✅", "❌"],
  ["✅", "✅", "✅"],
  ["✅", "✅", "✅"],
  ["✅", "❌", "✅"],
];

const highlights = [
  { icon: "🏆", text: "Best Day: Wednesday — Perfect macros!", color: "text-primary" },
  { icon: "⚠️", text: "Worst Day: Saturday — +400 cal over", color: "text-accent" },
  { icon: "🍗", text: "Most Eaten: Chicken dishes (4×)", color: "text-teal-400" },
  { icon: "⭐", text: "Top Rated: Palak Paneer (5★)", color: "text-amber-400" },
];

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  return (
    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut", delay }}
      />
    </div>
  );
}

function GradeReveal() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setTimeout(() => setRevealed(true), 500);
  }, []);

  return (
    <motion.div
      className="glass-card-static text-center py-8 space-y-3 border-primary/30"
      animate={revealed ? { rotateY: 0 } : { rotateY: 90 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        <span className="text-7xl font-display font-bold gradient-text drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">B+</span>
      </motion.div>
      <p className="text-sm text-primary font-medium">Great week! You're improving!</p>
      <p className="text-xs text-muted-foreground">↑ Up from B last week</p>
    </motion.div>
  );
}

export default function NutrientsReport() {
  const navigate = useNavigate();
  const maxCal = 2400;

  return (
    <AppLayout>
      <div className="p-6 lg:p-12 max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground">📊 Weekly Report</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 text-sm">
            <button className="btn-ghost p-1"><ChevronLeft size={16} /></button>
            <span className="text-muted-foreground">Dec 16 - Dec 22, 2024</span>
            <button className="btn-ghost p-1"><ChevronRight size={16} /></button>
          </motion.div>

          {/* Grade */}
          <motion.div variants={fadeUp}>
            <GradeReveal />
          </motion.div>

          {/* Calorie Chart */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-4">
            <h3 className="text-sm font-semibold text-foreground">📈 Calorie Tracking</h3>
            <p className="text-xs text-muted-foreground">Target: 1,800/day · Avg: 1,720/day</p>
            <div className="flex items-end gap-2 h-32 relative">
              {/* Target line */}
              <div className="absolute left-0 right-0 border-t border-dashed border-primary/40" style={{ bottom: `${(1800 / maxCal) * 100}%` }}>
                <span className="text-[9px] text-primary absolute -top-3 right-0">1,800</span>
              </div>
              {dailyCals.map((d, i) => (
                <motion.div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    className={`w-full rounded-t-md ${d.ok ? "bg-primary" : "bg-accent"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.cal / maxCal) * 128}px` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Macros */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-4">
            <h3 className="text-sm font-semibold text-foreground">💪 Macro Balance</h3>
            {macros.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="text-foreground">{m.avg}g / {m.target}g ({Math.round((m.avg / m.target) * 100)}%)</span>
                </div>
                <AnimatedBar pct={(m.avg / m.target) * 100} color={m.color} delay={i * 0.15} />
              </div>
            ))}
          </motion.div>

          {/* Meal Consistency */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-3">
            <h3 className="text-sm font-semibold text-foreground">🍽️ Consistency: 19/21 meals (90%)</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">{d}</p>
                  <div className="space-y-1">
                    {mealGrid[i].map((m, j) => (
                      <div key={j} className={`w-full h-3 rounded-sm ${m === "✅" ? "bg-primary/60" : "bg-destructive/40"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-primary">🔥 Best streak: 5 days straight!</p>
          </motion.div>

          {/* Highlights */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <div key={i} className="glass-card text-center space-y-1">
                <span className="text-xl">{h.icon}</span>
                <p className="text-xs text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={fadeUp} className="glass-card-static bg-primary/5 space-y-3">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>✅ You hit your protein target 6 out of 7 days</p>
              <p>✅ Your meal consistency improved from last week</p>
              <p>⚠️ Saturday dinners tend to be heavy — try planning ahead</p>
              <p>💡 Swap white rice for brown rice 2x next week for more fiber</p>
              <p className="text-primary font-medium pt-1">Keep it up! You're on track to reach your weight goal by February.</p>
            </div>
          </motion.div>

          {/* Nutrient Gaps */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-2">
            <h3 className="text-sm font-semibold text-foreground">📋 Micronutrient Gaps</h3>
            <p className="text-xs text-muted-foreground">⚠️ Low Vitamin C — add citrus fruits</p>
            <p className="text-xs text-muted-foreground">⚠️ Low Iron — add more spinach/lentils</p>
            <p className="text-xs text-muted-foreground">⚠️ Low Calcium — add yogurt</p>
          </motion.div>

          {/* Next Week Goals */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-2">
            <h3 className="text-sm font-semibold text-foreground">🎯 Next Week Goals</h3>
            {["Hit 25g fiber daily", "Log all 21 meals", "Try 2 new recipes"].map((g, i) => (
              <label key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded border border-white/20" />
                {g}
              </label>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex gap-3">
            <button className="btn-secondary flex-1 py-2 text-xs"><Share2 size={14} className="inline mr-1" />Share Report</button>
            <button onClick={() => navigate("/meal-plan")} className="btn-primary flex-1 py-2 text-xs">
              <Target size={14} className="inline mr-1" />Start Next Week
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
