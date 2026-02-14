import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Star, ArrowRight, ScanLine, Refrigerator, CalendarRange, UserCircle2, Camera, BrainCircuit, BarChart3, Trophy, Menu, X, Target, Heart, Recycle, Sparkles } from "lucide-react";

const features = [
  { icon: ScanLine, title: "Snap & Know", desc: "Take a photo of any food — get instant AI nutrition analysis with detailed macros and health scores." },
  { icon: Refrigerator, title: "Smart Food Store", desc: "Scan your fridge. Know what you have. Get alerts before food expires and reduce waste." },
  { icon: CalendarRange, title: "AI Meal Plans", desc: "Personalized weekly plans that learn your taste preferences and adapt to your goals." },
];

const steps = [
  { num: 1, title: "Set Up Profile", desc: "Tell us about your health goals and dietary needs", icon: UserCircle2 },
  { num: 2, title: "Scan Kitchen", desc: "Photograph your fridge and pantry items", icon: Camera },
  { num: 3, title: "Get AI Recs", desc: "Receive personalized meal suggestions instantly", icon: BrainCircuit },
  { num: 4, title: "Track & Win", desc: "Monitor progress and earn achievement badges", icon: Trophy },
];

const testimonials = [
  { text: "NutriAI helped me lose 8kg in 2 months! The meal plans are incredibly accurate.", name: "Sarah M.", age: 24 },
  { text: "I reduced my food waste by 60%! The expiry tracking is a game-changer.", name: "Ahmed K.", age: 28 },
  { text: "Finally an app that understands Pakistani food and my dietary preferences!", name: "Fatima R.", age: 31 },
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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-16 lg:h-20">
          <Link to="/" className="gradient-text-shimmer font-display font-bold text-2xl lg:text-3xl tracking-tight">NutriAI</Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">How It Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Reviews</a>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
              className="btn-primary px-6 py-2.5 text-sm font-bold"
            >
              Get Started
            </motion.button>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-foreground p-2">
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-white/[0.04] bg-background/95 backdrop-blur-2xl px-6 py-5 space-y-4">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-base text-muted-foreground font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="block text-base text-muted-foreground font-medium">How It Works</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)} className="block text-base text-muted-foreground font-medium">Reviews</a>
            <button onClick={() => navigate("/auth")} className="btn-primary w-full py-3 text-sm font-bold">Get Started</button>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-400/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="text-center z-10 max-w-3xl mx-auto"
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 chip mb-8 text-sm py-2.5 px-5">
              <Sparkles size={16} className="text-primary" />
              AI-Powered Nutrition
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold gradient-text-shimmer mb-6 leading-[1.05] tracking-tight"
            >
              NutriAI
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 font-medium">
              Your AI-Powered Personal Nutritionist
            </motion.p>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground/50 mb-12 max-w-lg mx-auto leading-relaxed">
              Snap food. Scan your fridge. Get personalized meal plans — all powered by artificial intelligence.
            </motion.p>
            <motion.div variants={fadeUp}>
              <motion.button
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/auth")}
                className="btn-primary px-12 py-5 text-lg font-bold animate-pulse-glow rounded-2xl"
              >
                Get Started Free <ArrowRight className="inline ml-2" size={22} />
              </motion.button>
              <p className="text-sm text-muted-foreground/30 mt-5 tracking-wide">
                No credit card required • 100% free
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* Features */}
      <section id="features" className="px-6 py-24 lg:py-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 lg:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            Everything You Need to Eat Smart
          </h2>
          <div className="w-16 h-1.5 bg-primary rounded-full mx-auto" />
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card text-center space-y-5 p-8 lg:p-10"
            >
              <div className="icon-box-lg mx-auto">
                <f.icon size={28} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground">{f.title}</h3>
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works — single row with scroll reveal */}
      <section id="how-it-works" className="px-6 py-20 lg:py-28 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-16 lg:mb-20 tracking-tight"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" as const }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center text-xl lg:text-2xl font-bold text-foreground mx-auto shadow-lg shadow-primary/25">
                {s.num}
              </div>
              <div className="icon-box mx-auto">
                <s.icon size={22} className="text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-sm lg:text-base font-semibold text-foreground leading-tight">{s.title}</p>
              <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 lg:py-28 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-3 tracking-tight">Trusted by Thousands</h2>
        <p className="text-base text-muted-foreground text-center mb-12 lg:mb-16">Students, fitness enthusiasts, and busy families</p>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card space-y-4 p-6 lg:p-8"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-base lg:text-lg text-foreground leading-relaxed">"{t.text}"</p>
              <p className="text-sm text-muted-foreground font-medium">— {t.name}, {t.age}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SDG */}
      <section className="px-6 py-14">
        <div className="glass-card-static max-w-5xl mx-auto py-8 lg:py-10 text-center">
          <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-medium">Supporting UN SDGs</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="chip text-sm py-2.5 px-5"><Target size={16} className="inline mr-1.5" /> Zero Hunger</span>
            <span className="chip text-sm py-2.5 px-5"><Heart size={16} className="inline mr-1.5" /> Good Health</span>
            <span className="chip text-sm py-2.5 px-5"><Recycle size={16} className="inline mr-1.5" /> Responsible Consumption</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card-static text-center bg-gradient-to-r from-primary/[0.06] to-teal-400/[0.04] py-14 lg:py-20 px-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-8 tracking-tight">
            Start Your Nutrition Journey Today
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="btn-primary px-10 py-4 text-base font-bold"
          >
            Get Started <ArrowRight className="inline ml-2" size={20} />
          </motion.button>
        </motion.div>
      </section>

      <footer className="px-6 py-10 text-center border-t border-white/[0.04]">
        <p className="text-sm text-muted-foreground/40">
          Built with care for healthier lives • Made for Hackathon 2024
        </p>
      </footer>
    </div>
  );
}
