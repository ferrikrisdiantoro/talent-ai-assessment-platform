'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Mail, Lock, User, Brain } from 'lucide-react'
import { login } from '@/app/auth/login/action'
import { signup } from '@/app/auth/signup/action'

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)

        let result
        if (mode === 'login') {
            result = await login(formData)
        } else {
            result = await signup(formData)
        }

        if (result?.error) {
            setMessage({ text: result.error, type: 'error' })
        } else if (result && 'success' in result && result.success) {
            setMessage({ text: result.message, type: 'success' })
            if (mode === 'signup') {
                // optionally switch to login or just show check email
            }
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                        <Brain className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-sm text-foreground/60">
                        {mode === 'login'
                            ? 'Enter your credentials to access your dashboard'
                            : 'Sign up to start your assessment journey'}
                    </p>
                </div>

                <div className="bg-card px-8 py-10 shadow-xl border border-border rounded-2xl">
                    {/* Tabs */}
                    <div className="flex mb-8 bg-background/50 p-1 rounded-lg border border-border">
                        <button
                            onClick={() => { setMode('login'); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'login' ? 'bg-primary text-white shadow' : 'text-foreground/70 hover:text-foreground'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'signup' ? 'bg-primary text-white shadow' : 'text-foreground/70 hover:text-foreground'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs uppercase font-bold text-foreground/50 mb-1.5 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="full_name"
                                        type="text"
                                        required
                                        className="block w-full rounded-xl border-border bg-background pl-10 pr-3 py-2.5 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm outline-none transition"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs uppercase font-bold text-foreground/50 mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-xl border-border bg-background pl-10 pr-3 py-2.5 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm outline-none transition"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-foreground/50 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full rounded-xl border-border bg-background pl-10 pr-3 py-2.5 text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition transform active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-lg text-sm border flex items-start gap-3 ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {message.type === 'success' ? <Check className="h-5 w-5 shrink-0" /> : <div className="h-5 w-5 shrink-0 font-bold">!</div>}
                            <p>{message.text}</p>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-foreground/40">
                    &copy; 2025 TalentAI. Secure Assessment Platform.
                </p>
            </div>
        </div>
    )
}
