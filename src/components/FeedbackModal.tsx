import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ThumbsDown, Flame, Drumstick, Feather, Zap, Frown, Users, RefreshCw, Ban, CheckCircle2, Sparkles } from "lucide-react";

const quickTags = [
  { icon: Heart, label: "Loved It", positive: true },
  { icon: ThumbsDown, label: "Not Great", positive: false },
  { icon: Flame, label: "Too Spicy", positive: false },
  { icon: Frown, label: "Too Bland", positive: false },
  { icon: Drumstick, label: "Too Heavy", positive: false },
  { icon: Zap, label: "Quick & Easy", positive: true },
  { icon: Users, label: "Family Approved", positive: true },
  { icon: RefreshCw, label: "Would Repeat", positive: true },
  { icon: CheckCircle2, label: "Perfect!", positive: true },
];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealName: string;
  mealEmoji?: string;
}

export default function FeedbackModal({ isOpen, onClose, mealName }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (label: string) => {
    setSelectedTags(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setSelectedTags([]);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-card-static rounded-t-[28px] rounded-b-none max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-white/15" />
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <Sparkles size={48} className="text-primary mx-auto mb-4" />
                <p className="text-lg font-bold text-foreground">Thanks! I'll remember this</p>
              </motion.div>
            ) : (
              <div className="px-6 pb-10 space-y-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    How was the {mealName}?
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileTap={{ scale: 0.8 }}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={36}
                        className={`transition-all duration-200 ${
                          star <= (hoveredStar || rating)
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center">
                  {quickTags.map((tag) => (
                    <motion.button
                      key={tag.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag.label)}
                      className={`chip text-sm flex items-center gap-1.5 ${
                        selectedTags.includes(tag.label)
                          ? tag.positive ? "chip-selected" : "bg-destructive/15 text-destructive border-destructive/25"
                          : ""
                      }`}
                    >
                      <tag.icon size={14} /> {tag.label}
                    </motion.button>
                  ))}
                </div>

                <textarea
                  placeholder="Any notes for next time?"
                  className="input-glass w-full resize-none text-sm"
                  rows={2}
                />

                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2">
                  <Sparkles size={18} /> Submit Feedback
                </motion.button>
                <button onClick={onClose} className="btn-ghost w-full py-2.5 text-sm text-center block">
                  Skip
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
