import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";

const quickTags = [
  { emoji: "😋", label: "Loved It", positive: true },
  { emoji: "👎", label: "Not Great", positive: false },
  { emoji: "🌶️", label: "Too Spicy", positive: false },
  { emoji: "🧂", label: "Too Bland", positive: false },
  { emoji: "🏋️", label: "Too Heavy", positive: false },
  { emoji: "⚡", label: "Quick & Easy", positive: true },
  { emoji: "👨‍👩‍👧", label: "Family Approved", positive: true },
  { emoji: "🔁", label: "Would Make Again", positive: true },
  { emoji: "👌", label: "Perfect!", positive: true },
];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealName: string;
  mealEmoji?: string;
}

export default function FeedbackModal({ isOpen, onClose, mealName, mealEmoji = "🍛" }: FeedbackModalProps) {
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-card-static rounded-t-3xl rounded-b-none max-h-[70vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-4">✨</div>
                <p className="text-lg font-semibold text-foreground">Thanks! I'll remember this 🧠</p>
              </motion.div>
            ) : (
              <div className="px-6 pb-8 space-y-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    How was the {mealName}? {mealEmoji}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2">
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
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Quick Tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickTags.map((tag) => (
                    <button
                      key={tag.label}
                      onClick={() => toggleTag(tag.label)}
                      className={`chip text-xs ${
                        selectedTags.includes(tag.label)
                          ? tag.positive ? "chip-selected" : "bg-destructive/20 text-destructive border-destructive/30"
                          : ""
                      }`}
                    >
                      {tag.emoji} {tag.label}
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Any notes for next time?"
                  className="input-glass w-full resize-none text-sm"
                  rows={2}
                />

                <button onClick={handleSubmit} className="btn-primary w-full py-3 text-sm font-semibold">
                  Submit Feedback ✨
                </button>
                <button onClick={onClose} className="btn-ghost w-full py-2 text-sm">
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
