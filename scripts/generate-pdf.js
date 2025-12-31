const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
    console.log('Starting PDF generation...');

    // Files are in parent directory (project root)
    const projectRoot = path.resolve(__dirname, '..');
    const htmlPath = path.join(projectRoot, 'Dokumentasi_Teknis_Humania_TalentMap.html');
    const pdfPath = path.join(projectRoot, 'Dokumentasi_Teknis_Humania_TalentMap.pdf');

    console.log('HTML file:', htmlPath);
    console.log('PDF output:', pdfPath);

    const browser = await puppeteer.launch({
        headless: 'new'
    });

    const page = await browser.newPage();

    // Load the HTML file
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0'
    });

    console.log('Page loaded, generating PDF...');

    // Generate PDF
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
        }
    });

    await browser.close();

    console.log('✅ PDF generated successfully!');
    console.log('Output:', pdfPath);
}

generatePDF().catch(err => {
    console.error('Error generating PDF:', err);
    process.exit(1);
});
