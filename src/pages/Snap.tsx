import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Check, ChevronLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

const loadingMessages = [
  "🔍 Identifying your food...",
  "📊 Calculating nutrition...",
  "🧠 Checking your health profile...",
  "✨ Almost ready...",
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
      <div className="px-5 py-6 lg:p-10 max-w-lg mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-xl font-display font-bold text-foreground">📸 Snap & Know</h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <motion.div
                  variants={fadeUp}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card-static border-2 border-dashed border-primary/20 flex flex-col items-center justify-center py-14 cursor-pointer active:bg-primary/[0.03] transition-colors"
                  onClick={startScan}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Camera size={28} className="text-primary" />
                  </div>
                  <p className="text-foreground font-semibold text-sm mb-1">Take a photo or upload</p>
                  <p className="text-[11px] text-muted-foreground">Tap to scan food</p>
                </motion.div>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={startScan} className="btn-primary flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2">
                    <Camera size={16} /> Take Photo
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={startScan} className="btn-secondary flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2">
                    <Upload size={16} /> Upload
                  </motion.button>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">Recent Scans</h3>
                  <div className="flex gap-2.5">
                    {["🍕 Pizza", "🥗 Salad", "🍛 Curry"].map((s, i) => (
                      <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={startScan} className="glass-card text-center py-3 px-3 text-sm flex-1">{s}</motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center py-10">
                <div className="relative w-44 h-44 mx-auto rounded-2xl overflow-hidden glass-card-static flex items-center justify-center">
                  <span className="text-6xl">🍛</span>
                  <div className="absolute inset-0 border-2 border-primary/40 rounded-2xl animate-pulse" />
                  <div className="absolute left-0 right-0 h-0.5 bg-primary/80 animate-scan" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={loadingIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground">
                    {loadingMessages[loadingIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card-static space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Chicken Biryani 🍛</h2>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Confidence: 94%</p>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">7/10</div>
                  </div>
                  <div className="text-center py-2">
                    <p className="text-4xl font-bold text-foreground font-display"><CountUp target={450} /></p>
                    <p className="text-[11px] text-muted-foreground mt-1">calories</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: "💪 Protein", value: "32g" },
                      { label: "🌾 Carbs", value: "45g" },
                      { label: "🧈 Fat", value: "15g" },
                      { label: "🥬 Fiber", value: "3g" },
                    ].map((m, i) => (
                      <div key={i} className="glass-card-static text-center py-3">
                        <p className="text-[11px] text-muted-foreground">{m.label}</p>
                        <p className="text-lg font-bold text-foreground mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card-static space-y-2 p-4">
                  <p className="text-[11px] text-muted-foreground">Budget Impact: 25% of remaining calories</p>
                  <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden flex">
                    <motion.div className="bg-primary h-full rounded-l-full" initial={{ width: 0 }} animate={{ width: "62%" }} transition={{ duration: 1 }} />
                    <motion.div className="bg-teal-400 h-full animate-glow-pulse" initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>

                <div className="glass-card-static bg-primary/[0.04] border-primary/15 text-sm text-foreground flex items-center gap-2.5 p-3.5">
                  <Check size={16} className="text-primary shrink-0" /> Allergen Check: Safe — no allergens detected
                </div>
                <div className="glass-card-static bg-accent/[0.04] border-accent/15 text-sm text-foreground flex items-center gap-2.5 p-3.5">
                  ⚠️ Health Note: Moderate carbs — fits your weight loss plan
                </div>

                <div className="glass-card-static bg-primary/[0.03] text-sm p-3.5">
                  <p className="text-foreground">💡 Try Chicken Pulao instead — saves 120 calories, same protein!</p>
                </div>

                <div className="glass-card-static text-[11px] text-muted-foreground p-3">
                  🧠 Did you know? Saffron in biryani has mood-boosting properties!
                </div>

                <div className="flex gap-2.5 sticky bottom-[92px] lg:bottom-4 pt-3">
                  {!added ? (
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd} className="btn-primary flex-1 py-3.5 text-sm font-bold">
                      ✅ Add to Today's Meals
                    </motion.button>
                  ) : (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="btn-primary flex-1 py-3.5 text-sm font-bold text-center opacity-80 pointer-events-none">
                      ✅ Added!
                    </motion.div>
                  )}
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setPhase("upload"); setAdded(false); }} className="btn-secondary px-4 py-3.5">
                    <RotateCcw size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} mealName="Chicken Biryani" mealEmoji="🍛" />
    </AppLayout>
  );
}
