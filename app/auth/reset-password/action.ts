'use server'

import { createClient } from '@/utils/supabase/server'

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email wajib diisi' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return {
        success: true,
        message: 'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.'
    }
}
