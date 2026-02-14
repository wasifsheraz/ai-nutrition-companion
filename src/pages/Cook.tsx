import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Plus, X, UtensilsCrossed, Flame, Dumbbell, Clock,
  Sparkles, ChefHat, Search, Wheat, Timer, BarChart3, ListOrdered,
  RefreshCw, CookingPot, Warehouse
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

type MealType = "breakfast" | "lunch" | "dinner";
type CookMode = null | "new" | "store";
type Phase = "input" | "searching" | "result";

const mockRecipe = {
  name: "Grilled Chicken Quinoa Bowl",
  ingredients: ["Chicken Breast", "Quinoa", "Avocado", "Cherry Tomatoes", "Lemon"],
  complexity: "Medium",
  time: "30 min",
  cal: 520,
  protein: 42,
  carbs: 48,
  fat: 16,
  steps: [
    "Season chicken with salt, pepper, paprika and lemon zest",
    "Grill chicken on medium-high heat for 6-7 min each side",
    "Cook quinoa in salted water for 15 minutes, then fluff",
    "Dice avocado and halve the cherry tomatoes",
    "Assemble bowl: quinoa base, sliced chicken, toppings",
    "Drizzle with lemon juice and olive oil, serve warm",
  ],
};

const searchingMessages = [
  "Analyzing your ingredients...",
  "Finding the best recipe match...",
  "Calculating nutritional balance...",
  "Preparing your recommendation...",
];

