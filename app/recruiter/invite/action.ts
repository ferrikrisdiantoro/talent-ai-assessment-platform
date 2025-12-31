'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { headers } from 'next/headers'
import { sendInvitationEmail } from '@/lib/email'

export async function inviteCandidate(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Anda harus login terlebih dahulu' }
    }

    // Check if user is a recruiter
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter') {
        return { error: 'Hanya recruiter yang bisa mengirim undangan' }
    }

    const email = formData.get('email') as string
    const candidateName = formData.get('candidate_name') as string | null

    if (!email) {
        return { error: 'Email kandidat wajib diisi' }
    }

    // Get organization
    const { data: organization } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('recruiter_id', user.id)
        .single()

    // Generate unique token
    const token = randomBytes(32).toString('hex')

    // Set expiry to 7 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Service client to bypass RLS
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if invitation already exists for this email from this recruiter
    const { data: existingInvitation } = await serviceClient
        .from('invitations')
        .select('id, status')
        .eq('recruiter_id', user.id)
        .eq('email', email)
        .single()

    if (existingInvitation) {
        if (existingInvitation.status === 'accepted') {
            return { error: 'Kandidat dengan email ini sudah terdaftar' }
        }
        // Update existing pending invitation with new token
        const { error } = await serviceClient
            .from('invitations')
            .update({
                token,
                expires_at: expiresAt.toISOString(),
                candidate_name: candidateName,
                status: 'pending'
            })
            .eq('id', existingInvitation.id)

        if (error) {
            console.error('Error updating invitation:', error)
            return { error: 'Gagal memperbarui undangan' }
        }
    } else {
        // Create new invitation
        const { error } = await serviceClient
            .from('invitations')
            .insert({
                organization_id: organization?.id,
                recruiter_id: user.id,
                email,
                candidate_name: candidateName,
                token,
                expires_at: expiresAt.toISOString(),
                status: 'pending'
            })

        if (error) {
            console.error('Error creating invitation:', error)
            return { error: 'Gagal membuat undangan' }
        }
    }

    // Generate invite link
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const inviteLink = `${protocol}://${host}/invite/${token}`

    // Send email invitation
    const emailResult = await sendInvitationEmail({
        to: email,
        inviteLink,
        candidateName: candidateName || undefined,
        organizationName: organization?.name || 'Perusahaan',
        recruiterName: profile?.full_name || undefined,
    })

    return {
        success: true,
        inviteLink,
        message: 'Undangan berhasil dibuat',
        emailSent: emailResult.success,
        emailError: emailResult.error
    }
}

