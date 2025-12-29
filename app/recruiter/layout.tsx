import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, UserPlus, Users, LogOut, FileText, ChevronRight, Building2 } from 'lucide-react'

export default async function RecruiterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h1>
                    <p className="text-slate-500 mb-6">Halaman ini hanya untuk Recruiter/Business Owner.</p>
                    <Link href="/dashboard" className="px-6 py-3 btn-primary rounded-xl inline-block">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    // Get organization info
    const { data: organization } = await supabase
        .from('organizations')
        .select('name')
        .eq('recruiter_id', user.id)
        .single()

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Recruiter Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-blue-600 to-blue-700 hidden md:flex flex-col shadow-xl">
                <div className="p-6 border-b border-blue-500/30">
                    <Link href="/recruiter" className="flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="Humania TalentMap"
                            width={40}
                            height={40}
                            className="rounded-lg ring-2 ring-white/20"
                        />
                        <div>
                            <h1 className="font-bold text-lg text-white">Humania</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-blue-200 font-medium">TalentMap</p>
                                <span className="text-[10px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded">RECRUITER</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Organization Info */}
                {organization && (
                    <div className="px-6 py-4 border-b border-blue-500/30">
                        <div className="flex items-center gap-3 bg-blue-500/30 rounded-xl p-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-blue-200">Perusahaan</p>
                                <p className="text-sm font-semibold text-white truncate">{organization.name}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-xs font-semibold text-blue-300 mb-4 px-3 uppercase tracking-wider">Menu Recruiter</div>
                    <NavItem href="/recruiter" icon={<LayoutDashboard className="h-5 w-5" />}>
                        Dashboard
                    </NavItem>
                    <NavItem href="/recruiter/invite" icon={<UserPlus className="h-5 w-5" />}>
                        Invite Kandidat
                    </NavItem>
                    <NavItem href="/recruiter/candidates" icon={<Users className="h-5 w-5" />}>
                        Daftar Kandidat
                    </NavItem>
                </nav>

                <div className="p-4 border-t border-blue-500/30 bg-blue-700/50">
                    <div className="flex items-center gap-3 mb-3 px-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                            {profile?.full_name?.[0]?.toUpperCase() || 'R'}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'Recruiter'}</p>
                            <p className="text-xs text-blue-200">Recruiter</p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition">
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-blue-600 shadow-lg">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/recruiter" className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="Humania TalentMap"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="font-bold text-white">Recruiter</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link href="/recruiter" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                            <LayoutDashboard className="w-5 h-5" />
                        </Link>
                        <Link href="/recruiter/invite" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                            <UserPlus className="w-5 h-5" />
                        </Link>
                        <Link href="/recruiter/candidates" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                            <Users className="w-5 h-5" />
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 pt-16 md:pt-8 p-4 md:p-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
        >
            <span className="text-blue-200 group-hover:text-white transition-colors duration-200">{icon}</span>
            <span className="flex-1">{children}</span>
            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-white" />
        </Link>
    )
}
