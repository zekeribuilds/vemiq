'use client';

import Link from 'next/link';
import { MenuIcon, XIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { useState } from 'react';
import NavLink from './NavLink';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#171717]/80 backdrop-blur-lg border-b border-[#2A2A2A]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/images/logo.svg" alt="Vemiq" className="w-8 h-8" />
            <span className="font-semibold text-lg text-[#FFFFFF]">Vemiq</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons - Right Aligned */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-sm text-[#898989] hover:text-[#FFFFFF] transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#6C63FF] hover:bg-[#5A52D5] text-sm text-[#FFFFFF] px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="text-[#898989] hover:text-[#FFFFFF]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1F1F1F] border-b border-[#2A2A2A]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-left text-[#FFFFFF] hover:text-[#6C63FF] transition-colors font-medium text-sm py-2 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#2A2A2A] flex flex-row gap-2">
              <Link
                href="/login"
                className="flex-1 text-center text-[#898989] hover:text-[#FFFFFF] transition-colors font-medium text-sm py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 bg-[#6C63FF] hover:bg-[#5A52D5] text-center text-sm text-[#FFFFFF] py-2.5 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
