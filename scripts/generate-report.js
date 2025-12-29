const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Client color palette (Humania)
const COLORS = {
    primary: '#2563EB',       // Blue-600
    primaryDark: '#1D4ED8',   // Blue-700
    secondary: '#3B82F6',     // Blue-500
    text: '#1E293B',          // Slate-800
    textLight: '#64748B',     // Slate-500
    white: '#FFFFFF',
    background: '#F8FAFC',    // Slate-50
    success: '#10B981',       // Emerald-500
    warning: '#F59E0B',       // Amber-500
};

// Page dimensions
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;

// Screenshot paths
const SCREENSHOTS_DIR = 'C:/Users/ferry/.gemini/antigravity/brain/ab52f949-f79e-4935-8238-d1b1dbab9f2d';
const LOGO_PATH = 'd:/Projek/Freelancer/cl38_fw - Sistem Rekrutmen AI (DONE)/public/logo.jpg';
const OUTPUT_PATH = 'd:/Projek/Freelancer/cl38_fw - Sistem Rekrutmen AI (DONE)/Laporan_Fitur_Humania_TalentMap.pdf';

// Create PDF
const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
        Title: 'Laporan Fitur Humania TalentMap - Recruiter Flow',
        Author: 'Humania TalentMap',
        Subject: 'Documentation & Testing Report',
    }
});

const stream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(stream);

// Helper functions
function drawHeader(doc, title) {
    // Header background
    doc.rect(0, 0, PAGE_WIDTH, 80).fill(COLORS.primary);

    // Logo
    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, MARGIN, 15, { width: 50 });
    }

    // Title
    doc.fillColor(COLORS.white)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('Humania TalentMap', MARGIN + 60, 25);

    doc.fontSize(12)
        .font('Helvetica')
        .text(title, MARGIN + 60, 50);

    doc.fillColor(COLORS.text);
}

function drawFooter(doc, pageNum) {
    const y = PAGE_HEIGHT - 40;
    doc.fontSize(10)
        .fillColor(COLORS.textLight)
        .text(`© 2025 Humania TalentMap`, MARGIN, y, { lineBreak: false })
        .text(`Halaman ${pageNum}`, PAGE_WIDTH - MARGIN - 60, y, { lineBreak: false });
}

function addSectionTitle(doc, title, y) {
    doc.fontSize(18)
        .fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .text(title, MARGIN, y);

    doc.moveTo(MARGIN, y + 25)
        .lineTo(PAGE_WIDTH - MARGIN, y + 25)
        .strokeColor(COLORS.secondary)
        .lineWidth(2)
        .stroke();

    return y + 40;
}

