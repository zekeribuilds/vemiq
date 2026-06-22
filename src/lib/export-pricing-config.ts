/**
 * Export Pricing Configuration
 * 
 * Vemiq uses a pay-per-page model for report exports.
 * Pricing is defined here as configuration rather than database records because:
 * 1. Pricing is business logic that should be version-controlled
 * 2. Easier to A/B test different pricing strategies
 * 3. No need for complex admin UI to manage pricing
 * 
 * Payment only occurs at export time, not during usage.
 */

export interface ExportPricing {
  pricePerPage: number; // in Naira
  currency: 'NGN';
  minimumCharge: number; // minimum charge in Naira
}

export const exportPricing: ExportPricing = {
  pricePerPage: 300,
  currency: 'NGN',
  minimumCharge: 300, // minimum charge for 1 page
};

/**
 * Calculate export cost based on page count
 */
export function calculateExportCost(pageCount: number): number {
  if (pageCount <= 0) return 0;
  return Math.max(pageCount * exportPricing.pricePerPage, exportPricing.minimumCharge);
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  return `₦${cost.toLocaleString()}`;
}

/**
 * Get pricing summary for display
 */
export function getPricingSummary(pageCount: number) {
  const cost = calculateExportCost(pageCount);
  return {
    pages: pageCount,
    pricePerPage: exportPricing.pricePerPage,
    totalCost: cost,
    formattedCost: formatCost(cost),
  };
}
