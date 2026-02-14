import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BrainCircuit, Share2, Target, Trophy, AlertTriangle, Flame, Star, Dumbbell, TrendingUp, CalendarDays, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
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
  [true, true, true],
  [true, true, true],
  [true, true, true],
  [true, true, false],
  [true, true, true],
  [true, true, true],
  [true, false, true],
];

const highlights = [
  { icon: Trophy, text: "Best Day: Wednesday", color: "border-primary/15" },
  { icon: AlertTriangle, text: "Worst Day: Saturday", color: "border-accent/15" },
  { icon: Flame, text: "Most Eaten: Chicken (4×)", color: "border-teal-400/15" },
  { icon: Star, text: "Top Rated: Palak Paneer", color: "border-amber-400/15" },
];

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  return (
    <div className="h-3 rounded-full bg-white/[0.03] overflow-hidden">
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
    <div className="glass-card-static text-center py-10 lg:py-14 space-y-4 border-primary/15 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={revealed ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
        className="relative z-10"
      >
        <span className="text-8xl lg:text-9xl font-display font-bold gradient-text inline-block" style={{ filter: "drop-shadow(0 0 30px rgba(16,185,129,0.3))" }}>B+</span>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-base text-primary font-semibold relative z-10">
        Great week! You're improving!
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm text-muted-foreground relative z-10 flex items-center justify-center gap-1.5">
        <TrendingUp size={16} className="text-primary" strokeWidth={1.5} /> Up from B last week
      </motion.p>
    </div>
  );
}

export default function NutrientsReport() {
  const navigate = useNavigate();
  const maxCal = 2400;

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 lg:space-y-8">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <div className="icon-box-sm"><BarChart3 size={20} className="text-primary" strokeWidth={1.5} /></div>
              Weekly Report
            </h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-5 text-sm">
            <button className="btn-ghost p-2"><ChevronLeft size={18} /></button>
            <span className="text-sm text-muted-foreground font-medium">Dec 16 - Dec 22, 2024</span>
            <button className="btn-ghost p-2"><ChevronRight size={18} /></button>
          </motion.div>

          <motion.div variants={fadeUp}><GradeReveal /></motion.div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
            <motion.div variants={fadeUp} className="glass-card-static space-y-4 p-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2"><TrendingUp size={16} strokeWidth={1.5} /> Calorie Tracking</h3>
              <p className="text-sm text-muted-foreground">Target: 1,800/day · Avg: 1,720/day</p>
              <div className="flex items-end gap-2 h-36 relative pt-4">
                <div className="absolute left-0 right-0 border-t border-dashed border-primary/20" style={{ bottom: `${(1800 / maxCal) * 100}%` }}>
                  <span className="text-[10px] text-primary/50 absolute -top-3.5 right-0">1,800</span>
                </div>
                {dailyCals.map((d, i) => (
                  <motion.div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                      className={`w-full rounded-lg ${d.ok ? "bg-gradient-to-t from-primary/70 to-primary" : "bg-gradient-to-t from-accent/70 to-accent"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.cal / maxCal) * 140}px` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{d.day}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card-static space-y-4 p-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2"><Dumbbell size={16} strokeWidth={1.5} /> Macro Balance</h3>
              {macros.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{m.label}</span>
                    <span className="text-foreground font-semibold">{m.avg}g / {m.target}g <span className="text-muted-foreground">({Math.round((m.avg / m.target) * 100)}%)</span></span>
                  </div>
                  <AnimatedBar pct={(m.avg / m.target) * 100} color={m.color} delay={0.3 + i * 0.12} />
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="glass-card-static space-y-4 p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2"><CalendarDays size={16} strokeWidth={1.5} /> Consistency: 19/21 (90%)</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">{d}</p>
                  <div className="space-y-1">
                    {mealGrid[i].map((m, j) => (
                      <motion.div
                        key={j}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + (i * 3 + j) * 0.03 }}
                        className={`w-full h-4 rounded flex items-center justify-center ${m ? "bg-primary/40" : "bg-destructive/20"}`}
                      >
                        {m ? <CheckCircle2 size={10} className="text-primary" /> : <XCircle size={10} className="text-destructive" />}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-primary font-semibold flex items-center gap-1.5"><Flame size={16} strokeWidth={1.5} /> Best streak: 5 days straight!</p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className={`glass-card text-center space-y-2 p-4 lg:p-5 border ${h.color}`}
              >
                <div className="icon-box-sm mx-auto">
                  <h.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted-foreground leading-tight">{h.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static bg-primary/[0.02] space-y-3 p-6">
            <div className="flex items-center gap-2.5">
              <div className="icon-box-sm">
                <BrainCircuit size={18} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold text-foreground">AI Insights</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-primary shrink-0" /> Protein target hit 6/7 days</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-primary shrink-0" /> Meal consistency improved from last week</p>
              <p className="flex items-center gap-2"><AlertTriangle size={15} className="text-accent shrink-0" /> Saturday dinners tend to be heavy</p>
              <p className="flex items-center gap-2"><Target size={15} className="text-teal-400 shrink-0" /> Swap white rice for brown rice 2× for more fiber</p>
              <p className="text-primary font-semibold pt-1">On track to reach your goal by February!</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} className="btn-secondary flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2">
              <Share2 size={18} strokeWidth={1.5} /> Share Report
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/meal-plan")} className="btn-primary flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2">
              <Target size={18} strokeWidth={1.5} /> Start Next Week
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
