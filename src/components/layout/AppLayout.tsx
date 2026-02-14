import { NavLink, useLocation } from "react-router-dom";
import { Home, ScanLine, Warehouse, CalendarDays, BarChart3, UserCircle2, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[80px] fixed left-0 top-0 h-full z-40 items-center py-8 gap-2 border-r border-white/[0.04] bg-background/80 backdrop-blur-2xl">
        <div className="gradient-text font-display font-bold text-2xl mb-8 tracking-tight">N</div>
        {sidebarItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 w-16 relative ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={22} strokeWidth={active ? 2 : 1.5} className="relative z-10" />
              <span className="text-[10px] font-semibold relative z-10">{item.label}</span>
            </NavLink>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[80px] pb-[92px] lg:pb-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.04] bg-background/80 backdrop-blur-2xl">
        <div className="flex justify-around items-center px-2 py-2 safe-area-bottom">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 py-2.5 px-4 rounded-2xl transition-all duration-300 relative min-w-[56px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 w-10 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon size={24} strokeWidth={active ? 2 : 1.5} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
