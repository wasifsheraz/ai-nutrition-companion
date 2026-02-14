import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Camera, Plus, Search, Warehouse, Egg, Milk, Beef, Apple, Carrot,
  Wheat, Package, MoreVertical, Pencil, Trash2, X, Check, ImagePlus, Upload
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

type FoodItem = {
  id: string;
  icon: typeof Egg;
  name: string;
  qty: string;
  category: "dairy" | "fruits_veg" | "pantry";
};

const initialItems: FoodItem[] = [
  { id: "1", icon: Milk, name: "Milk", qty: "1L", category: "dairy" },
  { id: "2", icon: Egg, name: "Eggs", qty: "×6", category: "dairy" },
  { id: "3", icon: Milk, name: "Cheese", qty: "1 block", category: "dairy" },
  { id: "4", icon: Milk, name: "Butter", qty: "1 stick", category: "dairy" },
  { id: "5", icon: Milk, name: "Yogurt", qty: "500g", category: "dairy" },
  { id: "6", icon: Apple, name: "Tomatoes", qty: "4 pieces", category: "fruits_veg" },
  { id: "7", icon: Carrot, name: "Spinach", qty: "1 bunch", category: "fruits_veg" },
  { id: "8", icon: Apple, name: "Lemons", qty: "×3", category: "fruits_veg" },
  { id: "9", icon: Carrot, name: "Chilies", qty: "bunch", category: "fruits_veg" },
  { id: "10", icon: Apple, name: "Onions", qty: "×5", category: "fruits_veg" },
  { id: "11", icon: Carrot, name: "Carrots", qty: "×4", category: "fruits_veg" },
  { id: "12", icon: Wheat, name: "Rice", qty: "2kg", category: "pantry" },
  { id: "13", icon: Package, name: "Lentils", qty: "1kg", category: "pantry" },
  { id: "14", icon: Wheat, name: "Flour", qty: "1kg", category: "pantry" },
  { id: "15", icon: Package, name: "Cooking Oil", qty: "1L", category: "pantry" },
  { id: "16", icon: Package, name: "Cumin", qty: "50g", category: "pantry" },
  { id: "17", icon: Package, name: "Turmeric", qty: "50g", category: "pantry" },
  { id: "18", icon: Package, name: "Chickpeas", qty: "×2 cans", category: "pantry" },
];

const categoryIcons: Record<string, typeof Egg> = { dairy: Milk, fruits_veg: Apple, pantry: Wheat };
const categoryLabels: Record<string, string> = { dairy: "Dairy Products", fruits_veg: "Fruits & Vegetables", pantry: "Pantry" };
const categoryTypes = ["dairy", "fruits_veg", "pantry"] as const;
const typeOptions = [
  { value: "dairy", label: "Dairy" },
  { value: "fruits_veg", label: "Fruits & Vegetables" },
  { value: "pantry", label: "Pantry" },
];

type ScannedItem = { name: string; qty: string; category: "dairy" | "fruits_veg" | "pantry" };

