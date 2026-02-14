import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Brain, Share2, Target } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

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
  { icon: "🏆", text: "Best Day: Wednesday", color: "border-primary/20" },
  { icon: "⚠️", text: "Worst Day: Saturday", color: "border-accent/20" },
  { icon: "🍗", text: "Most Eaten: Chicken (4×)", color: "border-teal-400/20" },
  { icon: "⭐", text: "Top Rated: Palak Paneer", color: "border-amber-400/20" },
];

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  return (
    <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
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
  useEffect(() => { setTimeout(() => setRevealed(true), 400); }, []);

  return (
    <div className="glass-card-static text-center py-8 space-y-3 border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={revealed ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
        className="relative z-10"
      >
        <span className="text-7xl font-display font-bold gradient-text inline-block" style={{ filter: "drop-shadow(0 0 30px rgba(16,185,129,0.4))" }}>B+</span>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-sm text-primary font-semibold relative z-10">
        Great week! You're improving!
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-[11px] text-muted-foreground relative z-10">
        ↑ Up from B last week
      </motion.p>
    </div>
  );
}

export default function NutrientsReport() {
  const navigate = useNavigate();
  const maxCal = 2400;

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:p-10 max-w-lg mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-xl font-display font-bold text-foreground">📊 Weekly Report</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 text-sm">
            <button className="btn-ghost p-1.5"><ChevronLeft size={16} /></button>
            <span className="text-xs text-muted-foreground font-medium">Dec 16 - Dec 22, 2024</span>
            <button className="btn-ghost p-1.5"><ChevronRight size={16} /></button>
          </motion.div>

          <motion.div variants={fadeUp}><GradeReveal /></motion.div>

          {/* Calorie Chart */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-3 p-5">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">📈 Calorie Tracking</h3>
            <p className="text-[11px] text-muted-foreground">Target: 1,800/day · Avg: 1,720/day</p>
            <div className="flex items-end gap-1.5 h-28 relative pt-4">
              <div className="absolute left-0 right-0 border-t border-dashed border-primary/30" style={{ bottom: `${(1800 / maxCal) * 100}%` }}>
                <span className="text-[9px] text-primary/60 absolute -top-3 right-0">1,800</span>
              </div>
              {dailyCals.map((d, i) => (
                <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className={`w-full rounded-md ${d.ok ? "bg-gradient-to-t from-primary/80 to-primary" : "bg-gradient-to-t from-accent/80 to-accent"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.cal / maxCal) * 112}px` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                    style={{ minHeight: 4 }}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Macros */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-3.5 p-5">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">💪 Macro Balance</h3>
            {macros.map((m, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{m.label}</span>
                  <span className="text-foreground font-semibold">{m.avg}g / {m.target}g <span className="text-muted-foreground">({Math.round((m.avg / m.target) * 100)}%)</span></span>
                </div>
                <AnimatedBar pct={(m.avg / m.target) * 100} color={m.color} delay={0.3 + i * 0.12} />
              </div>
            ))}
          </motion.div>

          {/* Meal Consistency */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-3 p-5">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">🍽️ Consistency: 19/21 (90%)</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-[9px] text-muted-foreground mb-1 font-medium">{d}</p>
                  <div className="space-y-0.5">
                    {mealGrid[i].map((m, j) => (
                      <motion.div
                        key={j}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + (i * 3 + j) * 0.03 }}
                        className={`w-full h-3 rounded-sm ${m === "✅" ? "bg-primary/50" : "bg-destructive/30"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-primary font-semibold">🔥 Best streak: 5 days straight!</p>
          </motion.div>

          {/* Highlights */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className={`glass-card text-center space-y-1 p-3.5 border ${h.color}`}
              >
                <span className="text-xl block">{h.icon}</span>
                <p className="text-[11px] text-muted-foreground leading-tight">{h.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={fadeUp} className="glass-card-static bg-primary/[0.03] space-y-2.5 p-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain size={14} className="text-primary" />
              </div>
              <h3 className="text-xs font-bold text-foreground">AI Insights</h3>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <p>✅ Protein target hit 6/7 days</p>
              <p>✅ Meal consistency improved from last week</p>
              <p>⚠️ Saturday dinners tend to be heavy</p>
              <p>💡 Swap white rice for brown rice 2× for more fiber</p>
              <p className="text-primary font-semibold pt-1">On track to reach your goal by February! 🎯</p>
            </div>
          </motion.div>

          {/* Nutrient Gaps */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-2 p-4">
            <h3 className="text-xs font-semibold text-foreground">📋 Micronutrient Gaps</h3>
            <p className="text-[11px] text-muted-foreground">⚠️ Low Vitamin C — add citrus fruits</p>
            <p className="text-[11px] text-muted-foreground">⚠️ Low Iron — add more spinach/lentils</p>
            <p className="text-[11px] text-muted-foreground">⚠️ Low Calcium — add yogurt</p>
          </motion.div>

          {/* Next Week Goals */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-2.5 p-4">
            <h3 className="text-xs font-semibold text-foreground">🎯 Next Week Goals</h3>
            {["Hit 25g fiber daily", "Log all 21 meals", "Try 2 new recipes"].map((g, i) => (
              <label key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded border border-white/15 shrink-0" />
                {g}
              </label>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex gap-2.5">
            <motion.button whileTap={{ scale: 0.97 }} className="btn-secondary flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5">
              <Share2 size={14} /> Share Report
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/meal-plan")} className="btn-primary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5">
              <Target size={14} /> Start Next Week
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
