import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";

const stepLabels = ["You", "Body", "Goals", "Diet", "Cuisine"];

const genderOptions = [
  { emoji: "♂️", label: "Male" },
  { emoji: "♀️", label: "Female" },
  { emoji: "⚧", label: "Other" },
];

const activityLevels = [
  { emoji: "🛋️", label: "Sedentary", desc: "Desk job, minimal exercise" },
  { emoji: "🚶", label: "Light", desc: "Light exercise 1-3 days/week" },
  { emoji: "🏃", label: "Moderate", desc: "Moderate exercise 3-5 days/week" },
  { emoji: "💪", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
];

const healthGoals = [
  { emoji: "⬇️", label: "Lose Weight", desc: "Calorie deficit" },
  { emoji: "⚖️", label: "Maintain", desc: "Keep current weight" },
  { emoji: "💪", label: "Gain Muscle", desc: "High protein" },
];

const allergies = ["🥜 Nuts", "🥛 Dairy", "🌾 Gluten", "🥚 Eggs", "🫘 Soy", "🦐 Shellfish", "❌ None"];
const diets = ["🥩 Keto", "🌱 Vegan", "🥬 Vegetarian", "☪️ Halal", "🍽️ No Preference"];
const cuisines = [
  "🇵🇰 Pakistani", "🇮🇳 Indian", "🇨🇳 Chinese", "🇮🇹 Italian",
  "🇲🇽 Mexican", "🇹🇷 Turkish", "🇯🇵 Japanese", "🇹🇭 Thai",
  "🇸🇦 Arabian", "🇺🇸 American", "🇰🇷 Korean", "🌍 Other",
];

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const step = () => {
      const p = Math.min((Date.now() - start) / 1500, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span className="stat-number">{val.toLocaleString()}</span>;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Ahmed");
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState(85);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState("Moderate");
  const [goal, setGoal] = useState("Lose Weight");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(["🥛 Dairy", "🦐 Shellfish"]);
  const [diet, setDiet] = useState("☪️ Halal");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["🇵🇰 Pakistani", "🇮🇳 Indian", "🇨🇳 Chinese"]);
  const [showResult, setShowResult] = useState(false);

  const bmi = weight / Math.pow(height / 100, 2);
  const bmiCategory = bmi < 18.5 ? { label: "Underweight", color: "text-blue-400" }
    : bmi < 25 ? { label: "Normal", color: "text-primary" }
    : bmi < 30 ? { label: "Overweight", color: "text-accent" }
    : { label: "Obese", color: "text-destructive" };

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    if (item.includes("None")) { setter(arr.includes(item) ? [] : [item]); return; }
    const filtered = arr.filter(a => !a.includes("None"));
    setter(filtered.includes(item) ? filtered.filter(a => a !== item) : [...filtered, item]);
  };

  const next = () => {
    if (step === 4) { setShowResult(true); return; }
    setStep(s => s + 1);
  };

  const fadeSlide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: 0.3, ease: "easeOut" as const },
  } as const;

  if (showResult) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-5 py-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="glass-card-static max-w-sm w-full space-y-5 p-6">
          <div className="text-center text-4xl mb-1">🎉</div>
          <h2 className="text-lg font-display font-bold text-center text-foreground">Your Plan is Ready! ✨</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">👤 Name</span><span className="text-foreground font-medium">{name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">BMI</span><span className={`font-bold ${bmiCategory.color}`}>{bmi.toFixed(1)} — {bmiCategory.label}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Daily Target</span><span className="text-foreground font-bold"><CountUp target={1800} /> cal</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">🎯 Goal</span><span className="text-foreground">{goal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">🍽️ Diet</span><span className="text-foreground">{diet}</span></div>
            <div className="flex justify-between items-start"><span className="text-muted-foreground shrink-0">🌍 Cuisines</span><span className="text-foreground text-right text-xs ml-2">{selectedCuisines.join(", ")}</span></div>
          </div>
          <div className="glass-card-static bg-primary/[0.04] text-sm text-muted-foreground p-3.5 leading-relaxed">
            💡 Based on your BMI of {bmi.toFixed(1)} and weight loss goal, we'll focus on high-protein, moderate-carb meals at 1,800 cal/day.
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/dashboard")} className="btn-primary w-full py-3.5 text-sm font-bold">
            🚀 Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col px-5 py-6 max-w-sm mx-auto">
      {/* Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          {stepLabels.map((l, i) => (
            <span key={i} className={`font-semibold transition-colors ${i <= step ? "text-primary" : ""}`}>
              {i < step ? <Check size={12} className="inline text-primary mr-0.5" /> : null}{l}
            </span>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full" animate={{ width: `${((step + 1) / 5) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" {...fadeSlide} className="space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Let's get to know you! 👋</h2>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1.5 block font-medium">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-glass w-full" placeholder="What should we call you?" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1.5 block font-medium">Age</label>
                <div className="flex items-center gap-4">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAge(Math.max(10, age - 1))} className="btn-secondary w-11 h-11 flex items-center justify-center text-lg rounded-xl">-</motion.button>
                  <span className="text-2xl font-bold text-foreground w-14 text-center font-display">{age}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAge(Math.min(100, age + 1))} className="btn-secondary w-11 h-11 flex items-center justify-center text-lg rounded-xl">+</motion.button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-2 block font-medium">Gender</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {genderOptions.map(g => (
                    <motion.button key={g.label} whileTap={{ scale: 0.95 }} onClick={() => setGender(g.label)}
                      className={`glass-card text-center py-4 transition-all ${gender === g.label ? "border-primary/40 bg-primary/[0.06]" : ""}`}>
                      <div className="text-2xl mb-1">{g.emoji}</div>
                      <div className="text-xs font-semibold text-foreground">{g.label}</div>
                      {gender === g.label && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} className="text-primary mx-auto mt-1" /></motion.div>}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" {...fadeSlide} className="space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Your body metrics 📏</h2>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Weight</span><span className="text-foreground font-bold text-lg font-display">{weight} kg</span>
                </div>
                <input type="range" min={30} max={200} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-primary h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Height</span><span className="text-foreground font-bold text-lg font-display">{height} cm</span>
                </div>
                <input type="range" min={100} max={220} value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full accent-primary h-2" />
              </div>
              <motion.div layout className="glass-card-static text-center bg-primary/[0.03] py-5">
                <p className="text-[11px] text-muted-foreground mb-1.5">Your BMI</p>
                <motion.p key={bmi.toFixed(1)} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className={`text-4xl font-bold font-display ${bmiCategory.color}`}>
                  {bmi.toFixed(1)}
                </motion.p>
                <motion.span key={bmiCategory.label} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`chip text-xs mt-3 inline-block ${bmiCategory.color}`}>{bmiCategory.label}</motion.span>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...fadeSlide} className="space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">What's your goal? 🎯</h2>
              <div>
                <label className="text-[11px] text-muted-foreground mb-2 block font-medium">Activity Level</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {activityLevels.map(a => (
                    <motion.button key={a.label} whileTap={{ scale: 0.95 }} onClick={() => setActivity(a.label)}
                      className={`glass-card text-left py-3.5 px-3.5 transition-all ${activity === a.label ? "border-primary/40 bg-primary/[0.06]" : ""}`}>
                      <div className="text-xl mb-1">{a.emoji}</div>
                      <div className="text-xs font-bold text-foreground">{a.label}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{a.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-2 block font-medium">Health Goal</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {healthGoals.map(g => (
                    <motion.button key={g.label} whileTap={{ scale: 0.95 }} onClick={() => setGoal(g.label)}
                      className={`glass-card text-center py-4 transition-all ${goal === g.label ? "border-primary/40 bg-primary/[0.06]" : ""}`}>
                      <div className="text-2xl mb-1">{g.emoji}</div>
                      <div className="text-[11px] font-bold text-foreground">{g.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...fadeSlide} className="space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Dietary Info 🥗</h2>
              <div>
                <label className="text-[11px] text-muted-foreground mb-2 block font-medium">Food Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {allergies.map(a => (
                    <motion.button key={a} whileTap={{ scale: 0.95 }} onClick={() => toggleItem(selectedAllergies, a, setSelectedAllergies)}
                      className={`chip text-xs ${selectedAllergies.includes(a) ? "chip-selected" : ""}`}>{a}</motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-2 block font-medium">Diet Preference</label>
                <div className="flex flex-wrap gap-2">
                  {diets.map(d => (
                    <motion.button key={d} whileTap={{ scale: 0.95 }} onClick={() => setDiet(d)}
                      className={`chip text-xs ${diet === d ? "chip-selected" : ""}`}>{d}</motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" {...fadeSlide} className="space-y-5">
              <h2 className="text-xl font-display font-bold text-foreground">Favorite Cuisines 🌍</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {cuisines.map(c => (
                  <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => toggleItem(selectedCuisines, c, setSelectedCuisines)}
                    className={`glass-card text-center py-3.5 text-sm transition-all relative ${selectedCuisines.includes(c) ? "border-primary/40 bg-primary/[0.06]" : ""}`}>
                    {c}
                    {selectedCuisines.includes(c) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check size={10} className="text-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-2.5 mt-6 pb-safe">
        {step > 0 && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(s => s - 1)} className="btn-secondary px-5 py-3.5 text-sm flex items-center gap-1.5">
            <ChevronLeft size={16} /> Back
          </motion.button>
        )}
        <motion.button whileTap={{ scale: 0.97 }} onClick={next} className="btn-primary flex-1 py-3.5 text-sm font-bold">
          {step === 4 ? "Finish ✨" : "Next →"}
        </motion.button>
      </div>
    </div>
  );
}
