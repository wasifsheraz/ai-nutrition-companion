import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, BrainCircuit, Share2, Target, Trophy,
  AlertTriangle, Flame, Dumbbell, TrendingUp, CalendarDays, CheckCircle2,
  Droplets, Wheat, Beef, Apple, BarChart3, Zap, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } },
};

const weekRanges = ["Dec 9 – Dec 15, 2024", "Dec 16 – Dec 22, 2024", "Dec 23 – Dec 29, 2024"];
const dailyCals = [
  { day: "Mon", cal: 1780 }, { day: "Tue", cal: 1850 }, { day: "Wed", cal: 1700 },
  { day: "Thu", cal: 1800 }, { day: "Fri", cal: 1680 }, { day: "Sat", cal: 2200 }, { day: "Sun", cal: 1750 },
];
const macros = [
  { label: "Protein", avg: 85, target: 90, icon: Beef, unit: "g" },
  { label: "Carbs", avg: 180, target: 200, icon: Wheat, unit: "g" },
  { label: "Fat", avg: 55, target: 60, icon: Droplets, unit: "g" },
  { label: "Fiber", avg: 22, target: 25, icon: Apple, unit: "g" },
];
const insights = [
  { text: "Protein target hit 6 out of 7 days — great consistency!", type: "positive" as const },
  { text: "Saturday dinners tend to exceed your calorie goal by ~400 cal", type: "warning" as const },
  { text: "Try swapping white rice for brown rice 2× a week for more fiber", type: "tip" as const },
  { text: "You're on track to reach your goal by February!", type: "positive" as const },
];

