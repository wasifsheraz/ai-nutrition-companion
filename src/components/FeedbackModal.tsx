import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, X, MessageSquare, Send } from "lucide-react";

const ratingLabels = ["", "Terrible", "Not Great", "Decent", "Really Good", "Amazing!"];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealName: string;
  mealEmoji?: string;
}

export default function FeedbackModal({ isOpen, onClose, mealName }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hoveredStar || rating;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setNote("");
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-card-static rounded-t-[32px] rounded-b-none max-h-[85vh] overflow-y-auto"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>

            {/* Close button */}
            <button onClick={onClose} className="absolute right-5 top-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="text-center py-20 px-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8 }}
                >
                  <Sparkles size={52} className="text-primary mx-auto mb-5" strokeWidth={1.5} />
                </motion.div>
                <p className="text-xl font-display font-bold text-foreground">Thanks for your feedback!</p>
                <p className="text-sm text-muted-foreground mt-2">We'll use this to improve your recommendations</p>
              </motion.div>
            ) : (
              <div className="px-6 pb-10 pt-4 space-y-7">
                {/* Title */}
                <div className="text-center space-y-1">
                  <p className="text-xl font-display font-bold text-foreground">
                    How was the {mealName}?
                  </p>
                  <p className="text-sm text-muted-foreground">Your feedback helps NutriAI learn your taste</p>
                </div>

                {/* Star rating */}
                <div className="space-y-2">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileTap={{ scale: 0.75, rotate: -15 }}
                        whileHover={{ scale: 1.15 }}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setRating(star)}
                        className="p-1.5 relative"
                      >
                        <Star
                          size={40}
                          className={`transition-all duration-300 ${
                            star <= activeRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/10"
                          }`}
                          strokeWidth={1.5}
                        />
                        {star <= activeRating && (
                          <motion.div
                            layoutId={`glow-${star}`}
                            className="absolute inset-0 rounded-full"
                            style={{ boxShadow: "0 0 20px rgba(251,191,36,0.3)" }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {activeRating > 0 && (
                      <motion.p
                        key={activeRating}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-center text-sm font-semibold text-primary"
                      >
                        {ratingLabels[activeRating]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Note input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare size={14} strokeWidth={1.5} /> Any notes? (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Too salty, loved the sauce, would add more spice..."
                    className="input-glass w-full resize-none text-sm"
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send size={18} strokeWidth={1.5} /> Submit Feedback
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
