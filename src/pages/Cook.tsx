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
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } },
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
  complexity: "Medium", time: "30 min", cal: 520, protein: 42, carbs: 48, fat: 16,
  steps: [
    "Season chicken with salt, pepper, paprika and lemon zest",
    "Grill chicken on medium-high heat for 6-7 min each side",
    "Cook quinoa in salted water for 15 minutes, then fluff",
    "Dice avocado and halve the cherry tomatoes",
    "Assemble bowl: quinoa base, sliced chicken, toppings",
    "Drizzle with lemon juice and olive oil, serve warm",
  ],
};

const searchingMessages = ["Scanning your ingredients...", "Matching flavor profiles...", "Finding the perfect recipe...", "Optimizing nutrition balance...", "Preparing your meal plan..."];
const mealPreferences = [{ label: "Spicy", icon: Flame }, { label: "Healthy", icon: Heart }, { label: "Quick", icon: Zap }, { label: "High Protein", icon: Dumbbell }];
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

  const addIngredient = () => { const val = inputVal.trim(); if (val && !ingredients.includes(val)) { setIngredients(prev => [...prev, val]); setInputVal(""); } };
  const removeIngredient = (ing: string) => setIngredients(prev => prev.filter(i => i !== ing));
  const togglePref = (label: string) => setSelectedPrefs(prev => prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]);
  const addCustomPref = () => { const val = prefInput.trim(); if (val && !selectedPrefs.includes(val)) { setSelectedPrefs(prev => [...prev, val]); setPrefInput(""); } };

  const handleGenerate = () => {
    setPhase("searching"); setSearchMsgIdx(0); let idx = 0;
    const interval = setInterval(() => { idx++; if (idx >= searchingMessages.length) { clearInterval(interval); setTimeout(() => setPhase("result"), 600); } else { setSearchMsgIdx(idx); } }, 800);
  };

  const handleReset = () => { setPhase("input"); setIngredients([]); setInputVal(""); setPrefInput(""); setSelectedPrefs([]); setSearchMsgIdx(0); };
  const handleNewMealSameIngredients = () => { setPhase("searching"); setSearchMsgIdx(0); let idx = 0; const interval = setInterval(() => { idx++; if (idx >= searchingMessages.length) { clearInterval(interval); setTimeout(() => setPhase("result"), 600); } else { setSearchMsgIdx(idx); } }, 800); };
  const handleAddNewIngredients = () => setPhase("input");
  const handleCookIt = () => setShowFeedback(true);

  const handleSelectMode = (m: CookMode) => {
    setMode(m); setPhase("input");
    if (m === "ai") { setIngredients(["Chicken", "Tomatoes", "Spinach", "Rice", "Onions"]); setTimeout(() => handleGenerate(), 100); }
  };

  const handleBack = () => {
    if (phase === "result") { handleReset(); } else if (mode) { setMode(null); setPhase("input"); setIngredients([]); setSelectedPrefs([]); } else { navigate("/dashboard"); }
  };

  return (
    <AppLayout>
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={handleBack} className="btn-ghost p-1.5"><ChevronLeft size={18} /></button>
            <div className="flex-1">
              <h1 className="text-lg lg:text-xl font-display font-bold text-foreground flex items-center gap-2">
                <div className="icon-box-sm"><Salad size={14} className="text-primary" strokeWidth={1.5} /></div>
                Cook
              </h1>
              <p className="text-muted-foreground text-[10px] mt-0.5 ml-[38px]">Create your perfect meal</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!mode && (
              <motion.div key="mode-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }} className="space-y-4">
                <p className="text-muted-foreground text-xs font-medium">Choose how you'd like to start</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => handleSelectMode("ingredients")}
                    className="glass-card text-left p-5 space-y-3 group relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-500" />
                    <div className="icon-box"><PackagePlus size={18} className="text-primary" strokeWidth={1.5} /></div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Select Ingredients</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">Enter ingredients & preference — get a personalized AI recipe</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-semibold">Get Started <ArrowRight size={12} /></div>
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => handleSelectMode("ai")}
                    className="glass-card text-left p-5 space-y-3 group relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-all duration-500" />
                    <div className="icon-box" style={{ background: "rgba(14,165,233,0.08)", borderColor: "rgba(14,165,233,0.15)" }}>
                      <BrainCircuit size={18} className="text-secondary" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">Let AI Decide</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">AI picks the best meal from your Food Store</p>
                    </div>
                    <div className="flex items-center gap-1 text-secondary text-xs font-semibold">Auto Generate <ArrowRight size={12} /></div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {mode === "ingredients" && phase === "input" && (
              <motion.div key="input-phase" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }} className="space-y-4">
                <div className="glass-card-static p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5"><UtensilsCrossed size={13} className="text-primary" strokeWidth={1.5} />Meal Type</label>
                  <div className="flex flex-wrap gap-2">
                    {mealTypes.map(type => (<motion.button key={type} whileTap={{ scale: 0.93 }} onClick={() => setSelectedMealType(type)} className={`chip text-xs py-2 px-4 ${selectedMealType === type ? "chip-selected" : ""}`}>{type}</motion.button>))}
                  </div>
                </div>

                <div className="glass-card-static p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5"><Heart size={13} className="text-primary" strokeWidth={1.5} />Meal Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {mealPreferences.map(({ label, icon: Icon }) => (<motion.button key={label} whileTap={{ scale: 0.93 }} onClick={() => togglePref(label)} className={`chip text-xs py-2 px-4 flex items-center gap-1.5 ${selectedPrefs.includes(label) ? "chip-selected" : ""}`}><Icon size={12} strokeWidth={1.5} />{label}</motion.button>))}
                  </div>
                  <div className="flex gap-2">
                    <input value={prefInput} onChange={e => setPrefInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustomPref()} placeholder="Add custom..." className="input-glass flex-1 text-xs" />
                    <motion.button whileTap={{ scale: 0.9 }} onClick={addCustomPref} className="btn-secondary px-3"><Plus size={14} /></motion.button>
                  </div>
                  {selectedPrefs.filter(p => !mealPreferences.find(m => m.label === p)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPrefs.filter(p => !mealPreferences.find(m => m.label === p)).map(p => (
                        <span key={p} className="chip chip-selected text-xs py-1.5 flex items-center gap-1">{p}<button onClick={() => togglePref(p)}><X size={10} /></button></span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-card-static p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5"><Salad size={13} className="text-primary" strokeWidth={1.5} />Add Ingredients</label>
                  <div className="flex gap-2">
                    <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && addIngredient()} placeholder="e.g. Chicken, Rice..." className="input-glass flex-1" />
                    <motion.button whileTap={{ scale: 0.9 }} onClick={addIngredient} className="btn-primary p-2.5"><Plus size={16} /></motion.button>
                  </div>
                  {ingredients.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5">
                      {ingredients.map(ing => (
                        <motion.span key={ing} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="chip text-xs py-1.5 flex items-center gap-1">
                          {ing}<button onClick={() => removeIngredient(ing)}><X size={12} className="text-muted-foreground hover:text-foreground transition-colors" /></button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>

                <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={ingredients.length < 2}
                  className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none">
                  <Sparkles size={14} strokeWidth={1.5} /> Generate Recipe
                </motion.button>
              </motion.div>
            )}

            {phase === "searching" && (
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative w-28 h-28">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full"
                    style={{ border: "2px solid transparent", background: "conic-gradient(from 0deg, hsl(217,91%,60%), hsl(199,89%,48%), transparent 50%) border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                  <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center border border-primary/15">
                    <ScanSearch size={28} className="text-primary" strokeWidth={1.5} />
                  </motion.div>
                  <motion.div animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 50px rgba(59,130,246,0.3)" }} />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={searchMsgIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-foreground font-semibold text-sm text-center">
                    {searchingMessages[searchMsgIdx]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex gap-1.5">
                  {searchingMessages.map((_, i) => (<motion.div key={i} className={`w-2 h-2 rounded-full ${i <= searchMsgIdx ? "bg-primary" : "bg-muted"}`} animate={i <= searchMsgIdx ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.4 }} />))}
                </div>
              </motion.div>
            )}

            {phase === "result" && (
              <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                    <Sparkles size={12} className="text-primary" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Recommendation</span>
                  </div>
                </div>

                <div className="glass-card-static p-5 lg:p-6 space-y-4 border-primary/10">
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">{mockRecipe.name}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {[{ icon: Timer, label: mockRecipe.time }, { icon: BarChart3, label: mockRecipe.complexity }, { icon: Flame, label: `${mockRecipe.cal} cal` }].map(({ icon: Icon, label }) => (
                      <span key={label} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1 border border-border"><Icon size={12} strokeWidth={1.5} className="text-primary" /> {label}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[{ icon: Dumbbell, value: mockRecipe.protein, label: "Protein", unit: "g", cls: "text-primary" }, { icon: Wheat, value: mockRecipe.carbs, label: "Carbs", unit: "g", cls: "text-secondary" }, { icon: Flame, value: mockRecipe.fat, label: "Fat", unit: "g", cls: "text-accent" }].map(({ icon: Icon, value, label, unit, cls }) => (
                      <div key={label} className="glass-card-static text-center py-3 px-2">
                        <Icon size={14} className={`${cls} mx-auto mb-1`} strokeWidth={1.5} />
                        <p className="text-lg font-bold text-foreground stat-number">{value}<span className="text-xs font-normal text-muted-foreground">{unit}</span></p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5"><Salad size={13} strokeWidth={1.5} className="text-primary" />Main Ingredients</p>
                    <div className="grid gap-1.5">
                      {mockRecipe.ingredients.map(({ name, available }) => (
                        <motion.div key={name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between glass-card-static py-2 px-3" style={{ borderRadius: "10px" }}>
                          <span className="text-xs text-foreground font-medium">{name}</span>
                          {available ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5"><Check size={10} /> Available</span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5"><ShoppingCart size={10} /> Buy</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5"><ListOrdered size={13} strokeWidth={1.5} className="text-primary" /> Steps</p>
                    <div className="space-y-2">
                      {mockRecipe.steps.map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }} className="flex gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold border border-primary/20">{i + 1}</span>
                          <span className="text-xs text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleNewMealSameIngredients} className="btn-secondary py-3 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <RefreshCw size={13} strokeWidth={1.5} /> New Meal
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddNewIngredients} className="btn-secondary py-3 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <PackagePlus size={13} strokeWidth={1.5} /> Add Ingredients
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleCookIt} className="btn-primary py-3 text-xs font-bold flex items-center justify-center gap-1.5">
                    <UtensilsCrossed size={13} strokeWidth={1.5} /> I'm Cooking It!
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} mealName={mockRecipe.name} />
    </AppLayout>
  );
}
