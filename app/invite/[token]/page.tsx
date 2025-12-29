'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Mail, Lock, User, ArrowRight, AlertCircle, Building2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/components/Toast'
import { validateInvitation, acceptInvitation } from './action'

interface InvitationData {
    valid: boolean
    expired?: boolean
    email?: string
    candidateName?: string
    organizationName?: string
    recruiterName?: string
}

export default function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
    const [token, setToken] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [invitation, setInvitation] = useState<InvitationData | null>(null)
    const router = useRouter()
    const toast = useToast()

    useEffect(() => {
        const loadInvitation = async () => {
            const { token: inviteToken } = await params
            setToken(inviteToken)

            const result = await validateInvitation(inviteToken)
            setInvitation(result)
            setLoading(false)
        }
        loadInvitation()
    }, [params])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)

        const formData = new FormData(e.currentTarget)
        formData.set('token', token)

        const result = await acceptInvitation(formData)

        if (result.error) {
            toast.error(result.error)
            setSubmitting(false)
        } else if (result.success) {
            toast.success(result.message || 'Pendaftaran berhasil! Silakan cek email untuk konfirmasi.')
        }

        setSubmitting(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500">Memvalidasi undangan...</p>
                </div>
            </div>
        )
    }

    if (!invitation?.valid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        {invitation?.expired ? 'Undangan Kedaluwarsa' : 'Undangan Tidak Valid'}
                    </h1>
                    <p className="text-slate-500 mb-6">
                        {invitation?.expired
                            ? 'Link undangan ini sudah melewati batas waktu. Silakan hubungi recruiter untuk mendapatkan link baru.'
                            : 'Link undangan tidak valid atau sudah digunakan. Silakan hubungi recruiter.'}
                    </p>
                    <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl inline-block font-medium hover:bg-blue-700 transition">
                        Ke Halaman Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Info */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 text-white p-12 flex-col justify-between overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

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
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Anda Telah Diundang!</h2>
                        <p className="text-blue-100 text-base leading-relaxed mb-6">
                            Anda menerima undangan untuk mengerjakan assessment dari:
                        </p>
                        {invitation.organizationName && (
                            <div className="bg-white/10 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-center gap-3">
                                    <Building2 className="w-6 h-6" />
                                    <span className="font-semibold text-lg">{invitation.organizationName}</span>
                                </div>
                                {invitation.recruiterName && (
                                    <p className="text-blue-200 text-sm mt-1">oleh {invitation.recruiterName}</p>
                                )}
                            </div>
                        )}
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
                            Daftar sebagai Kandidat
                        </h2>
                        <p className="mt-1 text-slate-500 text-sm">
                            Lengkapi data diri Anda untuk memulai assessment.
                        </p>
                    </div>

                    {/* Invitation Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Email undangan:</strong> {invitation.email}
                        </p>
                        {invitation.organizationName && (
                            <p className="text-sm text-blue-800 mt-1">
                                <strong>Dari:</strong> {invitation.organizationName}
                            </p>
                        )}
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                                    defaultValue={invitation.candidateName || ''}
                                    className="block w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                    placeholder="Nama Lengkap Anda"
                                />
                            </div>
                        </div>

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
                                    defaultValue={invitation.email || ''}
                                    readOnly
                                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-slate-600 shadow-sm sm:text-sm outline-none cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-slate-400 ml-1">Email tidak dapat diubah karena sesuai dengan undangan</p>
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
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition transform active:scale-[0.98]"
                        >
                            {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Daftar & Mulai Assessment'}
                            {!submitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-blue-600 font-medium hover:text-blue-500">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
