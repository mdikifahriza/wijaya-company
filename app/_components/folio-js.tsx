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
      lines.length > 0
        ? lines.flatMap((text) => [text, 1800])
        : ["", 1800];

  return (
    <>
      <p className="mb-4 font-sans text-4xl font-bold tracking-tight text-white text-center sm:text-6xl md:text-7xl">
        {siteName}
      </p>
      <div className="mx-auto mb-8 h-20 max-w-3xl text-center text-xl font-light text-white/90 sm:text-3xl md:text-4xl">
         {!mounted ? (
           <span>{lines[0] ?? ""}</span>
         ) : sequence.length > 0 && (
           <TypeAnimation
              sequence={sequence}
              wrapper="span"
              speed={50}
              className=""
              deletionSpeed={65}
              repeat={Infinity}
           />
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
        <img
          src={logoUrl}
          alt={siteName}
          className="h-9 w-9 object-contain"
        />
        <p className="font-display text-sm uppercase tracking-[0.16em] text-current sm:text-base">
          {siteName}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#69734f] text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
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
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Sticky header background
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // ScrollSpy logic
      const sections = navLinks.map(link => link.href.substring(1));
      
      let currentActive = "";
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          // Offset of 200px to trigger slightly before reaching the section
          if (window.scrollY >= sectionTop - 200) {
             currentActive = sectionId;
          }
        }
      }
      
      if (currentActive) {
         setActiveSection(currentActive);
      } else if (window.scrollY < 100) {
         setActiveSection("hero"); // Default to hero when at top
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [navLinks]);

  const isMobile = windowWidth !== null ? windowWidth < 768 : null;
  const useLightTextAtTop = topTextVariant === "light";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);

    if (!href.startsWith("#")) {
      return;
    }

    e.preventDefault();

    const section = document.querySelector(href);
    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - 80, // Offset for sticky header
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }
  };

    return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#e5e9dc] shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          
          <div
            className={`transition-colors duration-300 ${
              isScrolled || !useLightTextAtTop ? "text-[#69734f]" : "text-white"
            }`}
          >
            <LogoBadge siteName={siteName} logoUrl={logoUrl} />
          </div>

          {isMobile !== true && (
            <nav className="hidden items-center gap-8 text-[13px] font-bold md:flex uppercase tracking-wider">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`transition-colors hover:text-[#69734f] ${
                    activeSection === link.href.substring(1)
                      ? "text-[#69734f]"
                      : isScrolled || !useLightTextAtTop
                        ? "text-[#69734f]"
                        : "text-white/90"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {isMobile !== false && (
            <button 
              className={`md:hidden z-[40] relative transition-colors ${
                isScrolled || !useLightTextAtTop ? "text-[#69734f]" : "text-white"
              } ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <i className="bi bi-list text-3xl"></i>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobile !== false && (
        <div className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <div className={`absolute right-0 top-0 h-full w-[280px] bg-white p-8 transition-transform duration-300 ease-in-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              
              <button 
                className="absolute top-8 right-8 text-[#69734f] hover:opacity-70 transition-opacity z-[60]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="bi bi-x text-4xl"></i>
              </button>

              <div className="mb-8 border-b border-gray-100 pb-4 pr-12">
                <div className="text-[#69734f]"><LogoBadge siteName={siteName} logoUrl={logoUrl} /></div>
              </div>
              <nav className="flex flex-col gap-5 text-[14px] font-bold uppercase tracking-wider text-[#69734f]">
                {navLinks.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`transition-colors hover:text-[#69734f] ${activeSection === link.href.substring(1) ? 'text-[#69734f]' : 'text-[#69734f]'}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
           </div>
        </div>
      )}
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
              animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.3 }}
              key={item.id}
              className="group relative h-72 w-full overflow-hidden rounded-[1.8rem] border border-[#d6ddc7] bg-[#f8faf3] shadow-[0_18px_45px_rgba(23,52,40,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_55px_rgba(23,52,40,0.12)] md:h-80"
            >
               <div className="relative flex h-full flex-col p-8">
                  {/* Rating Stars */}
                  <div className="mb-4 flex text-[#69734f]">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <i
                           key={i}
                           className={`bi ${i < (item.rating || 5) ? 'bi-star-fill' : 'bi-star'} text-sm mr-1`}
                        ></i>
                     ))}
                  </div>

                  {/* Testimonial Text */}
                  <div className="mb-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                     <p className="text-[15px] italic leading-relaxed text-[#5b6248]">
                        &quot;{item.description}&quot;
                     </p>
                  </div>

                  {/* Author Info */}
                  <div className="mt-auto border-t border-[#dfe5d2] pt-6">
                     <h4 className="font-display text-base font-bold uppercase tracking-wider text-[#69734f]">
                        {item.title}
                     </h4>
                     <p className="mt-1 text-[13px] font-semibold uppercase tracking-widest text-[#69734f]">
                        {item.subtitle}
                     </p>
                  </div>
               </div>
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
       behavior: prefersReducedMotion ? "auto" : "smooth"
     });
   };
 
   return (
     <button
       onClick={scrollToTop}
       className={`fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#69734f] text-white shadow-lg transition-all duration-300 hover:bg-[#50593b] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
     >
       <i className="bi bi-arrow-up text-xl"></i>
     </button>
   );
}
