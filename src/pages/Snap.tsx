import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Check, ChevronLeft, RotateCcw, ShieldCheck, AlertTriangle, Lightbulb, BrainCircuit, Flame, Dumbbell, Droplets, Leaf, ScanLine, BarChart3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" as const } },
};

const loadingMessages = [
  { icon: ScanLine, text: "Identifying your food..." },
  { icon: BarChart3, text: "Calculating nutrition..." },
  { icon: BrainCircuit, text: "Checking your health profile..." },
  { icon: Sparkles, text: "Almost ready..." },
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
  return <span className="stat-number">{val}</span>;
}

export default function Snap() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"upload" | "loading" | "results">("upload");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [added, setAdded] = useState(false);

  const startScan = () => {
    setPhase("loading");
    setLoadingIdx(0);
    const interval = setInterval(() => {
      setLoadingIdx(prev => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => setPhase("results"), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setShowFeedback(true), 800);
  };

  return (
    <AppLayout>
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-2xl mx-auto relative">
        <motion.div animate={{ opacity: [0.01, 0.03, 0.01] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[10%] right-[-100px] w-[300px] h-[300px] bg-primary rounded-full blur-[120px] pointer-events-none" />

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 relative z-10">
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-1.5"><ChevronLeft size={18} /></button>
            <h1 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <div className="icon-box-sm"><ScanLine size={14} className="text-primary" strokeWidth={1.5} /></div>
              Snap & Know
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <motion.div variants={fadeUp} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  className="glass-card-static border-2 border-dashed border-primary/12 flex flex-col items-center justify-center py-14 cursor-pointer" onClick={startScan}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="icon-box-lg mb-4">
                    <Camera size={22} className="text-primary" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-foreground font-semibold text-sm mb-0.5">Take a photo or upload</p>
                  <p className="text-xs text-muted-foreground">Tap to scan food instantly</p>
                </motion.div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={startScan} className="btn-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Camera size={14} strokeWidth={1.5} /> Take Photo
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={startScan} className="btn-secondary flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5">
                    <Upload size={14} strokeWidth={1.5} /> Upload
                  </motion.button>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Recent Scans</h3>
                  <div className="flex gap-2">
                    {[{ icon: Flame, label: "Pizza" }, { icon: Leaf, label: "Salad" }, { icon: Sparkles, label: "Curry" }].map((s, i) => (
                      <motion.button key={i} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} onClick={startScan} className="glass-card text-center py-3 px-3 text-xs flex-1 flex flex-col items-center gap-1.5">
                        <div className="icon-box-sm"><s.icon size={14} className="text-primary" strokeWidth={1.5} /></div>
                        <span>{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center py-12">
                <div className="relative w-36 h-36 mx-auto rounded-xl overflow-hidden glass-card-static flex items-center justify-center">
                  <ScanLine size={48} className="text-muted-foreground/15" strokeWidth={1} />
                  <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 border-2 border-primary/20 rounded-xl" />
                  <div className="absolute left-0 right-0 h-0.5 bg-primary/70 animate-scan" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={loadingIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    {(() => { const Ic = loadingMessages[loadingIdx].icon; return <Ic size={14} className="text-primary" strokeWidth={1.5} />; })()}
                    {loadingMessages[loadingIdx].text}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="glass-card-static space-y-4 p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Chicken Biryani</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Confidence: 94%</p>
                    </div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}
                      className="w-11 h-11 rounded-full bg-primary/8 flex items-center justify-center text-sm font-bold text-primary border border-primary/12">7/10</motion.div>
                  </div>
                  <div className="text-center py-2">
                    <p className="text-4xl font-bold text-foreground font-display"><CountUp target={450} /></p>
                    <p className="text-xs text-muted-foreground mt-0.5">calories</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {[{ label: "Protein", value: "32g", icon: Dumbbell }, { label: "Carbs", value: "45g", icon: Flame }, { label: "Fat", value: "15g", icon: Droplets }, { label: "Fiber", value: "3g", icon: Leaf }].map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }} className="glass-card-static text-center py-3">
                        <div className="icon-box-sm mx-auto mb-1"><m.icon size={12} className="text-primary" strokeWidth={1.5} /></div>
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        <p className="text-base font-bold text-foreground mt-0.5">{m.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="glass-card-static space-y-1.5 p-3">
                  <p className="text-xs text-muted-foreground">Budget Impact: 25% of remaining calories</p>
                  <div className="h-2.5 rounded-full bg-muted/20 overflow-hidden flex">
                    <motion.div className="bg-primary h-full rounded-l-full" initial={{ width: 0 }} animate={{ width: "62%" }} transition={{ duration: 1 }} />
                    <motion.div className="bg-sky-400 h-full animate-glow-pulse" initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="glass-card-static bg-primary/[0.02] border-primary/8 text-xs text-foreground flex items-center gap-2 p-3">
                  <ShieldCheck size={16} className="text-primary shrink-0" strokeWidth={1.5} /> Allergen Check: Safe — no allergens detected
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="glass-card-static bg-accent/[0.02] border-accent/8 text-xs text-foreground flex items-center gap-2 p-3">
                  <AlertTriangle size={16} className="text-accent shrink-0" strokeWidth={1.5} /> Health Note: Moderate carbs — fits your weight loss plan
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                  className="glass-card-static bg-primary/[0.02] text-xs p-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                  <p className="text-foreground">Try Chicken Pulao instead — saves 120 calories, same protein!</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                  className="glass-card-static text-xs text-muted-foreground p-3 flex items-center gap-2">
                  <BrainCircuit size={14} className="text-primary shrink-0" strokeWidth={1.5} />
                  Did you know? Saffron in biryani has mood-boosting properties!
                </motion.div>

                <div className="flex gap-2 sticky bottom-[84px] lg:bottom-4 pt-2">
                  {!added ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleAdd} className="btn-primary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check size={14} /> Add to Today's Meals
                    </motion.button>
                  ) : (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="btn-primary flex-1 py-3 text-xs font-bold text-center opacity-80 pointer-events-none flex items-center justify-center gap-1.5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}><Check size={14} /></motion.div>
                      Added!
                    </motion.div>
                  )}
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setPhase("upload"); setAdded(false); }} className="btn-secondary px-4 py-3">
                    <RotateCcw size={16} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} mealName="Chicken Biryani" />
    </AppLayout>
  );
}
