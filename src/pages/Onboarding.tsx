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
  { emoji: "⬇️", label: "Lose Weight", desc: "Calorie deficit, fat burning" },
  { emoji: "⚖️", label: "Maintain", desc: "Keep current weight" },
  { emoji: "💪", label: "Gain Muscle", desc: "Calorie surplus, high protein" },
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
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.3 },
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card-static max-w-md w-full space-y-4">
          <div className="text-center text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-display font-bold text-center text-foreground">Your Personalized Plan is Ready! ✨</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">👤 Name</span><span className="text-foreground font-medium">{name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">BMI</span><span className={`font-bold ${bmiCategory.color}`}>{bmi.toFixed(1)} — {bmiCategory.label}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Daily Target</span><span className="text-foreground font-bold"><CountUp target={1800} /> calories</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">🎯 Goal</span><span className="text-foreground">{goal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">🍽️ Diet</span><span className="text-foreground">{diet}</span></div>
            <div className="flex justify-between items-start"><span className="text-muted-foreground">🌍 Cuisines</span><span className="text-foreground text-right text-xs">{selectedCuisines.join(", ")}</span></div>
          </div>
          <div className="glass-card-static bg-primary/5 text-sm text-muted-foreground">
            💡 Based on your BMI of {bmi.toFixed(1)} and weight loss goal, we'll focus on high-protein, moderate-carb meals at 1,800 cal/day.
          </div>
          <button onClick={() => navigate("/dashboard")} className="btn-primary w-full py-3 text-sm font-semibold">
            🚀 Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs text-muted-foreground">
          {stepLabels.map((l, i) => (
            <span key={i} className={`font-medium ${i <= step ? "text-primary" : ""}`}>
              {i < step ? <Check size={14} className="inline text-primary" /> : null} {l}
            </span>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full" animate={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" {...fadeSlide} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Let's get to know you! 👋</h2>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-glass w-full text-lg" placeholder="What should we call you?" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setAge(Math.max(10, age - 1))} className="btn-secondary w-10 h-10 flex items-center justify-center text-lg">-</button>
                  <span className="text-2xl font-bold text-foreground w-16 text-center">{age}</span>
                  <button onClick={() => setAge(Math.min(100, age + 1))} className="btn-secondary w-10 h-10 flex items-center justify-center text-lg">+</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {genderOptions.map(g => (
                    <button key={g.label} onClick={() => setGender(g.label)}
                      className={`glass-card text-center py-4 transition-all ${gender === g.label ? "border-primary bg-primary/10" : ""}`}>
                      <div className="text-2xl mb-1">{g.emoji}</div>
                      <div className="text-xs font-medium text-foreground">{g.label}</div>
                      {gender === g.label && <Check size={14} className="text-primary mx-auto mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" {...fadeSlide} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Your body metrics 📏</h2>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Weight</span><span className="text-foreground font-bold text-lg">{weight} kg</span>
                </div>
                <input type="range" min={30} max={200} value={weight} onChange={e => setWeight(+e.target.value)}
                  className="w-full accent-primary" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Height</span><span className="text-foreground font-bold text-lg">{height} cm</span>
                </div>
                <input type="range" min={100} max={220} value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full accent-primary" />
              </div>
              <motion.div layout className="glass-card-static text-center bg-primary/5">
                <p className="text-xs text-muted-foreground mb-1">Your BMI</p>
                <motion.p key={bmi.toFixed(1)} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-4xl font-bold font-display ${bmiCategory.color}`}>
                  {bmi.toFixed(1)}
                </motion.p>
                <span className={`chip text-xs mt-2 inline-block ${bmiCategory.color}`}>{bmiCategory.label}</span>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...fadeSlide} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">What's your goal? 🎯</h2>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Activity Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {activityLevels.map(a => (
                    <button key={a.label} onClick={() => setActivity(a.label)}
                      className={`glass-card text-left py-3 px-4 transition-all ${activity === a.label ? "border-primary bg-primary/10" : ""}`}>
                      <div className="text-xl">{a.emoji}</div>
                      <div className="text-sm font-semibold text-foreground">{a.label}</div>
                      <div className="text-xs text-muted-foreground">{a.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Health Goal</label>
                <div className="grid grid-cols-3 gap-3">
                  {healthGoals.map(g => (
                    <button key={g.label} onClick={() => setGoal(g.label)}
                      className={`glass-card text-center py-4 transition-all ${goal === g.label ? "border-primary bg-primary/10" : ""}`}>
                      <div className="text-2xl mb-1">{g.emoji}</div>
                      <div className="text-xs font-semibold text-foreground">{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...fadeSlide} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Dietary Info 🥗</h2>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Food Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {allergies.map(a => (
                    <button key={a} onClick={() => toggleItem(selectedAllergies, a, setSelectedAllergies)}
                      className={`chip text-xs ${selectedAllergies.includes(a) ? "chip-selected" : ""}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Diet Preference</label>
                <div className="flex flex-wrap gap-2">
                  {diets.map(d => (
                    <button key={d} onClick={() => setDiet(d)}
                      className={`chip text-xs ${diet === d ? "chip-selected" : ""}`}>{d}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" {...fadeSlide} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Favorite Cuisines 🌍</h2>
              <div className="grid grid-cols-3 gap-3">
                {cuisines.map(c => (
                  <button key={c} onClick={() => toggleItem(selectedCuisines, c, setSelectedCuisines)}
                    className={`glass-card text-center py-4 text-sm transition-all relative ${selectedCuisines.includes(c) ? "border-primary bg-primary/10" : ""}`}>
                    {c}
                    {selectedCuisines.includes(c) && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check size={10} className="text-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <button onClick={next} className="btn-primary flex-1 py-3 text-sm font-semibold">
          {step === 4 ? "Finish ✨" : "Next →"}
        </button>
      </div>
    </div>
  );
}
