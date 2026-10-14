import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useEnter } from "../../lib/motion";

const PATHS = [
  {
    key: "patient",
    icon: "HeartPulse",
    tag: "I'm a patient",
    title: "Personal nutrition and wellness",
    points: ["Dosha questionnaire and results", "Plans approved by your practitioner", "Food scanning and daily check-ins", "Chat and consultations"],
    signIn: "/signin",
    signUp: "/signup",
  },
  {
    key: "doctor",
    icon: "Stethoscope",
    tag: "I'm a practitioner",
    title: "A workspace for your practice",
    points: ["Link and manage your patients", "Review and approve weekly plans", "Clinical notes and uploaded reports", "Adherence at a glance"],
    signIn: "/signin/doctor",
    signUp: "/signup/doctor",
  },
];

const AuthSelectionPage = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  useEnter(ref, { stagger: 0.1 });

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-8rem] h-[440px] w-[440px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-8rem] h-[440px] w-[440px] rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <Header showNav={false} />

      <main className="page-container relative pb-20 pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <p data-enter className="eyebrow justify-center">Welcome</p>
          <h1 data-enter className="mt-4 font-display text-4xl font-semibold text-text-primary sm:text-5xl">
            Who's signing in?
          </h1>
          <p data-enter className="mt-4 text-lg text-text-secondary">
            Patients and practitioners see different things, so pick the one that fits you.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {PATHS.map((p) => (
            // Entrance animation on the wrapper, hover lift on the card, so
            // GSAP and the CSS transform transition never fight each other.
            <div key={p.key} data-enter className="flex">
            <article
              className="group flex w-full flex-col rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-organic)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)] sm:p-9"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon name={p.icon} size={22} />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">{p.tag}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">{p.title}</h2>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-text-secondary">
                    <Icon name="Check" size={17} className="shrink-0 text-primary" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button className="rounded-md" onClick={() => navigate(p.signIn)}>
                  Sign in
                </Button>
                <Button variant="outline" className="rounded-md" onClick={() => navigate(p.signUp)}>
                  Create account
                </Button>
              </div>
            </article>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AuthSelectionPage;