export default function Cook() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CookMode>(null);
  const [phase, setPhase] = useState<Phase>("input");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [searchMsgIdx, setSearchMsgIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const addIngredient = () => {
    const val = inputVal.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients((prev) => [...prev, val]);
      setInputVal("");
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleGenerate = () => {
    setPhase("searching");
    setSearchMsgIdx(0);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= searchingMessages.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("result"), 600);
      } else {
        setSearchMsgIdx(idx);
      }
    }, 900);
  };

  const handleReset = () => {
    setPhase("input");
    setIngredients([]);
    setInputVal("");
    setSearchMsgIdx(0);
  };

  const handleCookIt = () => {
    setShowFeedback(true);
  };

  const handleSelectMode = (m: CookMode) => {
    setMode(m);
    setPhase("input");
    if (m === "store") {
      setIngredients(["Chicken", "Tomatoes", "Spinach", "Rice", "Onions"]);
      setTimeout(() => handleGenerate(), 100);
    }
  };

  const handleBack = () => {
    if (phase === "result") {
      handleReset();
    } else if (mode) {
      setMode(null);
      setPhase("input");
      setIngredients([]);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-3xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={handleBack} className="btn-ghost p-2">
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-display font-bold text-foreground flex-1 flex items-center gap-2">
              <div className="icon-box-sm">
                <ChefHat size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              Cook
            </h1>
          </motion.div>

          {/* Mode Selection */}
          <AnimatePresence mode="wait">
            {!mode && (
              <motion.div
                key="mode-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <p className="text-muted-foreground text-sm">How would you like to find a recipe?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectMode("new")}
                    className="glass-card text-left space-y-4 p-6"
                  >
                    <div className="icon-box">
                      <Plus size={22} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">New Ingredients</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter ingredients you have and get an AI-powered recipe
                      </p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectMode("store")}
                    className="glass-card text-left space-y-4 p-6"
                  >
                    <div className="icon-box">
                      <Warehouse size={22} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">From Food Store</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate a recipe using items from your pantry
                      </p>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Input Phase */}
            {mode === "new" && phase === "input" && (
              <motion.div
                key="input-phase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Meal Type</label>
                  <div className="flex gap-3">
                    {(["breakfast", "lunch", "dinner"] as MealType[]).map((t) => (
                      <motion.button
                        key={t}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMealType(t)}
                        className={`chip text-sm py-2.5 px-5 capitalize ${mealType === t ? "chip-selected" : ""}`}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Add Ingredients</label>
                  <div className="flex gap-2">
                    <input
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                      placeholder="Type ingredient and press Enter..."
                      className="input-glass flex-1"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={addIngredient}
                      className="btn-primary p-3.5"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>

                {ingredients.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-wrap gap-2"
                  >
                    {ingredients.map((ing) => (
                      <motion.span
                        key={ing}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="chip text-sm py-2 flex items-center gap-1.5"
                      >
                        {ing}
                        <button onClick={() => removeIngredient(ing)}>
                          <X size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={ingredients.length < 2}
                  className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Search size={18} strokeWidth={1.5} /> Generate Recipe
                </motion.button>
              </motion.div>
            )}

            {/* Searching Phase */}
            {phase === "searching" && (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-8"
              >
                {/* Animated scanning orb */}
                <div className="relative w-32 h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent"
                    style={{
                      borderImage: "conic-gradient(from 0deg, hsl(160,84%,39%), transparent 40%) 1",
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      background: "conic-gradient(from 0deg, hsl(160,84%,39%), transparent 40%) border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <CookingPot size={36} className="text-primary" strokeWidth={1.5} />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 40px rgba(16,185,129,0.3)" }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={searchMsgIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-foreground font-semibold text-lg text-center"
                  >
                    {searchingMessages[searchMsgIdx]}
                  </motion.p>
                </AnimatePresence>

                <div className="flex gap-1.5">
                  {searchingMessages.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i <= searchMsgIdx ? "bg-primary" : "bg-white/10"}`}
                      animate={i <= searchMsgIdx ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Result Phase */}
            {phase === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={18} strokeWidth={1.5} />
                  <span className="text-sm font-bold uppercase tracking-wider">Recommended Recipe</span>
                </div>

                <div className="glass-card-static p-6 space-y-5 border-primary/15 bg-gradient-to-br from-primary/[0.04] to-teal-400/[0.02]">
                  <h2 className="text-2xl font-display font-bold text-foreground">{mockRecipe.name}</h2>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Timer size={16} strokeWidth={1.5} className="text-primary" /> {mockRecipe.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart3 size={16} strokeWidth={1.5} className="text-primary" /> {mockRecipe.complexity}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame size={16} strokeWidth={1.5} className="text-primary" /> {mockRecipe.cal} cal
                    </span>
                  </div>

                  {/* Macros */}
                  <div className="flex gap-3">
                    <div className="glass-card-static flex-1 text-center py-3 px-2">
                      <Dumbbell size={16} className="text-primary mx-auto mb-1" strokeWidth={1.5} />
                      <p className="text-lg font-bold text-foreground">{mockRecipe.protein}g</p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div className="glass-card-static flex-1 text-center py-3 px-2">
                      <Wheat size={16} className="text-teal-400 mx-auto mb-1" strokeWidth={1.5} />
                      <p className="text-lg font-bold text-foreground">{mockRecipe.carbs}g</p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>
                    <div className="glass-card-static flex-1 text-center py-3 px-2">
                      <Flame size={16} className="text-amber-400 mx-auto mb-1" strokeWidth={1.5} />
                      <p className="text-lg font-bold text-foreground">{mockRecipe.fat}g</p>
                      <p className="text-xs text-muted-foreground">Fat</p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Main Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {mockRecipe.ingredients.map((ing) => (
                        <span key={ing} className="chip text-sm py-2">{ing}</span>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <ListOrdered size={16} strokeWidth={1.5} className="text-primary" /> Steps
                    </p>
                    <div className="space-y-3">
                      {mockRecipe.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.4 }}
                          className="flex gap-3"
                        >
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold border border-primary/20">
                            {i + 1}
                          </span>
                          <span className="text-sm text-muted-foreground leading-relaxed pt-1">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    className="btn-secondary flex-1 py-4 text-base font-semibold flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} strokeWidth={1.5} /> Another Recipe
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCookIt}
                    className="btn-primary flex-1 py-4 text-base font-bold flex items-center justify-center gap-2"
                  >
                    <UtensilsCrossed size={18} strokeWidth={1.5} /> I'm Cooking It!
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        mealName={mockRecipe.name}
      />
    </AppLayout>
  );
}
