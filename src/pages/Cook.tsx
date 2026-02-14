import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Brain } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

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
      <div className="px-5 py-6 lg:p-10 max-w-lg mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-xl font-display font-bold text-foreground flex-1">🍳 What Can I Cook?</h1>
            <span className="chip text-[11px] py-1.5">680 cal left</span>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1.5">
            <p className="text-[11px] text-muted-foreground font-medium">Using ingredients from your Food Store:</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {ingredients.map((ing, i) => (
                <span key={i} className={`chip text-[11px] py-1.5 ${ing.includes("⚠️") ? "chip-warning" : ""}`}>{ing}</span>
              ))}
            </div>
          </motion.div>

          <div className="space-y-3">
            {recipes.map((r, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`glass-card space-y-2.5 p-4 ${r.featured ? "border-primary/20 bg-gradient-to-br from-primary/[0.04] to-teal-400/[0.03]" : ""}`}
              >
                {r.featured && <span className="text-[11px] font-bold text-primary">🌟 RECOMMENDED</span>}
                <h3 className="text-sm font-bold text-foreground">{r.name}</h3>
                <p className="text-[11px] text-muted-foreground">
                  {r.cuisine} · ⏱️ {r.time} · 🔥 {r.cal} cal
                </p>
                <p className="text-[11px] text-muted-foreground">
                  💪 {r.protein}g · 🌾 {r.carbs}g · 🧈 {r.fat}g
                </p>
                <div className="flex flex-wrap gap-1">
                  {r.uses.map((u, j) => (
                    <span key={j} className={`text-[11px] ${u.includes("⚠️") ? "text-accent font-medium" : "text-muted-foreground"}`}>{u}</span>
                  ))}
                </div>
                {r.warning && <p className="text-[11px] text-accent font-medium">⚠️ {r.warning}</p>}
                {r.badge && <span className="chip text-[11px] py-1">{r.badge}</span>}
                {r.featured && <p className="text-[11px] text-muted-foreground/70 italic">Rated {r.rating} avg on similar meals</p>}

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="btn-ghost text-[11px] flex items-center gap-1 p-0">
                    Recipe <ChevronDown size={14} className={`transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`} />
                  </button>
                  {cooked === i ? (
                    <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="chip text-[11px] chip-selected py-1">✅ Cooked!</motion.span>
                  ) : (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCook(i, r.name)} className="btn-primary text-[11px] py-1.5 px-4">🍳 Cook This!</motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-2.5 border-t border-white/[0.05] space-y-2">
                        {r.steps.map((s, j) => (
                          <div key={j} className="flex gap-2 text-xs">
                            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">{j + 1}</span>
                            <span className="text-muted-foreground leading-relaxed">{s}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="glass-card-static bg-primary/[0.03] flex items-start gap-3 p-4">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Brain size={14} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These recipes match your food store, Pakistani/Indian preferences, and past ratings. Avoided spicy dishes since you rated them low. 🧠
            </p>
          </motion.div>
        </motion.div>
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} mealName={feedbackMeal} mealEmoji="🍳" />
    </AppLayout>
  );
}
