import React from 'react';

interface ReportPageProps {
  children: React.ReactNode;
  pageNumber?: number;
  className?: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  children,
  pageNumber,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white
        w-[210mm]
        h-[297mm]
        p-[25.4mm]
        shadow-lg
        mb-8
        mx-auto
        relative
        ${className}
      `}
      style={{
        fontFamily: 'Times New Roman, serif',
        fontSize: '12px',
        lineHeight: '1.5',
        textAlign: 'justify',
      }}
    >
      {children}
      {pageNumber && (
        <div className="absolute bottom-[12.7mm] right-[25.4mm] text-sm">
          {pageNumber}
        </div>
      )}
    </div>
  );
};
