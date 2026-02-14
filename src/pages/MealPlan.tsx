import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Copy, Share2, Sparkles } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const weekPlan: Record<string, { period: string; emoji: string; name: string; cal: number; protein: number; time: string }[]> = {
  Mon: [
    { period: "🌅 Breakfast", emoji: "🍳", name: "Masala Omelette + Paratha", cal: 380, protein: 22, time: "15min" },
    { period: "☀️ Lunch", emoji: "🍗", name: "Chicken Pulao + Raita", cal: 520, protein: 35, time: "30min" },
    { period: "🌙 Dinner", emoji: "🥘", name: "Daal + Brown Rice + Salad", cal: 420, protein: 18, time: "25min" },
  ],
  Tue: [
    { period: "🌅 Breakfast", emoji: "🥣", name: "Oatmeal with Banana & Nuts", cal: 350, protein: 14, time: "10min" },
    { period: "☀️ Lunch", emoji: "🍛", name: "Chicken Biryani + Raita", cal: 550, protein: 38, time: "40min" },
    { period: "🌙 Dinner", emoji: "🥗", name: "Grilled Chicken Salad", cal: 380, protein: 32, time: "15min" },
  ],
  Wed: [
    { period: "🌅 Breakfast", emoji: "🍞", name: "Egg & Cheese Sandwich", cal: 320, protein: 18, time: "8min" },
    { period: "☀️ Lunch", emoji: "🍲", name: "Palak Paneer + Roti", cal: 480, protein: 22, time: "25min" },
    { period: "🌙 Dinner", emoji: "🐟", name: "Fish Curry + Rice", cal: 460, protein: 35, time: "30min" },
  ],
};

// Fill remaining days with Mon data
["Thu", "Fri", "Sat", "Sun"].forEach((d, i) => {
  weekPlan[d] = weekPlan[Object.keys(weekPlan)[i % 3]];
});

const groceryHave = ["Chicken ✅", "Eggs ✅", "Rice ✅", "Onions ✅", "Lentils ✅"];
const groceryNeed = [
  { name: "Yogurt 1L", price: "$2.50" },
  { name: "Brown Rice 1kg", price: "$3.00" },
  { name: "Spinach 2 bunches", price: "$1.50" },
  { name: "Ginger", price: "$0.50" },
  { name: "Green peppers ×4", price: "$2.00" },
  { name: "Paratha pack", price: "$3.50" },
];

export default function MealPlan() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("Wed");
  const [tab, setTab] = useState<"plan" | "grocery">("plan");
  const [generated, setGenerated] = useState(true);
  const [cooked, setCooked] = useState<Record<string, boolean>>({});

  const toggleCooked = (key: string) => setCooked(prev => ({ ...prev, [key]: !prev[key] }));
  const dayMeals = weekPlan[selectedDay] || [];
  const dayTotal = dayMeals.reduce((s, m) => s + m.cal, 0);
  const dayProtein = dayMeals.reduce((s, m) => s + m.protein, 0);

  if (!generated) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-12 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
              <h1 className="text-2xl font-display font-bold text-foreground">📅 Generate Your Meal Plan</h1>
            </div>
            <div className="glass-card-static space-y-6">
              <p className="text-sm text-muted-foreground">Configure your plan</p>
              <button onClick={() => setGenerated(true)} className="btn-primary w-full py-3 text-sm font-semibold">
                <Sparkles size={16} className="inline mr-2" />Generate My Plan
              </button>
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-12 max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground">📅 Meal Plan</h1>
          </motion.div>

          {/* Tab Toggle */}
          <motion.div variants={fadeUp} className="flex gap-2">
            <button onClick={() => setTab("plan")} className={`chip text-xs ${tab === "plan" ? "chip-selected" : ""}`}>📅 Plan View</button>
            <button onClick={() => setTab("grocery")} className={`chip text-xs ${tab === "grocery" ? "chip-selected" : ""}`}>🛒 Grocery List</button>
          </motion.div>

          {tab === "plan" ? (
            <>
              {/* Day Selector */}
              <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-1">
                {days.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`chip text-xs whitespace-nowrap ${selectedDay === d ? "chip-selected" : ""}`}
                  >
                    {d} {i < 2 ? "✅" : i === 2 ? "📍" : ""}
                  </button>
                ))}
              </motion.div>

              {/* Meals */}
              <div className="space-y-4">
                {dayMeals.map((meal, i) => {
                  const key = `${selectedDay}-${i}`;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card space-y-2"
                    >
                      <p className="text-xs text-muted-foreground">{meal.period}</p>
                      <h3 className="text-base font-semibold text-foreground">{meal.emoji} {meal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        🔥 {meal.cal} cal · 💪 {meal.protein}g · ⏱️ {meal.time}
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-ghost text-xs">View Recipe</button>
                        <button
                          onClick={() => toggleCooked(key)}
                          className={`chip text-xs ${cooked[key] ? "chip-selected" : ""}`}
                        >
                          {cooked[key] ? "✅ Cooked" : "Mark Cooked"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Daily Summary */}
              <motion.div variants={fadeUp} className="glass-card-static bg-primary/5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today</span>
                  <span className="text-foreground font-medium">{dayTotal} / 1,800 cal · {dayProtein}g protein</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dayTotal / 1800) * 100, 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card-static space-y-3">
                <h3 className="text-sm font-semibold text-primary">✅ Already in Your Fridge</h3>
                <div className="flex flex-wrap gap-2">
                  {groceryHave.map((item, i) => (
                    <span key={i} className="chip text-xs chip-selected">{item}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card-static space-y-3">
                <h3 className="text-sm font-semibold text-foreground">🛒 Need to Buy</h3>
                {groceryNeed.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-foreground">Total Estimated</span>
                  <span className="text-primary">$13.00</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary flex-1 py-2 text-xs"><Copy size={14} className="inline mr-1" />Copy List</button>
                <button className="btn-secondary flex-1 py-2 text-xs"><Share2 size={14} className="inline mr-1" />Share</button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
