import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Camera, Warehouse, Flame, CalendarDays, Plus, Star, BrainCircuit, ChevronRight, UtensilsCrossed, ScanLine, Clock, Sparkles, Dumbbell, Droplets } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
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

function AnimatedRing({ percent, size = 200 }: { percent: number; size?: number }) {
  const strokeWidth = 12;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} fill="none" />
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

function MacroBar({ label, icon: Icon, current, target, color }: { label: string; icon: React.ElementType; current: number; target: number; color: string }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground flex items-center gap-1.5"><Icon size={14} strokeWidth={1.5} />{label}</span>
        <span className="text-foreground font-semibold">{current}g / {target}g</span>
      </div>
      <div className="h-3 rounded-full bg-white/[0.03] overflow-hidden">
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
  { time: "8:30 AM", icon: UtensilsCrossed, name: "Oatmeal with Banana", cal: 320, protein: 12, rated: true, stars: 5 },
  { time: "1:00 PM", icon: Flame, name: "Chicken Karahi with Rice", cal: 520, protein: 38, rated: true, stars: 4 },
  { time: "4:00 PM", icon: UtensilsCrossed, name: "Banana + Almonds", cal: 180, protein: 6, rated: false },
  { time: "7:00 PM", icon: Clock, name: "Dinner not logged yet", cal: 0, protein: 0, pending: true },
];

const quickActions = [
  { icon: ScanLine, title: "Snap & Know", sub: "Scan any food instantly", to: "/snap", gradient: "from-emerald-500/8 to-teal-500/8", glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]" },
  { icon: Warehouse, title: "Food Store", sub: "23 items · 3 expiring", to: "/food-store", gradient: "from-teal-500/8 to-cyan-500/8", glow: "group-hover:shadow-[0_0_40px_rgba(45,212,191,0.12)]" },
  { icon: UtensilsCrossed, title: "Cook Now", sub: "4 recipes from fridge", to: "/cook", gradient: "from-amber-500/8 to-orange-500/8", glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]" },
  { icon: CalendarDays, title: "Meal Plan", sub: "This week's plan ready", to: "/meal-plan", gradient: "from-purple-500/8 to-pink-500/8", glow: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.12)]" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7 lg:space-y-10">
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">{greeting}, Ahmed</h1>
              <p className="text-sm text-muted-foreground mt-1">Let's check your nutrition today</p>
            </div>
            <Link to="/profile" className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-base font-bold text-foreground shadow-lg shadow-primary/20">
              A
            </Link>
          </motion.div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
            <motion.div variants={fadeUp} className="glass-card-static p-6 lg:p-8 space-y-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today's Progress</h2>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <AnimatedRing percent={1120 / 1800} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl lg:text-5xl font-bold text-foreground stat-number"><CountUp target={1120} /></span>
                    <span className="text-sm text-muted-foreground mt-1">/ 1,800 cal</span>
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-base text-primary font-semibold mt-4"
                >
                  680 remaining
                </motion.p>
              </div>
              <div className="space-y-4">
                <MacroBar label="Protein" icon={Dumbbell} current={78} target={90} color="bg-primary" />
                <MacroBar label="Carbs" icon={Sparkles} current={145} target={200} color="bg-teal-400" />
                <MacroBar label="Fat" icon={Droplets} current={42} target={60} color="bg-cyan-400" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-semibold text-foreground">Today's Meals</h2>
                <button className="btn-ghost text-sm flex items-center gap-1.5"><Plus size={16} /> Add</button>
              </div>
              <div className="relative pl-6 space-y-3">
                <div className="absolute left-[9px] top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-primary/60 to-teal-400/20" />
                {meals.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="glass-card flex items-center gap-4 py-4 px-5"
                  >
                    <div className="absolute -left-[5px] w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow-sm shadow-primary/30" />
                    <div className="icon-box-sm">
                      <m.icon size={20} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {m.time} {m.cal > 0 && `· ${m.cal} cal · ${m.protein}g protein`}
                      </p>
                    </div>
                    {m.rated && (
                      <div className="flex gap-0.5">
                        {Array.from({ length: m.stars || 0 }).map((_, j) => (
                          <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    )}
                    {m.pending && (
                      <button onClick={() => navigate("/snap")} className="chip text-xs py-2 px-4">+ Log</button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(a.to)}
                  className={`group glass-card text-left bg-gradient-to-br ${a.gradient} space-y-3 p-5 lg:p-6 ${a.glow} transition-shadow duration-500`}
                >
                  <div className="icon-box">
                    <a.icon size={22} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-base font-bold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static bg-gradient-to-r from-primary/[0.04] to-teal-400/[0.03] flex items-start gap-4 p-5 lg:p-6">
            <div className="icon-box">
              <BrainCircuit className="text-primary" size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm lg:text-base text-foreground leading-relaxed">
                Your tomatoes and spinach expire tomorrow! Make Palak tonight — it uses both and fits your calorie budget perfectly.
              </p>
              <button onClick={() => navigate("/cook")} className="btn-ghost text-sm mt-3 flex items-center gap-1.5 p-0">
                Show Recipe <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
