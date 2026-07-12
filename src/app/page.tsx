'use client';

import Link from 'next/link';
import { DocumentsIcon, SparklesIcon, ZapIcon, ShieldIcon, CheckIcon, StarIcon, UsersIcon, TrendingUpIcon, PlayIcon } from '@/design-system';
import { Card } from '@/design-system/components/Card';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Home() {

  return (
    <main className="min-h-screen bg-background m-0 p-0">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background-secondary via-background to-background-tertiary py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-8 lg:px-16 pt-32 sm:pt-32 md:pt-40 lg:pt-48">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-background-tertiary/50 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-background-tertiary/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h1 className={`${plusJakartaSans.className} text-3xl sm:text-sm md:text-3xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight text-center`}>
              <span className="whitespace-nowrap">Document Your SIWES</span><br />
              <span className="text-2xl sm:text-xs md:text-2xl lg:text-4xl block mt-0" style={{ color: '#8661ff' }}>Generate Your Report</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
              Vemiq helps students capture activities, store evidence, and organize training records throughout their industrial attachment, making report writing a structured process instead of a last-minute rush.
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center justify-center text-sm sm:text-base py-2.5 sm:py-3"
              >
                Start Documenting
              </Link>
              <Link
                href="/features"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-foreground text-sm sm:text-base py-2.5 sm:py-3"
              >
                How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 mt-6 sm:mt-12 text-muted-foreground flex-wrap px-2">
              <div className="flex items-center gap-2">
                <CheckIcon size={14} className="text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Built for SWEP & SIWES Students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={14} className="text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Keep Activities, Photos & Records in One Place</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={14} className="text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm">Generate Institution-Ready Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-8 lg:px-16 bg-background-secondary">
        <div>
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">
              The Problem Students Face
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-text-secondary max-w-2xl mx-auto px-2">
              Industrial training reports shouldn't be a source of stress
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { icon: DocumentsIcon, title: 'Poor Formatting', desc: 'Students struggle with proper academic formatting standards', color: 'error' },
              { icon: ZapIcon, title: 'Last-Minute Stress', desc: 'Procrastination leads to rushed, low-quality submissions', color: 'warning' },
              { icon: ShieldIcon, title: 'Rejected Reports', desc: 'Supervisors reject poorly formatted submissions', color: 'error' },
              { icon: SparklesIcon, title: 'Copying Old Projects', desc: 'Students copy from seniors instead of creating original work', color: 'warning' },
            ].map((item, index) => (
              <Card key={item.title} className="p-3 sm:p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-${item.color}-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-2 sm:mb-4`}>
                  <item.icon className={`text-${item.color}-500`} size={20} />
                </div>
                <h3 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">{item.title}</h3>
                <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-8 lg:px-16 bg-background-secondary">
        <div>
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">
              How Vemiq Solves This
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-text-secondary max-w-2xl mx-auto px-2">
              Everything you need to create professional academic reports
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[
              { title: 'AI-Assisted Writing', desc: 'Transform your weekly logs into professional academic content', icon: SparklesIcon },
              { title: 'Smart Formatting', desc: 'Automatic Times New Roman, 12pt, 1.5 spacing, proper margins', icon: DocumentsIcon },
              { title: 'Real-Time Preview', desc: 'See exactly how your report will look as you write', icon: ShieldIcon },
              { title: 'PDF Export', desc: 'Download print-ready PDFs with one click', icon: ZapIcon },
              { title: 'Weekly Logbook', desc: 'Track activities with images and notes throughout your training', icon: CheckIcon },
              { title: 'Institution Ready', desc: 'Reports formatted to meet university standards', icon: StarIcon },
            ].map((item, index) => (
              <Card key={item.title} className="p-3 sm:p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <item.icon className="text-primary" size={18} />
                </div>
                <h3 className="font-semibold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">{item.title}</h3>
                <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-8 lg:px-16 bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-30 h-30 sm:w-60 sm:h-60 bg-background-tertiary/50 rounded-full blur-2xl animate-float" />
          <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-30 h-30 sm:w-60 sm:h-60 bg-background-tertiary/50 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="text-center relative px-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-3 sm:mb-6">
            Ready to Transform Your Industrial Training Experience?
          </h2>
          <p className="text-text-secondary mb-6 sm:mb-10 text-sm sm:text-base md:text-lg leading-relaxed px-2">
            Join thousands of engineering students who are already using Vemiq
            to create professional reports in minutes.
          </p>
          <div className="flex flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-4 bg-primary text-white rounded-xl sm:rounded-2xl hover:bg-primary/80 transition-all duration-200 font-semibold text-sm sm:text-base md:text-lg hover:shadow-lg hover:shadow-primary/30 active:scale-95 text-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-4 bg-background-tertiary text-white rounded-xl sm:rounded-2xl hover:bg-background-tertiary/50 transition-all duration-200 font-semibold text-sm sm:text-base md:text-lg backdrop-blur-sm text-center border-2 border-white hover:shadow-lg hover:shadow-white/10"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
