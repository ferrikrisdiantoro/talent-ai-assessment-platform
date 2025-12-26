import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Settings, LogOut, BarChart3, Menu, X } from 'lucide-react'

export default async function DashboardLayout({
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

    // Fetch profile to check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-blue-600 hidden md:flex flex-col z-50">
                {/* Logo Section */}
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <Image
                            src="/logo.jpg"
                            alt="Humania TalentMap"
                            width={44}
                            height={44}
                            className="rounded-xl shadow-lg ring-2 ring-white/20"
                        />
                        <div>
                            <h1 className="font-bold text-lg text-white">Humania</h1>
                            <p className="text-xs text-blue-200 font-medium">TalentMap</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="text-xs font-semibold text-blue-300 mb-4 px-3 uppercase tracking-wider">Menu</div>
                    <NavItem href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
                        Dashboard
                    </NavItem>
                    <NavItem href="/dashboard/results" icon={<BarChart3 className="h-5 w-5" />}>
                        Hasil Saya
                    </NavItem>
                    {/* Conditional Admin Link */}
                    {profile?.role === 'admin' && (
                        <NavItem href="/admin" icon={<Settings className="h-5 w-5" />}>
                            Admin Panel
                        </NavItem>
                    )}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-blue-500/50 bg-blue-700/50">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm shadow-lg">
                            {initials}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-blue-200 truncate">{user.email}</p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <LogOut className="h-4 w-4" />
                            Keluar
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-blue-600 flex items-center justify-between px-4 z-50 shadow-lg">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo.jpg"
                        alt="Humania"
                        width={36}
                        height={36}
                        className="rounded-lg"
                    />
                    <span className="font-bold text-white">Humania</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/results" className="p-2 text-white/80 hover:text-white">
                        <BarChart3 className="w-5 h-5" />
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button className="p-2 text-white/80 hover:text-white">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 min-h-screen">
                <div className="p-4 md:p-8 pt-20 md:pt-8">
                    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
        >
            <span className="text-blue-200 group-hover:text-white transition-colors duration-200">{icon}</span>
            <span className="flex-1">{children}</span>
        </Link>
    )
}