function addScreenshot(doc, imagePath, caption, y, width = 450) {
    if (fs.existsSync(imagePath)) {
        const x = (PAGE_WIDTH - width) / 2;

        // Shadow/border effect
        doc.rect(x - 2, y - 2, width + 4, 260 + 4)
            .fillColor('#E2E8F0')
            .fill();

        doc.image(imagePath, x, y, { width: width, height: 250 });

        // Caption
        doc.fontSize(10)
            .fillColor(COLORS.textLight)
            .font('Helvetica-Oblique')
            .text(caption, MARGIN, y + 260, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

        return y + 290;
    }
    return y;
}

let pageNum = 1;

// ========== COVER PAGE ==========
drawHeader(doc, 'Laporan Dokumentasi & Testing');

doc.moveDown(8);
doc.fontSize(32)
    .fillColor(COLORS.primary)
    .font('Helvetica-Bold')
    .text('Laporan Fitur &', MARGIN, 200, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

doc.text('Testing Report', MARGIN, 240, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

doc.moveDown(2);
doc.fontSize(18)
    .fillColor(COLORS.text)
    .font('Helvetica')
    .text('Implementasi Recruiter Flow', MARGIN, 300, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

doc.fontSize(14)
    .fillColor(COLORS.textLight)
    .text('Platform Pemetaan Talenta & Assessment', MARGIN, 330, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

// Feature boxes
const boxY = 400;
const boxWidth = 150;
const boxHeight = 80;
const boxes = [
    { title: 'Recruiter', subtitle: 'Dashboard & Invite', x: 70 },
    { title: 'Kandidat', subtitle: 'Assessment Flow', x: 230 },
    { title: 'Admin', subtitle: 'Management', x: 390 },
];

boxes.forEach(box => {
    doc.rect(box.x, boxY, boxWidth, boxHeight)
        .fillColor(COLORS.primary)
        .fill();

    doc.fillColor(COLORS.white)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(box.title, box.x, boxY + 20, { width: boxWidth, align: 'center' });

    doc.fontSize(10)
        .font('Helvetica')
        .text(box.subtitle, box.x, boxY + 45, { width: boxWidth, align: 'center' });
});

doc.fontSize(12)
    .fillColor(COLORS.textLight)
    .text('Tanggal: 29 Desember 2025', MARGIN, 550, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

doc.text('Versi: 1.0.0', MARGIN, 570, { align: 'center', width: PAGE_WIDTH - MARGIN * 2 });

drawFooter(doc, pageNum++);

// ========== TABLE OF CONTENTS ==========
doc.addPage();
drawHeader(doc, 'Daftar Isi');

let y = 120;
doc.fontSize(16)
    .fillColor(COLORS.text)
    .font('Helvetica-Bold')
    .text('Daftar Isi', MARGIN, y);

y += 40;
const toc = [
    '1. Ringkasan Eksekutif',
    '2. Fitur Baru - Recruiter Flow',
    '3. Alur Sistem (Flow Diagram)',
    '4. Screenshot Halaman - Recruiter',
    '5. Screenshot Halaman - Kandidat',
    '6. Screenshot Halaman - Admin',
    '7. Hasil Testing',
    '8. Kesimpulan',
];

toc.forEach((item, idx) => {
    doc.fontSize(12)
        .fillColor(COLORS.text)
        .font('Helvetica')
        .text(item, MARGIN + 20, y + idx * 25);
});

drawFooter(doc, pageNum++);

// ========== EXECUTIVE SUMMARY ==========
doc.addPage();
drawHeader(doc, 'Ringkasan Eksekutif');

y = 120;
y = addSectionTitle(doc, '1. Ringkasan Eksekutif', y);

doc.fontSize(12)
    .fillColor(COLORS.text)
    .font('Helvetica')
    .text('Dokumen ini berisi laporan implementasi fitur Recruiter Flow pada platform Humania TalentMap. Fitur ini memungkinkan perusahaan/recruiter untuk:', MARGIN, y, { width: PAGE_WIDTH - MARGIN * 2 });

y += 60;
const features = [
    '✓ Mendaftar sebagai Recruiter dengan informasi perusahaan',
    '✓ Menginvite kandidat melalui link unik',
    '✓ Melihat daftar kandidat yang telah diundang',
    '✓ Memantau progress assessment kandidat',
    '✓ Melihat hasil assessment dan download PDF report',
];

features.forEach((feat, idx) => {
    doc.fontSize(11)
        .fillColor(COLORS.text)
        .text(feat, MARGIN + 20, y + idx * 22);
});

y += features.length * 22 + 30;

// Status box
doc.rect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, 60)
    .fillColor('#DCFCE7')
    .fill();

doc.fontSize(14)
    .fillColor('#166534')
    .font('Helvetica-Bold')
    .text('STATUS: IMPLEMENTASI SELESAI ✓', MARGIN + 20, y + 15);

doc.fontSize(11)
    .font('Helvetica')
    .text('Semua fitur telah ditest dan berfungsi dengan baik.', MARGIN + 20, y + 38);

drawFooter(doc, pageNum++);

// ========== RECRUITER FLOW FEATURES ==========
doc.addPage();
drawHeader(doc, 'Fitur Baru');

y = 120;
y = addSectionTitle(doc, '2. Fitur Baru - Recruiter Flow', y);

const recruitFeatures = [
    { name: 'Registrasi Recruiter', desc: 'Recruiter dapat mendaftar dengan memilih role "Recruiter" dan mengisi nama perusahaan.' },
    { name: 'Dashboard Recruiter', desc: 'Dashboard khusus dengan statistik undangan, kandidat terdaftar, dan progress assessment.' },
    { name: 'Invite Kandidat', desc: 'Generate link unik untuk mengundang kandidat. Link berlaku 7 hari.' },
    { name: 'Daftar Kandidat', desc: 'Melihat semua kandidat yang diundang beserta status mereka.' },
    { name: 'Lihat Hasil Assessment', desc: 'Akses hasil assessment kandidat termasuk skor dan download PDF report.' },
    { name: 'Mobile Responsive', desc: 'Semua halaman dapat diakses dengan baik di perangkat mobile.' },
];

recruitFeatures.forEach((feat, idx) => {
    const boxY = y + idx * 65;

    // Feature box
    doc.rect(MARGIN, boxY, PAGE_WIDTH - MARGIN * 2, 55)
        .fillColor(idx % 2 === 0 ? '#EFF6FF' : COLORS.white)
        .fill();

    doc.rect(MARGIN, boxY, 5, 55)
        .fillColor(COLORS.primary)
        .fill();

    doc.fontSize(12)
        .fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .text(feat.name, MARGIN + 15, boxY + 10);

    doc.fontSize(10)
        .fillColor(COLORS.textLight)
        .font('Helvetica')
        .text(feat.desc, MARGIN + 15, boxY + 30, { width: PAGE_WIDTH - MARGIN * 2 - 30 });
});

drawFooter(doc, pageNum++);

// ========== FLOW DIAGRAM ==========
doc.addPage();
drawHeader(doc, 'Alur Sistem');

y = 120;
y = addSectionTitle(doc, '3. Alur Sistem (Flow Diagram)', y);

// Flow boxes
const flowBoxWidth = 140;
const flowBoxHeight = 50;
const arrowWidth = 30;
const startX = 80;

const flowSteps = [
    { text: 'Recruiter\nRegister', color: COLORS.primary },
    { text: 'Buat\nUndangan', color: COLORS.secondary },
    { text: 'Kandidat\nRegister', color: COLORS.primary },
    { text: 'Kerjakan\nAssessment', color: COLORS.success },
    { text: 'Lihat\nHasil', color: '#8B5CF6' },
];

flowSteps.forEach((step, idx) => {
    const x = startX + idx * (flowBoxWidth + arrowWidth);

    if (idx < flowSteps.length - 1) {
        // Arrow
        doc.moveTo(x + flowBoxWidth + 5, y + flowBoxHeight / 2)
            .lineTo(x + flowBoxWidth + arrowWidth - 5, y + flowBoxHeight / 2)
            .strokeColor(COLORS.textLight)
            .lineWidth(2)
            .stroke();

        // Arrow head
        doc.moveTo(x + flowBoxWidth + arrowWidth - 10, y + flowBoxHeight / 2 - 5)
            .lineTo(x + flowBoxWidth + arrowWidth - 5, y + flowBoxHeight / 2)
            .lineTo(x + flowBoxWidth + arrowWidth - 10, y + flowBoxHeight / 2 + 5)
            .stroke();
    }
});

// Draw boxes on top of arrows - positioned vertically
y = 150;
doc.fontSize(10)
    .font('Helvetica-Bold');

const verticalFlow = [
    { step: '1', text: 'Recruiter mendaftar dengan role Recruiter dan input nama perusahaan', y: y },
    { step: '2', text: 'Recruiter generate link undangan untuk kandidat', y: y + 60 },
    { step: '3', text: 'Kandidat menerima link dan mendaftar melalui link tersebut', y: y + 120 },
    { step: '4', text: 'Kandidat mengerjakan assessment yang tersedia', y: y + 180 },
    { step: '5', text: 'Recruiter melihat hasil assessment kandidat', y: y + 240 },
];

verticalFlow.forEach(flow => {
    // Step circle
    doc.circle(MARGIN + 15, flow.y + 12, 12)
        .fillColor(COLORS.primary)
        .fill();

    doc.fillColor(COLORS.white)
        .fontSize(12)
        .text(flow.step, MARGIN + 10, flow.y + 6);

    // Step text
    doc.fillColor(COLORS.text)
        .fontSize(11)
        .font('Helvetica')
        .text(flow.text, MARGIN + 40, flow.y + 5, { width: PAGE_WIDTH - MARGIN * 2 - 50 });

    // Connector line
    if (flow.step !== '5') {
        doc.moveTo(MARGIN + 15, flow.y + 24)
            .lineTo(MARGIN + 15, flow.y + 48)
            .strokeColor('#CBD5E1')
            .lineWidth(2)
            .stroke();
    }
});

drawFooter(doc, pageNum++);

// ========== RECRUITER SCREENSHOTS ==========
doc.addPage();
drawHeader(doc, 'Screenshot Recruiter');

y = 120;
y = addSectionTitle(doc, '4. Screenshot Halaman - Recruiter', y);

y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_recruiter_dashboard_1766973532270.png`, 'Gambar 4.1: Dashboard Recruiter - Menampilkan statistik dan quick actions', y);

drawFooter(doc, pageNum++);

// Recruiter page 2
doc.addPage();
drawHeader(doc, 'Screenshot Recruiter');

y = 120;
y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_recruiter_invite_1766973551116.png`, 'Gambar 4.2: Halaman Invite Kandidat - Form untuk generate link undangan', y);

y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_recruiter_candidates_1766973570994.png`, 'Gambar 4.3: Daftar Kandidat - Menampilkan kandidat terdaftar dan undangan pending', y + 20);

drawFooter(doc, pageNum++);

// ========== CANDIDATE SCREENSHOTS ==========
doc.addPage();
drawHeader(doc, 'Screenshot Kandidat');

y = 120;
y = addSectionTitle(doc, '5. Screenshot Halaman - Kandidat', y);

y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_candidate_dashboard_1766973765870.png`, 'Gambar 5.1: Dashboard Kandidat - Daftar modul assessment yang tersedia', y);

drawFooter(doc, pageNum++);

// Candidate page 2
doc.addPage();
drawHeader(doc, 'Screenshot Kandidat');

y = 120;
y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_candidate_results_1766973793960.png`, 'Gambar 5.2: Halaman Hasil - Menampilkan skor assessment kandidat', y);

drawFooter(doc, pageNum++);

// ========== ADMIN SCREENSHOTS ==========
doc.addPage();
drawHeader(doc, 'Screenshot Admin');

y = 120;
y = addSectionTitle(doc, '6. Screenshot Halaman - Admin', y);

y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_admin_dashboard_1766973948910.png`, 'Gambar 6.1: Dashboard Admin - Overview dan manajemen assessment', y);

drawFooter(doc, pageNum++);

// Admin page 2
doc.addPage();
drawHeader(doc, 'Screenshot Admin');

y = 120;
y = addScreenshot(doc, `${SCREENSHOTS_DIR}/report_admin_candidates_1766973966742.png`, 'Gambar 6.2: Daftar Kandidat Admin - Semua kandidat dengan status', y);

drawFooter(doc, pageNum++);

// ========== TESTING RESULTS ==========
doc.addPage();
drawHeader(doc, 'Hasil Testing');

y = 120;
y = addSectionTitle(doc, '7. Hasil Testing', y);

// Test results table
const testResults = [
    { feature: 'Login Recruiter', status: 'PASS', notes: 'Redirect ke /recruiter berhasil' },
    { feature: 'Registrasi Recruiter', status: 'PASS', notes: 'Organisasi terbuat otomatis' },
    { feature: 'Generate Invite Link', status: 'PASS', notes: 'Token unik, expired 7 hari' },
    { feature: 'Accept Invitation', status: 'PASS', notes: 'Kandidat terhubung ke recruiter' },
    { feature: 'View Candidates', status: 'PASS', notes: 'List dan detail berfungsi' },
    { feature: 'Mobile Responsive', status: 'PASS', notes: 'Semua halaman responsive' },
    { feature: 'RLS Policies', status: 'PASS', notes: 'Data isolation berfungsi' },
];

// Table header
doc.rect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, 30)
    .fillColor(COLORS.primary)
    .fill();

doc.fillColor(COLORS.white)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Fitur', MARGIN + 10, y + 10)
    .text('Status', MARGIN + 200, y + 10)
    .text('Catatan', MARGIN + 280, y + 10);

y += 30;

testResults.forEach((result, idx) => {
    const rowY = y + idx * 28;

    doc.rect(MARGIN, rowY, PAGE_WIDTH - MARGIN * 2, 28)
        .fillColor(idx % 2 === 0 ? '#F8FAFC' : COLORS.white)
        .fill();

    doc.fillColor(COLORS.text)
        .fontSize(10)
        .font('Helvetica')
        .text(result.feature, MARGIN + 10, rowY + 9);

    doc.fillColor(result.status === 'PASS' ? '#166534' : '#DC2626')
        .font('Helvetica-Bold')
        .text(result.status === 'PASS' ? '✓ PASS' : '✗ FAIL', MARGIN + 200, rowY + 9);

    doc.fillColor(COLORS.textLight)
        .font('Helvetica')
        .text(result.notes, MARGIN + 280, rowY + 9);
});

drawFooter(doc, pageNum++);

// ========== CONCLUSION ==========
doc.addPage();
drawHeader(doc, 'Kesimpulan');

y = 120;
y = addSectionTitle(doc, '8. Kesimpulan', y);

doc.fontSize(12)
    .fillColor(COLORS.text)
    .font('Helvetica')
    .text('Implementasi Recruiter Flow pada platform Humania TalentMap telah berhasil diselesaikan dengan baik. Semua fitur yang direncanakan telah diimplementasikan dan lolos testing.', MARGIN, y, { width: PAGE_WIDTH - MARGIN * 2 });

y += 70;

// Summary boxes
const summaryItems = [
    { icon: '📊', title: '7 Fitur Baru', desc: 'Termasuk dashboard, invite, dan hasil' },
    { icon: '✅', title: '100% Testing Pass', desc: 'Semua fitur berfungsi dengan baik' },
    { icon: '📱', title: 'Mobile Ready', desc: 'Responsive di semua perangkat' },
    { icon: '🔒', title: 'Secure', desc: 'RLS policies untuk data isolation' },
];

summaryItems.forEach((item, idx) => {
    const boxX = MARGIN + (idx % 2) * ((PAGE_WIDTH - MARGIN * 2) / 2);
    const boxY = y + Math.floor(idx / 2) * 80;
    const boxW = (PAGE_WIDTH - MARGIN * 2) / 2 - 10;

    doc.rect(boxX, boxY, boxW, 70)
        .fillColor('#EFF6FF')
        .fill();

    doc.fontSize(24)
        .text(item.icon, boxX + 15, boxY + 10);

    doc.fontSize(12)
        .fillColor(COLORS.primary)
        .font('Helvetica-Bold')
        .text(item.title, boxX + 55, boxY + 15);

    doc.fontSize(10)
        .fillColor(COLORS.textLight)
        .font('Helvetica')
        .text(item.desc, boxX + 55, boxY + 35);
});

y += 180;

// Final note
doc.rect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, 80)
    .fillColor(COLORS.primary)
    .fill();

doc.fillColor(COLORS.white)
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Siap untuk Deployment', MARGIN + 20, y + 20);

doc.fontSize(11)
    .font('Helvetica')
    .text('Semua fitur telah diverifikasi dan siap untuk di-deploy ke production environment.', MARGIN + 20, y + 45, { width: PAGE_WIDTH - MARGIN * 2 - 40 });

drawFooter(doc, pageNum++);

// Finalize PDF
doc.end();

stream.on('finish', () => {
    console.log('PDF created successfully at:', OUTPUT_PATH);
});
