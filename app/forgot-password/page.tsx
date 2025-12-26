'use client'

import { useState } from 'react'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { resetPassword } from '@/app/auth/reset-password/action'
import { useToast } from '@/components/Toast'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await resetPassword(formData)

        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            setSent(true)
            toast.success(result.message)
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen lg:h-screen bg-slate-50 lg:overflow-hidden">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 text-white p-12 flex-col justify-between overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* Logo */}
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

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                    <div className="relative w-full max-w-sm mb-8 animate-in fade-in zoom-in-95 duration-700">
                        <div className="animate-[float_6s_ease-in-out_infinite]">
                            <Image
                                src="/vector-login.png"
                                alt="Reset Password Illustration"
                                width={350}
                                height={350}
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </div>
                    </div>
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-bold mb-3">Reset Password</h2>
                        <p className="text-blue-100 text-base leading-relaxed">
                            Masukkan email terdaftar Anda dan kami akan mengirimkan link untuk mengatur ulang password.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-blue-200 text-center">
                    &copy; 2025 Humania TalentMap.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 animate-in slide-in-from-right-8 duration-500">
                    {/* Mobile Logo */}
                    <div className="text-center lg:text-left">
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
                            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-lg" />
                            <span className="font-bold text-xl text-blue-600">Humania TalentMap</span>
                        </Link>
                    </div>

                    {/* Back Link - only show when not sent */}
                    {!sent && (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Login
                        </Link>
                    )}

                    {!sent ? (
                        <>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                                    Lupa Password?
                                </h2>
                                <p className="mt-1 text-slate-500 text-sm">
                                    Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
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
                                            className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                            placeholder="anda@perusahaan.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition transform active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Kirim Link Reset'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                <CheckCircle className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-3">
                                Email Terkirim!
                            </h2>
                            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
                                Kami telah mengirimkan link reset password ke email Anda.
                                Silakan cek inbox atau folder spam.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
