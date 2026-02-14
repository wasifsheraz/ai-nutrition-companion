import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Check, Activity, Target, Dumbbell, Sofa, PersonStanding, Bike,
  ArrowDown, Scale, Sparkles, Rocket, Heart, Utensils, Globe, ShieldCheck,
  ChevronRight, Flame, Trophy
} from "lucide-react";

const steps = [
  { label: "You", icon: PersonStanding },
  { label: "Body", icon: Activity },
  { label: "Goals", icon: Target },
  { label: "Diet", icon: Heart },
  { label: "Cuisine", icon: Globe },
];

const genderOptions = [
  { label: "Male", icon: PersonStanding },
  { label: "Female", icon: PersonStanding },
  { label: "Other", icon: PersonStanding },
];

const activityLevels = [
  { icon: Sofa, label: "Sedentary", desc: "Desk job, minimal exercise" },
  { icon: PersonStanding, label: "Light", desc: "Light exercise 1-3 days/week" },
  { icon: Bike, label: "Moderate", desc: "Moderate exercise 3-5 days/week" },
  { icon: Dumbbell, label: "Very Active", desc: "Hard exercise 6-7 days/week" },
];

const healthGoals = [
  { icon: ArrowDown, label: "Lose Weight", desc: "Calorie deficit plan" },
  { icon: Scale, label: "Maintain", desc: "Keep current weight" },
  { icon: Dumbbell, label: "Gain Muscle", desc: "High protein intake" },
];

const allergies = ["Nuts", "Dairy", "Gluten", "Eggs", "Soy", "Shellfish", "None"];
const diets = ["Keto", "Vegan", "Vegetarian", "Halal", "No Preference"];
const cuisines = ["Pakistani", "Indian", "Chinese", "Italian", "Mexican", "Turkish", "Japanese", "Thai", "Arabian", "American", "Korean", "Other"];
const cuisineIcons: Record<string, React.ElementType> = {
  Pakistani: Flame, Indian: Flame, Chinese: Utensils, Italian: Utensils,
  Mexican: Flame, Turkish: Utensils, Japanese: Utensils, Thai: Flame,
  Arabian: Utensils, American: Utensils, Korean: Flame, Other: Globe,
};

