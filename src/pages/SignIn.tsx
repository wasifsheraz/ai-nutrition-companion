import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-teal-400/[0.04]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/[0.05] rounded-full blur-[100px]" />
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-display font-bold gradient-text-shimmer">NutriAI</h1>
          <p className="text-xl text-foreground font-medium">Eat smarter. Live better.</p>
          <div className="space-y-3 text-sm text-muted-foreground">
            {["AI-powered food recognition", "Personalized meal planning", "Smart fridge management"].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                  <Check size={12} className="text-primary" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-static w-full max-w-sm space-y-5 p-6"
        >
          <div className="lg:hidden text-center mb-2">
            <h1 className="text-2xl font-display font-bold gradient-text">NutriAI</h1>
            <p className="text-xs text-muted-foreground mt-1">Eat smarter. Live better.</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-xs text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" placeholder="Email" className="input-glass w-full pl-10" defaultValue="demo@nutriai.com" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-glass w-full pl-10 pr-10"
                defaultValue="password123"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors">
              Forgot password?
            </p>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full" />
              ) : "Sign In"}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <div className="flex-1 h-px bg-white/[0.06]" />
            or continue with
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <motion.button whileTap={{ scale: 0.98 }} className="btn-secondary w-full py-3 text-sm font-medium">
            Google
          </motion.button>

          <p className="text-center text-[11px] text-muted-foreground">
            Don't have an account? <Link to="/sign-up" className="text-primary font-semibold">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
