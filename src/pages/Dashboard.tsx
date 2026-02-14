import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Camera, Box, Flame, CalendarDays, Plus, Star, Brain, ChevronRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function AnimatedRing({ percent, size = 160 }: { percent: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth={10} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} stroke="url(#ringGrad)" strokeWidth={10} fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - percent) }}
        transition={{ duration: 1.5, ease: "easeOut" }}
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
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{current}g / {target}g</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
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
  { icon: Camera, emoji: "📸", title: "Snap & Know", sub: "Scan any food instantly", to: "/snap", gradient: "from-emerald-500/20 to-teal-500/20" },
  { icon: Box, emoji: "🧊", title: "Food Store", sub: "23 items · 3 expiring soon", to: "/food-store", gradient: "from-teal-500/20 to-cyan-500/20" },
  { icon: Flame, emoji: "🍳", title: "Cook Now", sub: "4 recipes from your fridge", to: "/cook", gradient: "from-amber-500/20 to-orange-500/20" },
  { icon: CalendarDays, emoji: "📅", title: "Meal Plan", sub: "This week's plan ready", to: "/meal-plan", gradient: "from-purple-500/20 to-pink-500/20" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <div className="p-6 lg:p-12 max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{greeting}, Ahmed 👋</h1>
              <p className="text-sm text-muted-foreground">Let's check your nutrition today</p>
            </div>
            <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-sm font-bold text-foreground">
              A
            </Link>
          </motion.div>

          {/* Progress Card */}
          <motion.div variants={fadeUp} className="glass-card-static space-y-6">
            <h2 className="text-sm font-semibold text-muted-foreground">Today's Progress</h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                <AnimatedRing percent={1120 / 1800} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground stat-number">1,120</span>
                  <span className="text-xs text-muted-foreground">/ 1,800 cal</span>
                </div>
              </div>
              <p className="text-sm text-primary font-medium mt-2">680 remaining</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MacroBar label="💪 Protein" current={78} target={90} color="bg-primary" />
              <MacroBar label="🌾 Carbs" current={145} target={200} color="bg-teal-400" />
              <MacroBar label="🧈 Fat" current={42} target={60} color="bg-cyan-400" />
            </div>
          </motion.div>

          {/* Meals */}
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-foreground">Today's Meals</h2>
              <button className="btn-ghost text-xs flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary to-teal-400 rounded-full" />
              {meals.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card flex items-center gap-4"
                >
                  <div className="absolute -left-[14px] w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
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
                    <button className="chip text-xs">+ Log</button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(a.to)}
                  className={`glass-card text-left bg-gradient-to-br ${a.gradient} space-y-2`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div variants={fadeUp} className="glass-card-static bg-gradient-to-r from-primary/5 to-teal-400/5 flex items-start gap-3">
            <Brain className="text-primary shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-foreground">
                🧠 Your tomatoes and spinach expire tomorrow! Make Palak tonight — it uses both.
              </p>
              <button onClick={() => navigate("/cook")} className="btn-ghost text-xs mt-2 flex items-center gap-1">
                Show Recipe <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
