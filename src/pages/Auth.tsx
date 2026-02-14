import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Check, Sparkles } from "lucide-react";

function FloatingBlob({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ opacity: [0.02, 0.05, 0.02], scale: [1, 1.2, 1], x: [0, 15, -15, 0], y: [0, -20, 10, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
    />
  );
}

export default function Auth() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(tab === "signup" ? "/onboarding" : "/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[100dvh] flex relative overflow-hidden">
      <FloatingBlob className="w-[600px] h-[600px] bg-primary top-[-100px] right-[-200px]" />
      <FloatingBlob className="w-[400px] h-[400px] bg-secondary bottom-[-100px] left-[-100px]" delay={3} />

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.02]" />
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-md space-y-5">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-display font-bold gradient-text-shimmer">NutriAI</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-foreground font-medium">Eat smarter. Live better.</motion.p>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            {["AI-powered food recognition", "Personalized meal planning", "Smart fridge management"].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.12 }} className="flex items-center gap-2.5">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 400 }} className="w-5 h-5 rounded-full bg-primary/12 flex items-center justify-center">
                  <Check size={10} className="text-primary" />
                </motion.div>
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6 }} className="glass-card-static w-full max-w-sm space-y-4 p-5">
          <div className="lg:hidden text-center mb-1">
            <h1 className="text-xl font-display font-bold gradient-text">NutriAI</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Eat smarter. Live better.</p>
          </div>

          <div className="flex relative">
            {(["login", "signup"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab === t ? "text-foreground" : "text-muted-foreground"}`}>
                {t === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
            <motion.div layoutId="auth-tab" className="absolute bottom-0 h-0.5 w-1/2 bg-primary rounded-full" animate={{ x: tab === "login" ? "0%" : "100%" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, x: tab === "login" ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
                {tab === "signup" && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input placeholder="Full name" className="input-glass w-full pl-9" />
                  </motion.div>
                )}
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" placeholder="Email" className="input-glass w-full pl-9" defaultValue="demo@nutriai.com" />
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} placeholder="Password" className="input-glass w-full pl-9 pr-9" defaultValue="password123" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {tab === "login" && <p className="text-[10px] text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors">Forgot password?</p>}
              </motion.div>
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full" />
              ) : tab === "login" ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <div className="flex-1 h-px bg-border/50" />or continue with<div className="flex-1 h-px bg-border/50" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-2.5 text-xs font-medium">Google</motion.button>
          <p className="text-center text-[10px] text-muted-foreground">
            {tab === "login" ? <>Don't have an account? <button onClick={() => setTab("signup")} className="text-primary font-semibold">Sign up</button></> : <>Already have an account? <button onClick={() => setTab("login")} className="text-primary font-semibold">Login</button></>}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
