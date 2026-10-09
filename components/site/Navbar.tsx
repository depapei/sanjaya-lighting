'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Products', href: '/#products' },
  { label: 'Koleksi', href: '/#koleksi' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top utility bar — Luceplan spec: solid black, white text */}
      {/* <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <p className="truncate text-xs font-normal leading-tight text-white/70">
            Toko Lampu Hias Jakarta — Jl. Raya Pos Pengumben No. 5
          </p>
          <Link
            href="/#contact"
            className="hidden h-9 shrink-0 items-center gap-1 rounded-sm border border-white/40 px-4 text-sm font-normal text-white transition-colors hover:bg-white hover:text-black sm:inline-flex"
          >
            Hubungi Kami
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div> */}

      {/* Main low-profile bar — white, thin rule, text-first links */}
      <nav className="border-b border-[#E5E7EB] bg-white/80 backdrop-blur-sm rounded-full mx-lg mt-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-black">
                SANJAYA LIGHTING
              </span>
              <span className="mt-1 text-xs font-normal text-[#6B6B6B]">
                Toko Lampu Hias Jakarta
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="p-0 text-base font-normal text-black transition-opacity hover:opacity-60"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="rounded-sm border border-[#E5E7EB] p-2 text-black transition-colors hover:border-black md:hidden"
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
              transition={{ duration: 0.2 }}
              className="border-t border-[#E5E7EB] bg-white md:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="block px-3 py-2 text-sm font-normal text-black hover:bg-[#F6F6F6]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
