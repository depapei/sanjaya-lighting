'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-md border-b border-gray-200'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <p className='text-start flex flex-col'>
              <span className='text-xl font-bold text-gray-900'>SANJAYA LIGHTING</span>

              {/* <span className='text-xs font-semi-bold text-gray-700'>Toko Lampu Hias Jakarta</span>
              <span className='text-xs font-semi-bold text-gray-700'>Jl. Raya Pos Pengumben No. 5</span> */}

              <span className='text-xs font-semi-bold text-gray-700'>Toko Lampu Hias Jakarta | Jl. Raya Pos Pengumben No. 5</span>
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link href='/#home' className='text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'>
              Home
            </Link>
            {/* <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  Menu
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <Link href='/#products' className='text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'>
              Products
            </Link>
            <Link href='/#about' className='text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'>
              About
            </Link>
            <Link href='/#contact' className='text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'>
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          >
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-white border-t border-gray-200'
          >
            <div className='px-4 py-4 space-y-3'>
              <Link
                href='/#home'
                className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/#products-carousel'
                className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href='/#about'
                className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href='/#contact'
                className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
