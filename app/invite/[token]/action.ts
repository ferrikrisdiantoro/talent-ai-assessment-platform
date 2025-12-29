'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function validateInvitation(token: string) {
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find invitation by token
    const { data: invitation, error } = await serviceClient
        .from('invitations')
        .select(`
            *,
            organizations (
                name
            )
        `)
        .eq('token', token)
        .single()

    if (error || !invitation) {
        return { valid: false }
    }

    // Check if already accepted
    if (invitation.status === 'accepted') {
        return { valid: false }
    }

    // Check if expired
    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)
    if (expiresAt < now) {
        return { valid: false, expired: true }
    }

    // Get recruiter name
    const { data: recruiterProfile } = await serviceClient
        .from('profiles')
        .select('full_name')
        .eq('id', invitation.recruiter_id)
        .single()

    const organizationData = Array.isArray(invitation.organizations)
        ? invitation.organizations[0]
        : invitation.organizations

    return {
        valid: true,
        email: invitation.email,
        candidateName: invitation.candidate_name,
        organizationName: organizationData?.name,
        recruiterName: recruiterProfile?.full_name
    }
}

export async function acceptInvitation(formData: FormData) {
    const token = formData.get('token') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    if (!token || !email || !password || !fullName) {
        return { error: 'Semua field wajib diisi' }
    }

    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Validate token again
    const { data: invitation, error: invError } = await serviceClient
        .from('invitations')
        .select('*')
        .eq('token', token)
        .single()

    if (invError || !invitation) {
        return { error: 'Undangan tidak valid' }
    }

    if (invitation.status === 'accepted') {
        return { error: 'Undangan sudah digunakan' }
    }

    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)
    if (expiresAt < now) {
        return { error: 'Undangan sudah kedaluwarsa' }
    }

    // Verify email matches invitation
    if (email.toLowerCase() !== invitation.email.toLowerCase()) {
        return { error: 'Email tidak sesuai dengan undangan' }
    }

    // Create user account
    const supabase = await createClient()

    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for invited users
        user_metadata: {
            full_name: fullName
        }
    })

    if (authError) {
        // Check if user already exists
        if (authError.message.includes('already') || authError.message.includes('exists')) {
            return { error: 'Email sudah terdaftar. Silakan login dengan akun yang sudah ada.' }
        }
        console.error('Auth error:', authError)
        return { error: 'Gagal membuat akun: ' + authError.message }
    }

    if (!authData.user) {
        return { error: 'Gagal membuat akun' }
    }

    // Create profile linked to recruiter
    const { error: profileError } = await serviceClient
        .from('profiles')
        .insert({
            id: authData.user.id,
            full_name: fullName,
            role: 'candidate',
            organization_id: invitation.organization_id,
            invited_by: invitation.recruiter_id,
            invitation_id: invitation.id
        })

    if (profileError) {
        console.error('Profile error:', profileError)
        // Don't fail if profile creation fails
    }

    // Update invitation status
    const { error: updateError } = await serviceClient
        .from('invitations')
        .update({
            status: 'accepted',
            accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id)

    if (updateError) {
        console.error('Update invitation error:', updateError)
    }

    // Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (signInError) {
        return {
            success: true,
            message: 'Akun berhasil dibuat! Silakan login dengan kredensial Anda.'
        }
    }

    // Redirect to dashboard
    redirect('/dashboard')
}
