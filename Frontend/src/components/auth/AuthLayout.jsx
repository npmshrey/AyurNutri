// src/components/auth/AuthLayout.jsx
// Shared frame for every sign-in / sign-up / reset screen.
//
// Before this, each auth page had its own copy of the layout, no header
// (so there was no way back to the homepage), an empty 80px spacer where a
// header was meant to be, and its own hardcoded teal that didn't match the
// rest of the brand.
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../ui/Header";
import Icon from "../AppIcon";
import Input from "../ui/Input";
import { gsap, useGSAP, MOTION_OK } from "../../lib/motion";

export const AuthLayout = ({ aside, eyebrow, title, subtitle, children, footer, wide = false }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(q("[data-auth-card]"), { y: 28, autoAlpha: 0, duration: 0.8 });
        const items = q("[data-auth-item]");
        if (items.length) {
          tl.from(items, { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.045, clearProps: "transform,opacity,visibility" }, "-=0.45");
        }
        const asideItems = q("[data-auth-aside] > *");
        if (asideItems.length) {
          tl.from(asideItems, { x: -18, autoAlpha: 0, duration: 0.7, stagger: 0.08, clearProps: "transform,opacity,visibility" }, 0.1);
        }
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-[-8rem] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[420px] w-[420px] rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <Header showNav={false} />

      <main className="page-container relative flex min-h-screen items-center pb-24 pt-24 lg:pb-16">
        <div
          className={`mx-auto grid w-full items-center gap-12 ${
            aside ? "lg:grid-cols-[0.95fr_1.05fr]" : ""
          } ${wide ? "max-w-6xl" : aside ? "max-w-5xl" : "max-w-md"}`}
        >
          {aside && (
            <div data-auth-aside className="hidden lg:block">
              {aside.kicker && <p className="eyebrow">{aside.kicker}</p>}
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-text-primary">
                {aside.heading}
              </h1>
              {aside.body && (
                <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">{aside.body}</p>
              )}
              {aside.points && (
                <ul className="mt-6 space-y-3">
                  {aside.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-text-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon name="Check" size={12} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div
            data-auth-card
            className="w-full rounded-3xl border border-border bg-card/90 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-sm sm:p-8"
          >
            <div data-auth-item className="mb-6">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">{title}</h2>
              {subtitle && <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>}
            </div>

            {children}

            {footer && (
              <div data-auth-item className="mt-6 border-t border-border pt-5 text-center text-sm text-text-secondary">
                {footer}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/** Password input with a show/hide toggle inside the field. */
export const PasswordField = ({ label = "Password", ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...props}
      label={label}
      type={show ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <Icon name={show ? "EyeOff" : "Eye"} size={17} />
        </button>
      }
    />
  );
};

/** Styled native select that matches Input. */
export const SelectField = ({ label, required, children, id, ...props }) => {
  const fallbackId = React.useId();
  const selectId = id || fallbackId;
  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          className="h-11 w-full appearance-none bg-none rounded-lg border border-border bg-input px-3.5 pr-10 text-sm text-text-primary transition-[border-color,box-shadow] duration-200 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          {...props}
        >
          {children}
        </select>
        <Icon
          name="ChevronDown"
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      </div>
    </div>
  );
};

/** Inline alert used for form errors and success messages. */
export const FormMessage = ({ kind = "error", children }) => {
  if (!children) return null;
  const styles =
    kind === "error"
      ? "border-destructive/20 bg-destructive/5 text-destructive"
      : "border-primary/20 bg-primary/5 text-primary";
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`mb-4 flex gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${styles}`}>
      <Icon name={kind === "error" ? "AlertCircle" : "CheckCircle2"} size={17} className="mt-px shrink-0" />
      <div>{children}</div>
    </div>
  );
};

export const AuthLink = ({ to, children }) => (
  <Link to={to} className="font-medium text-primary underline-offset-4 hover:underline">
    {children}
  </Link>
);

export default AuthLayout;
