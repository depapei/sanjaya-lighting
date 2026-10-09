'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Products', href: '/#products' },
  { label: 'Koleksi', href: '/#koleksi' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

const SCROLL_THRESHOLD = 16;
const HIDE_THRESHOLD = 80;
const DELTA_THRESHOLD = 4;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const isOpenRef = useRef(isOpen);
  const reduceMotion = useReducedMotion();

  isOpenRef.current = isOpen;

  useEffect(() => {
    lastY.current = window.scrollY;
    setScrolled(window.scrollY > SCROLL_THRESHOLD);

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        lastY.current = y;

        setScrolled(y > SCROLL_THRESHOLD);

        if (isOpenRef.current) {
          // Menu mobile terbuka: navbar wajib tetap tampil
          setHidden(false);
        } else if (y <= SCROLL_THRESHOLD) {
          setHidden(false);
        } else if (Math.abs(delta) < DELTA_THRESHOLD) {
          // Abaikan jitter kecil agar tidak flicker
        } else if (delta > 0 && y > HIDE_THRESHOLD) {
          setHidden(true);
        } else if (delta < 0) {
          setHidden(false);
        }

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !reduceMotion ? '-110%' : '0%' }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 ${
        hidden ? 'pointer-events-none' : ''
      }`}
    >
      {/* Main low-profile bar — pill putih di atas, invert ke hitam saat terscroll */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgb(0, 0, 0)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgb(229, 231, 235)',
          // Fix rounded bug: pill saat tertutup, kartu rounded saat menu mobile terbuka
          // agar dropdown tidak merusak bentuk pill
          borderRadius: isOpen ? 20 : 999,
          backdropFilter: scrolled ? 'blur(0px)' : 'blur(12px)',
        }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        style={{ WebkitBackdropFilter: scrolled ? 'blur(0px)' : 'blur(12px)' }}
        className="mx-auto max-w-7xl overflow-hidden border"
      >
        <div className="px-4 sm:px-6">
          <div className="flex h-12 items-center justify-between">
            <Link href="/" className="flex flex-col leading-none">
              <span
                className={`text-md font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-white' : 'text-black'
                }`}
              >
                SANJAYA LIGHTING
              </span>
              <span
                className={`mt-1 text-xs font-normal transition-colors duration-300 ${
                  scrolled ? 'text-white/60' : 'text-[#6B6B6B]'
                }`}
              >
                Toko Lampu Hias Jakarta
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`p-0 text-base font-normal transition-colors duration-300 hover:opacity-60 ${
                    scrolled ? 'text-white' : 'text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className={`p-2 transition-colors duration-300 md:hidden ${
                isOpen
                  ? scrolled
                    ? 'rounded-[10px] border border-white/20 text-white hover:border-white'
                    : 'rounded-[10px] border border-[#E5E7EB] text-black hover:border-black'
                  : scrolled
                    ? 'rounded-full border border-white/20 text-white hover:border-white'
                    : 'rounded-full border border-[#E5E7EB] text-black hover:border-black'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className={`border-t transition-colors duration-300 md:hidden ${
                scrolled ? 'border-white/20 bg-black' : 'border-[#E5E7EB] bg-white'
              }`}
            >
              <div className="space-y-1 px-4 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={`block rounded-[10px] px-3 py-2 text-sm font-normal transition-colors duration-300 ${
                      scrolled
                        ? 'text-white hover:bg-white/10'
                        : 'text-black hover:bg-[#F6F6F6]'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
