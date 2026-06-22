import React from 'react';

interface A4PageProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
}

export default function A4Page({ children, pageNumber, totalPages }: A4PageProps) {
  return (
    <div className="a4-page bg-white mb-8 shadow-xl">
      <div className="a4-content min-h-[247mm]">
        {children}
      </div>

      <div className="absolute bottom-4 right-4 text-sm text-muted-foreground font-medium">
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  );
}
