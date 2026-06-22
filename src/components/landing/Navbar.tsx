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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <img src="/images/logo.svg" alt="Vemiq" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="font-bold text-lg sm:text-xl text-foreground">vemiq</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-6 lg:gap-8 mx-4">
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons - Right Aligned */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
            <Link
              href="/login"
              className="text-sm sm:text-base text-muted-foreground hover:text-primary dark:hover:text-white transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm sm:text-base px-4 py-2"
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
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-3 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-left text-foreground hover:text-primary dark:hover:text-white transition-colors font-medium text-sm py-2 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-row gap-2">
              <Link
                href="/login"
                className="flex-1 text-center text-muted-foreground hover:text-primary dark:hover:text-white transition-colors font-medium text-sm py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 btn-primary text-center text-sm py-2.5"
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
