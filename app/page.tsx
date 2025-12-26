import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brain, BarChart3, ChevronRight, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground selection:bg-primary/20">
      {/* Navbar - Mobile Optimized */}
      <header className="px-4 md:px-6 h-16 md:h-20 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="/logo.jpg"
            alt="Humania TalentMap"
            width={36}
            height={36}
            className="rounded-lg w-8 h-8 md:w-10 md:h-10"
          />
          <div className="hidden sm:block">
            <span className="font-bold text-lg md:text-xl text-primary tracking-tight">Humania</span>
            <span className="font-bold text-lg md:text-xl text-slate-700 tracking-tight ml-1">TalentMap</span>
          </div>
          <span className="sm:hidden font-bold text-base text-primary">Humania</span>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary text-slate-600 transition-colors hidden md:block">
            Masuk
          </Link>
          <Link
            href="/login"
            className="text-xs md:text-sm font-bold btn-primary px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl flex items-center gap-1 md:gap-2"
          >
            <span className="hidden sm:inline">Mulai Sekarang</span>
            <span className="sm:hidden">Mulai</span>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center py-8 md:py-12 lg:py-16 px-4 md:px-6 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs md:text-sm font-medium text-primary">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Platform Assessment Berbasis AI</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Platform Pemetaan Talenta untuk{' '}
                  <span className="text-primary">Rekrutmen & Pengembangan Tim</span>
                </h1>

                <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Evaluasi kandidat dengan modul psikotes komprehensif. Dapatkan skor instan, insight mendalam, dan panduan wawancara oleh AI.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 md:px-6 md:py-3.5 btn-primary rounded-xl text-sm md:text-base font-semibold"
                  >
                    Mulai Assessment <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 md:px-6 md:py-3.5 btn-outline rounded-xl text-sm md:text-base font-semibold"
                  >
                    Pelajari Lebih Lanjut
                  </a>
                </div>
              </div>

              {/* Right Side - Illustration (Desktop Only) */}
              <div className="relative hidden lg:block">
                <div className="animate-[float_6s_ease-in-out_infinite]">
                  <Image
                    src="/hero-illustration.png"
                    alt="Talent Assessment Platform Illustration"
                    width={600}
                    height={500}
                    className="w-full h-auto drop-shadow-2xl"
                    priority
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-primary/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Mobile Optimized */}
        <section id="features" className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-slate-900">Mengapa Memilih Humania TalentMap?</h2>
              <p className="text-slate-600 text-sm md:text-lg">Solusi lengkap untuk keputusan rekrutmen berbasis data.</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {/* Card 1 */}
              <div className="card-elevated p-5 md:p-8 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Multi-Modul Assessment</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Tes Kognitif, Kepribadian (Big Five & DISC), Minat Kerja, dan Sikap dalam satu platform terintegrasi.
                </p>
              </div>

              {/* Card 2 */}
              <div className="card-elevated p-5 md:p-8 group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Brain className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Analisis AI Gemini</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Lebih dari sekadar skor. AI menghasilkan narasi insight dan pertanyaan wawancara yang dipersonalisasi.
                </p>
              </div>

              {/* Card 3 */}
              <div className="card-elevated p-5 md:p-8 group hover:-translate-y-1 transition-all duration-300 sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Laporan Instan</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Visualisasi data yang mudah dipahami dengan skor per dimensi dan kategori langsung setelah assessment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile Optimized */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">Siap Meningkatkan Proses Rekrutmen Anda?</h2>
            <p className="text-blue-100 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
              Bergabung dengan tim HR modern yang menggunakan data dan AI untuk keputusan rekrutmen yang lebih baik.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-primary rounded-xl font-bold text-sm md:text-lg hover:bg-blue-50 transition-colors"
            >
              Coba Gratis Sekarang <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer - Mobile Optimized */}
      <footer className="py-6 md:py-10 border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="Humania TalentMap"
                width={24}
                height={24}
                className="rounded-md w-6 h-6 md:w-8 md:h-8"
              />
              <span className="font-semibold text-sm md:text-base text-slate-700">Humania TalentMap</span>
            </div>
            <p className="text-slate-500 text-xs md:text-sm">&copy; {new Date().getFullYear()} Humania TalentMap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
