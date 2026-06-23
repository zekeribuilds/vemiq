'use client';

import { useState } from 'react';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import { useReportStore } from '@/store/reportStore';
import { getPricingSummary } from '@/lib/export-pricing-config';

export default function Step7Export() {
  const { studentInfo, reportType, reportStructure, weeklyLogs, reset } = useReportStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Estimate page count based on content
  const estimatePageCount = () => {
    // Base pages: title page, abstract, table of contents = 3
    let pages = 3;
    
    // Add pages for chapters (approximately 3-4 pages per chapter)
    pages += reportStructure.numberOfChapters * 3;
    
    // Add pages for weekly logs (approximately 1 page per week)
    pages += weeklyLogs.length;
    
    return Math.max(pages, 5); // Minimum 5 pages
  };

  const pageCount = estimatePageCount();
  const pricing = getPricingSummary(pageCount);

  const handleExport = async () => {
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    try {
      const supabase = (await import('@/lib/supabase/browser')).createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please login to continue');
        setIsProcessingPayment(false);
        return;
      }

      // Initialize Paystack payment for export
      const response = await fetch('/api/payments/export/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          amount: pricing.totalCost,
          pageCount: pageCount,
          reportType: reportType,
          companyName: studentInfo.companyName,
        }),
      });

      const data = await response.json();

      if (data.authorizationUrl) {
        // Redirect to Paystack
        window.location.href = data.authorizationUrl;
      } else {
        console.error('Payment initialization error:', data.error);
        alert('Failed to initialize payment. Please try again.');
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment error. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleCreateNew = () => {
    reset();
    window.location.href = '/dashboard/reports/create';
  };

  const handleViewReports = () => {
    window.location.href = '/dashboard/reports';
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        Export Your Report
      </h2>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        color: colors.text.secondary,
        marginBottom: spacing.xl,
      }}>
        Download your report as a print-ready PDF.
      </p>

      {!showPayment && !exportComplete && !isExporting && (
        <Card style={{ padding: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: `${colors.primary}10`,
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ color: colors.primary }}>
                <VemiqIcon category="data" name="report" size={32} />
              </div>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '18px',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                {reportType} Report
              </h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
              }}>
                {studentInfo.companyName} • {studentInfo.academicSession}
              </p>
            </div>
          </div>

          <div style={{
            marginBottom: spacing.xl,
            padding: spacing.md,
            backgroundColor: colors.background.elevated,
            borderRadius: '16px',
          }}>
            <Stack spacing="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
                <div style={{ color: colors.success }}>
                  <VemiqIcon category="status" name="completed" size={18} />
                </div>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
                  {weeklyLogs.length} weekly logs processed
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
                <div style={{ color: colors.success }}>
                  <VemiqIcon category="status" name="completed" size={18} />
                </div>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
                  {reportStructure.numberOfChapters} chapters generated
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
                <div style={{ color: colors.success }}>
                  <VemiqIcon category="status" name="completed" size={18} />
                </div>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
                  Times New Roman, 12pt, 1.5 spacing
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
                <div style={{ color: colors.success }}>
                  <VemiqIcon category="status" name="completed" size={18} />
                </div>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>
                  A4 format with proper margins
                </span>
              </div>
            </Stack>
          </div>

          <Button
            onClick={handleExport}
            isLoading={isExporting}
            fullWidth
            size="md"
            icon="download"
            iconPosition="left"
          >
            Export as PDF
          </Button>
        </Card>
      )}

      {showPayment && !exportComplete && (
        <Card style={{ padding: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: `${colors.primary}10`,
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ color: colors.primary }}>
                <VemiqIcon category="action" name="download" size={32} />
              </div>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '18px',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Export Summary
              </h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
              }}>
                {reportType} Report • {studentInfo.companyName}
              </p>
            </div>
          </div>

          <div style={{
            marginBottom: spacing.xl,
            padding: spacing.xl,
            backgroundColor: `${colors.primary}05`,
            borderRadius: '16px',
            border: `2px solid ${colors.primary}20`,
          }}>
            <Stack spacing="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: colors.text.secondary }}>
                  Estimated Pages
                </span>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>
                  {pricing.pages}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: colors.text.secondary }}>
                  Cost Per Page
                </span>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>
                  ₦{pricing.pricePerPage}
                </span>
              </div>
              <div style={{
                borderTop: `1px solid ${colors.primary}20`,
                paddingTop: spacing.md,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '600', color: colors.text.primary }}>
                  Total Cost
                </span>
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: colors.primary,
                }}>
                  {pricing.formattedCost}
                </span>
              </div>
            </Stack>
          </div>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: colors.text.secondary,
            marginBottom: spacing.xl,
            textAlign: 'center',
          }}>
            Payment is processed securely via Paystack. You will be redirected to complete your payment.
          </p>

          <div style={{ display: 'flex', gap: spacing.md }}>
            <Button
              onClick={() => setShowPayment(false)}
              variant="ghost"
              size="md"
              style={{ flex: 1 }}
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              isLoading={isProcessingPayment}
              size="md"
              icon="download"
              iconPosition="left"
              style={{ flex: 1 }}
            >
              Pay {pricing.formattedCost}
            </Button>
          </div>
        </Card>
      )}

      {isExporting && (
        <Card style={{ padding: spacing.xl, textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: `4px solid ${colors.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: `0 auto ${spacing.md} auto`,
          }} />
          <h3 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}>
            Generating PDF...
          </h3>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            color: colors.text.secondary,
          }}>
            This may take a few moments. Please don't close this page.
          </p>
        </Card>
      )}

      {exportComplete && (
        <Card style={{ padding: spacing.xl, textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: `${colors.success}10`,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.md} auto`,
          }}>
            <div style={{ color: colors.success }}>
              <VemiqIcon category="status" name="success" size={32} />
            </div>
          </div>
          <h3 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}>
            Export Complete!
          </h3>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            color: colors.text.secondary,
            marginBottom: spacing.xl,
          }}>
            Your report has been downloaded successfully.
          </p>

          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
            <Button onClick={handleViewReports} variant="ghost" size="md">
              View All Reports
            </Button>
            <Button onClick={handleCreateNew} size="md">
              Create New Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
