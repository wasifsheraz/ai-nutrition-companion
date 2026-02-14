import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Camera, Box, Flame, CalendarDays, Plus, Star, Brain, ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const step = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span className="stat-number">{val.toLocaleString()}</span>;
}

function AnimatedRing({ percent, size = 180 }: { percent: number; size?: number }) {
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} stroke="url(#ringGrad)" strokeWidth={strokeWidth} fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - percent) }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        strokeDasharray={circ}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
          <stop offset="100%" stopColor="hsl(171, 77%, 50%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MacroBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-semibold">{current}g / {target}g</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

const meals = [
  { time: "8:30 AM", emoji: "🥣", name: "Oatmeal with Banana", cal: 320, protein: 12, rated: true, stars: 5 },
  { time: "1:00 PM", emoji: "🍗", name: "Chicken Karahi with Rice", cal: 520, protein: 38, rated: true, stars: 4 },
  { time: "4:00 PM", emoji: "🍌", name: "Banana + Almonds", cal: 180, protein: 6, rated: false },
  { time: "7:00 PM", emoji: "🕐", name: "Dinner not logged yet", cal: 0, protein: 0, pending: true },
];

const quickActions = [
  { emoji: "📸", title: "Snap & Know", sub: "Scan any food instantly", to: "/snap", gradient: "from-emerald-500/10 to-teal-500/10", glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]" },
  { emoji: "🧊", title: "Food Store", sub: "23 items · 3 expiring", to: "/food-store", gradient: "from-teal-500/10 to-cyan-500/10", glow: "group-hover:shadow-[0_0_40px_rgba(45,212,191,0.15)]" },
  { emoji: "🍳", title: "Cook Now", sub: "4 recipes from fridge", to: "/cook", gradient: "from-amber-500/10 to-orange-500/10", glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]" },
  { emoji: "📅", title: "Meal Plan", sub: "This week's plan ready", to: "/meal-plan", gradient: "from-purple-500/10 to-pink-500/10", glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:p-10 max-w-lg lg:max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">{greeting}, Ahmed 👋</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Let's check your nutrition today</p>
            </div>
            <Link to="/profile" className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-sm font-bold text-foreground shadow-lg shadow-primary/20">
              A
            </Link>
          </motion.div>

          {/* Progress Card */}
          <motion.div variants={fadeUp} className="glass-card-static p-5 space-y-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Progress</h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                <AnimatedRing percent={1120 / 1800} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground stat-number"><CountUp target={1120} /></span>
                  <span className="text-xs text-muted-foreground mt-0.5">/ 1,800 cal</span>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-primary font-semibold mt-3"
              >
                680 remaining
              </motion.p>
            </div>
            <div className="space-y-3">
              <MacroBar label="💪 Protein" current={78} target={90} color="bg-primary" />
              <MacroBar label="🌾 Carbs" current={145} target={200} color="bg-teal-400" />
              <MacroBar label="🧈 Fat" current={42} target={60} color="bg-cyan-400" />
            </div>
          </motion.div>

          {/* Meals */}
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-semibold text-foreground">Today's Meals</h2>
              <button className="btn-ghost text-xs flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            <div className="relative pl-5 space-y-3">
              <div className="absolute left-[7px] top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-primary/60 to-teal-400/20" />
              {meals.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="glass-card flex items-center gap-3 py-3 px-4"
                >
                  <div className="absolute -left-[5px] w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm shadow-primary/30" />
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {m.time} {m.cal > 0 && `· ${m.cal} cal · ${m.protein}g protein`}
                    </p>
                  </div>
                  {m.rated && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: m.stars || 0 }).map((_, j) => (
                        <Star key={j} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                  {m.pending && (
                    <button onClick={() => navigate("/snap")} className="chip text-[11px] py-1.5 px-3">+ Log</button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-display font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(a.to)}
                  className={`group glass-card text-left bg-gradient-to-br ${a.gradient} space-y-2 p-4 ${a.glow} transition-shadow duration-500`}
                >
                  <span className="text-3xl block">{a.emoji}</span>
                  <p className="text-sm font-bold text-foreground">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{a.sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div variants={fadeUp} className="glass-card-static bg-gradient-to-r from-primary/[0.06] to-teal-400/[0.04] flex items-start gap-3 p-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="text-primary" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                Your tomatoes and spinach expire tomorrow! Make Palak tonight — it uses both. 🧠
              </p>
              <button onClick={() => navigate("/cook")} className="btn-ghost text-xs mt-2 flex items-center gap-1 p-0">
                Show Recipe <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
