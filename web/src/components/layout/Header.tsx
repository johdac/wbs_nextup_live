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
      <nav
        style={{ backgroundImage: 'url("/bg.jpg")' }}
        className="sticky top-0 z-50 h-24
                flex justify-between items-center 
                py-4 sm:py-8 text-white relative "
      >
        <Link to="/">
          <div className="text-2xl sm:text-4xl font-black italic tracking-tighter">
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

        {/* Mobile Burger Icon */}
        {!open && (
          <button onClick={() => setOpen(true)} className="lg:hidden z-50">
            <Menu size={28} />
          </button>
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-purple rounded-l-xl shadow-lg flex flex-col overflow-hidden lg:hidden transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* X Button inside drawer */}
          <button
            onClick={() => setOpen(false)}
            className="self-end m-4 p-2 rounded-full hover:bg-purple-dark"
          >
            <X size={24} />
          </button>

          {/* Nav Items */}
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center px-8 py-4 active:bg-hover-purple"
            >
              <Icon className="h-4 w-4 mr-3" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
