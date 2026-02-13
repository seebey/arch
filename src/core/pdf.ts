import puppeteer from 'puppeteer';

export async function svgToPdf(svgContent: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();

    // Create HTML wrapper for SVG
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
            svg { display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Get SVG dimensions
    const dimensions = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const rawWidth = svg?.getAttribute('width') || '800';
      const rawHeight = svg?.getAttribute('height') || '600';
      return {
        width: parseInt(rawWidth, 10) || 800,
        height: parseInt(rawHeight, 10) || 600
      };
    });

    await page.pdf({
      path: outputPath,
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
  } finally {
    await browser.close();
  }
}
