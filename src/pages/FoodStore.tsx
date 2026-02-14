import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Plus, Search, BrainCircuit, AlertTriangle, CheckCircle2, Warehouse, UtensilsCrossed, CalendarDays, Egg, Milk, Beef, Apple, Carrot, Wheat } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const expiring = [
  { icon: Apple, name: "Tomatoes", qty: "4 pieces", days: "TOMORROW", urgent: true },
  { icon: Carrot, name: "Spinach", qty: "1 bunch", days: "2 DAYS", urgent: false },
  { icon: Beef, name: "Chicken", qty: "500g", days: "3 DAYS", urgent: false },
];

const fresh = [
  { icon: Egg, name: "Eggs", qty: "×6", days: "12 days" },
  { icon: Milk, name: "Cheese", qty: "1 block", days: "10 days" },
  { icon: Milk, name: "Butter", qty: "1 stick", days: "14 days" },
  { icon: Apple, name: "Lemons", qty: "×3", days: "7 days" },
  { icon: Carrot, name: "Chilies", qty: "bunch", days: "5 days" },
  { icon: Milk, name: "Milk", qty: "1L", days: "4 days" },
  { icon: Milk, name: "Yogurt", qty: "500g", days: "6 days" },
  { icon: Apple, name: "Onions", qty: "×5", days: "14 days" },
];

const pantry = ["Rice 2kg", "Lentils 1kg", "Flour 1kg", "Cooking Oil 1L", "Cumin", "Turmeric", "Chili powder", "Garam masala", "Chickpeas ×2", "Tomato paste ×3"];
const filters = ["All", "Protein", "Veggies", "Dairy", "Grains"];

export default function FoodStore() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Warehouse size={24} /> My Food Store</h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>23 items</span><span>·</span><span className="text-accent font-medium flex items-center gap-1"><AlertTriangle size={14} /> 3 expiring</span><span>·</span><span>Scanned 2h ago</span>
            <div className="flex gap-3 ml-auto">
              <motion.button whileTap={{ scale: 0.95 }} className="btn-primary py-2.5 px-4 text-sm flex items-center gap-2"><Camera size={16} />Scan</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} className="btn-secondary py-2.5 px-4 text-sm flex items-center gap-2"><Plus size={16} />Add</motion.button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="input-glass w-full pl-11 text-sm" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {filters.map(f => (
                <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setActiveFilter(f)} className={`chip text-sm ${activeFilter === f ? "chip-selected" : ""}`}>{f}</motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-bold text-accent flex items-center gap-2"><AlertTriangle size={18} /> Expiring Soon</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 lg:grid lg:grid-cols-3">
              {expiring.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="glass-card min-w-[160px] border-accent/20 space-y-2.5 p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    <item.icon size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-base font-bold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.qty}</p>
                  <span className={`text-sm font-bold block flex items-center gap-1.5 ${item.urgent ? "text-destructive animate-pulse" : "text-accent"}`}><AlertTriangle size={14} /> {item.days}</span>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/cook")} className="chip text-sm w-full text-center py-2 flex items-center justify-center gap-1.5"><UtensilsCrossed size={14} /> Cook Now</motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-bold text-primary flex items-center gap-2"><CheckCircle2 size={18} /> Fresh Items</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {fresh.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card text-center space-y-2 p-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto">
                    <item.icon size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.qty}</p>
                  <span className="text-xs text-primary font-medium">{item.days}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Wheat size={18} /> Pantry</h2>
            <div className="glass-card-static p-5">
              <div className="flex flex-wrap gap-2">
                {pantry.map((item, i) => (
                  <span key={i} className="chip text-sm py-2">{item}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card-static bg-gradient-to-r from-primary/[0.04] to-teal-400/[0.03] flex items-start gap-4 p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BrainCircuit className="text-primary" size={20} />
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                Your tomatoes and spinach expire soon! Make Palak Paneer tonight — 380 cal, fits your plan perfectly!
              </p>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/cook")} className="chip text-sm flex items-center gap-1.5"><UtensilsCrossed size={14} /> Show Recipe</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/meal-plan")} className="chip text-sm flex items-center gap-1.5"><CalendarDays size={14} /> Add to Plan</motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
