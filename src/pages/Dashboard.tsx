import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Camera, Warehouse, Flame, CalendarDays, Plus, Star, BrainCircuit, ChevronRight,
  UtensilsCrossed, ScanLine, Clock, Sparkles, Dumbbell, Droplets, MessageSquare
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } },
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

function AnimatedRing({ percent, size = 160 }: { percent: number; size?: number }) {
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--muted))" strokeWidth={strokeWidth} fill="none" opacity={0.3} />
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
          <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
          <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MacroBar({ label, icon: Icon, current, target, color }: { label: string; icon: React.ElementType; current: number; target: number; color: string }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1"><Icon size={12} strokeWidth={1.5} />{label}</span>
        <span className="text-foreground font-semibold">{current}g / {target}g</span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
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

const todayMeals = [
  { time: "8:30 AM", name: "Oatmeal with Banana", cal: 320, protein: 12, status: "cooked" as const, stars: 5 },
  { time: "1:00 PM", name: "Chicken Karahi with Rice", cal: 520, protein: 38, status: "cooked" as const, stars: 4 },
  { time: "4:00 PM", name: "Banana + Almonds", cal: 180, protein: 6, status: "recent" as const },
  { time: "7:00 PM", name: "Dinner not planned yet", cal: 0, protein: 0, status: "pending" as const },
];

const quickActions = [
  { icon: ScanLine, title: "Snap & Know", sub: "Scan any food instantly", to: "/snap", gradient: "from-blue-500/6 to-sky-500/6" },
  { icon: Warehouse, title: "Food Store", sub: "23 items · 3 expiring", to: "/food-store", gradient: "from-sky-500/6 to-cyan-500/6" },
  { icon: UtensilsCrossed, title: "Cook Now", sub: "AI-powered recipes", to: "/cook", gradient: "from-amber-500/6 to-orange-500/6" },
  { icon: CalendarDays, title: "Meal Plan", sub: "This week's plan ready", to: "/meal-plan", gradient: "from-indigo-500/6 to-purple-500/6" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMeal, setFeedbackMeal] = useState("");

  const openFeedback = (name: string) => {
    setFeedbackMeal(name);
    setFeedbackOpen(true);
  };

  return (
    <AppLayout>
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-5xl mx-auto relative">
        <motion.div
          animate={{ opacity: [0.01, 0.03, 0.01], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary rounded-full blur-[150px] pointer-events-none"
        />

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 lg:space-y-8 relative z-10">
          {/* Greeting */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground tracking-tight">{greeting}, Ahmed</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Let's check your nutrition today</p>
            </div>
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15"
              >
                A
              </motion.div>
            </Link>
          </motion.div>

          {/* Progress */}
          <motion.div variants={fadeUp} className="glass-card-static p-4 lg:p-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Today's Progress</h2>
            <div className="lg:flex lg:items-center lg:gap-8">
              <div className="flex flex-col items-center lg:shrink-0">
                <div className="relative">
                  <AnimatedRing percent={1120 / 1800} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl lg:text-4xl font-bold text-foreground stat-number"><CountUp target={1120} /></span>
                    <span className="text-xs text-muted-foreground mt-0.5">/ 1,800 cal</span>
                  </div>
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm text-primary font-semibold mt-3">
                  680 remaining
                </motion.p>
              </div>
              <div className="flex-1 space-y-3 mt-4 lg:mt-0">
                <MacroBar label="Protein" icon={Dumbbell} current={78} target={90} color="bg-primary" />
                <MacroBar label="Carbs" icon={Sparkles} current={145} target={200} color="bg-sky-400" />
                <MacroBar label="Fat" icon={Droplets} current={42} target={60} color="bg-cyan-400" />
              </div>
            </div>
          </motion.div>

          {/* Today's Meals */}
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-semibold text-foreground">Today's Meals</h2>
              <button onClick={() => navigate("/cook")} className="btn-ghost text-xs flex items-center gap-1"><Plus size={14} /> Add</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {todayMeals.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="glass-card flex items-center gap-3 py-3 px-3"
                >
                  <div className="icon-box-sm">
                    {m.status === "pending" ? (
                      <Clock size={14} className="text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <UtensilsCrossed size={14} className="text-primary" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {m.time} {m.cal > 0 && `· ${m.cal} cal · ${m.protein}g protein`}
                    </p>
                  </div>
                  {m.status === "cooked" && m.stars && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: m.stars }).map((_, j) => (
                        <Star key={j} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                  {m.status === "recent" && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openFeedback(m.name)}
                      className="chip text-[10px] py-1 px-2 flex items-center gap-1"
                    >
                      <MessageSquare size={10} /> Feedback
                    </motion.button>
                  )}
                  {m.status === "pending" && (
                    <button onClick={() => navigate("/cook")} className="chip text-[10px] py-1 px-2">+ Plan</button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-display font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(a.to)}
                  className={`group glass-card text-left bg-gradient-to-br ${a.gradient} space-y-2 p-3.5 lg:p-5`}
                >
                  <div className="icon-box">
                    <a.icon size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-foreground">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{a.sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div variants={fadeUp}>
            <motion.div
              whileHover={{ y: -2 }}
              className="glass-card-static bg-gradient-to-r from-primary/[0.03] to-secondary/[0.02] flex items-start gap-3 p-4 lg:p-5"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="icon-box"
              >
                <BrainCircuit className="text-primary" size={16} strokeWidth={1.5} />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs lg:text-sm text-foreground leading-relaxed">
                  Your tomatoes and spinach expire tomorrow! Make Palak tonight — it uses both and fits your calorie budget perfectly.
                </p>
                <button onClick={() => navigate("/cook")} className="btn-ghost text-xs mt-2 flex items-center gap-1 p-0">
                  Show Recipe <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} mealName={feedbackMeal} />
    </AppLayout>
  );
}
