'use client';

import { useState } from 'react';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '24px', fontWeight: '700', marginBottom: spacing.xl }}>{reportType} REPORT</h1>
      <h2 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '20px', marginBottom: spacing.md }}>ON</h2>
      <h3 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '24px', fontWeight: '700', marginBottom: spacing.xl }}>INDUSTRIAL TRAINING</h3>
      <div style={{ marginTop: spacing.xl }}>
        <Stack spacing="sm">
          <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: '600' }}>AT</p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '18px' }}>{studentInfo.companyName}</p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>{studentInfo.organizationDepartment}</p>
        </Stack>
      </div>
      <div style={{ marginTop: spacing.xl }}>
        <Stack spacing="sm">
          <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: '600' }}>ACADEMIC SESSION</p>
          <p style={{ fontFamily: 'system-ui, sans-serif' }}>{studentInfo.academicSession}</p>
        </Stack>
      </div>
      <div style={{ marginTop: spacing.xl }}>
        <Stack spacing="sm">
          <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: '600' }}>IN PARTIAL FULFILLMENT OF</p>
          <p style={{ fontFamily: 'system-ui, sans-serif' }}>THE REQUIREMENTS FOR THE AWARD OF</p>
          <p style={{ fontFamily: 'system-ui, sans-serif' }}>BACHELOR OF ENGINEERING (B.Eng)</p>
        </Stack>
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
            <h2 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '20px', fontWeight: '700', marginBottom: spacing.md }}>CERTIFICATION</h2>
            <p style={{ fontFamily: 'system-ui, sans-serif', marginBottom: spacing.md }}>
              This is to certify that this {reportType} report titled
              &quot;INDUSTRIAL TRAINING REPORT&quot; was carried out at
              {studentInfo.companyName}, {studentInfo.organizationDepartment}
              under my supervision.
            </p>
            <div style={{ marginTop: spacing['3xl'] }}>
              <Stack spacing="md">
                <p>______________________</p>
                <p style={{ fontFamily: 'system-ui, sans-serif' }}>Supervisor: {studentInfo.supervisorName}</p>
                <p>______________________</p>
                <p style={{ fontFamily: 'system-ui, sans-serif' }}>Coordinator: {studentInfo.coordinatorName}</p>
              </Stack>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '20px', fontWeight: '700', marginBottom: spacing.md }}>DEDICATION</h2>
            {reportStructure.includeDedication && (
              <p style={{ fontFamily: 'system-ui, sans-serif' }}>
                This report is dedicated to my parents, guardians, and all who
                have supported me throughout my academic journey.
              </p>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '20px', fontWeight: '700', marginBottom: spacing.md }}>ACKNOWLEDGEMENT</h2>
            {reportStructure.includeAcknowledgement && (
              <p style={{ fontFamily: 'system-ui, sans-serif' }}>
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
            <h2 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '20px', fontWeight: '700', marginBottom: spacing.md }}>ABSTRACT</h2>
            {reportStructure.includeAbstract && (
              <p style={{ fontFamily: 'system-ui, sans-serif' }}>
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
        return <p style={{ fontFamily: 'system-ui, sans-serif' }}>Content for page {currentPage}</p>;
    }
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        Preview Your Report
      </h2>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        color: colors.text.secondary,
        marginBottom: spacing.xl,
      }}>
        Review your report before exporting to PDF.
      </p>

      <div style={{
        backgroundColor: colors.background.elevated,
        borderRadius: '24px',
        padding: spacing.xl,
        marginBottom: spacing.xl,
      }}>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <Button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              variant="ghost"
              size="sm"
              icon="remove"
              iconPosition="left"
            >
              Zoom Out
            </Button>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: colors.text.primary,
            }}>
              {zoom}%
            </span>
            <Button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              variant="ghost"
              size="sm"
              icon="add"
              iconPosition="left"
            >
              Zoom In
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              variant="ghost"
              size="sm"
              icon="remove"
              iconPosition="left"
            >
              Previous
            </Button>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: colors.text.primary,
            }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              variant="ghost"
              size="sm"
              icon="add"
              iconPosition="left"
            >
              Next
            </Button>
          </div>
        </Card>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
            transform: `scale(${zoom / 100})`,
          }}
        >
          <A4Page pageNumber={currentPage} totalPages={totalPages}>
            {renderContent()}
          </A4Page>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
