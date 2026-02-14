import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-teal-400/10" />
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-display font-bold gradient-text-shimmer">NutriAI</h1>
          <p className="text-xl text-foreground font-medium">Eat smarter. Live better.</p>
          <div className="space-y-3 text-sm text-muted-foreground">
            {["AI-powered food recognition", "Personalized meal planning", "Smart fridge management"].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check size={12} className="text-primary" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-static w-full max-w-md space-y-6"
        >
          <div className="lg:hidden text-center mb-4">
            <h1 className="text-2xl font-display font-bold gradient-text">NutriAI</h1>
          </div>

          {/* Tabs */}
          <div className="flex relative">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
            <motion.div
              layoutId="auth-tab"
              className="absolute bottom-0 h-0.5 w-1/2 bg-primary rounded-full"
              animate={{ x: tab === "login" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "login" ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {tab === "signup" && (
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input placeholder="Full name" className="input-glass w-full pl-10" />
                  </div>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" placeholder="Email" className="input-glass w-full pl-10" defaultValue="demo@nutriai.com" />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input-glass w-full pl-10 pr-10"
                    defaultValue="password123"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {tab === "login" && (
                  <p className="text-xs text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors">
                    Forgot password?
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <button type="submit" className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full" />
              ) : tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            or continue with
            <div className="flex-1 h-px bg-border" />
          </div>

          <button className="btn-secondary w-full py-3 text-sm font-medium">
            Google
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {tab === "login" ? (
              <>Don't have an account? <button onClick={() => setTab("signup")} className="text-primary font-medium">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setTab("login")} className="text-primary font-medium">Login</button></>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
