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
      className={`text-sm text-[#898989] hover:text-[#FFFFFF] transition-colors font-medium relative ${isActive ? 'text-[#FFFFFF]' : ''} ${className || ''}`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#6C63FF] rounded-full" />
      )}
    </Link>
  );
}
