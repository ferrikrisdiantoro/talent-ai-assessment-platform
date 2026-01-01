'use server'

import nodemailer from 'nodemailer'

// Create Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

interface InvitationEmailParams {
    to: string
    inviteLink: string
    candidateName?: string
    organizationName: string
    recruiterName?: string
}

/**
 * Send invitation email to candidate using Gmail SMTP
 */
export async function sendInvitationEmail({
    to,
    inviteLink,
    candidateName,
    organizationName,
}: InvitationEmailParams): Promise<{ success: boolean; error?: string }> {

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Gmail credentials not configured. Email not sent.')
        return { success: false, error: 'Email tidak terkirim (Gmail belum dikonfigurasi)' }
    }

    const greeting = candidateName ? `Halo ${candidateName},` : 'Halo,'

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Undangan Assessment</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%); padding: 40px 40px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Humania TalentMap</h1>
                                <p style="color: #BFDBFE; margin: 8px 0 0 0; font-size: 14px;">Platform Assessment Rekrutmen</p>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px;">
                                <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    ${greeting}
                                </p>
                                
                                <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                                    Anda telah diundang oleh <strong style="color: #1D4ED8;">${organizationName}</strong> untuk mengikuti proses assessment rekrutmen melalui platform Humania TalentMap.
                                </p>
                                
                                <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">
                                    Silakan klik tombol di bawah ini untuk memulai proses registrasi dan mengerjakan assessment:
                                </p>
                                
                                <!-- CTA Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center">
                                            <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(29, 78, 216, 0.4);">
                                                Mulai Assessment →
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                                    Jika tombol tidak berfungsi, salin dan tempel link berikut di browser Anda:<br>
                                    <a href="${inviteLink}" style="color: #1D4ED8; word-break: break-all;">${inviteLink}</a>
                                </p>
                                
                                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 16px 0 0 0;">
                                    Link ini berlaku selama <strong>7 hari</strong>.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="color: #64748b; font-size: 12px; margin: 0;">
                                    Email ini dikirim secara otomatis oleh sistem Humania TalentMap.<br>
                                    Jika Anda tidak merasa mendaftar, abaikan email ini.
                                </p>
                                <p style="color: #94a3b8; font-size: 11px; margin: 12px 0 0 0;">
                                    © ${new Date().getFullYear()} Humania TalentMap. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `

    const textContent = `
${greeting}

Anda telah diundang oleh ${organizationName} untuk mengikuti proses assessment rekrutmen melalui platform Humania TalentMap.

Silakan klik link berikut untuk memulai:
${inviteLink}

Link ini berlaku selama 7 hari.

---
Email ini dikirim secara otomatis oleh sistem Humania TalentMap.
    `.trim()

    try {
        await transporter.sendMail({
            from: `"Humania TalentMap" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: `Undangan Assessment dari ${organizationName}`,
            text: textContent,
            html: htmlContent,
        })

        return { success: true }
    } catch (error) {
        console.error('Gmail error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengirim email'
        }
    }
}
