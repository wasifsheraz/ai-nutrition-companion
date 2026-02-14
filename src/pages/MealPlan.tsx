import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Copy, Share2, Sparkles } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

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
        <div className="px-5 py-6 lg:p-10 max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
              <h1 className="text-xl font-display font-bold text-foreground">📅 Generate Meal Plan</h1>
            </div>
            <div className="glass-card-static space-y-5 p-5">
              <p className="text-sm text-muted-foreground">Configure your plan</p>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setGenerated(true)} className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2">
                <Sparkles size={16} />Generate My Plan
              </motion.button>
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:p-10 max-w-lg mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-xl font-display font-bold text-foreground">📅 Meal Plan</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTab("plan")} className={`chip text-xs ${tab === "plan" ? "chip-selected" : ""}`}>📅 Plan View</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTab("grocery")} className={`chip text-xs ${tab === "grocery" ? "chip-selected" : ""}`}>🛒 Grocery List</motion.button>
          </motion.div>

          {tab === "plan" ? (
            <>
              <motion.div variants={fadeUp} className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {days.map((d, i) => (
                  <motion.button
                    key={d}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDay(d)}
                    className={`chip text-xs py-2 px-3 ${selectedDay === d ? "chip-selected" : ""}`}
                  >
                    {d} {i < 2 ? "✅" : i === 2 ? "📍" : ""}
                  </motion.button>
                ))}
              </motion.div>

              <div className="space-y-3">
                {dayMeals.map((meal, i) => {
                  const key = `${selectedDay}-${i}`;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-card space-y-2 p-4"
                    >
                      <p className="text-[11px] text-muted-foreground font-medium">{meal.period}</p>
                      <h3 className="text-sm font-bold text-foreground">{meal.emoji} {meal.name}</h3>
                      <p className="text-[11px] text-muted-foreground">
                        🔥 {meal.cal} cal · 💪 {meal.protein}g · ⏱️ {meal.time}
                      </p>
                      <div className="flex gap-2 pt-0.5">
                        <button className="btn-ghost text-[11px] p-0">View Recipe</button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleCooked(key)}
                          className={`chip text-[11px] py-1 ${cooked[key] ? "chip-selected" : ""}`}
                        >
                          {cooked[key] ? "✅ Cooked" : "Mark Cooked"}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div variants={fadeUp} className="glass-card-static bg-primary/[0.03] space-y-2 p-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Today</span>
                  <span className="text-foreground font-bold">{dayTotal} / 1,800 cal · {dayProtein}g protein</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="glass-card-static space-y-2.5 p-4">
                <h3 className="text-xs font-bold text-primary">✅ Already in Your Fridge</h3>
                <div className="flex flex-wrap gap-1.5">
                  {groceryHave.map((item, i) => (
                    <span key={i} className="chip text-[11px] chip-selected py-1.5">{item}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card-static space-y-2.5 p-4">
                <h3 className="text-xs font-bold text-foreground">🛒 Need to Buy</h3>
                {groceryNeed.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground font-medium">{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">$13.00</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <motion.button whileTap={{ scale: 0.97 }} className="btn-secondary flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5"><Copy size={14} />Copy</motion.button>
                <motion.button whileTap={{ scale: 0.97 }} className="btn-secondary flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5"><Share2 size={14} />Share</motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
