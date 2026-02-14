import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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

function FloatingBlob({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.015, 0.04, 0.015],
        scale: [1, 1.15, 1],
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
    />
  );
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navBg = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Global floating blobs */}
      <FloatingBlob className="w-[800px] h-[800px] bg-primary top-[-200px] left-[-200px]" delay={0} />
      <FloatingBlob className="w-[600px] h-[600px] bg-secondary bottom-[20%] right-[-100px]" delay={4} />
      <FloatingBlob className="w-[500px] h-[500px] bg-primary top-[60%] left-[10%]" delay={8} />

      {/* Navbar */}
      <motion.nav
        style={{ opacity: navBg }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/30"
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-16 lg:h-20">
          <Link to="/" className="gradient-text-shimmer font-display font-bold text-2xl lg:text-3xl tracking-tight">NutriAI</Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium hover:translate-y-[-1px]">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium hover:translate-y-[-1px]">How It Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium hover:translate-y-[-1px]">Reviews</a>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
              className="btn-primary px-6 py-2.5 text-sm font-bold"
            >
              Get Started
            </motion.button>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-foreground p-2">
            <motion.div animate={{ rotate: mobileMenu ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* Fallback static nav bg for scroll=0 */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/10 bg-background/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-16 lg:h-20">
          <Link to="/" className="gradient-text-shimmer font-display font-bold text-2xl lg:text-3xl tracking-tight">NutriAI</Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">How It Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Reviews</a>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/auth")} className="btn-primary px-6 py-2.5 text-sm font-bold">
              Get Started
            </motion.button>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-foreground p-2">
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl px-6 py-5 space-y-4"
          >
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-base text-muted-foreground font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="block text-base text-muted-foreground font-medium">How It Works</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)} className="block text-base text-muted-foreground font-medium">Reviews</a>
            <button onClick={() => navigate("/auth")} className="btn-primary w-full py-3 text-sm font-bold">Get Started</button>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
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
            <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground/40 mb-12 max-w-lg mx-auto leading-relaxed">
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
              <p className="text-sm text-muted-foreground/25 mt-5 tracking-wide">
                No credit card required • 100% free
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 lg:py-32 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-14 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            Everything You Need to Eat Smart
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-16 h-1.5 bg-primary rounded-full mx-auto origin-left"
          />
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <AnimatedSection key={i}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="glass-card text-center space-y-5 p-8 lg:p-10 group"
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="icon-box-lg mx-auto group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-shadow duration-500"
                >
                  <f.icon size={28} className="text-primary" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl lg:text-2xl font-bold text-foreground">{f.title}</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 lg:py-28 max-w-3xl mx-auto relative">
        <FloatingBlob className="w-[400px] h-[400px] bg-primary top-0 right-[-200px]" delay={2} />
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
            How It Works
          </h2>
        </AnimatedSection>
        <div className="space-y-6 lg:space-y-8">
          {steps.map((s, i) => (
            <AnimatedSection key={i}>
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-6 lg:p-8 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg lg:text-xl font-bold text-primary-foreground"
                    style={{ boxShadow: "0 4px 20px rgba(16,185,129,0.2)" }}
                  >
                    {s.num}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-foreground">{s.title}</h3>
                  </div>
                  <div className="icon-box-sm" style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.15)" }}>
                    <s.icon size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-16 lg:pl-[72px]">{s.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 lg:py-28 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">Trusted by Thousands</h2>
          <p className="text-base text-muted-foreground">Students, fitness enthusiasts, and busy families</p>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <AnimatedSection key={i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="glass-card space-y-4 p-6 lg:p-8"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <motion.div key={s} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * s }}>
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-base lg:text-lg text-foreground leading-relaxed">"{t.text}"</p>
                <p className="text-sm text-muted-foreground font-medium">— {t.name}, {t.age}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* SDG */}
      <AnimatedSection className="px-6 py-14">
        <div className="glass-card-static max-w-5xl mx-auto py-8 lg:py-10 text-center">
          <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-medium">Supporting UN SDGs</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="chip text-sm py-2.5 px-5"><Target size={16} className="inline mr-1.5" /> Zero Hunger</span>
            <span className="chip text-sm py-2.5 px-5"><Heart size={16} className="inline mr-1.5" /> Good Health</span>
            <span className="chip text-sm py-2.5 px-5"><Recycle size={16} className="inline mr-1.5" /> Responsible Consumption</span>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Footer */}
      <AnimatedSection className="px-6 py-20">
        <div className="max-w-5xl mx-auto glass-card-static text-center bg-gradient-to-r from-primary/[0.04] to-secondary/[0.03] py-14 lg:py-20 px-8 relative overflow-hidden">
          <FloatingBlob className="w-[300px] h-[300px] bg-primary top-0 right-0" delay={1} />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-8 tracking-tight relative z-10">
            Start Your Nutrition Journey Today
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="btn-primary px-10 py-4 text-base font-bold relative z-10"
          >
            Get Started <ArrowRight className="inline ml-2" size={20} />
          </motion.button>
        </div>
      </AnimatedSection>

      <footer className="px-6 py-10 text-center border-t border-border/30">
        <p className="text-sm text-muted-foreground/30">
          Built with care for healthier lives • Made for Hackathon 2024
        </p>
      </footer>
    </div>
  );
}
