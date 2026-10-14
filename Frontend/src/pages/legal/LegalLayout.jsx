import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import Footer from "../homepage-ayur-nutri-platform/components/Footer";
import { SITE } from "../../config/site";
import { useEnter } from "../../lib/motion";

/** Contact line used by both legal pages. */
export const Contact = () =>
  SITE.contactEmail ? (
    <a className="text-primary underline underline-offset-2" href={`mailto:${SITE.contactEmail}`}>
      {SITE.contactEmail}
    </a>
  ) : (
    <span>your practitioner, or {SITE.owner}</span>
  );

export const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="mt-10 font-display text-xl font-semibold text-text-primary">{title}</h2>
    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-secondary">{children}</div>
  </section>
);

const LegalLayout = ({ title, intro, sections, children }) => {
  const ref = useRef(null);
  useEnter(ref);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Helmet>
        <title>{`${title} | ${SITE.name}`}</title>
      </Helmet>
      <Header />
      <main className="page-container pb-20 pt-28">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[13rem_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">On this page</p>
              <ul className="mt-3 space-y-2 text-sm">
                {sections.map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-text-secondary transition-colors hover:text-primary">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="max-w-2xl">
            <h1 data-enter className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">{title}</h1>
            <p data-enter className="mt-2 text-sm text-text-secondary">Last updated {SITE.legalUpdated}</p>
            <p data-enter className="mt-6 text-[15px] leading-relaxed text-text-secondary">{intro}</p>
            <div data-enter>{children}</div>
            <p className="mt-12 border-t border-border pt-6 text-sm text-text-secondary">
              See also: <Link to={title === "Privacy Policy" ? "/terms" : "/privacy"} className="text-primary underline underline-offset-2">
                {title === "Privacy Policy" ? "Terms and Conditions" : "Privacy Policy"}
              </Link>
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalLayout;
