'use client';

import { useState } from 'react';
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { useReportStore } from '@/store/reportStore';
import A4Page from '@/components/preview/A4Page';
import { calculateTotalPages } from '@/lib/pdf/pageCalculator';

export default function Step6Preview() {
  const { studentInfo, reportType, reportStructure, setStep } = useReportStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  // Calculate total pages dynamically
  const content = `
    Title Page
    Certification
    ${reportStructure.includeDedication ? 'Dedication' : ''}
    ${reportStructure.includeAcknowledgement ? 'Acknowledgement' : ''}
    ${reportStructure.includeAbstract ? 'Abstract' : ''}
    Table of Contents
    Introduction
    Company Overview
    Activities
    Challenges
    Conclusion
  `;

  const totalPages = calculateTotalPages({
    content,
    fontSize: 12,
    lineHeight: 1.5,
  });

  const renderTitlePage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl font-bold mb-8">{reportType} REPORT</h1>
      <h2 className="text-xl mb-4">ON</h2>
      <h3 className="text-2xl font-bold mb-8">INDUSTRIAL TRAINING</h3>
      <div className="mt-8 space-y-2">
        <p className="font-semibold">AT</p>
        <p className="text-lg">{studentInfo.companyName}</p>
        <p className="text-sm">{studentInfo.organizationDepartment}</p>
      </div>
      <div className="mt-8 space-y-2">
        <p className="font-semibold">ACADEMIC SESSION</p>
        <p>{studentInfo.academicSession}</p>
      </div>
      <div className="mt-8 space-y-2">
        <p className="font-semibold">IN PARTIAL FULFILLMENT OF</p>
        <p>THE REQUIREMENTS FOR THE AWARD OF</p>
        <p>BACHELOR OF ENGINEERING (B.Eng)</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return renderTitlePage();
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">CERTIFICATION</h2>
            <p className="mb-4">
              This is to certify that this {reportType} report titled
              &quot;INDUSTRIAL TRAINING REPORT&quot; was carried out at
              {studentInfo.companyName}, {studentInfo.organizationDepartment}
              under my supervision.
            </p>
            <div className="mt-12 space-y-4">
              <p>______________________</p>
              <p>Supervisor: {studentInfo.supervisorName}</p>
              <p>______________________</p>
              <p>Coordinator: {studentInfo.coordinatorName}</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">DEDICATION</h2>
            {reportStructure.includeDedication && (
              <p>
                This report is dedicated to my parents, guardians, and all who
                have supported me throughout my academic journey.
              </p>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">ACKNOWLEDGEMENT</h2>
            {reportStructure.includeAcknowledgement && (
              <p>
                I wish to express my sincere gratitude to my supervisor,
                {studentInfo.supervisorName}, for his guidance and support
                throughout this industrial training program. I also thank the
                management and staff of {studentInfo.companyName} for the
                opportunity and mentorship.
              </p>
            )}
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">ABSTRACT</h2>
            {reportStructure.includeAbstract && (
              <p>
                This report details my industrial training experience at
                {studentInfo.companyName}, {studentInfo.organizationDepartment}
                during the {studentInfo.academicSession} academic session
                ({studentInfo.startDate} to {studentInfo.endDate}).
                The training covered various aspects of practical engineering
                applications, including hands-on experience with industrial
                equipment, project management, and teamwork.
              </p>
            )}
          </div>
        );
      default:
        return <p>Content for page {currentPage}</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">Preview Your Report</h2>
      <p className="text-muted-foreground mb-8">
        Review your report before exporting to PDF.
      </p>

      <div className="bg-muted rounded-3xl p-8 mb-6">
        <Card className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeftIcon size={20} />}
            >
              Zoom Out
            </Button>
            <span className="text-sm font-medium text-foreground">{zoom}%</span>
            <Button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              variant="ghost"
              size="sm"
              leftIcon={<ChevronRightIcon size={20} />}
            >
              Zoom In
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeftIcon size={20} />}
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              variant="ghost"
              size="sm"
              leftIcon={<ChevronRightIcon size={20} />}
            >
              Next
            </Button>
          </div>
        </Card>

        <div
          className="flex justify-center transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <A4Page pageNumber={currentPage} totalPages={totalPages}>
            {renderContent()}
          </A4Page>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => setStep(5)} variant="ghost" size="md">
          Back
        </Button>
        <Button onClick={() => setStep(7)} size="md">
          Continue to Export
        </Button>
      </div>
    </div>
  );
}
