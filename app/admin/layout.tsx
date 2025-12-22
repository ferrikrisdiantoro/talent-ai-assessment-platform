import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Brain, LayoutDashboard, PlusCircle, Users, LogOut } from 'lucide-react'

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
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-muted-foreground mb-8">You do not have permission to view the Admin Panel.</p>
                <Link href="/dashboard" className="px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110">
                    Return to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Admin Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-800 bg-card hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800 flex items-center gap-2 font-bold text-xl text-primary">
                    <Brain className="h-6 w-6" />
                    <span>TalentAI <span className="text-xs text-white bg-red-500 px-1.5 py-0.5 rounded ml-1">ADMIN</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/admin" icon={<LayoutDashboard className="h-5 w-5" />}>
                        Overview
                    </NavItem>
                    <NavItem href="/admin/assessments/new" icon={<PlusCircle className="h-5 w-5" />}>
                        Create Assessment
                    </NavItem>
                    <NavItem href="/admin/candidates" icon={<Users className="h-5 w-5" />}>
                        Candidates
                    </NavItem>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link href="/dashboard" className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition mb-2">
                        &larr; Candidate View
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary/10 hover:text-primary transition font-medium"
        >
            {icon}
            {children}
        </Link>
    )
}
