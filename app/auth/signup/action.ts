'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for simplicity, but in production we should validate
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string
    const role = (formData.get('role') as string) || 'candidate'
    const companyName = formData.get('company_name') as string | null

    // Validate role
    if (!['candidate', 'recruiter'].includes(role)) {
        return { error: 'Invalid role selected' }
    }

    // Validate company name for recruiter
    if (role === 'recruiter' && !companyName) {
        return { error: 'Nama perusahaan wajib diisi untuk Recruiter' }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Create profile entry for the new user
    if (data.user) {
        const serviceClient = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Create profile with appropriate role
        const { error: profileError } = await serviceClient
            .from('profiles')
            .insert({
                id: data.user.id,
                full_name: fullName,
                role: role
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
            // Don't return error to user as auth signup succeeded
        }

        // If recruiter, create organization
        if (role === 'recruiter' && companyName) {
            const { error: orgError } = await serviceClient
                .from('organizations')
                .insert({
                    name: companyName,
                    recruiter_id: data.user.id
                })

            if (orgError) {
                console.error('Error creating organization:', orgError)
            }
        }
    }

    return { success: true, message: 'Check your email to confirm your account.' }
}
