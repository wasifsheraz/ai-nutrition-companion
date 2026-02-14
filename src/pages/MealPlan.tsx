import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Check, Copy, Share2, Sparkles, Flame, Clock, Dumbbell,
  CalendarDays, ShoppingCart, Heart, Zap, UtensilsCrossed, ScanSearch,
  Coffee, Sun, Moon, Cookie, ArrowRight, BrainCircuit
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 14, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } } };

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealOptions = [{ label: "Breakfast", icon: Coffee }, { label: "Lunch", icon: Sun }, { label: "Snacks", icon: Cookie }, { label: "Dinner", icon: Moon }];
const durationOptions = [{ label: "1 Day", value: 1 }, { label: "3 Days", value: 3 }, { label: "1 Week", value: 7 }];
const tasteOptions = [{ label: "Spicy", icon: Flame }, { label: "Healthy", icon: Heart }, { label: "Quick", icon: Zap }, { label: "High Protein", icon: Dumbbell }];
const searchingMessages = ["Analyzing your preferences...", "Balancing nutrition goals...", "Crafting daily meals...", "Building grocery list...", "Finalizing your plan..."];

const weekPlan: Record<string, { period: string; icon: React.ElementType; name: string; cal: number; protein: number; time: string }[]> = {
  Mon: [
    { period: "Breakfast", icon: Sparkles, name: "Masala Omelette + Paratha", cal: 380, protein: 22, time: "15min" },
    { period: "Lunch", icon: Flame, name: "Chicken Pulao + Raita", cal: 520, protein: 35, time: "30min" },
    { period: "Dinner", icon: Clock, name: "Daal + Brown Rice + Salad", cal: 420, protein: 18, time: "25min" },
  ],
  Tue: [
    { period: "Breakfast", icon: Sparkles, name: "Oatmeal with Banana & Nuts", cal: 350, protein: 14, time: "10min" },
    { period: "Lunch", icon: Flame, name: "Chicken Biryani + Raita", cal: 550, protein: 38, time: "40min" },
    { period: "Dinner", icon: Clock, name: "Grilled Chicken Salad", cal: 380, protein: 32, time: "15min" },
  ],
  Wed: [
    { period: "Breakfast", icon: Sparkles, name: "Egg & Cheese Sandwich", cal: 320, protein: 18, time: "8min" },
    { period: "Lunch", icon: Flame, name: "Palak Paneer + Roti", cal: 480, protein: 22, time: "25min" },
    { period: "Dinner", icon: Clock, name: "Fish Curry + Rice", cal: 460, protein: 35, time: "30min" },
  ],
};
["Thu", "Fri", "Sat", "Sun"].forEach((d, i) => { weekPlan[d] = weekPlan[Object.keys(weekPlan)[i % 3]]; });

const groceryHave = ["Chicken", "Eggs", "Rice", "Onions", "Lentils"];
const groceryNeed = [{ name: "Yogurt", qty: "1L" }, { name: "Brown Rice", qty: "1kg" }, { name: "Spinach", qty: "2 bunches" }, { name: "Ginger", qty: "1 piece" }, { name: "Green peppers", qty: "×4" }, { name: "Paratha pack", qty: "1 pack" }];

type Phase = "setup" | "generating" | "plan";

