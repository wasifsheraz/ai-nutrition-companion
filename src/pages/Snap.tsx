import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Check, ChevronLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import FeedbackModal from "@/components/FeedbackModal";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

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
      <div className="p-6 lg:p-12 max-w-2xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground">📸 Snap & Know</h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <motion.div
                  variants={fadeUp}
                  className="glass-card-static border-2 border-dashed border-primary/30 flex flex-col items-center justify-center py-16 cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={startScan}
                >
                  <Camera size={48} className="text-primary mb-4" />
                  <p className="text-foreground font-medium mb-1">Take a photo or upload from gallery</p>
                  <p className="text-xs text-muted-foreground">Tap to scan food</p>
                </motion.div>
                <div className="flex gap-3">
                  <button onClick={startScan} className="btn-primary flex-1 py-3 text-sm"><Camera size={16} className="inline mr-2" />Take Photo</button>
                  <button onClick={startScan} className="btn-secondary flex-1 py-3 text-sm"><Upload size={16} className="inline mr-2" />Upload</button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Scans</h3>
                  <div className="flex gap-3">
                    {["🍕 Pizza", "🥗 Salad", "🍛 Curry"].map((s, i) => (
                      <button key={i} onClick={startScan} className="glass-card text-center py-3 px-4 text-sm flex-1">{s}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center py-12">
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden glass-card-static flex items-center justify-center">
                  <span className="text-6xl">🍛</span>
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl animate-pulse" />
                  <div className="absolute left-0 right-0 h-0.5 bg-primary/80 animate-scan" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={loadingIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground">
                    {loadingMessages[loadingIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card-static space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Chicken Biryani 🍛</h2>
                      <p className="text-xs text-muted-foreground">Confidence: 94%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">7/10</div>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-foreground font-display"><CountUp target={450} /></p>
                    <p className="text-xs text-muted-foreground">calories</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "💪 Protein", value: "32g" },
                      { label: "🌾 Carbs", value: "45g" },
                      { label: "🧈 Fat", value: "15g" },
                      { label: "🥬 Fiber", value: "3g" },
                    ].map((m, i) => (
                      <div key={i} className="glass-card-static text-center py-3">
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-lg font-bold text-foreground">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget impact */}
                <div className="glass-card-static space-y-2">
                  <p className="text-xs text-muted-foreground">Budget Impact: 25% of remaining calories</p>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
                    <motion.div className="bg-primary h-full" initial={{ width: 0 }} animate={{ width: "62%" }} transition={{ duration: 1 }} />
                    <motion.div className="bg-teal-400 h-full animate-pulse" initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>

                {/* Safety */}
                <div className="glass-card-static bg-primary/5 border-primary/20 text-sm text-foreground flex items-center gap-2">
                  <Check size={16} className="text-primary" /> Allergen Check: Safe — no allergens detected
                </div>
                <div className="glass-card-static bg-accent/5 border-accent/20 text-sm text-foreground flex items-center gap-2">
                  ⚠️ Health Note: Moderate carbs — fits your weight loss plan
                </div>

                {/* Alternative */}
                <div className="glass-card-static bg-primary/5 text-sm">
                  <p className="text-foreground">💡 Try Chicken Pulao instead — saves 120 calories, same protein!</p>
                </div>

                {/* Fun fact */}
                <div className="glass-card-static text-xs text-muted-foreground">
                  🧠 Did you know? Saffron in biryani has mood-boosting properties!
                </div>

                {/* Actions */}
                <div className="flex gap-3 sticky bottom-20 lg:bottom-4 pt-4">
                  {!added ? (
                    <button onClick={handleAdd} className="btn-primary flex-1 py-3 text-sm font-semibold">
                      ✅ Add to Today's Meals
                    </button>
                  ) : (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="btn-primary flex-1 py-3 text-sm font-semibold text-center opacity-80">
                      ✅ Added!
                    </motion.div>
                  )}
                  <button onClick={() => { setPhase("upload"); setAdded(false); }} className="btn-secondary px-4 py-3 text-sm">
                    <RotateCcw size={16} />
                  </button>
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
