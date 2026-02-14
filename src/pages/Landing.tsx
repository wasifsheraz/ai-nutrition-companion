import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, CalendarDays, Sparkles, ChevronRight, Star, ArrowRight } from "lucide-react";

const floatingEmojis = ["🥗", "🍎", "🥑", "🍗", "🥚", "🍅", "🥦", "🍌", "🧀", "🥕"];

const features = [
  { icon: "📸", title: "Snap & Know", desc: "Take a photo of any food — get instant AI nutrition analysis", gradient: "from-primary/20 to-teal-400/20" },
  { icon: "🧊", title: "Smart Food Store", desc: "Scan your fridge. Know what you have. Reduce food waste.", gradient: "from-teal-400/20 to-cyan-400/20" },
  { icon: "📅", title: "AI Meal Plans", desc: "Personalized weekly plans that learn your taste preferences", gradient: "from-primary/20 to-emerald-400/20" },
];

const steps = [
  { num: 1, title: "Set Up Profile", icon: "👤" },
  { num: 2, title: "Scan Your Kitchen", icon: "📸" },
  { num: 3, title: "Get AI Recommendations", icon: "🧠" },
  { num: 4, title: "Track & Improve", icon: "📊" },
];

const testimonials = [
  { text: "NutriAI helped me lose 8kg in 2 months!", name: "Sarah", age: 24 },
  { text: "I reduced my food waste by 60%!", name: "Ahmed", age: 28 },
  { text: "Finally an app that understands Pakistani food!", name: "Fatima", age: 31 },
];

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const step = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref} className="stat-number">{count.toLocaleString()}</span>;
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.2,
          }}
          animate={{
            y: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <FloatingParticles />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center z-10 max-w-2xl"
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-display font-bold gradient-text-shimmer mb-4"
          >
            NutriAI
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-2">
            Your AI-Powered Personal Nutritionist
          </motion.p>
          <motion.p variants={fadeUp} className="text-base text-muted-foreground/70 mb-10">
            Snap food. Scan your fridge. Get personalized meal plans.
          </motion.p>
          <motion.div variants={fadeUp}>
            <button
              onClick={() => navigate("/auth")}
              className="btn-primary px-12 py-4 text-lg font-bold animate-pulse-glow"
            >
              Get Started Free <ArrowRight className="inline ml-2" size={20} />
            </button>
            <p className="text-xs text-muted-foreground/50 mt-4">
              No credit card required • 100% free
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 -mt-20 relative z-10 max-w-4xl mx-auto">
        <div className="glass-card-static flex flex-col sm:flex-row items-center justify-around gap-6 py-8">
          {[
            { value: 10000, label: "Meals Analyzed", suffix: "+" },
            { value: 500, label: "Recipes", suffix: "+" },
            { value: 98, label: "Accuracy", suffix: "%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-foreground font-display">
                <CountUp target={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
            Everything You Need to Eat Smart
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4, boxShadow: "0 0 30px rgba(16,185,129,0.15)" }}
              className={`glass-card text-center space-y-4 bg-gradient-to-br ${f.gradient}`}
            >
              <div className="text-5xl">{f.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-xl font-bold text-foreground mx-auto">
                {s.num}
              </div>
              <div className="text-2xl">{s.icon}</div>
              <p className="text-sm font-medium text-foreground">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Trusted by Thousands</h2>
        <p className="text-sm text-muted-foreground text-center mb-10">Students, fitness enthusiasts, and busy families</p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card space-y-3"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground italic">"{t.text}"</p>
              <p className="text-xs text-muted-foreground">— {t.name}, {t.age}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SDG + Footer */}
      <section className="px-6 py-12 text-center space-y-6">
        <div className="glass-card-static max-w-3xl mx-auto py-8">
          <p className="text-xs text-muted-foreground mb-4">Supporting UN Sustainable Development Goals</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="chip">🎯 SDG 2: Zero Hunger</span>
            <span className="chip">❤️ SDG 3: Good Health</span>
            <span className="chip">♻️ SDG 12: Responsible Consumption</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto glass-card-static text-center bg-gradient-to-r from-primary/20 to-teal-400/20 py-12">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Start Your Nutrition Journey Today
          </h2>
          <button
            onClick={() => navigate("/auth")}
            className="btn-primary px-10 py-3 text-base font-bold"
          >
            Get Started <ArrowRight className="inline ml-2" size={18} />
          </button>
        </div>
      </section>

      <footer className="px-6 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Built with ❤️ for healthier lives • Made for Hackathon 2024
        </p>
      </footer>
    </div>
  );
}