export default function MealPlan() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [tab, setTab] = useState<"plan" | "grocery">("plan");
  const [cooked, setCooked] = useState<Record<string, boolean>>({});
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["Breakfast", "Lunch", "Dinner"]);
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [searchMsgIdx, setSearchMsgIdx] = useState(0);

  const toggleMeal = (label: string) => setSelectedMeals(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  const toggleTaste = (label: string) => setSelectedTastes(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]);
  const toggleCooked = (key: string) => setCooked(prev => ({ ...prev, [key]: !prev[key] }));

  const handleGenerate = () => {
    setPhase("generating"); setSearchMsgIdx(0); let idx = 0;
    const interval = setInterval(() => { idx++; if (idx >= searchingMessages.length) { clearInterval(interval); setTimeout(() => setPhase("plan"), 600); } else { setSearchMsgIdx(idx); } }, 800);
  };

  const handleBack = () => { if (phase === "plan") setPhase("setup"); else navigate("/dashboard"); };
  const dayMeals = weekPlan[selectedDay] || [];
  const dayTotal = dayMeals.reduce((s, m) => s + m.cal, 0);
  const dayProtein = dayMeals.reduce((s, m) => s + m.protein, 0);

  return (
    <AppLayout>
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-3xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={handleBack} className="btn-ghost p-1.5"><ChevronLeft size={18} /></button>
            <div className="flex-1">
              <h1 className="text-lg lg:text-xl font-display font-bold text-foreground flex items-center gap-2">
                <div className="icon-box-sm"><CalendarDays size={14} className="text-primary" strokeWidth={1.5} /></div>
                Meal Plan
              </h1>
              <p className="text-muted-foreground text-[10px] mt-0.5 ml-[38px]">Plan your meals with AI</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "setup" && (
              <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }} className="space-y-4">
                <p className="text-muted-foreground text-xs font-medium">Configure your AI-generated meal plan</p>

                <div className="glass-card-static p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5"><UtensilsCrossed size={13} className="text-primary" strokeWidth={1.5} />Include Meals</label>
                  <div className="flex flex-wrap gap-2">
                    {mealOptions.map(({ label, icon: Icon }) => (
                      <motion.button key={label} whileTap={{ scale: 0.93 }} onClick={() => toggleMeal(label)} className={`chip text-xs py-2 px-4 flex items-center gap-1.5 ${selectedMeals.includes(label) ? "chip-selected" : ""}`}>
                        <Icon size={12} strokeWidth={1.5} />{label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="glass-card-static p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5"><CalendarDays size={13} className="text-primary" strokeWidth={1.5} />Plan Duration</label>
                  <div className="flex flex-wrap gap-2">
                    {durationOptions.map(({ label, value }) => (
                      <motion.button key={value} whileTap={{ scale: 0.93 }} onClick={() => setSelectedDuration(value)} className={`chip text-xs py-2 px-4 ${selectedDuration === value ? "chip-selected" : ""}`}>{label}</motion.button>
                    ))}
                  </div>
                </div>

                <div className="glass-card-static p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5"><Heart size={13} className="text-primary" strokeWidth={1.5} />Food Taste</label>
                  <div className="flex flex-wrap gap-2">
                    {tasteOptions.map(({ label, icon: Icon }) => (
                      <motion.button key={label} whileTap={{ scale: 0.93 }} onClick={() => toggleTaste(label)} className={`chip text-xs py-2 px-4 flex items-center gap-1.5 ${selectedTastes.includes(label) ? "chip-selected" : ""}`}>
                        <Icon size={12} strokeWidth={1.5} />{label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={selectedMeals.length === 0}
                  className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none">
                  <Sparkles size={14} strokeWidth={1.5} /> Generate Meal Plan with AI
                </motion.button>
              </motion.div>
            )}

            {phase === "generating" && (
              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative w-28 h-28">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full"
                    style={{ border: "2px solid transparent", background: "conic-gradient(from 0deg, hsl(217,91%,60%), hsl(199,89%,48%), transparent 50%) border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                  <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center border border-primary/15">
                    <ScanSearch size={28} className="text-primary" strokeWidth={1.5} />
                  </motion.div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={searchMsgIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-muted-foreground text-xs font-medium">
                    {searchingMessages[searchMsgIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {phase === "plan" && (
              <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
                <div className="flex gap-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTab("plan")} className={`chip text-xs py-2 px-4 flex items-center gap-1.5 ${tab === "plan" ? "chip-selected" : ""}`}>
                    <CalendarDays size={13} strokeWidth={1.5} /> Plan View
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTab("grocery")} className={`chip text-xs py-2 px-4 flex items-center gap-1.5 ${tab === "grocery" ? "chip-selected" : ""}`}>
                    <ShoppingCart size={13} strokeWidth={1.5} /> Grocery List
                  </motion.button>
                </div>

                {tab === "plan" ? (
                  <>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                      {days.map((d, i) => (
                        <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDay(d)}
                          className={`chip text-xs py-2 px-3 flex items-center gap-1 ${selectedDay === d ? "chip-selected" : ""}`}>
                          {d} {i < 2 && <Check size={11} className="text-primary" />} {i === 2 && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
                        </motion.button>
                      ))}
                    </div>

                    <div className="space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
                      {dayMeals.map((meal, i) => {
                        const key = `${selectedDay}-${i}`;
                        return (
                          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="glass-card space-y-2 p-4 lg:p-5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"><meal.icon size={13} strokeWidth={1.5} />{meal.period}</div>
                            <h3 className="text-sm font-bold text-foreground">{meal.name}</h3>
                            <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><Flame size={11} strokeWidth={1.5} /> {meal.cal} cal</span>
                              <span className="flex items-center gap-0.5"><Dumbbell size={11} strokeWidth={1.5} /> {meal.protein}g</span>
                              <span className="flex items-center gap-0.5"><Clock size={11} strokeWidth={1.5} /> {meal.time}</span>
                            </div>
                            <div className="flex gap-2 pt-0.5">
                              <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleCooked(key)}
                                className={`chip text-[10px] py-1.5 ${cooked[key] ? "chip-selected" : ""}`}>
                                {cooked[key] ? <><Check size={12} /> Cooked</> : "Mark Cooked"}
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="glass-card-static bg-primary/[0.02] space-y-2 p-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Today</span>
                        <span className="text-foreground font-bold">{dayTotal} / 1,800 cal · {dayProtein}g protein</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-primary to-sky-400 rounded-full"
                          initial={{ width: 0 }} animate={{ width: `${Math.min(dayTotal / 1800 * 100, 100)}%` }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                    <div className="glass-card-static space-y-2 p-4 lg:p-5">
                      <h3 className="text-xs font-bold text-primary flex items-center gap-1.5"><Check size={13} />Already in Your Food Store</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {groceryHave.map((item, i) => <span key={i} className="chip text-xs chip-selected py-1.5">{item}</span>)}
                      </div>
                    </div>
                    <div className="glass-card-static space-y-2 p-4 lg:p-5">
                      <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5"><ShoppingCart size={13} strokeWidth={1.5} /> Need to Buy</h3>
                      {groceryNeed.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs py-1.5 border-b border-border/20 last:border-0">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground font-medium">{item.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 lg:col-span-2">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                        const text = groceryNeed.map(i => `${i.name} — ${i.qty}`).join("\n");
                        navigator.clipboard.writeText(text);
                        import("sonner").then(({ toast }) => toast.success("Grocery list copied!"));
                      }} className="btn-secondary flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"><Copy size={13} strokeWidth={1.5} />Copy</motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} className="btn-secondary flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"><Share2 size={13} strokeWidth={1.5} />Share</motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppLayout>
  );
}
