'use client';

import { useState } from 'react';
import { DownloadIcon, SuccessIcon, DocumentsIcon, CreditCardIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
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
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">Export Your Report</h2>
      <p className="text-muted-foreground mb-8">
        Download your report as a print-ready PDF.
      </p>

      {!showPayment && !exportComplete && !isExporting && (
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
              <DocumentsIcon className="text-primary" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {reportType} Report
              </h3>
              <p className="text-muted-foreground">
                {studentInfo.companyName} • {studentInfo.academicSession}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6 p-4 bg-muted rounded-2xl">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>{weeklyLogs.length} weekly logs processed</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>{reportStructure.numberOfChapters} chapters generated</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>Times New Roman, 12pt, 1.5 spacing</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>A4 format with proper margins</span>
            </div>
          </div>

          <Button
            onClick={handleExport}
            isLoading={isExporting}
            fullWidth
            size="md"
            leftIcon={<DownloadIcon size={20} />}
          >
            Export as PDF
          </Button>
        </Card>
      )}

      {showPayment && !exportComplete && (
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
              <CreditCardIcon className="text-primary" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Export Summary
              </h3>
              <p className="text-muted-foreground">
                {reportType} Report • {studentInfo.companyName}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6 p-6 bg-primary/5 rounded-2xl border-2 border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Pages</span>
              <span className="text-foreground font-semibold">{pricing.pages}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost Per Page</span>
              <span className="text-foreground font-semibold">₦{pricing.pricePerPage}</span>
            </div>
            <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
              <span className="text-foreground font-semibold">Total Cost</span>
              <span className="text-2xl font-bold text-primary">{pricing.formattedCost}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6 text-center">
            Payment is processed securely via Paystack. You will be redirected to complete your payment.
          </p>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowPayment(false)}
              variant="ghost"
              size="md"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              isLoading={isProcessingPayment}
              size="md"
              leftIcon={<CreditCardIcon size={20} />}
              className="flex-1"
            >
              Pay {pricing.formattedCost}
            </Button>
          </div>
        </Card>
      )}

      {isExporting && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Generating PDF...
          </h3>
          <p className="text-muted-foreground">
            This may take a few moments. Please don't close this page.
          </p>
        </Card>
      )}

      {exportComplete && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <SuccessIcon className="text-success" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Export Complete!
          </h3>
          <p className="text-muted-foreground mb-6">
            Your report has been downloaded successfully.
          </p>

          <div className="flex gap-4 justify-center">
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
