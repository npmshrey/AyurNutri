import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import useAuth from "../../../hooks/useAuth";
import useTheme from "../../../hooks/useTheme";
import LotusLogo from "../../../assets/logo.jpg";

export const PATIENT_SECTIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "food-scan", label: "Food Scan" },
  { id: "analytics", label: "Progress" },
  { id: "sessions", label: "Sessions" },
  { id: "messages", label: "Messages" },
  { id: "intelligence-center", label: "Learn" },
];

const NavbarPatient = ({ active = "dashboard", onNavigate = () => {} }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const go = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="bg-card/95 backdrop-blur border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={LotusLogo} alt="" className="h-8 w-8 rounded-full object-contain" />
            <span className="font-display text-lg font-semibold text-primary">AyurNutri</span>
          </Link>

          <nav aria-label="Patient sections" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {PATIENT_SECTIONS.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => go(n.id)}
                    aria-current={active === n.id ? "page" : undefined}
                    className={`relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-sm after:transition-transform ${
                      active === n.id
                        ? "text-primary after:bg-primary after:scale-x-100"
                        : "text-text-secondary hover:text-primary after:scale-x-0"
                    }`}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {user?.fullName && (
              <span className="hidden xl:inline text-sm text-text-secondary">{user.fullName}</span>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:text-primary hover:bg-muted"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              <Icon name={theme === "dark" ? "Sun" : "Moon"} size={16} />
            </button>
            <Button variant="outline" size="sm" onClick={logout} className="hidden sm:inline-flex">
              Log out
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary hover:bg-muted"
              aria-expanded={open}
              aria-controls="patient-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <Icon name={open ? "X" : "Menu"} size={18} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="patient-mobile-nav" aria-label="Patient sections" className="lg:hidden border-t border-border bg-card">
          <ul className="max-w-7xl mx-auto px-4 py-2">
            {PATIENT_SECTIONS.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => go(n.id)}
                  aria-current={active === n.id ? "page" : undefined}
                  className={`w-full text-left rounded-md px-3 py-2.5 text-sm font-medium ${
                    active === n.id ? "bg-primary/10 text-primary" : "text-text-primary hover:bg-muted"
                  }`}
                >
                  {n.label}
                </button>
              </li>
            ))}
            <li className="sm:hidden border-t border-border mt-2 pt-2">
              <button
                type="button"
                onClick={logout}
                className="w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-muted"
              >
                Log out
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default NavbarPatient;
