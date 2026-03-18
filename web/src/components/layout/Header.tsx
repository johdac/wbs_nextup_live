import {
  Sparkles,
  Heart,
  Plus,
  UserPlus,
  Menu,
  X,
  LogOut,
  User,
  CalendarRange,
  MapPin,
  Mic2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const baseNavItems = [
  { to: "/events", label: "Discover", icon: Sparkles },
  { to: "/favorites", label: "Favorites", icon: Heart },
];

const organizerNavItem = { to: "/create", label: "Create New", icon: Plus };

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { signedIn, user, handleSignOut } = useAuth();
  const roleFromStorage = localStorage.getItem("role");
  const currentRole = user?.role ?? user?.roles?.[0] ?? roleFromStorage;
  const isOrganizer = currentRole === "organizer";
  const hideCreateNew = signedIn && currentRole === "user";
  const navItems = hideCreateNew
    ? baseNavItems
    : [...baseNavItems, organizerNavItem];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [userDropdownOpen]);
  return (
    <>
      <div className="container pb-4 lg:pb-8 lg:pt-4">
        <nav className="flex justify-between items-center py-4 sm:py-8 text-white">
          <Link to="/">
            <div className="text-2xl sm:text-4xl font-black italic tracking-tighter">
              <img
                className="w-45 sm:w-60 mt-1.5 sm:mt-4"
                src="logo-nextuplive.svg"
                alt="Logo nextup live"
              />
              {/* NextUp Live<span className="not-italic ml-1">✦</span> */}
            </div>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center font-medium relative">
            <div className="hidden rounded-l-lg overflow-hidden lg:flex bg-purple ">
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
            {/* User Menu or Login Button */}
            {signedIn && user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center bg-purple rounded-r-lg overflow-hidden px-8 py-4 transition ${userDropdownOpen ? "bg-hover-purple" : "hover:bg-hover-purple"} cursor-pointer gap-2`}
                >
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-37.5">{user.username}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-16 w-52 bg-purple rounded-lg shadow-xl py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-hover-purple transition gap-2 text-white"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    {isOrganizer && (
                      <>
                        <Link
                          to="/managed-events"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-3 hover:bg-hover-purple transition gap-2 text-white"
                        >
                          <CalendarRange className="h-4 w-4" />
                          <span>Managed Events</span>
                        </Link>
                        <Link
                          to="/managed-artists"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-3 hover:bg-hover-purple transition gap-2 text-white"
                        >
                          <Mic2 className="h-4 w-4" />
                          <span>Managed Artists</span>
                        </Link>
                        <Link
                          to="/managed-locations"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-3 hover:bg-hover-purple transition gap-2 text-white"
                        >
                          <MapPin className="h-4 w-4" />
                          <span>Managed Locations</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 hover:bg-hover-purple transition gap-2 text-left text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                state={{ from: location }}
                className="flex items-center px-8 py-4 transition bg-purple rounded-r-lg hover:bg-hover-purple cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Burger Icon */}
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden relative z-130"
            >
              <Menu size={28} />
            </button>
          )}

          {/* Mobile Drawer Backdrop */}
          {open && (
            <div
              className="fixed inset-0 z-120 bg-black/60 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Mobile Drawer */}
          <div
            className={`fixed top-0 right-0 z-130 h-full w-64 bg-purple rounded-l-xl shadow-lg flex flex-col overflow-hidden lg:hidden transform transition-transform duration-300 ease-in-out
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
            {/* User Menu or Sign up Button Mobile */}
            {signedIn && user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center px-8 py-4 hover:bg-hover-purple gap-2"
                >
                  <User className="h-4 w-4" />
                  {user.username}
                </Link>
                {isOrganizer && (
                  <>
                    <Link
                      to="/managed-events"
                      onClick={() => setOpen(false)}
                      className="flex items-center px-8 py-4 hover:bg-hover-purple gap-2"
                    >
                      <CalendarRange className="h-4 w-4" />
                      Managed Events
                    </Link>

                    <Link
                      to="/managed-artists"
                      onClick={() => setOpen(false)}
                      className="flex items-center px-8 py-4 hover:bg-hover-purple gap-2"
                    >
                      <Mic2 className="h-4 w-4" />
                      Managed Artists
                    </Link>
                    <Link
                      to="/managed-locations"
                      onClick={() => setOpen(false)}
                      className="flex items-center px-8 py-4 hover:bg-hover-purple gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Managed Locations
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  className="flex items-center px-8 py-4 hover:bg-hover-purple w-full text-left gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                state={{ from: location }}
                onClick={() => setOpen(false)}
                className="flex items-center px-8 py-4 active:bg-hover-purple w-full text-left hover:bg-hover-purple"
              >
                <UserPlus className="h-4 w-4 mr-3" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
