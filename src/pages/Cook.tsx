import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, BrainCircuit, UtensilsCrossed, Flame, Dumbbell, Clock, Sparkles, AlertTriangle, Zap, Star as StarIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

const recipes = [
  {
    featured: true, name: "Chicken & Spinach Rice Bowl", cuisine: "Pakistani", time: "25 min", cal: 480,
    protein: 32, carbs: 52, fat: 12, uses: ["Chicken", "Spinach", "Rice"],
    usesWarning: [false, true, false],
    warning: "Uses 2 expiring items!", rating: "4.5",
    steps: ["Season chicken with salt, turmeric, and red chili powder", "Sauté spinach with garlic until wilted", "Cook chicken in a pan until golden", "Layer rice, chicken, and spinach in a bowl", "Garnish with lemon juice and serve hot"]
  },
  {
    name: "Tomato Egg Scramble", cuisine: "Chinese", time: "10 min", cal: 220,
    protein: 14, carbs: 8, fat: 16, uses: ["Eggs", "Tomatoes"],
    usesWarning: [false, true],
    badge: "Quick & Easy",
    steps: ["Beat eggs with salt and white pepper", "Dice tomatoes into wedges", "Scramble eggs in hot oil until half set", "Add tomatoes and stir-fry 2 minutes", "Season with sugar and serve"]
  },
  {
    name: "Chicken Karahi", cuisine: "Pakistani", time: "35 min", cal: 450,
    protein: 38, carbs: 12, fat: 28, uses: ["Chicken", "Tomatoes", "Chilies", "Onions"],
    usesWarning: [false, false, false, false],
    steps: ["Heat oil and fry onions golden", "Add tomatoes and cook until soft", "Add chicken and spices, cook 20 min", "Add green chilies and ginger", "Garnish with coriander"]
  },
  {
    name: "Cheese Omelette", cuisine: "Any", time: "8 min", cal: 280,
    protein: 20, carbs: 2, fat: 22, uses: ["Eggs", "Cheese"],
    usesWarning: [false, false],
    badge: "Fastest option",
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

  const ingredients = [
    { name: "Chicken", warning: false },
    { name: "Eggs", warning: false },
    { name: "Tomatoes", warning: true },
    { name: "Spinach", warning: true },
    { name: "Cheese", warning: false },
    { name: "Rice", warning: false },
    { name: "Onions", warning: false },
    { name: "Chilies", warning: false },
  ];

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground flex-1 flex items-center gap-2">
              <div className="icon-box-sm"><UtensilsCrossed size={20} className="text-primary" strokeWidth={1.5} /></div>
              What Can I Cook?
            </h1>
            <span className="chip text-sm py-2">680 cal left</span>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Using ingredients from your Food Store:</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {ingredients.map((ing, i) => (
                <span key={i} className={`chip text-sm py-2 ${ing.warning ? "chip-warning" : ""}`}>{ing.name} {ing.warning && <AlertTriangle size={12} className="ml-1" />}</span>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
            {recipes.map((r, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`glass-card space-y-3 p-5 lg:p-6 ${r.featured ? "border-primary/15 bg-gradient-to-br from-primary/[0.03] to-teal-400/[0.02] lg:col-span-2" : ""}`}
              >
                {r.featured && <span className="text-sm font-bold text-primary flex items-center gap-1.5"><Sparkles size={16} strokeWidth={1.5} /> RECOMMENDED</span>}
                <h3 className="text-lg font-bold text-foreground">{r.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{r.cuisine}</span>
                  <span className="flex items-center gap-1"><Clock size={14} strokeWidth={1.5} /> {r.time}</span>
                  <span className="flex items-center gap-1"><Flame size={14} strokeWidth={1.5} /> {r.cal} cal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Dumbbell size={14} strokeWidth={1.5} /> {r.protein}g protein</span>
                  <span>{r.carbs}g carbs</span>
                  <span>{r.fat}g fat</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.uses.map((u, j) => (
                    <span key={j} className={`chip text-xs py-1.5 ${r.usesWarning?.[j] ? "chip-warning" : ""}`}>{u}</span>
                  ))}
                </div>
                {r.warning && <p className="text-sm text-accent font-medium flex items-center gap-1.5"><AlertTriangle size={14} strokeWidth={1.5} /> {r.warning}</p>}
                {r.badge && <span className="chip text-xs py-1.5 flex items-center gap-1 w-fit"><Zap size={12} strokeWidth={1.5} /> {r.badge}</span>}
                {r.featured && <p className="text-sm text-muted-foreground/70 italic flex items-center gap-1"><StarIcon size={14} className="text-amber-400" /> Rated {r.rating} avg on similar meals</p>}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="btn-ghost text-sm flex items-center gap-1.5 p-0">
                    Recipe <ChevronDown size={16} className={`transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`} />
                  </button>
                  {cooked === i ? (
                    <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="chip text-sm chip-selected py-1.5">Cooked!</motion.span>
                  ) : (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCook(i, r.name)} className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"><UtensilsCrossed size={14} strokeWidth={1.5} /> Cook This!</motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-3 border-t border-white/[0.04] space-y-2.5">
                        {r.steps.map((s, j) => (
                          <div key={j} className="flex gap-3 text-sm">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">{j + 1}</span>
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

          <motion.div variants={fadeUp} className="glass-card-static bg-primary/[0.02] flex items-start gap-4 p-5">
            <div className="icon-box-sm">
              <BrainCircuit size={18} className="text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These recipes match your food store, Pakistani/Indian preferences, and past ratings. Avoided spicy dishes since you rated them low.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} mealName={feedbackMeal} />
    </AppLayout>
  );
}
