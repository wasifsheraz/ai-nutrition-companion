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
      <aside className="hidden lg:flex flex-col w-20 glass-card-static fixed left-0 top-0 h-full z-40 rounded-none items-center py-8 gap-2">
        <div className="gradient-text font-display font-bold text-lg mb-8">N</div>
        {sidebarItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 w-16 ${
                active
                  ? "bg-primary/20 text-primary nav-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="sidebar-dot"
                  className="w-1 h-1 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-20 pb-24 lg:pb-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card-static rounded-none rounded-t-2xl px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[56px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="w-5 h-1 rounded-full bg-primary mb-1"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
