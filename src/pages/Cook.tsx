import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Plus, X, UtensilsCrossed, Flame, Dumbbell,
  Sparkles, Wheat, Timer, BarChart3, ListOrdered,
  RefreshCw, ShoppingCart, Check, Zap, Heart, Salad,
  BrainCircuit, PackagePlus, ArrowRight, ScanSearch
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

type CookMode = null | "ingredients" | "ai";
type Phase = "input" | "searching" | "result";

const mockRecipe = {
  name: "Grilled Chicken Quinoa Bowl",
  ingredients: [
    { name: "Chicken Breast", available: true },
    { name: "Quinoa", available: true },
    { name: "Avocado", available: false },
    { name: "Cherry Tomatoes", available: true },
    { name: "Lemon", available: false },
  ],
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
  "Scanning your ingredients...",
  "Matching flavor profiles...",
  "Finding the perfect recipe...",
  "Optimizing nutrition balance...",
  "Preparing your meal plan...",
];

const mealPreferences = [
  { label: "Spicy", icon: Flame },
  { label: "Healthy", icon: Heart },
  { label: "Quick", icon: Zap },
  { label: "High Protein", icon: Dumbbell },
];

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function Cook() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CookMode>(null);
  const [phase, setPhase] = useState<Phase>("input");
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [prefInput, setPrefInput] = useState("");
  const [searchMsgIdx, setSearchMsgIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>("Lunch");

  const addIngredient = () => {
    const val = inputVal.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients((prev) => [...prev, val]);
      setInputVal("");
    }
  };

  const removeIngredient = (ing: string) =>
    setIngredients((prev) => prev.filter((i) => i !== ing));

  const togglePref = (label: string) =>
    setSelectedPrefs((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );

  const addCustomPref = () => {
    const val = prefInput.trim();
    if (val && !selectedPrefs.includes(val)) {
      setSelectedPrefs((prev) => [...prev, val]);
      setPrefInput("");
    }
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
    }, 800);
  };

  const handleReset = () => {
    setPhase("input");
    setIngredients([]);
    setInputVal("");
    setPrefInput("");
    setSelectedPrefs([]);
    setSearchMsgIdx(0);
  };

  const handleNewMealSameIngredients = () => {
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
    }, 800);
  };

  const handleAddNewIngredients = () => {
    setPhase("input");
  };

  const handleCookIt = () => setShowFeedback(true);

  const handleSelectMode = (m: CookMode) => {
    setMode(m);
    setPhase("input");
    if (m === "ai") {
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
      setSelectedPrefs([]);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-3xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={handleBack} className="btn-ghost p-2">
              <ChevronLeft size={22} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground flex items-center gap-3">
                <div className="icon-box-sm">
                  <Salad size={20} className="text-primary" strokeWidth={1.5} />
                </div>
                Cook
              </h1>
              <p className="text-muted-foreground text-sm mt-1 ml-[52px]">Create your perfect meal</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ─── Mode Selection ─── */}
            {!mode && (
              <motion.div
                key="mode-select"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-5"
              >
                <p className="text-muted-foreground text-sm font-medium">Choose how you'd like to start</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Option 1: Select Ingredients */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectMode("ingredients")}
                    className="glass-card text-left p-7 space-y-5 group relative"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-500" />
                    <div className="icon-box-lg">
                      <PackagePlus size={26} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-foreground">Select Ingredients</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Enter your ingredients & meal preference — get a personalized AI recipe
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                      Get Started <ArrowRight size={14} strokeWidth={2} />
                    </div>
                  </motion.button>

                  {/* Option 2: AI Decide */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectMode("ai")}
                    className="glass-card text-left p-7 space-y-5 group relative"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-all duration-500" />
                    <div className="icon-box-lg" style={{ background: "rgba(20, 184, 166, 0.08)", borderColor: "rgba(20, 184, 166, 0.15)" }}>
                      <BrainCircuit size={26} className="text-secondary" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-foreground">Let AI Decide</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        AI picks the best meal from the items in your Food Store
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary text-sm font-semibold">
                      Auto Generate <ArrowRight size={14} strokeWidth={2} />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ─── Input Phase ─── */}
            {mode === "ingredients" && phase === "input" && (
              <motion.div
                key="input-phase"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Meal Type */}
                <div className="glass-card-static p-6 space-y-4">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <UtensilsCrossed size={16} className="text-primary" strokeWidth={1.5} />
                    Meal Type
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {mealTypes.map((type) => (
                      <motion.button
                        key={type}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setSelectedMealType(type)}
                        className={`chip text-sm py-2.5 px-5 ${
                          selectedMealType === type ? "chip-selected" : ""
                        }`}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Meal Preference */}
                <div className="glass-card-static p-6 space-y-4">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Heart size={16} className="text-primary" strokeWidth={1.5} />
                    Meal Preference
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {mealPreferences.map(({ label, icon: Icon }) => (
                      <motion.button
                        key={label}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => togglePref(label)}
                        className={`chip text-sm py-2.5 px-5 flex items-center gap-2 ${
                          selectedPrefs.includes(label) ? "chip-selected" : ""
                        }`}
                      >
                        <Icon size={14} strokeWidth={1.5} />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={prefInput}
                      onChange={(e) => setPrefInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomPref()}
                      placeholder="Add custom preference..."
                      className="input-glass flex-1 text-sm"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={addCustomPref}
                      className="btn-secondary px-4"
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                  {selectedPrefs.filter((p) => !mealPreferences.find((m) => m.label === p)).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPrefs
                        .filter((p) => !mealPreferences.find((m) => m.label === p))
                        .map((p) => (
                          <span key={p} className="chip chip-selected text-sm py-2 flex items-center gap-1.5">
                            {p}
                            <button onClick={() => togglePref(p)}>
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Ingredients Input */}
                <div className="glass-card-static p-6 space-y-4">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Salad size={16} className="text-primary" strokeWidth={1.5} />
                    Add Ingredients
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                      placeholder="e.g. Chicken, Rice, Tomatoes..."
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

                  {ingredients.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
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
                </div>

                {/* Generate Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={ingredients.length < 2}
                  className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Sparkles size={18} strokeWidth={1.5} /> Generate Recipe
                </motion.button>
              </motion.div>
            )}

            {/* ─── Searching Phase ─── */}
            {phase === "searching" && (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-8"
              >
                <div className="relative w-36 h-36">
                  {/* Outer rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: "2px solid transparent",
                      background: "conic-gradient(from 0deg, hsl(160,84%,39%), hsl(171,77%,50%), transparent 50%) border-box",
                      WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  {/* Inner pulsing orb */}
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/15"
                  >
                    <ScanSearch size={38} className="text-primary" strokeWidth={1.5} />
                  </motion.div>
                  {/* Glow */}
                  <motion.div
                    animate={{ opacity: [0.15, 0.5, 0.15] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 50px rgba(16,185,129,0.3)" }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={searchMsgIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="text-foreground font-semibold text-lg text-center"
                  >
                    {searchingMessages[searchMsgIdx]}
                  </motion.p>
                </AnimatePresence>

                <div className="flex gap-2">
                  {searchingMessages.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                        i <= searchMsgIdx ? "bg-primary" : "bg-muted"
                      }`}
                      animate={i <= searchMsgIdx ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── Result Phase ─── */}
            {phase === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                    <Sparkles size={14} className="text-primary" strokeWidth={1.5} />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Recommendation</span>
                  </div>
                </div>

                {/* Recipe Card */}
                <div className="glass-card-static p-7 lg:p-8 space-y-6 border-primary/10">
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">{mockRecipe.name}</h2>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { icon: Timer, label: mockRecipe.time, color: "text-primary" },
                      { icon: BarChart3, label: mockRecipe.complexity, color: "text-primary" },
                      { icon: Flame, label: `${mockRecipe.cal} cal`, color: "text-primary" },
                    ].map(({ icon: Icon, label, color }) => (
                      <span
                        key={label}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 rounded-full px-3.5 py-1.5 border border-border"
                      >
                        <Icon size={14} strokeWidth={1.5} className={color} /> {label}
                      </span>
                    ))}
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Dumbbell, value: mockRecipe.protein, label: "Protein", unit: "g", cls: "text-primary" },
                      { icon: Wheat, value: mockRecipe.carbs, label: "Carbs", unit: "g", cls: "text-secondary" },
                      { icon: Flame, value: mockRecipe.fat, label: "Fat", unit: "g", cls: "text-accent" },
                    ].map(({ icon: Icon, value, label, unit, cls }) => (
                      <div key={label} className="glass-card-static text-center py-4 px-2">
                        <Icon size={18} className={`${cls} mx-auto mb-1.5`} strokeWidth={1.5} />
                        <p className="text-xl font-bold text-foreground stat-number">
                          {value}<span className="text-sm font-normal text-muted-foreground">{unit}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ingredients with availability */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Salad size={16} strokeWidth={1.5} className="text-primary" />
                      Main Ingredients
                    </p>
                    <div className="grid gap-2">
                      {mockRecipe.ingredients.map(({ name, available }) => (
                        <motion.div
                          key={name}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between glass-card-static py-3 px-4"
                          style={{ borderRadius: "14px" }}
                        >
                          <span className="text-sm text-foreground font-medium">{name}</span>
                          {available ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                              <Check size={12} strokeWidth={2} /> Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1">
                              <ShoppingCart size={12} strokeWidth={2} /> Buy
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <ListOrdered size={16} strokeWidth={1.5} className="text-primary" /> Steps
                    </p>
                    <div className="space-y-3">
                      {mockRecipe.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i, duration: 0.4 }}
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

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNewMealSameIngredients}
                    className="btn-secondary py-4 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} strokeWidth={1.5} /> New Meal
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddNewIngredients}
                    className="btn-secondary py-4 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <PackagePlus size={16} strokeWidth={1.5} /> Add Ingredients
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCookIt}
                    className="btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <UtensilsCrossed size={16} strokeWidth={1.5} /> I'm Cooking It!
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
