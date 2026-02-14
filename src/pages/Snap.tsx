import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Check, ChevronLeft, RotateCcw, ShieldCheck, AlertTriangle, Lightbulb, BrainCircuit, Flame, Dumbbell, Droplets, Leaf, ScanLine, BarChart3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

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
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-3xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <div className="icon-box-sm"><ScanLine size={20} className="text-primary" strokeWidth={1.5} /></div>
              Snap & Know
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <motion.div
                  variants={fadeUp}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card-static border-2 border-dashed border-primary/15 flex flex-col items-center justify-center py-20 cursor-pointer active:bg-primary/[0.02] transition-colors"
                  onClick={startScan}
                >
                  <div className="icon-box-lg mb-5">
                    <Camera size={32} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-foreground font-semibold text-base mb-1">Take a photo or upload</p>
                  <p className="text-sm text-muted-foreground">Tap to scan food instantly</p>
                </motion.div>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={startScan} className="btn-primary flex-1 py-4 text-base font-semibold flex items-center justify-center gap-2">
                    <Camera size={20} strokeWidth={1.5} /> Take Photo
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={startScan} className="btn-secondary flex-1 py-4 text-base font-medium flex items-center justify-center gap-2">
                    <Upload size={20} strokeWidth={1.5} /> Upload
                  </motion.button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Recent Scans</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Flame, label: "Pizza" },
                      { icon: Leaf, label: "Salad" },
                      { icon: Sparkles, label: "Curry" },
                    ].map((s, i) => (
                      <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={startScan} className="glass-card text-center py-4 px-4 text-sm flex-1 flex flex-col items-center gap-2">
                        <div className="icon-box-sm">
                          <s.icon size={18} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <span>{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 text-center py-16">
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden glass-card-static flex items-center justify-center">
                  <ScanLine size={64} className="text-muted-foreground/20" strokeWidth={1} />
                  <div className="absolute inset-0 border-2 border-primary/30 rounded-2xl animate-pulse" />
                  <div className="absolute left-0 right-0 h-0.5 bg-primary/80 animate-scan" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={loadingIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    {(() => { const Ic = loadingMessages[loadingIdx].icon; return <Ic size={16} className="text-primary" strokeWidth={1.5} />; })()}
                    {loadingMessages[loadingIdx].text}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="glass-card-static space-y-5 p-6 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Chicken Biryani</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Confidence: 94%</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary border border-primary/15">7/10</div>
                  </div>
                  <div className="text-center py-3">
                    <p className="text-5xl font-bold text-foreground font-display"><CountUp target={450} /></p>
                    <p className="text-sm text-muted-foreground mt-1">calories</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Protein", value: "32g", icon: Dumbbell },
                      { label: "Carbs", value: "45g", icon: Flame },
                      { label: "Fat", value: "15g", icon: Droplets },
                      { label: "Fiber", value: "3g", icon: Leaf },
                    ].map((m, i) => (
                      <div key={i} className="glass-card-static text-center py-4">
                        <div className="icon-box-sm mx-auto mb-1.5">
                          <m.icon size={16} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-xl font-bold text-foreground mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card-static space-y-2 p-5">
                  <p className="text-sm text-muted-foreground">Budget Impact: 25% of remaining calories</p>
                  <div className="h-3.5 rounded-full bg-white/[0.03] overflow-hidden flex">
                    <motion.div className="bg-primary h-full rounded-l-full" initial={{ width: 0 }} animate={{ width: "62%" }} transition={{ duration: 1 }} />
                    <motion.div className="bg-teal-400 h-full animate-glow-pulse" initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>

                <div className="glass-card-static bg-primary/[0.03] border-primary/10 text-sm text-foreground flex items-center gap-3 p-4">
                  <ShieldCheck size={20} className="text-primary shrink-0" strokeWidth={1.5} /> Allergen Check: Safe — no allergens detected
                </div>
                <div className="glass-card-static bg-accent/[0.03] border-accent/10 text-sm text-foreground flex items-center gap-3 p-4">
                  <AlertTriangle size={20} className="text-accent shrink-0" strokeWidth={1.5} /> Health Note: Moderate carbs — fits your weight loss plan
                </div>

                <div className="glass-card-static bg-primary/[0.02] text-sm p-4 flex items-center gap-3">
                  <Lightbulb size={20} className="text-primary shrink-0" strokeWidth={1.5} />
                  <p className="text-foreground">Try Chicken Pulao instead — saves 120 calories, same protein!</p>
                </div>

                <div className="glass-card-static text-sm text-muted-foreground p-4 flex items-center gap-3">
                  <BrainCircuit size={18} className="text-primary shrink-0" strokeWidth={1.5} />
                  Did you know? Saffron in biryani has mood-boosting properties!
                </div>

                <div className="flex gap-3 sticky bottom-[96px] lg:bottom-4 pt-3">
                  {!added ? (
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd} className="btn-primary flex-1 py-4 text-base font-bold flex items-center justify-center gap-2">
                      <Check size={20} /> Add to Today's Meals
                    </motion.button>
                  ) : (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="btn-primary flex-1 py-4 text-base font-bold text-center opacity-80 pointer-events-none flex items-center justify-center gap-2">
                      <Check size={20} /> Added!
                    </motion.div>
                  )}
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setPhase("upload"); setAdded(false); }} className="btn-secondary px-5 py-4">
                    <RotateCcw size={20} strokeWidth={1.5} />
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
