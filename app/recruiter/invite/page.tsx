'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, UserPlus, Copy, Check, Loader2, Link2, Send } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { inviteCandidate } from './action'

export default function InviteCandidatePage() {
    const [loading, setLoading] = useState(false)
    const [inviteLink, setInviteLink] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const router = useRouter()
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setInviteLink(null)

        const formData = new FormData(e.currentTarget)
        const result = await inviteCandidate(formData)

        if (result.error) {
            toast.error(result.error)
        } else if (result.success && result.inviteLink) {
            toast.success('Undangan berhasil dibuat!')
            setInviteLink(result.inviteLink)
        }

        setLoading(false)
    }

    const copyToClipboard = async () => {
        if (inviteLink) {
            await navigator.clipboard.writeText(inviteLink)
            setCopied(true)
            toast.success('Link berhasil disalin!')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleNewInvite = () => {
        setInviteLink(null)
        setCopied(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Invite Kandidat</h1>
                <p className="text-slate-500 mt-1">Kirim undangan ke kandidat untuk mengerjakan assessment.</p>
            </div>

            {!inviteLink ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Nama Kandidat <span className="text-slate-400">(opsional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <UserPlus className="h-4 w-4" />
                                </div>
                                <input
                                    name="candidate_name"
                                    type="text"
                                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                    placeholder="Nama lengkap kandidat"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Email Kandidat <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm outline-none transition"
                                    placeholder="kandidat@email.com"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 ml-1">Link undangan akan digenerate untuk dibagikan ke kandidat</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Buat Link Undangan
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Undangan Berhasil Dibuat!</h2>
                        <p className="text-slate-500 text-sm">Bagikan link di bawah ini kepada kandidat via WhatsApp, Email, atau platform lainnya.</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Link Undangan</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 truncate">
                                <Link2 className="w-4 h-4 inline mr-2 text-slate-400" />
                                {inviteLink}
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition ${copied
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Disalin!' : 'Salin'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Catatan:</strong> Link ini berlaku selama 7 hari. Kandidat bisa langsung daftar dan mengerjakan assessment melalui link tersebut.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleNewInvite}
                            className="flex-1 py-3 px-4 border-2 border-blue-600 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition"
                        >
                            Invite Lagi
                        </button>
                        <button
                            onClick={() => router.push('/recruiter/candidates')}
                            className="flex-1 py-3 px-4 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
                        >
                            Lihat Kandidat
                        </button>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-blue-800 mb-2">💡 Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Kandidat akan otomatis terhubung dengan akun Anda setelah mendaftar</li>
                    <li>• Anda bisa melihat hasil assessment di menu "Daftar Kandidat"</li>
                    <li>• Link bisa dibagikan via WhatsApp, Email, atau platform apapun</li>
                </ul>
            </div>
        </div>
    )
}
