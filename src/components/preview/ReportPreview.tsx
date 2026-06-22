'use client';

import { useState, useEffect } from 'react';
import A4Page from './A4Page';
import PreviewControls from './PreviewControls';
import { useReportStore } from '@/store/reportStore';
import { calculateTotalPages } from '@/lib/pdf/pageCalculator';

export default function ReportPreview() {
  const { studentInfo, reportType, reportStructure, weeklyLogs } = useReportStore();
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages dynamically based on content
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
    <div className="flex-1 overflow-auto bg-gray-100 p-8">
      <PreviewControls
        zoom={zoom}
        onZoomChange={setZoom}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div
        className="flex justify-center transition-transform"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <A4Page pageNumber={currentPage} totalPages={totalPages}>
          {renderContent()}
        </A4Page>
      </div>
    </div>
  );
}