function FloatingBlob({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div animate={{ opacity: [0.01, 0.035, 0.01], scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`} />
  );
}

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const step = () => { const p = Math.min((Date.now() - start) / 1500, 1); setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(step); };
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
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(["Dairy", "Shellfish"]);
  const [diet, setDiet] = useState("Halal");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Pakistani", "Indian", "Chinese"]);
  const [showResult, setShowResult] = useState(false);

  const bmi = weight / Math.pow(height / 100, 2);
  const bmiCategory = bmi < 18.5 ? { label: "Underweight", color: "text-blue-400" } :
    bmi < 25 ? { label: "Normal", color: "text-primary" } :
    bmi < 30 ? { label: "Overweight", color: "text-accent" } :
    { label: "Obese", color: "text-destructive" };

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    if (item === "None") { setter(arr.includes(item) ? [] : [item]); return; }
    const filtered = arr.filter(a => a !== "None");
    setter(filtered.includes(item) ? filtered.filter(a => a !== item) : [...filtered, item]);
  };

  const next = () => { if (step === 4) { setShowResult(true); return; } setStep(s => s + 1); };

  const fadeSlide = {
    initial: { opacity: 0, x: 40, filter: "blur(6px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -40, filter: "blur(6px)" },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  } as const;

  if (showResult) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4 py-6 relative overflow-hidden">
        <FloatingBlob className="w-[400px] h-[400px] bg-primary top-[-100px] right-[-100px]" />
        <FloatingBlob className="w-[300px] h-[300px] bg-secondary bottom-[-50px] left-[-50px]" delay={3} />
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, type: "spring", stiffness: 180 }} className="max-w-sm w-full space-y-4 relative z-10">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center space-y-2">
            <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-block">
              <div className="icon-box-lg mx-auto" style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.2)" }}>
                <Trophy size={22} className="text-primary" strokeWidth={1.5} />
              </div>
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-foreground">You're All Set!</h2>
            <p className="text-xs text-muted-foreground">Your personalized nutrition plan is ready</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card-static p-4 space-y-3">
            {[
              { label: "Name", value: name },
              { label: "BMI", value: `${bmi.toFixed(1)} — ${bmiCategory.label}`, cls: bmiCategory.color },
              { label: "Daily Target", value: "cal", count: 1800 },
              { label: "Goal", value: goal },
              { label: "Diet", value: diet },
              { label: "Cuisines", value: selectedCuisines.join(", ") },
            ].map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <span className={`text-xs font-semibold ${row.cls || "text-foreground"}`}>
                  {row.count ? <><CountUp target={row.count} /> {row.value}</> : row.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="glass-card-static p-3 space-y-1.5 border-primary/10" style={{ background: "rgba(59,130,246,0.02)" }}>
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" strokeWidth={1.5} />
              <span className="text-[10px] font-bold text-primary">AI Recommendation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on your BMI of {bmi.toFixed(1)} and {goal.toLowerCase()} goal, we'll focus on high-protein, moderate-carb meals at 1,800 cal/day.
            </p>
          </motion.div>

          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/dashboard")}
            className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2">
            <Rocket size={16} strokeWidth={1.5} /> Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 py-5 lg:py-6 max-w-md mx-auto relative">
      <FloatingBlob className="w-[300px] h-[300px] bg-primary top-[10%] right-[-150px]" />

      {/* Step Indicator */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-6 relative z-10">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-center">
                <motion.div animate={{ scale: active ? 1.1 : 1, borderColor: done || active ? "hsl(217,91%,60%)" : "rgba(255,255,255,0.05)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center border-2 transition-colors ${done ? "bg-primary border-primary" : active ? "bg-primary/8 border-primary" : "bg-muted/30 border-border/30"}`}>
                  {done ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                      <Check size={13} className="text-primary-foreground" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <StepIcon size={13} className={active ? "text-primary" : "text-muted-foreground"} strokeWidth={1.5} />
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div animate={{ backgroundColor: i < step ? "hsl(217,91%,60%)" : "rgba(255,255,255,0.03)" }} className="w-5 lg:w-8 h-0.5 mx-0.5 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-medium">Step {step + 1} of 5</span>
          <span className="text-[10px] text-primary font-bold">{steps[step].label}</span>
        </div>
        <div className="h-0.5 rounded-full bg-muted/30 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" animate={{ width: `${((step + 1) / 5) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" {...fadeSlide} className="space-y-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">Let's get to know you!</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Tell us a bit about yourself</p>
              </div>
              <div className="glass-card-static p-3.5 space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wider">Your Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="input-glass w-full text-sm" placeholder="What should we call you?" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wider">Age</label>
                  <div className="flex items-center gap-3 justify-center">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setAge(Math.max(10, age - 1))}
                      className="w-9 h-9 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-base text-foreground font-bold hover:bg-muted/50 transition-colors">−</motion.button>
                    <motion.span key={age} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}
                      className="text-3xl font-bold text-foreground w-16 text-center font-display gradient-text">{age}</motion.span>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setAge(Math.min(100, age + 1))}
                      className="w-9 h-9 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-base text-foreground font-bold hover:bg-muted/50 transition-colors">+</motion.button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wider">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {genderOptions.map(g => (
                    <motion.button key={g.label} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} onClick={() => setGender(g.label)}
                      className={`glass-card text-center py-2 px-1.5 transition-all relative overflow-hidden ${gender === g.label ? "border-primary/25 bg-primary/[0.04]" : ""}`}>
                      {gender === g.label && <motion.div layoutId="gender-glow" className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />}
                      <div className="relative z-10">
                        <div className="w-7 h-7 rounded-md bg-muted/30 border border-border/30 flex items-center justify-center mx-auto mb-1">
                          <g.icon size={13} className={gender === g.label ? "text-primary" : "text-muted-foreground"} strokeWidth={1.5} />
                        </div>
                        <div className="text-[10px] font-bold text-foreground">{g.label}</div>
                        {gender === g.label && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                            className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center mx-auto mt-1">
                            <Check size={8} className="text-primary-foreground" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" {...fadeSlide} className="space-y-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">Your body metrics</h2>
                <p className="text-xs text-muted-foreground mt-0.5">We'll use this to calculate your needs</p>
              </div>
              <div className="glass-card-static p-4 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Weight</span>
                    <motion.span key={weight} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                      className="text-xl font-bold text-foreground font-display">{weight} <span className="text-xs text-muted-foreground">kg</span></motion.span>
                  </div>
                  <input type="range" min={30} max={200} value={weight} onChange={e => setWeight(+e.target.value)}
                    className="w-full accent-primary h-1.5" style={{ accentColor: "hsl(217,91%,60%)" }} />
                </div>
                <div className="h-px bg-border/30" />
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Height</span>
                    <motion.span key={height} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                      className="text-xl font-bold text-foreground font-display">{height} <span className="text-xs text-muted-foreground">cm</span></motion.span>
                  </div>
                  <input type="range" min={100} max={220} value={height} onChange={e => setHeight(+e.target.value)}
                    className="w-full accent-primary h-1.5" style={{ accentColor: "hsl(217,91%,60%)" }} />
                </div>
              </div>
              <motion.div layout className="glass-card-static p-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <div className="icon-box mx-auto" style={{ background: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.15)" }}>
                    <Activity size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Your BMI</p>
                  <motion.p key={bmi.toFixed(1)} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`text-5xl font-bold font-display ${bmiCategory.color}`}>{bmi.toFixed(1)}</motion.p>
                  <motion.div key={bmiCategory.label} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <span className={`chip text-xs inline-flex items-center gap-1 ${bmiCategory.color === "text-primary" ? "chip-selected" : "chip-warning"}`}>
                      <ShieldCheck size={12} strokeWidth={1.5} />{bmiCategory.label}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" {...fadeSlide} className="space-y-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">What's your goal?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">We'll tailor your nutrition accordingly</p>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wider">Activity Level</label>
                <div className="space-y-2">
                  {activityLevels.map((a, i) => (
                    <motion.button key={a.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => setActivity(a.label)}
                      className={`glass-card w-full flex items-center gap-2.5 py-2.5 px-3 text-left transition-all relative overflow-hidden ${activity === a.label ? "border-primary/25 bg-primary/[0.04]" : ""}`}>
                      {activity === a.label && <motion.div layoutId="activity-glow" className="absolute inset-0 bg-gradient-to-r from-primary/[0.05] to-transparent" />}
                      <div className="icon-box-sm relative z-10" style={activity === a.label ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.15)" } : {}}>
                        <a.icon size={14} className={activity === a.label ? "text-primary" : "text-muted-foreground"} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 relative z-10">
                        <div className="text-xs font-bold text-foreground">{a.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</div>
                      </div>
                      {activity === a.label && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                          className="w-5 h-5 bg-primary rounded-full flex items-center justify-center relative z-10"><Check size={11} className="text-primary-foreground" strokeWidth={2.5} /></motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wider">Health Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {healthGoals.map(g => (
                    <motion.button key={g.label} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} onClick={() => setGoal(g.label)}
                      className={`glass-card text-center py-3 px-1.5 transition-all relative overflow-hidden ${goal === g.label ? "border-primary/25 bg-primary/[0.04]" : ""}`}>
                      {goal === g.label && <motion.div layoutId="goal-glow" className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />}
                      <div className="relative z-10">
                        <div className="icon-box-sm mx-auto mb-1.5" style={goal === g.label ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.15)" } : {}}>
                          <g.icon size={14} className={goal === g.label ? "text-primary" : "text-muted-foreground"} strokeWidth={1.5} />
                        </div>
                        <div className="text-xs font-bold text-foreground">{g.label}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">{g.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" {...fadeSlide} className="space-y-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">Dietary preferences</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Help us personalize your meals</p>
              </div>
              <div className="glass-card-static p-3.5 space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wider">Food Allergies</label>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((a, i) => (
                      <motion.button key={a} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                        whileTap={{ scale: 0.93 }} onClick={() => toggleItem(selectedAllergies, a, setSelectedAllergies)}
                        className={`chip text-xs py-2 px-3 ${selectedAllergies.includes(a) ? "chip-selected" : ""}`}>{a}</motion.button>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-border/20" />
                <div>
                  <label className="text-[10px] text-muted-foreground mb-2 block font-semibold uppercase tracking-wider">Diet Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {diets.map((d, i) => (
                      <motion.button key={d} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                        whileTap={{ scale: 0.93 }} onClick={() => setDiet(d)}
                        className={`chip text-xs py-2 px-3 ${diet === d ? "chip-selected" : ""}`}>{d}</motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" {...fadeSlide} className="space-y-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground">Favorite cuisines</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Pick as many as you like</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {cuisines.map((c, i) => {
                  const CIcon = cuisineIcons[c] || Globe;
                  const selected = selectedCuisines.includes(c);
                  return (
                    <motion.button key={c} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.93 }} onClick={() => toggleItem(selectedCuisines, c, setSelectedCuisines)}
                      className={`glass-card text-center py-3 px-1.5 transition-all relative overflow-hidden ${selected ? "border-primary/25 bg-primary/[0.04]" : ""}`}>
                      {selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent" />}
                      <div className="relative z-10">
                        <div className="icon-box-sm mx-auto mb-1.5" style={selected ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.15)" } : {}}>
                          <CIcon size={13} className={selected ? "text-primary" : "text-muted-foreground"} strokeWidth={1.5} />
                        </div>
                        <div className="text-[10px] font-bold text-foreground">{c}</div>
                        {selected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                            className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check size={9} className="text-primary-foreground" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-center text-[10px] text-muted-foreground">{selectedCuisines.length} selected</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mt-6 pb-safe relative z-10">
        {step > 0 && (
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.95 }}
            onClick={() => setStep(s => s - 1)} className="btn-secondary px-4 py-3 text-xs flex items-center gap-1.5 font-medium">
            <ChevronLeft size={14} strokeWidth={1.5} /> Back
          </motion.button>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={next}
          className="btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-1.5">
          {step === 4 ? <><Sparkles size={14} strokeWidth={1.5} /> Finish</> : <>Continue <ChevronRight size={14} strokeWidth={1.5} /></>}
        </motion.button>
      </div>
    </div>
  );
}
