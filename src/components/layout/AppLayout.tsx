import { NavLink, useLocation } from "react-router-dom";
import { Home, ScanLine, Warehouse, CalendarDays, BarChart3, UserCircle2, ChefHat, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/snap", icon: ScanLine, label: "Snap" },
  { to: "/food-store", icon: Warehouse, label: "Store" },
  { to: "/cook", icon: ChefHat, label: "Cook" },
  { to: "/meal-plan", icon: CalendarDays, label: "Plan" },
  { to: "/nutrients-report", icon: BarChart3, label: "Report" },
];

const sidebarItems = [...navItems, { to: "/profile", icon: UserCircle2, label: "Profile" }];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[68px] fixed left-0 top-0 h-full z-40 items-center py-6 gap-1 border-r border-border/50 bg-background/90 backdrop-blur-2xl">
        <div className="gradient-text font-display font-bold text-xl mb-6 tracking-tight">N</div>
        {sidebarItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all duration-300 w-14 relative ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/6 border border-primary/12"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={18} strokeWidth={active ? 2 : 1.5} className="relative z-10" />
              <span className="text-[9px] font-semibold relative z-10">{item.label}</span>
            </NavLink>
          );
        })}
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="mt-auto p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {theme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[68px] pb-[80px] lg:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-2xl">
        <div className="flex justify-around items-center px-1 py-1.5 safe-area-bottom">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl transition-all duration-300 relative min-w-[44px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                <span className="text-[9px] font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
          {/* Mobile theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2.5 text-muted-foreground min-w-[44px]"
          >
            {theme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
            <span className="text-[9px] font-semibold">Theme</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
