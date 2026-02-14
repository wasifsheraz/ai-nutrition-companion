import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Plus, Search, Brain } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
      <div className="p-6 lg:p-12 max-w-4xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground">🧊 My Food Store</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>23 items</span><span>·</span><span className="text-accent">3 expiring ⚠️</span><span>·</span><span>Scanned 2h ago</span>
            <div className="flex gap-2 ml-auto">
              <button className="btn-primary py-2 px-3 text-xs"><Camera size={14} className="inline mr-1" />Scan</button>
              <button className="btn-secondary py-2 px-3 text-xs"><Plus size={14} className="inline mr-1" />Add</button>
            </div>
          </motion.div>

          {/* Search + Filters */}
          <motion.div variants={fadeUp} className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="input-glass w-full pl-10 text-sm" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`chip text-xs whitespace-nowrap ${activeFilter === f ? "chip-selected" : ""}`}>{f}</button>
              ))}
            </div>
          </motion.div>

          {/* Expiring */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-semibold text-accent">⚠️ Expiring Soon</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {expiring.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card min-w-[140px] border-accent/30 space-y-2"
                >
                  <div className="text-3xl">{item.emoji}</div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty}</p>
                  <span className={`text-xs font-bold ${item.urgent ? "text-destructive animate-pulse" : "text-accent"}`}>⚠️ {item.days}</span>
                  <button onClick={() => navigate("/cook")} className="chip text-xs w-full text-center mt-1">Cook Now 🍳</button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fresh */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-semibold text-primary">✅ Fresh Items</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fresh.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card text-center space-y-1">
                  <div className="text-2xl">{item.emoji}</div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty}</p>
                  <span className="text-xs text-primary">{item.days}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pantry */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">🏪 Pantry</h2>
            <div className="glass-card-static">
              <div className="flex flex-wrap gap-2">
                {pantry.map((item, i) => (
                  <span key={i} className="chip text-xs">{item}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Suggestion */}
          <motion.div variants={fadeUp} className="glass-card-static bg-gradient-to-r from-primary/5 to-teal-400/5 flex items-start gap-3">
            <Brain className="text-primary shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                🧠 Your tomatoes and spinach expire soon! I suggest making Palak Paneer tonight — uses both items + cheese from your fridge. It's 380 cal and fits your plan!
              </p>
              <div className="flex gap-2">
                <button onClick={() => navigate("/cook")} className="chip text-xs">🍳 Show Recipe</button>
                <button onClick={() => navigate("/meal-plan")} className="chip text-xs">📅 Add to Plan</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
