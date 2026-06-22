import puppeteer from 'puppeteer';

interface PDFOptions {
  format?: 'A4';
  printBackground?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

export class PDFService {
  private browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  async getBrowser(): Promise<Awaited<ReturnType<typeof puppeteer.launch>>> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async generatePDF(html: string, options: PDFOptions = {}): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle' as any });

      const pdf = await page.pdf({
        format: options.format || 'A4',
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }

  async generatePDFFromURL(url: string, options: PDFOptions = {}): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle' as any });

      const pdf = await page.pdf({
        format: options.format || 'A4',
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }
}

// Singleton instance
let pdfServiceInstance: PDFService | null = null;

export function getPDFService(): PDFService {
  if (!pdfServiceInstance) {
    pdfServiceInstance = new PDFService();
  }
  return pdfServiceInstance;
}
