'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-muted-foreground hover:text-primary dark:hover:text-white transition-colors font-medium relative ${isActive ? 'text-primary' : ''} ${className || ''}`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
}
