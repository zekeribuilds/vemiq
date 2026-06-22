interface PageCalculationOptions {
  content: string;
  fontSize?: number; // in points
  lineHeight?: number;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  a4Height?: number; // in mm
}

export function calculateTotalPages(options: PageCalculationOptions): number {
  const {
    content,
    fontSize = 12,
    lineHeight = 1.5,
    marginTop = '25mm',
    marginBottom = '25mm',
    marginLeft = '25mm',
    marginRight = '25mm',
    a4Height = 297,
  } = options;

  // Convert margins from mm to points (1mm = 2.835 points)
  const topMargin = parseFloat(marginTop) * 2.835;
  const bottomMargin = parseFloat(marginBottom) * 2.835;
  const leftMargin = parseFloat(marginLeft) * 2.835;
  const rightMargin = parseFloat(marginRight) * 2.835;

  // A4 dimensions in points (210mm x 297mm)
  const a4WidthPoints = 210 * 2.835;
  const a4HeightPoints = a4Height * 2.835;

  // Calculate usable area
  const usableHeight = a4HeightPoints - topMargin - bottomMargin;
  const usableWidth = a4WidthPoints - leftMargin - rightMargin;

  // Calculate line height in points
  const lineHeightPoints = fontSize * lineHeight;

  // Estimate characters per line (average character width ~0.6 of font size)
  const avgCharWidth = fontSize * 0.6;
  const charsPerLine = Math.floor(usableWidth / avgCharWidth);

  // Calculate lines per page
  const linesPerPage = Math.floor(usableHeight / lineHeightPoints);

  // Strip HTML tags for content length calculation
  const plainText = content.replace(/<[^>]*>/g, '');
  const contentLength = plainText.length;

  // Calculate estimated lines
  const estimatedLines = Math.ceil(contentLength / charsPerLine);

  // Calculate pages
  const totalPages = Math.ceil(estimatedLines / linesPerPage);

  // Minimum of 1 page
  return Math.max(1, totalPages);
}

export function estimatePageBreaks(
  content: string,
  options: PageCalculationOptions
): number[] {
  const totalPages = calculateTotalPages(options);
  const pageBreaks: number[] = [];

  // Calculate approximate character position for each page break
  const plainText = content.replace(/<[^>]*>/g, '');
  const charsPerPage = Math.ceil(plainText.length / totalPages);

  for (let i = 1; i < totalPages; i++) {
    pageBreaks.push(i * charsPerPage);
  }

  return pageBreaks;
}
