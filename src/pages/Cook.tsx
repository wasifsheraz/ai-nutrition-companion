import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Brain } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const recipes = [
  {
    featured: true, name: "Chicken & Spinach Rice Bowl", cuisine: "Pakistani", time: "25 min", cal: 480,
    protein: 32, carbs: 52, fat: 12, uses: ["🍗 Chicken", "🥬 Spinach⚠️", "🍚 Rice"],
    warning: "Uses 2 expiring items!", rating: "4.5★",
    steps: ["Season chicken with salt, turmeric, and red chili powder", "Sauté spinach with garlic until wilted", "Cook chicken in a pan until golden", "Layer rice, chicken, and spinach in a bowl", "Garnish with lemon juice and serve hot"]
  },
  {
    name: "Tomato Egg Scramble", cuisine: "Chinese", time: "10 min", cal: 220,
    protein: 14, carbs: 8, fat: 16, uses: ["🥚 Eggs", "🍅 Tomatoes⚠️"],
    badge: "⚡ Quick & Easy",
    steps: ["Beat eggs with salt and white pepper", "Dice tomatoes into wedges", "Scramble eggs in hot oil until half set", "Add tomatoes and stir-fry 2 minutes", "Season with sugar and serve"]
  },
  {
    name: "Chicken Karahi", cuisine: "Pakistani", time: "35 min", cal: 450,
    protein: 38, carbs: 12, fat: 28, uses: ["🍗 Chicken", "🍅 Tomatoes", "🌶️ Chilies", "🧅 Onions"],
    steps: ["Heat oil and fry onions golden", "Add tomatoes and cook until soft", "Add chicken and spices, cook 20 min", "Add green chilies and ginger", "Garnish with coriander"]
  },
  {
    name: "Cheese Omelette", cuisine: "Any", time: "8 min", cal: 280,
    protein: 20, carbs: 2, fat: 22, uses: ["🥚 Eggs", "🧀 Cheese"],
    badge: "⚡ Fastest option",
    steps: ["Beat 3 eggs with salt and pepper", "Pour into buttered pan on medium heat", "Add grated cheese when eggs begin to set", "Fold and cook 1 more minute", "Serve immediately"]
  },
];

export default function Cook() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [cooked, setCooked] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMeal, setFeedbackMeal] = useState("");

  const handleCook = (idx: number, name: string) => {
    setCooked(idx);
    setFeedbackMeal(name);
    setTimeout(() => setShowFeedback(true), 800);
  };

  const ingredients = ["🍗 Chicken", "🥚 Eggs", "🍅 Tomatoes ⚠️", "🥬 Spinach ⚠️", "🧀 Cheese", "🍚 Rice", "🧅 Onions", "🌶️ Chilies"];

  return (
    <AppLayout>
      <div className="p-6 lg:p-12 max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">🍳 What Can I Cook?</h1>
            </div>
            <span className="chip text-xs ml-auto">680 cal remaining</span>
          </motion.div>

          {/* Ingredients */}
          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-xs text-muted-foreground">Using ingredients from your Food Store:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {ingredients.map((ing, i) => (
                <span key={i} className={`chip text-xs whitespace-nowrap ${ing.includes("⚠️") ? "chip-warning" : ""}`}>{ing}</span>
              ))}
            </div>
          </motion.div>

          {/* Recipes */}
          <div className="space-y-4">
            {recipes.map((r, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`glass-card space-y-3 ${r.featured ? "border-primary/30 bg-gradient-to-br from-primary/5 to-teal-400/5" : ""}`}
              >
                {r.featured && <span className="text-xs font-bold text-primary">🌟 RECOMMENDED</span>}
                <h3 className="text-base font-bold text-foreground">{r.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {r.cuisine} · ⏱️ {r.time} · 🔥 {r.cal} cal
                </p>
                <p className="text-xs text-muted-foreground">
                  💪 {r.protein}g protein · 🌾 {r.carbs}g carbs · 🧈 {r.fat}g fat
                </p>
                <div className="flex flex-wrap gap-1">
                  {r.uses.map((u, j) => (
                    <span key={j} className={`text-xs ${u.includes("⚠️") ? "text-accent" : "text-muted-foreground"}`}>{u}</span>
                  ))}
                </div>
                {r.warning && <p className="text-xs text-accent">⚠️ {r.warning}</p>}
                {r.badge && <span className="chip text-xs">{r.badge}</span>}
                {r.featured && <p className="text-xs text-muted-foreground italic">You rated similar meals {r.rating} on average</p>}

                <div className="flex gap-2">
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="btn-ghost text-xs flex items-center gap-1">
                    View Recipe <ChevronDown size={14} className={`transition-transform ${expanded === i ? "rotate-180" : ""}`} />
                  </button>
                  {cooked === i ? (
                    <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="chip text-xs chip-selected">✅ Cooked!</motion.span>
                  ) : (
                    <button onClick={() => handleCook(i, r.name)} className="btn-primary text-xs py-1.5 px-4">🍳 Cook This!</button>
                  )}
                </div>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        {r.steps.map((s, j) => (
                          <div key={j} className="flex gap-2 text-xs">
                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">{j + 1}</span>
                            <span className="text-muted-foreground">{s}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Personalization note */}
          <motion.div variants={fadeUp} className="glass-card-static bg-primary/5 flex items-start gap-3">
            <Brain size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              🧠 These recipes are based on your food store, Pakistani/Indian cuisine preference, and past 5-star ratings. I avoided spicy dishes since you rated them low last week.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} mealName={feedbackMeal} mealEmoji="🍳" />
    </AppLayout>
  );
}
