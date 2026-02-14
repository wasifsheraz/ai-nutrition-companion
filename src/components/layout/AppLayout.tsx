import { NavLink, useLocation } from "react-router-dom";
import { Home, Camera, Box, CalendarDays, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/snap", icon: Camera, label: "Snap" },
  { to: "/food-store", icon: Box, label: "Store" },
  { to: "/meal-plan", icon: CalendarDays, label: "Plan" },
  { to: "/nutrients-report", icon: BarChart3, label: "Report" },
];

const sidebarItems = [...navItems, { to: "/profile", icon: User, label: "Profile" }];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[72px] fixed left-0 top-0 h-full z-40 items-center py-6 gap-1 border-r border-white/[0.06] bg-background/80 backdrop-blur-2xl">
        <div className="gradient-text font-display font-bold text-xl mb-6">N</div>
        {sidebarItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 p-2.5 rounded-xl transition-all duration-300 w-14 relative ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon size={20} className="relative z-10" />
              <span className="text-[9px] font-medium relative z-10">{item.label}</span>
            </NavLink>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[72px] pb-[88px] lg:pb-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-background/80 backdrop-blur-2xl">
        <div className="flex justify-around items-center px-2 py-1 safe-area-bottom">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-300 relative min-w-[52px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