export default function FoodStore() {
  const navigate = useNavigate();
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newType, setNewType] = useState<"dairy" | "fruits_veg" | "pantry">("dairy");

  // Update dialog
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [editQty, setEditQty] = useState("");

  // Scan flow
  const [scanOpen, setScanOpen] = useState(false);
  const [scanPhase, setScanPhase] = useState<"upload" | "review">("upload");
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const totalCount = items.length;

  const addItem = () => {
    if (!newName.trim()) return;
    const iconMap: Record<string, typeof Egg> = { dairy: Milk, fruits_veg: Apple, pantry: Package };
    setItems(prev => [...prev, { id: Date.now().toString(), icon: iconMap[newType], name: newName.trim(), qty: newQty || "1", category: newType }]);
    setNewName(""); setNewQty(""); setNewType("dairy"); setAddOpen(false);
  };

  const deleteItem = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); setMenuOpen(null); };

  const openUpdate = (item: FoodItem) => { setEditItem(item); setEditQty(item.qty); setUpdateOpen(true); setMenuOpen(null); };

  const saveUpdate = () => {
    if (!editItem) return;
    setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, qty: editQty } : i));
    setUpdateOpen(false); setEditItem(null);
  };

  const addMore = (id: string) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      // Handle ×6 format
      const timesMatch = i.qty.match(/^×(\d+)/);
      if (timesMatch) { return { ...i, qty: `×${parseInt(timesMatch[1]) + 1}` }; }
      // Handle "4 pieces", "1 bunch", "2kg", "1L", "500g", "50g", "200ml" etc.
      const numMatch = i.qty.match(/^(\d+)(.*)/);
      if (numMatch) { return { ...i, qty: `${parseInt(numMatch[1]) + 1}${numMatch[2]}` }; }
      return i;
    }));
  };

  const handleScanFile = () => {
    // Simulate scanned items
    const mock: ScannedItem[] = [
      { name: "Bananas", qty: "×6", category: "fruits_veg" },
      { name: "Cream", qty: "200ml", category: "dairy" },
      { name: "Pasta", qty: "500g", category: "pantry" },
    ];
    setScannedItems(mock);
    setScanPhase("review");
  };

  const confirmScan = () => {
    const iconMap: Record<string, typeof Egg> = { dairy: Milk, fruits_veg: Apple, pantry: Package };
    const newItems = scannedItems.map((s, i) => ({
      id: `scan-${Date.now()}-${i}`, icon: iconMap[s.category], name: s.name, qty: s.qty, category: s.category,
    }));
    setItems(prev => [...prev, ...newItems]);
    setScanOpen(false); setScanPhase("upload"); setScannedItems([]);
  };

  const addMissedItem = () => {
    setScannedItems(prev => [...prev, { name: "", qty: "1", category: "fruits_veg" }]);
  };

  const renderSection = (cat: typeof categoryTypes[number]) => {
    const Icon = categoryIcons[cat];
    const sectionItems = filtered.filter(i => i.category === cat);
    if (sectionItems.length === 0 && search) return null;

    return (
      <motion.div variants={fadeUp} className="space-y-3" key={cat}>
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Icon size={18} className="text-primary" strokeWidth={1.5} /> {categoryLabels[cat]}
          <span className="text-xs text-muted-foreground font-normal ml-1">({sectionItems.length})</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sectionItems.map((item) => (
            <motion.div key={item.id} variants={fadeUp} className="glass-card space-y-2 p-4 relative">
              {/* Three dot menu */}
              <div className="absolute top-3 right-3">
                <button onClick={() => setMenuOpen(menuOpen === item.id ? null : item.id)} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                  <MoreVertical size={16} className="text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {menuOpen === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-8 z-20 w-32 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <button onClick={() => openUpdate(item)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors">
                        <Pencil size={14} className="text-primary" /> Update
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-white/5 transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="icon-box-sm mx-auto">
                <item.icon size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-foreground text-center">{item.name}</p>
              <p className="text-xs text-muted-foreground text-center">{item.qty}</p>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => addMore(item.id)}
                className="chip text-xs w-full text-center py-1.5 flex items-center justify-center gap-1.5"
              >
                <Plus size={13} /> Add More
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <AppLayout>
      <div className="px-5 py-6 lg:px-12 lg:py-10 max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-2"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <div className="icon-box-sm"><Warehouse size={20} className="text-primary" strokeWidth={1.5} /></div>
              My Food Store
            </h1>
          </motion.div>

          {/* Stats + Actions */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{totalCount} items</span>
            <div className="flex gap-3 ml-auto">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setScanOpen(true); setScanPhase("upload"); }} className="btn-primary py-2.5 px-4 text-sm flex items-center gap-2"><Camera size={16} />Scan</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAddOpen(true)} className="btn-secondary py-2.5 px-4 text-sm flex items-center gap-2"><Plus size={16} />Add</motion.button>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={fadeUp}>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="input-glass w-full pl-11 text-sm" />
            </div>
          </motion.div>

          {/* Sections */}
          {categoryTypes.map(cat => renderSection(cat))}
        </motion.div>
      </div>

      {/* ─── Add Item Dialog ─── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Item</DialogTitle>
            <DialogDescription>Add a product to your food store.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Milk" className="input-glass w-full text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <input value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="e.g. 1L" className="input-glass w-full text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Type</label>
              <div className="flex gap-2 flex-wrap">
                {typeOptions.map(t => (
                  <motion.button key={t.value} whileTap={{ scale: 0.93 }} onClick={() => setNewType(t.value as any)}
                    className={`chip text-sm ${newType === t.value ? "chip-selected" : ""}`}>{t.label}</motion.button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={addItem} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 w-full justify-center">
              <Plus size={16} /> Add Item
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Update Quantity Dialog ─── */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Update {editItem?.name}</DialogTitle>
            <DialogDescription>Change the quantity for this item.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <input value={editQty} onChange={e => setEditQty(e.target.value)} className="input-glass w-full text-sm" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={saveUpdate} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 w-full justify-center">
              <Check size={16} /> Save
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Scan Dialog ─── */}
      <Dialog open={scanOpen} onOpenChange={(v) => { setScanOpen(v); if (!v) { setScanPhase("upload"); setScannedItems([]); } }}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{scanPhase === "upload" ? "Scan Your Items" : "Review Scanned Items"}</DialogTitle>
            <DialogDescription>{scanPhase === "upload" ? "Take a photo or upload an image of your groceries." : "Edit quantities and confirm the items."}</DialogDescription>
          </DialogHeader>

          {scanPhase === "upload" ? (
            <div className="space-y-4 pt-2">
              <input type="file" ref={fileRef} accept="image/*" capture="environment" className="hidden" onChange={handleScanFile} />
              <div className="grid grid-cols-2 gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()}
                  className="glass-card flex flex-col items-center gap-3 py-8 cursor-pointer">
                  <div className="icon-box"><Camera size={24} className="text-primary" strokeWidth={1.5} /></div>
                  <span className="text-sm font-medium text-foreground">Capture</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { fileRef.current?.removeAttribute("capture"); fileRef.current?.click(); }}
                  className="glass-card flex flex-col items-center gap-3 py-8 cursor-pointer">
                  <div className="icon-box"><Upload size={24} className="text-primary" strokeWidth={1.5} /></div>
                  <span className="text-sm font-medium text-foreground">Upload</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {scannedItems.map((si, idx) => (
                <div key={idx} className="glass-card-static flex items-center gap-3 p-3">
                  <div className="icon-box-sm shrink-0">
                    <Package size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <input value={si.name} onChange={e => { const c = [...scannedItems]; c[idx] = { ...c[idx], name: e.target.value }; setScannedItems(c); }}
                    placeholder="Item name" className="input-glass flex-1 text-sm py-2" />
                  <div className="relative">
                    <Pencil size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input value={si.qty} onChange={e => { const c = [...scannedItems]; c[idx] = { ...c[idx], qty: e.target.value }; setScannedItems(c); }}
                      className="input-glass w-20 text-sm py-2 pr-7 text-center" />
                  </div>
                  <button onClick={() => setScannedItems(prev => prev.filter((_, i) => i !== idx))} className="p-1.5 rounded-lg hover:bg-white/5">
                    <X size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.95 }} onClick={addMissedItem}
                className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 w-full justify-center">
                <Plus size={14} /> Add Missed Item
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={confirmScan}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 w-full justify-center">
                <Check size={16} /> Confirm & Add All
              </motion.button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
