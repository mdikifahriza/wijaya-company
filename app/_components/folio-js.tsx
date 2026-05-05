"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export function FolioHeroText({
  siteName,
  subheadline,
  animatedTexts,
}: {
  siteName: string;
  subheadline: string;
  animatedTexts: string[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const lines =
    animatedTexts && animatedTexts.length > 0
      ? animatedTexts.filter(Boolean)
      : [subheadline].filter(Boolean);

  const sequence =
    lines.length > 0 ? lines.flatMap((text) => [text, 1800]) : ["", 1800];

  return (
    <>
      <p className="mb-5 text-center font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
        {siteName}
      </p>
      <div className="mx-auto mb-10 h-[4.75rem] max-w-3xl text-center text-base font-medium text-white/88 sm:h-[5.75rem] sm:text-2xl lg:text-3xl">
        {!mounted ? (
          <span>{lines[0] ?? ""}</span>
        ) : (
          sequence.length > 0 && (
            <TypeAnimation
              sequence={sequence}
              wrapper="span"
              speed={50}
              className=""
              deletionSpeed={65}
              repeat={Infinity}
            />
          )
        )}
      </div>
    </>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getSectionIdFromHref(href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) {
    return null;
  }

  const sectionId = href.slice(hashIndex + 1).trim();
  return sectionId || null;
}

function LogoBadge({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl?: string | null;
}) {
  if (logoUrl) {
    return (
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={siteName} className="h-9 w-9 object-contain" />
        <p className="font-display text-sm uppercase tracking-[0.16em] text-current sm:text-base">
          {siteName}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-xs font-semibold text-white">
        {getInitials(siteName)}
      </div>
      <p className="font-display text-sm uppercase tracking-[0.16em] text-current sm:text-base">
        {siteName}
      </p>
    </div>
  );
}

export function FolioHeader({
  siteName,
  logoUrl,
  navLinks,
  topTextVariant = "dark",
}: {
  siteName: string;
  logoUrl?: string | null;
  navLinks: { href: string; label: string }[];
  topTextVariant?: "light" | "dark";
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = navLinks
        .map((link) => getSectionIdFromHref(link.href))
        .filter((value): value is string => Boolean(value));

      let currentActive = "";
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 200) {
            currentActive = sectionId;
          }
        }
      }

      if (currentActive) {
        setActiveSection(currentActive);
      } else if (window.scrollY < 100) {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navLinks]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const useLightTextAtTop = topTextVariant === "light";

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setIsMobileMenuOpen(false);

    if (!href.startsWith("#")) {
      return;
    }

    e.preventDefault();

    const section = document.querySelector(href);
    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - 80,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "border-b border-border bg-surface/95 py-3 backdrop-blur-sm" : "bg-transparent py-5"}`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <div
            className={`transition-colors duration-300 ${
              isScrolled || !useLightTextAtTop ? "text-ink" : "text-white"
            }`}
          >
            <LogoBadge siteName={siteName} logoUrl={logoUrl} />
          </div>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold uppercase tracking-[0.14em] md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`border-b-2 pb-1 transition-colors ${
                  activeSection === getSectionIdFromHref(link.href)
                    ? `${isScrolled || !useLightTextAtTop ? "border-accent text-ink" : "border-white text-white"}`
                    : `${isScrolled || !useLightTextAtTop ? "border-transparent text-ink-muted hover:text-ink" : "border-transparent text-white/90 hover:text-white"} hover:border-accent/70`
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className={`relative z-[40] transition-colors md:hidden ${
              isScrolled || !useLightTextAtTop ? "text-ink" : "text-white"
            } ${isMobileMenuOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list text-3xl"></i>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/55 backdrop-blur-sm md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 h-full w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 z-10 flex h-full w-[280px] flex-col border-l border-border bg-white p-8 shadow-2xl"
            >
              <button
                type="button"
                className="absolute right-8 top-8 text-ink-muted transition-colors hover:text-ink"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu panel"
              >
                <i className="bi bi-x text-4xl"></i>
              </button>

              <div className="mb-8 border-b border-border pb-4 pr-12 text-ink">
                <LogoBadge siteName={siteName} logoUrl={logoUrl} />
              </div>

              <nav className="flex flex-col gap-5 text-[14px] font-semibold uppercase tracking-[0.14em] text-ink">
                {navLinks.map((link, index) => {
                  const sectionId = getSectionIdFromHref(link.href);
                  const isActive = sectionId
                    ? activeSection === sectionId
                    : false;

                  return (
                    <motion.a
                      key={link.href}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.2 }}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className={`border-b pb-2 transition-colors ${isActive ? "border-accent text-accent" : "border-border text-ink-muted hover:text-ink"}`}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function IsotopePortfolio({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    rating?: number;
  }>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const reduceMotion = mounted ? prefersReducedMotion : false;

  return (
    <>
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.article
              layout
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={
                reduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1 }
              }
              exit={
                reduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={reduceMotion ? { duration: 0 } : { duration: 0.3 }}
              key={item.id}
              className="relative w-full rounded-[var(--radius-md)] border border-border bg-white p-6 shadow-[0_12px_30px_rgba(45,51,25,0.07)] transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(45,51,25,0.1)]"
            >
              <div className="mb-4 flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`bi ${i < (item.rating || 5) ? "bi-star-fill" : "bi-star"} mr-1 text-sm`}
                  ></i>
                ))}
              </div>

              <blockquote className="text-[15px] italic leading-7 text-ink-muted">
                &quot;{item.description}&quot;
              </blockquote>

              <footer className="mt-6 border-t border-border pt-5">
                <h4 className="font-display text-lg font-bold text-ink">
                  {item.title}
                </h4>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  {item.subtitle}
                </p>
              </footer>

              <div className="sr-only">Rating {item.rating || 5} dari 5</div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all duration-300 hover:bg-ink ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
    >
      <i className="bi bi-arrow-up text-xl"></i>
    </button>
  );
}