function RadialRing({ pct, size = 90, stroke = 7, delay = 0, label, value }: {
  pct: number; size?: number; stroke?: number; delay?: number; label: string; value: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} opacity={0.3} />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - (circ * Math.min(pct, 100)) / 100 }}
            transition={{ duration: 1.2, ease: "easeOut", delay }} />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(217,91%,60%)" />
              <stop offset="100%" stopColor="hsl(199,89%,48%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-foreground stat-number">{value}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, trend }: {
  icon: React.ElementType; label: string; value: string; sub: string; trend?: "up" | "down";
}) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.25 }} className="glass-card-static p-3 lg:p-4 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="icon-box-sm"><Icon size={12} className="text-primary" strokeWidth={1.5} /></div>
        {trend && (
          <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${trend === "up" ? "text-primary" : "text-accent"}`}>
            {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{sub}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-foreground stat-number">{value}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

export default function NutrientsReport() {
  const navigate = useNavigate();
  const [weekIdx, setWeekIdx] = useState(1);
  const maxCal = 2400;
  const targetCal = 1800;
  const avgCal = Math.round(dailyCals.reduce((s, d) => s + d.cal, 0) / 7);

  return (
    <AppLayout>
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-4xl mx-auto relative">
        <motion.div animate={{ opacity: [0.01, 0.03, 0.01] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] bg-primary rounded-full blur-[150px] pointer-events-none" />

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 lg:space-y-6 relative z-10">
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-1.5"><ChevronLeft size={18} /></button>
            <div className="flex-1">
              <h1 className="text-lg lg:text-xl font-display font-bold text-foreground flex items-center gap-2">
                <div className="icon-box-sm"><BarChart3 size={14} className="text-primary" strokeWidth={1.5} /></div>
                Weekly Report
              </h1>
              <p className="text-muted-foreground text-[10px] mt-0.5 ml-[38px]">Your nutrition overview</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
            <button onClick={() => setWeekIdx(Math.max(0, weekIdx - 1))} className="btn-ghost p-1.5"><ChevronLeft size={16} /></button>
            <span className="text-xs text-muted-foreground font-medium min-w-[160px] text-center">{weekRanges[weekIdx]}</span>
            <button onClick={() => setWeekIdx(Math.min(weekRanges.length - 1, weekIdx + 1))} className="btn-ghost p-1.5"><ChevronRight size={16} /></button>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static p-4 lg:p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center space-y-1">
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.3 }}
                  className="text-5xl lg:text-6xl font-display font-bold gradient-text inline-block">B+</motion.span>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  className="text-xs text-primary font-semibold flex items-center justify-center gap-1">
                  <TrendingUp size={13} strokeWidth={1.5} /> Up from B last week
                </motion.p>
              </div>
              <div className="flex items-center justify-center gap-4 lg:gap-8 flex-wrap">
                <RadialRing pct={(avgCal / targetCal) * 100} label="Calories" value={`${avgCal}`} delay={0.3} />
                <RadialRing pct={(85 / 90) * 100} label="Protein" value="85g" delay={0.45} />
                <RadialRing pct={(180 / 200) * 100} label="Carbs" value="180g" delay={0.6} />
                <RadialRing pct={(55 / 60) * 100} label="Fat" value="55g" delay={0.75} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <StatCard icon={Flame} label="Avg Calories" value={`${avgCal}`} sub="+3%" trend="up" />
            <StatCard icon={Dumbbell} label="Avg Protein" value="85g" sub="+8%" trend="up" />
            <StatCard icon={Zap} label="Best Streak" value="5 days" sub="" />
            <StatCard icon={Trophy} label="Meals Logged" value="19/21" sub="90%" trend="up" />
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5"><TrendingUp size={13} className="text-primary" strokeWidth={1.5} />Daily Calories</h3>
              <span className="text-[10px] text-muted-foreground font-medium">Target: {targetCal}/day</span>
            </div>
            <div className="flex items-end gap-1.5 h-32 relative pt-4">
              <div className="absolute left-0 right-0 border-t border-dashed border-primary/20" style={{ bottom: `${(targetCal / maxCal) * 100}%` }}>
                <span className="text-[9px] text-primary/50 absolute -top-3 right-0">{targetCal}</span>
              </div>
              {dailyCals.map((d, i) => {
                const over = d.cal > targetCal;
                return (
                  <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div className={`w-full rounded-lg ${over ? "bg-gradient-to-t from-accent/50 to-accent" : "bg-gradient-to-t from-primary/40 to-primary"}`}
                      initial={{ height: 0 }} animate={{ height: `${(d.cal / maxCal) * 120}px` }} transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: "easeOut" }} style={{ minHeight: 4 }} />
                    <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static p-4 space-y-3">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5"><Dumbbell size={13} className="text-primary" strokeWidth={1.5} />Macro Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {macros.map((m, i) => {
                const pct = Math.round((m.avg / m.target) * 100);
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/10">
                    <div className="icon-box-sm shrink-0"><m.icon size={12} className="text-primary" strokeWidth={1.5} /></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground font-semibold">{m.label}</span>
                        <span className="text-muted-foreground font-medium">{m.avg}{m.unit} / {m.target}{m.unit}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.12 }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary stat-number w-10 text-right">{pct}%</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5"><CalendarDays size={13} className="text-primary" strokeWidth={1.5} />Meal Consistency</h3>
              <span className="chip text-[10px] py-1 px-2.5 chip-selected">19/21 · 90%</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
                const meals = [[true, true, true], [true, true, true], [true, true, true], [true, true, false], [true, true, true], [true, true, true], [true, false, true]][i];
                const done = meals.filter(Boolean).length;
                return (
                  <div key={i} className="text-center space-y-1.5">
                    <p className="text-[10px] text-muted-foreground font-medium">{d}</p>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.06, type: "spring", stiffness: 400 }}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${done === 3 ? "bg-primary/15 text-primary border border-primary/15" : "bg-accent/8 text-accent border border-accent/12"}`}>
                      {done}/3
                    </motion.div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-primary font-semibold flex items-center gap-1 pt-0.5"><Flame size={13} strokeWidth={1.5} /> Best streak: 5 days straight!</p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static p-4 space-y-3">
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="icon-box-sm" style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.15)" }}>
                <BrainCircuit size={14} className="text-primary" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xs font-bold text-foreground">AI Insights</h3>
            </div>
            <div className="space-y-2">
              {insights.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/10">
                  {item.type === "positive" && <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" strokeWidth={1.5} />}
                  {item.type === "warning" && <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" strokeWidth={1.5} />}
                  {item.type === "tip" && <Target size={14} className="text-secondary shrink-0 mt-0.5" strokeWidth={1.5} />}
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-2">
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={() => {
                const text = `Weekly Report: ${weekRanges[weekIdx]}\nGrade: B+\nAvg Calories: ${avgCal}/day\nProtein: 85g | Carbs: 180g | Fat: 55g\nMeals Logged: 19/21 (90%)`;
                navigator.clipboard.writeText(text);
                import("sonner").then(({ toast }) => toast.success("Report copied!"));
              }}
              className="btn-secondary flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5">
              <Share2 size={14} strokeWidth={1.5} /> Share Report
            </motion.button>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/meal-plan")}
              className="btn-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5">
              <Target size={14} strokeWidth={1.5} /> Plan Next Week
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
