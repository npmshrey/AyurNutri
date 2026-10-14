// src/components/ui/Header.jsx
// Site-wide header. Used on public pages, auth pages and the doctor portal.
//
// Fixes over the previous version:
//  - It no longer logs the user out when they land on the homepage. That
//    used to happen *during render* and triggered a hard page reload, so a
//    signed-in user clicking the logo was silently signed out.
//  - The logo points at "/" (it pointed at a route that doesn't exist).
//  - Signed-in users always get a way back to their own dashboard.
//  - The mobile menu is a real panel that closes on navigation and Escape.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import Logo from "../../assets/logo.jpg";
import { gsap, MOTION_OK } from "../../lib/motion";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/ayurvedic-intelligence-center", label: "Learn Ayurveda" },
  { to: "/personal-wellness-hub", label: "Wellness Hub" },
  { to: "/professional-dashboard-portal", label: "For Practitioners" },
];

let hasAnimatedIn = false; // animate the header in once per visit, not per page

const Header = ({ className = "", fluid = false, showNav = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const menuRef = useRef(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const dashboardPath = isDoctor
    ? "/professional-dashboard-portal"
    : "/personal-wellness-hub";

  const displayName = (() => {
    const base = (user?.fullName || user?.name || "").trim();
    if (!base) return "My account";
    const first = base.split(/\s+/)[0];
    return isDoctor && !/^dr\.?/i.test(base) ? `Dr. ${first}` : first;
  })();

  // Visitors who aren't signed in go to the matching sign-in page instead of
  // bouncing off a protected route.
  const resolveNavTarget = (to) => {
    if (to === "/personal-wellness-hub" && !(isAuthenticated && !isDoctor)) {
      return isAuthenticated ? "/professional-dashboard-portal" : "/signin";
    }
    if (to === "/professional-dashboard-portal" && !(isAuthenticated && isDoctor)) {
      return isAuthenticated ? "/personal-wellness-hub" : "/signin/doctor";
    }
    return to;
  };

  // Hide the dashboard link that doesn't belong to the signed-in role.
  const visibleLinks = NAV_LINKS.filter((l) => {
    if (!isAuthenticated) return true;
    if (isDoctor) return l.to !== "/personal-wellness-hub";
    return l.to !== "/professional-dashboard-portal";
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes, and on Escape.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // First-visit entrance.
  useLayoutEffect(() => {
    if (hasAnimatedIn) return;
    hasAnimatedIn = true;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(headerRef.current, { yPercent: -100, duration: 0.7, ease: "power3.out", clearProps: "transform" });
    });
    return () => mm.revert();
  }, []);

  // Sliding highlight behind the active desktop link.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const place = (animate) => {
      const active = nav.querySelector("[data-active='true']");
      if (!active) {
        gsap.to(pill, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      const props = {
        x: active.offsetLeft,
        width: active.offsetWidth,
        autoAlpha: 1,
      };
      if (animate) gsap.to(pill, { ...props, duration: 0.45, ease: "power3.out" });
      else gsap.set(pill, props);
    };
    place(false);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(() => place(false));
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, isAuthenticated]);

  // Mobile menu open/close animation.
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuOpen) {
      gsap.set(el, { display: "block" });
      if (reduce) return;
      gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: 0.4, ease: "power3.out" });
      gsap.from(el.querySelectorAll("[data-menu-item]"), { y: -8, autoAlpha: 0, duration: 0.35, stagger: 0.05, delay: 0.08 });
    } else if (!reduce && el.style.display === "block") {
      gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.28, ease: "power2.in", onComplete: () => gsap.set(el, { display: "none" }) });
    } else {
      gsap.set(el, { display: "none" });
    }
  }, [menuOpen]);

  const isActive = (link) =>
    link.end ? pathname === link.to : pathname.startsWith(link.to);

  const inner = fluid ? "px-4 sm:px-6 lg:px-8" : "page-container";

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || menuOpen
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-background/70 backdrop-blur-sm border-b border-transparent"
      } ${className}`}
    >
      <div className={inner}>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 group" aria-label="AyurNutri home">
            <img
              src={Logo}
              alt=""
              className="h-9 w-9 rounded-full object-contain transition-transform duration-300 group-hover:rotate-[-8deg]"
            />
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold text-primary">AyurNutri</span>
              <span className="hidden sm:block font-accent text-[11px] text-text-secondary mt-0.5">
                Ayurveda, measured
              </span>
            </span>
          </Link>

          {showNav && (
            <nav ref={navRef} className="relative hidden lg:flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
              <span
                ref={pillRef}
                aria-hidden="true"
                className="absolute left-0 top-1 bottom-1 rounded-full bg-primary/10 opacity-0"
              />
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={resolveNavTarget(link.to)}
                  data-active={isActive(link) ? "true" : "false"}
                  className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    isActive(link) ? "text-primary" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:text-primary hover:bg-muted"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              <Icon name={theme === "dark" ? "Sun" : "Moon"} size={16} />
            </button>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(dashboardPath)} className="rounded-full">
                  <Icon name="LayoutDashboard" size={15} className="mr-2" />
                  {displayName}
                </Button>
                <Button variant="outline" size="sm" onClick={logout} className="rounded-full">
                  Log out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="hidden lg:inline-flex rounded-full px-5"
                onClick={() => navigate("/auth-selection")}
              >
                Sign in
              </Button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div ref={menuRef} className="lg:hidden overflow-hidden" style={{ display: "none" }}>
        <div className="page-container pb-5 pt-1 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              data-menu-item
              to={resolveNavTarget(link.to)}
              className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                isActive(link) ? "bg-primary/10 text-primary" : "text-text-primary hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div data-menu-item className="pt-3 mt-2 border-t border-border flex gap-2">
            {isAuthenticated ? (
              <>
                <Button fullWidth onClick={() => navigate(dashboardPath)}>
                  My dashboard
                </Button>
                <Button fullWidth variant="outline" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <Button fullWidth onClick={() => navigate("/auth-selection")}>
                Sign in or create an account
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
