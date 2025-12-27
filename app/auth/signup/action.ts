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

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Create profile entry for the new user with 'candidate' role
    if (data.user) {
        const serviceClient = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error: profileError } = await serviceClient
            .from('profiles')
            .insert({
                id: data.user.id,
                full_name: fullName,
                role: 'candidate'
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
            // Don't return error to user as auth signup succeeded
        }
    }

    return { success: true, message: 'Check your email to confirm your account.' }
}
