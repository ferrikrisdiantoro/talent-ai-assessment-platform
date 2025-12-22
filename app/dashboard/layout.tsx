import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Brain, LayoutDashboard, FileText, Settings, LogOut, BarChart3, ChevronRight } from 'lucide-react'

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

    return (
        <div className="flex min-h-screen bg-background text-foreground bg-[url('/grid.svg')]">
            {/* Floating Glass Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 p-4 hidden md:block z-50">
                <div className="h-full glass-panel rounded-2xl flex flex-col border border-white/10 shadow-2xl backdrop-blur-xl">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-xl shadow-inner shadow-primary/20">
                                <Brain className="h-6 w-6 text-primary animate-pulse-glow" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight text-white">TalentAI</h1>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Recruitment OS</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">Menu</div>
                        <NavItem href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
                            Dashboard
                        </NavItem>
                        <NavItem href="/dashboard/results" icon={<BarChart3 className="h-5 w-5" />}>
                            My Results
                        </NavItem>
                        {/* Conditional Admin Link */}
                        {profile?.role === 'admin' && (
                            <NavItem href="/admin" icon={<Settings className="h-5 w-5" />}>
                                Admin Panel
                            </NavItem>
                        )}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-white/5 bg-white/5 m-2 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {profile?.full_name?.[0] || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                        <form action="/auth/signout" method="post">
                            <button className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/20 group">
                                <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 min-h-screen">
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 hover:shadow-lg hover:shadow-primary/5 active:scale-95"
        >
            <span className="group-hover:text-primary transition-colors duration-300">{icon}</span>
            <span className="flex-1 font-medium">{children}</span>
            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
        </Link>
    )
}
