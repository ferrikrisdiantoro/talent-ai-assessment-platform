'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Mail, Lock, User, ArrowRight, Sparkles, Brain, Target, Building2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { login } from '@/app/auth/login/action'
import { signup } from '@/app/auth/signup/action'
import { useToast } from '@/components/Toast'

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter'>('candidate')
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        // Add role to formData for signup
        if (mode === 'signup') {
            formData.set('role', selectedRole)
        }

        let result
        if (mode === 'login') {
            result = await login(formData)
        } else {
            result = await signup(formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else if (result && 'success' in result && result.success) {
            toast.success(result.message)
            if (mode === 'signup') {
                // optionally switch to login or just show check email
            }
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen lg:h-screen bg-slate-50 lg:overflow-hidden">
            {/* Left Side - Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 text-white p-12 flex-col justify-between overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-90 transition">
                        <Image
                            src="/logo.jpg"
                            alt="Humania Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl shadow-lg"
                            priority
                        />
                        <span className="font-bold text-2xl tracking-tight text-white">Humania TalentMap</span>
                    </Link>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                    {/* Vector Illustration with Animation */}
                    <div className="relative w-full max-w-md mb-8 animate-in fade-in zoom-in-95 duration-700">
                        <div className="animate-[float_6s_ease-in-out_infinite]">
                            <Image
                                src="/vector-login.png"
                                alt="Talent Assessment Illustration"
                                width={400}
                                height={400}
                                className="w-full h-auto drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </div>

                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-bold mb-3">Temukan Potensi Terbaikmu</h2>
                        <p className="text-blue-100 text-base leading-relaxed">
                            Platform assessment cerdas untuk memetakan bakat dan kepribadian profesional secara akurat.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-blue-200 text-center">
                    &copy; 2025 Humania TalentMap.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-6 md:p-6 lg:p-12 min-h-[100dvh] lg:min-h-0">
                <div className="w-full max-w-md mx-auto space-y-5 md:space-y-6">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
                            <span className="font-bold text-xl text-blue-600">Humania TalentMap</span>
                        </Link>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                            {mode === 'login' ? 'Selamat Datang' : 'Mulai Sekarang'}
                        </h2>
                        <p className="mt-1 text-slate-500 text-sm">
                            {mode === 'login'
                                ? 'Masuk untuk mengakses dashboard assessment Anda.'
                                : 'Buat akun baru dalam hitungan detik.'}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-slate-100 p-1 rounded-xl inline-flex w-full">
                        <button
                            onClick={() => { setMode('login') }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => { setMode('signup') }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Daftar
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <>
                                {/* Role Selection */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Daftar Sebagai</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRole('candidate')}
                                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${selectedRole === 'candidate'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="font-semibold text-sm">Kandidat</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRole('recruiter')}
                                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${selectedRole === 'recruiter'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <Building2 className="h-4 w-4" />
                                            <span className="font-semibold text-sm">Recruiter</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <input
                                            name="full_name"
                                            type="text"
                                            required
                                            className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                            placeholder="Nama Lengkap Anda"
                                        />
                                    </div>
                                </div>

                                {/* Company Name - Only for Recruiter */}
                                {selectedRole === 'recruiter' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Perusahaan/Bisnis</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            <input
                                                name="company_name"
                                                type="text"
                                                required
                                                className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                                placeholder="PT. Nama Perusahaan"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                    placeholder="anda@perusahaan.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="flex items-center justify-end">
                                <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition">
                                    Lupa password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition transform active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (mode === 'login' ? 'Masuk ke Dashboard' : 'Buat Akun Baru')}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
