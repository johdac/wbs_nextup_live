import { Sparkles, Heart, Plus, UserPlus, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
const navItems = [
  { to: "/events", label: "Discover", icon: Sparkles },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/create", label: "Create New", icon: Plus },
  { to: "/signup", label: "Sign up", icon: UserPlus },
];
export const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <>
      <nav className="flex justify-between items-center  py-8  text-white relative">
        <Link to="/">
          <div className="text-4xl font-black italic tracking-tighter">
            NextUp Live<span className="not-italic ml-1">✦</span>
          </div>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center font-medium gap-x-6 bg-purple rounded-lg overflow-hidden">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-8 py-4 transition hover:bg-hover-purple cursor-pointer ${
                  active ? "bg-hover-purple " : " hover:bg-hover-purple "
                }`}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
        {/* Mobile Menu Button */}
        {open && (
          <div className="absolute top-full right-0 mt-4 w-64 bg-purple rounded-xl shadow-lg flex flex-col overflow-hidden lg:hidden">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-8 py-4 transition hover:bg-hover-purple cursor-pointer ${
                    active ? "bg-hover-purple " : " hover:bg-hover-purple "
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};
