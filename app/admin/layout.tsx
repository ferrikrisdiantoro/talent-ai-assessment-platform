import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, PlusCircle, Users, LogOut, FileText, ChevronRight } from 'lucide-react'

export default async function AdminLayout({
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

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h1>
                    <p className="text-slate-500 mb-6">Anda tidak memiliki izin untuk mengakses Panel Admin.</p>
                    <Link href="/dashboard" className="px-6 py-3 btn-primary rounded-xl inline-block">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Admin Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/admin" className="flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="Humania TalentMap"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <div>
                            <h1 className="font-bold text-lg text-primary">Humania</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500 font-medium">TalentMap</p>
                                <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">ADMIN</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-xs font-semibold text-slate-400 mb-4 px-3 uppercase tracking-wider">Menu Admin</div>
                    <NavItem href="/admin" icon={<LayoutDashboard className="h-5 w-5" />}>
                        Overview
                    </NavItem>
                    <NavItem href="/admin/candidates" icon={<Users className="h-5 w-5" />}>
                        Daftar Kandidat
                    </NavItem>
                    <NavItem href="/admin/assessments/new" icon={<PlusCircle className="h-5 w-5" />}>
                        Buat Assessment
                    </NavItem>
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-3 px-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {profile?.full_name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold text-slate-800 truncate">{profile?.full_name || 'Admin'}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition mb-2">
                        ← Tampilan Kandidat
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/admin" className="flex items-center gap-2">
                        <Image
                            src="/logo.jpg"
                            alt="Humania TalentMap"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="font-bold text-primary">Admin</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg">
                            <LayoutDashboard className="w-5 h-5" />
                        </Link>
                        <Link href="/admin/candidates" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg">
                            <Users className="w-5 h-5" />
                        </Link>
                        <Link href="/admin/assessments/new" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg">
                            <PlusCircle className="w-5 h-5" />
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 pt-16 md:pt-0 p-4 md:p-8 min-h-screen">
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
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium"
        >
            <span className="text-slate-400 group-hover:text-primary transition-colors duration-200">{icon}</span>
            <span className="flex-1">{children}</span>
            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
        </Link>
    )
}
