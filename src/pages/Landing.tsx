import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";

const floatingEmojis = ["🥗", "🍎", "🥑", "🍗", "🥚", "🍅", "🥦", "🍌"];

const features = [
  { icon: "📸", title: "Snap & Know", desc: "Take a photo of any food — get instant AI nutrition analysis" },
  { icon: "🧊", title: "Smart Food Store", desc: "Scan your fridge. Know what you have. Reduce food waste." },
  { icon: "📅", title: "AI Meal Plans", desc: "Personalized weekly plans that learn your taste preferences" },
];

const steps = [
  { num: 1, title: "Set Up Profile", icon: "👤" },
  { num: 2, title: "Scan Kitchen", icon: "📸" },
  { num: 3, title: "Get AI Recs", icon: "🧠" },
  { num: 4, title: "Track & Win", icon: "📊" },
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
          className="absolute text-xl md:text-2xl"
          initial={{
            x: `${10 + Math.random() * 80}%`,
            y: `${10 + Math.random() * 80}%`,
            opacity: 0.06 + Math.random() * 0.12,
          }}
          animate={{
            y: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            x: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{
            duration: 20 + Math.random() * 15,
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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <FloatingParticles />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="text-center z-10 max-w-lg mx-auto"
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-display font-bold gradient-text-shimmer mb-3 leading-tight"
            >
              NutriAI
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-1.5 font-medium">
              Your AI-Powered Personal Nutritionist
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm md:text-base text-muted-foreground/60 mb-10 max-w-sm mx-auto leading-relaxed">
              Snap food. Scan your fridge. Get personalized meal plans.
            </motion.p>
            <motion.div variants={fadeUp}>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/auth")}
                className="btn-primary px-10 py-4 text-base font-bold animate-pulse-glow rounded-2xl"
              >
                Get Started Free <ArrowRight className="inline ml-1.5" size={18} />
              </motion.button>
              <p className="text-[11px] text-muted-foreground/40 mt-4 tracking-wide">
                No credit card required • 100% free
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-5 -mt-16 relative z-10 max-w-lg lg:max-w-3xl mx-auto">
        <div className="glass-card-static flex items-center justify-around py-6 px-4">
          {[
            { value: 10000, label: "Meals Analyzed", suffix: "+" },
            { value: 500, label: "Recipes", suffix: "+" },
            { value: 98, label: "Accuracy", suffix: "%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground font-display">
                <CountUp target={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-20 max-w-lg lg:max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            Everything You Need to Eat Smart
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card text-center space-y-3 p-5"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="text-base font-bold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-14 max-w-lg lg:max-w-3xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-foreground text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-base md:text-lg font-bold text-foreground mx-auto shadow-lg shadow-primary/20">
                {s.num}
              </div>
              <div className="text-xl">{s.icon}</div>
              <p className="text-[11px] md:text-xs font-medium text-foreground leading-tight">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-14 max-w-lg lg:max-w-3xl mx-auto">
        <h2 className="text-xl font-display font-bold text-foreground text-center mb-1.5">Trusted by Thousands</h2>
        <p className="text-xs text-muted-foreground text-center mb-8">Students, fitness enthusiasts, and busy families</p>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card space-y-2.5 p-4"
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed">"{t.text}"</p>
              <p className="text-[11px] text-muted-foreground">— {t.name}, {t.age}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SDG */}
      <section className="px-5 py-10">
        <div className="glass-card-static max-w-lg lg:max-w-2xl mx-auto py-6 text-center">
          <p className="text-[11px] text-muted-foreground mb-3 uppercase tracking-wider">Supporting UN SDGs</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="chip text-xs">🎯 Zero Hunger</span>
            <span className="chip text-xs">❤️ Good Health</span>
            <span className="chip text-xs">♻️ Responsible Consumption</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg lg:max-w-2xl mx-auto glass-card-static text-center bg-gradient-to-r from-primary/[0.08] to-teal-400/[0.06] py-10 px-6"
        >
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5">
            Start Your Nutrition Journey Today
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="btn-primary px-8 py-3.5 text-sm font-bold"
          >
            Get Started <ArrowRight className="inline ml-1.5" size={16} />
          </motion.button>
        </motion.div>
      </section>

      <footer className="px-5 py-8 text-center">
        <p className="text-[11px] text-muted-foreground/50">
          Built with ❤️ for healthier lives • Made for Hackathon 2024
        </p>
      </footer>
    </div>
  );
}
