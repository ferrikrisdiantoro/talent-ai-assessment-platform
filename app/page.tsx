import Link from "next/link";
import { ArrowRight, CheckCircle2, Brain, FileText, BarChart3, ChevronRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground bg-[url('/grid.svg')] selection:bg-primary/30">
      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 font-bold text-xl text-white">
          <div className="p-2 bg-primary/20 rounded-xl shadow-lg shadow-primary/20">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <span className="tracking-tight">TalentAI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-white text-muted-foreground transition-colors hidden md:block">
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-sm font-bold bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition shadow-lg shadow-white/10 flex items-center gap-2"
          >
            Get Started <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 animate-pulse-glow" />

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-4 animate-float">
              <Zap className="w-4 h-4" />
              <span>New: Gemini 2.5 AI Analysis Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500 animate-gradient">Recruitment AI</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of candidate assessment.
              Combine psychometric rigor with <span className="text-white font-semibold">Native AI Analysis</span> for deeper visuals and insights.
            </p>

            <div className="pt-8 flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-primary rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300"
              >
                Start Assessment Now <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-panel rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
                style={{ borderRadius: '1rem' }}
              >
                Explore Features
              </a>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Leading HR Teams Choose TalentAI</h2>
              <p className="text-muted-foreground text-lg">Everything you need to make data-driven hiring decisions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="glass-panel p-8 rounded-3xl md:col-span-2 group hover:border-primary/30 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Brain className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Narrative</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    Stop reading raw numbers. Our Gemini 2.5 integration reads between the lines, generating comprehensive candidate narratives, strengths, and personalized interview guides in seconds.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-green-500/50 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Multi-Dimensional</h3>
                <p className="text-muted-foreground">
                  Complete assessment suite covering Cognitive, Personality (Big Five), DISC, and Attitude in one seamless flow.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-purple-500/50 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real-time Visualization</h3>
                <p className="text-muted-foreground">
                  Beautiful, interactive charts and radial progress bars that make data interpretation effortless for any stakeholder.
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass-panel p-8 rounded-3xl md:col-span-2 border-t-4 border-t-blue-500/50 group hover:border-blue-400/30 transition-colors relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Instant PDF Reports</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Generate professional, branded PDF reports ready for presentation to hiring managers or clients immediately after assessment completion.
                    </p>
                  </div>
                  <div className="w-full md:w-1/3 bg-slate-900/50 rounded-xl p-4 border border-white/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="h-2 w-1/2 bg-white/20 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-white/10 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-12 bg-white/5 rounded-lg border border-white/5"></div>
                      <div className="h-12 bg-white/5 rounded-lg border border-white/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} TalentAI System. Built with ❤️ for Modern HR.</p>
        </div>
      </footer>
    </div>
  );
}
