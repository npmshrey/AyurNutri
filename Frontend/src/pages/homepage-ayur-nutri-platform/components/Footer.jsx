// Footer shared by the public pages.
//
// Previously: the newsletter posted to localhost:5000 (the backend runs on
// 9000, so every signup failed), and six of the nine links pointed to pages
// that don't exist. Every link here now goes somewhere real.
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Logo from "../../../assets/logo.jpg";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { name: "How it works", to: "/#how-it-works" },
      { name: "Learn Ayurveda", to: "/ayurvedic-intelligence-center" },
      { name: "Food library", to: "/#food-library" },
    ],
  },
  {
    title: "For patients",
    links: [
      { name: "Sign in", to: "/signin" },
      { name: "Create an account", to: "/signup" },
      { name: "Forgot password", to: "/reset" },
    ],
  },
  {
    title: "For practitioners",
    links: [
      { name: "Practitioner sign in", to: "/signin/doctor" },
      { name: "Register your practice", to: "/signup/doctor" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", to: "/privacy" },
      { name: "Terms and Conditions", to: "/terms" },
    ],
  },
];

const Footer = () => {
  const ref = useRef(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", text: "" });

  // No scroll reveal here on purpose: the footer sits so close to the bottom
  // of the page that its trigger could fail to fire, leaving it blank.

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus({ state: "error", text: "That doesn't look like an email address." });
      return;
    }
    setStatus({ state: "loading", text: "" });
    try {
      const { data } = await axios.post(`${API_BASE}/api/subscribe`, { email });
      setStatus({ state: "done", text: data?.message || "You're subscribed." });
      setEmail("");
    } catch (err) {
      setStatus({
        state: "error",
        text: err?.response?.data?.message || "Couldn't subscribe right now. Please try again later.",
      });
    }
  };

  return (
    <footer ref={ref} className="border-t border-border bg-card/60">
      <div className="page-container py-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={Logo} alt="" className="h-10 w-10 rounded-full object-contain" />
              <span className="font-display text-xl font-semibold text-primary">AyurNutri</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
              A practice tool for Ayurvedic dietitians. Dosha assessment, diet plans built from a
              food library that carries both nutrient and Ayurvedic data, and day-by-day patient
              follow-up in one place.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
              <label htmlFor="footer-email" className="text-sm font-medium text-text-primary">
                Occasional project updates
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" loading={status.state === "loading"}>
                  Subscribe
                </Button>
              </div>
              {status.text && (
                <p
                  role="status"
                  className={`mt-2 text-sm ${status.state === "error" ? "text-error" : "text-primary"}`}
                >
                  {status.text}
                </p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:col-start-5">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-text-primary">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.to}
                        className="text-sm text-text-secondary transition-colors hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="page-container flex flex-col gap-2 py-5 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AyurNutri · ABES Institute of Technology, Ghaziabad</p>
          <p className="flex items-center gap-1.5">
            <Icon name="Leaf" size={13} className="text-primary" />
            Built as a final-year project, 2027PJ-IT07
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
