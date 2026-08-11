'use client';

import { MobileHeader } from '@/components/mobile/MobileHeader';
import { DesktopHeader } from '@/components/desktop/DesktopHeader';

interface ResponsiveHeaderProps {
  title?: string;
}

export function ResponsiveHeader({ title }: ResponsiveHeaderProps) {
  return (
    <>
      <div className="md:hidden">
        <MobileHeader title={title} />
      </div>
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
    </>
  );
}
