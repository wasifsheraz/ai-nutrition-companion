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
const fadeUp = { hidden: { opacity: 0, y: 14, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" as const } } };

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
  { value: "fruits_veg", label: "Fruits & Veg" },
  { value: "pantry", label: "Pantry" },
];

type ScannedItem = { name: string; qty: string; category: "dairy" | "fruits_veg" | "pantry" };

export default function FoodStore() {
  const navigate = useNavigate();
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newType, setNewType] = useState<"dairy" | "fruits_veg" | "pantry">("dairy");
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [editQty, setEditQty] = useState("");
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
      const timesMatch = i.qty.match(/^×(\d+)/);
      if (timesMatch) return { ...i, qty: `×${parseInt(timesMatch[1]) + 1}` };
      const numMatch = i.qty.match(/^(\d+)(.*)/);
      if (numMatch) return { ...i, qty: `${parseInt(numMatch[1]) + 1}${numMatch[2]}` };
      return i;
    }));
  };

  const handleScanFile = () => {
    setScannedItems([
      { name: "Bananas", qty: "×6", category: "fruits_veg" },
      { name: "Cream", qty: "200ml", category: "dairy" },
      { name: "Pasta", qty: "500g", category: "pantry" },
    ]);
    setScanPhase("review");
  };

  const confirmScan = () => {
    const iconMap: Record<string, typeof Egg> = { dairy: Milk, fruits_veg: Apple, pantry: Package };
    const newItems = scannedItems.map((s, i) => ({ id: `scan-${Date.now()}-${i}`, icon: iconMap[s.category], name: s.name, qty: s.qty, category: s.category }));
    setItems(prev => [...prev, ...newItems]);
    setScanOpen(false); setScanPhase("upload"); setScannedItems([]);
  };

  const addMissedItem = () => setScannedItems(prev => [...prev, { name: "", qty: "1", category: "fruits_veg" }]);

  const renderSection = (cat: typeof categoryTypes[number]) => {
    const Icon = categoryIcons[cat];
    const sectionItems = filtered.filter(i => i.category === cat);
    if (sectionItems.length === 0 && search) return null;

    return (
      <motion.div variants={fadeUp} className="space-y-2" key={cat}>
        <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Icon size={14} className="text-primary" strokeWidth={1.5} /> {categoryLabels[cat]}
          <span className="text-[10px] text-muted-foreground font-normal ml-1">({sectionItems.length})</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {sectionItems.map((item) => (
            <motion.div key={item.id} variants={fadeUp} className="glass-card space-y-1.5 p-3 relative">
              <div className="absolute top-2 right-2">
                <button onClick={() => setMenuOpen(menuOpen === item.id ? null : item.id)} className="p-0.5 rounded-md hover:bg-muted/30 transition-colors">
                  <MoreVertical size={12} className="text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {menuOpen === item.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-6 z-20 w-28 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                      <button onClick={() => openUpdate(item)} className="w-full flex items-center gap-1.5 px-2.5 py-2 text-xs text-foreground hover:bg-muted/30 transition-colors">
                        <Pencil size={11} className="text-primary" /> Update
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="w-full flex items-center gap-1.5 px-2.5 py-2 text-xs text-destructive hover:bg-muted/30 transition-colors">
                        <Trash2 size={11} /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="icon-box-sm mx-auto"><item.icon size={14} className="text-primary" strokeWidth={1.5} /></div>
              <p className="text-xs font-semibold text-foreground text-center">{item.name}</p>
              <p className="text-[10px] text-muted-foreground text-center">{item.qty}</p>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => addMore(item.id)}
                className="chip text-[10px] w-full text-center py-1 flex items-center justify-center gap-1">
                <Plus size={10} /> Add
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <AppLayout>
      <div className="px-4 py-5 lg:px-10 lg:py-8 max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button onClick={() => navigate("/dashboard")} className="btn-ghost p-1.5"><ChevronLeft size={18} /></button>
            <h1 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <div className="icon-box-sm"><Warehouse size={14} className="text-primary" strokeWidth={1.5} /></div>
              My Food Store
            </h1>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{totalCount} items</span>
            <div className="flex gap-2 ml-auto">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setScanOpen(true); setScanPhase("upload"); }} className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5"><Camera size={13} />Scan</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAddOpen(true)} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"><Plus size={13} />Add</motion.button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="input-glass w-full pl-9 text-xs" />
            </div>
          </motion.div>

          {categoryTypes.map(cat => renderSection(cat))}
        </motion.div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border rounded-xl max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-foreground text-sm">Add New Item</DialogTitle>
            <DialogDescription className="text-xs">Add a product to your food store.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Name</label><input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Milk" className="input-glass w-full text-xs" /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Quantity</label><input value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="e.g. 1L" className="input-glass w-full text-xs" /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Type</label>
              <div className="flex gap-1.5 flex-wrap">{typeOptions.map(t => (<motion.button key={t.value} whileTap={{ scale: 0.93 }} onClick={() => setNewType(t.value as any)} className={`chip text-xs ${newType === t.value ? "chip-selected" : ""}`}>{t.label}</motion.button>))}</div>
            </div>
          </div>
          <DialogFooter className="pt-1">
            <motion.button whileTap={{ scale: 0.95 }} onClick={addItem} className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 w-full justify-center"><Plus size={13} /> Add Item</motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="bg-card border-border rounded-xl max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-foreground text-sm">Update {editItem?.name}</DialogTitle>
            <DialogDescription className="text-xs">Change the quantity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-1"><div className="space-y-1"><label className="text-xs font-medium text-foreground">Quantity</label><input value={editQty} onChange={e => setEditQty(e.target.value)} className="input-glass w-full text-xs" /></div></div>
          <DialogFooter className="pt-1"><motion.button whileTap={{ scale: 0.95 }} onClick={saveUpdate} className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 w-full justify-center"><Check size={13} /> Save</motion.button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scanOpen} onOpenChange={(v) => { setScanOpen(v); if (!v) { setScanPhase("upload"); setScannedItems([]); } }}>
        <DialogContent className="bg-card border-border rounded-xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground text-sm">{scanPhase === "upload" ? "Scan Your Items" : "Review Scanned Items"}</DialogTitle>
            <DialogDescription className="text-xs">{scanPhase === "upload" ? "Take a photo or upload an image." : "Edit quantities and confirm."}</DialogDescription>
          </DialogHeader>
          {scanPhase === "upload" ? (
            <div className="space-y-3 pt-1">
              <input type="file" ref={fileRef} accept="image/*" capture="environment" className="hidden" onChange={handleScanFile} />
              <div className="grid grid-cols-2 gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()} className="glass-card flex flex-col items-center gap-2 py-6 cursor-pointer">
                  <div className="icon-box"><Camera size={18} className="text-primary" strokeWidth={1.5} /></div>
                  <span className="text-xs font-medium text-foreground">Capture</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { fileRef.current?.removeAttribute("capture"); fileRef.current?.click(); }} className="glass-card flex flex-col items-center gap-2 py-6 cursor-pointer">
                  <div className="icon-box"><Upload size={18} className="text-primary" strokeWidth={1.5} /></div>
                  <span className="text-xs font-medium text-foreground">Upload</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {scannedItems.map((si, idx) => (
                <div key={idx} className="glass-card-static flex items-center gap-2 p-2.5">
                  <div className="icon-box-sm shrink-0"><Package size={12} className="text-primary" strokeWidth={1.5} /></div>
                  <input value={si.name} onChange={e => { const c = [...scannedItems]; c[idx] = { ...c[idx], name: e.target.value }; setScannedItems(c); }} placeholder="Item name" className="input-glass flex-1 text-xs py-1.5" />
                  <input value={si.qty} onChange={e => { const c = [...scannedItems]; c[idx] = { ...c[idx], qty: e.target.value }; setScannedItems(c); }} className="input-glass w-16 text-xs py-1.5 text-center" />
                  <button onClick={() => setScannedItems(prev => prev.filter((_, i) => i !== idx))} className="p-1 rounded-md hover:bg-muted/30"><X size={12} className="text-muted-foreground" /></button>
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.95 }} onClick={addMissedItem} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 w-full justify-center"><Plus size={12} /> Add Missed</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={confirmScan} className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 w-full justify-center"><Check size={13} /> Confirm & Add</motion.button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
