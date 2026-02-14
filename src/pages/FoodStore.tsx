import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Plus, Search, Brain } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const expiring = [
  { emoji: "🍅", name: "Tomatoes", qty: "4 pieces", days: "TOMORROW", urgent: true },
  { emoji: "🥬", name: "Spinach", qty: "1 bunch", days: "2 DAYS", urgent: false },
  { emoji: "🍗", name: "Chicken", qty: "500g", days: "3 DAYS", urgent: false },
];

const fresh = [
  { emoji: "🥚", name: "Eggs", qty: "×6", days: "12 days" },
  { emoji: "🧀", name: "Cheese", qty: "1 block", days: "10 days" },
  { emoji: "🧈", name: "Butter", qty: "1 stick", days: "14 days" },
  { emoji: "🍋", name: "Lemons", qty: "×3", days: "7 days" },
  { emoji: "🌶️", name: "Chilies", qty: "bunch", days: "5 days" },
  { emoji: "🥛", name: "Milk", qty: "1L", days: "4 days" },
  { emoji: "🫙", name: "Yogurt", qty: "500g", days: "6 days" },
  { emoji: "🧅", name: "Onions", qty: "×5", days: "14 days" },
];

const pantry = ["Rice 2kg", "Lentils 1kg", "Flour 1kg", "Cooking Oil 1L", "Cumin", "Turmeric", "Chili powder", "Garam masala", "Chickpeas ×2", "Tomato paste ×3"];
const filters = ["All", "Protein", "Veggies", "Dairy", "Grains"];

export default function FoodStore() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:p-10 max-w-lg lg:max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-xl font-display font-bold text-foreground">🧊 My Food Store</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>23 items</span><span>·</span><span className="text-accent font-medium">3 expiring ⚠️</span><span>·</span><span>Scanned 2h ago</span>
            <div className="flex gap-2 ml-auto">
              <motion.button whileTap={{ scale: 0.95 }} className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"><Camera size={14} />Scan</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"><Plus size={14} />Add</motion.button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2.5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="input-glass w-full pl-10 text-sm" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {filters.map(f => (
                <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setActiveFilter(f)} className={`chip text-xs ${activeFilter === f ? "chip-selected" : ""}`}>{f}</motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2.5">
            <h2 className="text-sm font-bold text-accent">⚠️ Expiring Soon</h2>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
              {expiring.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="glass-card min-w-[130px] border-accent/20 space-y-1.5 p-3.5"
                >
                  <div className="text-3xl">{item.emoji}</div>
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.qty}</p>
                  <span className={`text-[11px] font-bold block ${item.urgent ? "text-destructive animate-pulse" : "text-accent"}`}>⚠️ {item.days}</span>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/cook")} className="chip text-[11px] w-full text-center py-1.5">Cook Now 🍳</motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2.5">
            <h2 className="text-sm font-bold text-primary">✅ Fresh Items</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {fresh.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card text-center space-y-1 p-3">
                  <div className="text-2xl">{item.emoji}</div>
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.qty}</p>
                  <span className="text-[11px] text-primary font-medium">{item.days}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2.5">
            <h2 className="text-sm font-bold text-foreground">🏪 Pantry</h2>
            <div className="glass-card-static p-4">
              <div className="flex flex-wrap gap-1.5">
                {pantry.map((item, i) => (
                  <span key={i} className="chip text-[11px] py-1.5">{item}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static bg-gradient-to-r from-primary/[0.04] to-teal-400/[0.03] flex items-start gap-3 p-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="text-primary" size={16} />
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                Your tomatoes and spinach expire soon! Make Palak Paneer tonight — 380 cal, fits your plan! 🧠
              </p>
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/cook")} className="chip text-[11px]">🍳 Show Recipe</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/meal-plan")} className="chip text-[11px]">📅 Add to Plan</motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
