'use client';

import { useIsMobile } from "@/hooks/use-mobile";
import { slugify, type ProductCategory } from '@/lib/slug';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Koleksi', href: '/#koleksi' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

const SCROLL_THRESHOLD = 16;
const HIDE_THRESHOLD = 80;
const DELTA_THRESHOLD = 4;

/** Normalisasi respons /api/product-category (tahan terhadap shape lama string[]). */
function normalizeCategories(data: unknown): ProductCategory[] {
  if (!Array.isArray(data)) return [];
  if (data.every((item) => typeof item === 'string')) {
    return (data as string[]).map((name, i) => ({
      id: i,
      name,
      slug: slugify(name),
      productCount: 0,
    }));
  }
  return (data as ProductCategory[]).filter(
    (c) => c && typeof c.name === 'string' && typeof c.slug === 'string',
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const isOpenRef = useRef(isOpen);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peekCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  // Peek desktop: tampil sementara saat pointer di tengah-atas, tanpa mengubah `hidden`.
  const [peek, setPeek] = useState(false);
  const [canHover, setCanHover] = useState(false);

  isOpenRef.current = isOpen;

  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    setCatError(false);
    try {
      const res = await fetch('/api/product-category', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCategories(normalizeCategories(await res.json()));
    } catch {
      setCatError(true);
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Deteksi kemampuan hover presisi (mouse). Touchscreen / mobile tidak dapat peek.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Tutup dropdown saat pindah halaman / navbar disembunyikan saat scroll
  useEffect(() => {
    setProductsOpen(false);
    setPeek(false);
  }, [pathname]);

  useEffect(() => {
    // Saat peek aktif, dropdown boleh tetap terbuka agar bisa diklik.
    if (hidden && !peek) setProductsOpen(false);
  }, [hidden, peek]);

  // Peek basi wajib dibersihkan saat navbar kembali tampil via scroll / mobile / menu.
  useEffect(() => {
    if (!hidden || isMobile || isOpen) setPeek(false);
  }, [hidden, isMobile, isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (peekCloseTimer.current) clearTimeout(peekCloseTimer.current);
    };
  }, []);

  const openProducts = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(true);
  }, []);

  const scheduleCloseProducts = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductsOpen(false), 140);
  }, []);

  const cancelPeekClose = useCallback(() => {
    if (peekCloseTimer.current) clearTimeout(peekCloseTimer.current);
    peekCloseTimer.current = null;
  }, []);

  const handleSentinelEnter = useCallback(() => {
    cancelPeekClose();
    setPeek(true);
  }, [cancelPeekClose]);

  const handleHeaderEnter = useCallback(() => {
    // Jaga peek tetap hidup saat pointer pindah dari sentinel ke navbar.
    if (hidden) {
      cancelPeekClose();
      setPeek(true);
    }
  }, [cancelPeekClose, hidden]);

  const handleHeaderLeave = useCallback(() => {
    // Auto-hide lagi saat mouse menjauh dari navbar.
    if (peekCloseTimer.current) clearTimeout(peekCloseTimer.current);
    peekCloseTimer.current = setTimeout(() => setPeek(false), 120);
  }, []);

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

  const closeMobile = () => {
    setIsOpen(false);
    setMobileProductsOpen(false);
  };

  const linkColor = scrolled ? 'text-white' : 'text-black';
  const panelTheme = scrolled
    ? 'border-white/20 bg-black text-white'
    : 'border-[#E5E7EB] bg-white text-black';
  const panelItemHover = scrolled ? 'hover:bg-white/10' : 'hover:bg-[#F6F6F6]';
  const totalCount = categories.reduce((sum, c) => sum + (c.productCount ?? 0), 0);

  const dropdownAnim = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.32, 0.72, 0, 1] as const };

  // Behavior scroll lama dipertahankan: `hidden` hanya dari scroll.
  // `peek` hanya override visual sementara saat hover tengah-atas (desktop).
  const isVisuallyHidden = hidden && !peek && !reduceMotion;
  // Sentinel tetap mounted selama `hidden` (termasuk saat peek) agar tidak
  // remount di bawah kursor dan memicu mouseenter berulang / flicker.
  const showPeekZone =
    hidden && !isMobile && canHover && !isOpen && !reduceMotion;

  return (
    <>
      {/* Zona hover tak terlihat seukuran pill — desktop only, aktif saat navbar hidden */}
      {showPeekZone && (
        <div
          aria-hidden="true"
          onMouseEnter={handleSentinelEnter}
          onMouseLeave={handleHeaderLeave}
          className="fixed left-1/2 top-0 z-40 h-[88px] w-[min(620px,60vw)] -translate-x-1/2"
        />
      )}
      <motion.header
        initial={false}
        animate={{ y: isVisuallyHidden ? '-110%' : '0%' }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.32, 0.72, 0, 1] }}
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}
        className={`fixed left-0 right-0 top-0 z-50 flex w-full max-w-[100vw] justify-center px-0 pt-0 md:px-4 md:pt-3 ${
          isVisuallyHidden ? 'pointer-events-none' : ''
        }`}
      >
      {/* Main low-profile bar — pill putih di atas, invert ke hitam saat terscroll */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgb(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgb(229, 231, 235)',
          // Fix rounded bug: pill saat tertutup, kartu rounded saat menu mobile terbuka
          // agar dropdown tidak merusak bentuk pill
          borderRadius: isOpen ? '12px' : isMobile ? '12px' : '9999px',
          backdropFilter: 'blur(12px)',
        }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        style={{ WebkitBackdropFilter: scrolled ? 'blur(0px)' : 'blur(12px)' }}
        // overflow-visible saat dropdown desktop terbuka agar panel tidak terpotong;
        // selebihnya overflow-hidden agar menu mobile tetap terjepit rapi dalam pill.
        // w-full di mobile (full-bleed), auto di desktop (pill centered).
        className={`${isMobile && 'mx-md mt-4'} w-full max-w-full min-w-0 md:w-auto ${
          productsOpen && !isOpen ? 'overflow-visible' : 'overflow-hidden'
        }`}
      >
        <div className="min-w-0 px-4 sm:px-6">
          <div className="flex h-12 min-w-0 items-center justify-between gap-4 md:justify-start md:gap-8 lg:gap-12">
            <Link href="/" className="flex min-w-0 shrink flex-col leading-none">
              <span
                className={`truncate text-sm font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-white' : 'text-black'
                }`}
              >
                SANJAYA LIGHTING
              </span>
              <span
                className={`truncate text-xs font-normal transition-colors duration-300 ${
                  scrolled ? 'text-white/60' : 'text-[#6B6B6B]'
                }`}
              >
                Toko Lampu Hias Jakarta
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/#home"
                className={`p-0 text-base font-normal transition-colors duration-300 hover:opacity-60 ${linkColor}`}
              >
                Home
              </Link>

              {/* Products — hover dropdown kategori dari backend */}
              <div
                className="relative"
                onMouseEnter={openProducts}
                onMouseLeave={scheduleCloseProducts}
                onFocus={openProducts}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setProductsOpen(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setProductsOpen(false);
                }}
              >
                <Link
                  href="/products"
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                  className={`flex items-center gap-1 p-0 text-base font-normal transition-colors duration-300 hover:opacity-60 ${linkColor}`}
                >
                  Products
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      productsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {productsOpen && (
                    // Wrapper posisi (tanpa animasi) agar -translate-x tidak
                    // tertimpa transform milik framer-motion; pt-2 jadi
                    // jembatan hover supaya panel tidak flicker.
                    <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2">
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={dropdownAnim}
                        style={{ transformOrigin: 'top center' }}
                        className={`overflow-hidden rounded-[12px] border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${panelTheme}`}
                      >
                        <div className="p-2">
                          <Link
                            href="/products"
                            onClick={() => setProductsOpen(false)}
                            className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-sm font-semibold transition-colors ${panelItemHover}`}
                          >
                            Semua Produk
                            {!catLoading && !catError && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-normal ${
                                  scrolled
                                    ? 'bg-white/10 text-white/70'
                                    : 'bg-[#F6F6F6] text-[#6B6B6B]'
                                }`}
                              >
                                {totalCount}
                              </span>
                            )}
                          </Link>

                          <div
                            className={`mx-3 my-1 border-t ${
                              scrolled ? 'border-white/10' : 'border-[#E5E7EB]'
                            }`}
                          />

                          {catLoading ? (
                            <div className="space-y-1 px-1 py-1" aria-hidden="true">
                              {[0, 1, 2].map((n) => (
                                <div
                                  key={n}
                                  className={`h-9 animate-pulse rounded-[8px] ${
                                    scrolled ? 'bg-white/10' : 'bg-[#F6F6F6]'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : catError ? (
                            <div className="px-3 py-3 text-center">
                              <p
                                className={`text-sm font-normal ${
                                  scrolled ? 'text-white/60' : 'text-[#6B6B6B]'
                                }`}
                              >
                                Gagal memuat kategori.
                              </p>
                              <button
                                onClick={fetchCategories}
                                className="mt-1 p-0 text-sm font-normal underline underline-offset-2 hover:opacity-60"
                              >
                                Coba lagi
                              </button>
                            </div>
                          ) : categories.length === 0 ? (
                            <p
                              className={`px-3 py-3 text-center text-sm font-normal ${
                                scrolled ? 'text-white/60' : 'text-[#6B6B6B]'
                              }`}
                            >
                              Belum ada kategori.
                            </p>
                          ) : (
                            <motion.ul
                              initial={reduceMotion ? false : 'hidden'}
                              animate="show"
                              variants={{
                                hidden: {},
                                show: {
                                  transition: { staggerChildren: 0.04 },
                                },
                              }}
                            >
                              {categories.map((cat) => (
                                <motion.li
                                  key={cat.slug}
                                  variants={{
                                    hidden: { opacity: 0, y: 8 },
                                    show: { opacity: 1, y: 0 },
                                  }}
                                  transition={
                                    reduceMotion
                                      ? { duration: 0 }
                                      : { duration: 0.18, ease: 'easeOut' }
                                  }
                                >
                                  <Link
                                    href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                    onClick={() => setProductsOpen(false)}
                                    className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-sm font-normal transition-colors ${panelItemHover}`}
                                  >
                                    {cat.name}
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-xs ${
                                        scrolled
                                          ? 'bg-white/10 text-white/70'
                                          : 'bg-[#F6F6F6] text-[#6B6B6B]'
                                      }`}
                                    >
                                      {cat.productCount}
                                    </span>
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`p-0 text-base font-normal transition-colors duration-300 hover:opacity-60 ${linkColor}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className={`shrink-0 p-2 transition-colors duration-300 md:hidden ${
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
                <Link
                  href="/#home"
                  className={`block rounded-[10px] px-3 py-2 text-sm font-normal transition-colors duration-300 ${
                    scrolled
                      ? 'text-white hover:bg-white/10'
                      : 'text-black hover:bg-[#F6F6F6]'
                  }`}
                  onClick={closeMobile}
                >
                  Home
                </Link>

                {/* Products accordion (mobile) */}
                <div>
                  <button
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    aria-expanded={mobileProductsOpen}
                    className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-sm font-normal transition-colors duration-300 ${
                      scrolled
                        ? 'text-white hover:bg-white/10'
                        : 'text-black hover:bg-[#F6F6F6]'
                    }`}
                  >
                    Products
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileProductsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileProductsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 px-2 py-1">
                          <Link
                            href="/products"
                            onClick={closeMobile}
                            className={`block rounded-[8px] px-3 py-2 text-sm font-semibold transition-colors ${
                              scrolled
                                ? 'text-white hover:bg-white/10'
                                : 'text-black hover:bg-[#F6F6F6]'
                            }`}
                          >
                            Semua Produk
                          </Link>
                          {catLoading ? (
                            <div className="space-y-1 px-1" aria-hidden="true">
                              {[0, 1, 2].map((n) => (
                                <div
                                  key={n}
                                  className={`h-8 animate-pulse rounded-[8px] ${
                                    scrolled ? 'bg-white/10' : 'bg-[#F6F6F6]'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : catError ? (
                            <p
                              className={`px-3 py-2 text-sm font-normal ${
                                scrolled ? 'text-white/60' : 'text-[#6B6B6B]'
                              }`}
                            >
                              Gagal memuat kategori.
                            </p>
                          ) : (
                            categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                onClick={closeMobile}
                                className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-sm font-normal transition-colors ${
                                  scrolled
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-black hover:bg-[#F6F6F6]'
                                }`}
                              >
                                {cat.name}
                                <span
                                  className={`text-xs ${
                                    scrolled ? 'text-white/60' : 'text-[#6B6B6B]'
                                  }`}
                                >
                                  {cat.productCount}
                                </span>
                              </Link>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {NAV_LINKS.slice(1).map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={`block rounded-[10px] px-3 py-2 text-sm font-normal transition-colors duration-300 ${
                      scrolled
                        ? 'text-white hover:bg-white/10'
                        : 'text-black hover:bg-[#F6F6F6]'
                    }`}
                    onClick={closeMobile}
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
    </>
  );
}
