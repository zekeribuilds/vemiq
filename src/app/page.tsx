'use client';

import Link from 'next/link';
import { DocumentsIcon, SparklesIcon, ZapIcon, ShieldIcon, CheckIcon, StarIcon, UsersIcon, TrendingUpIcon, PlayIcon, ArrowRightIcon } from '@/design-system';
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
    <main className="min-h-screen bg-[#171717]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 px-4 md:px-8 pt-32 md:pt-40">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6C63FF]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C63FF]/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #6C63FF 1px, transparent 1px), linear-gradient(to bottom, #6C63FF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Bottom gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-[#171717] to-[#1F1F1F]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`${plusJakartaSans.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#FFFFFF] mb-6 leading-tight`}>
              Document Your SIWES
              <br />
              <span className="text-[#6C63FF]">Generate Your Report</span>
            </h1>
            
            <p className="text-base md:text-lg text-[#898989] max-w-3xl mx-auto mb-10 leading-relaxed">
              Vemiq helps students capture activities, store evidence, and organize training records throughout their industrial attachment, making report writing a structured process instead of a last-minute rush.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6C63FF] text-[#FFFFFF] rounded-xl hover:bg-[#6C63FF]/90 transition-all duration-200 font-semibold text-base hover:shadow-lg hover:shadow-[#6C63FF]/30 hover:-translate-y-0.5"
              >
                Start Documenting
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1F1F1F] text-[#FFFFFF] rounded-xl border border-[#2A2A2A] hover:border-[#6C63FF]/50 transition-all duration-200 font-semibold text-base hover:-translate-y-0.5"
              >
                <PlayIcon size={18} />
                How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[#898989]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                  <CheckIcon size={12} className="text-[#6C63FF]" />
                </div>
                <span className="text-sm">Built for SWEP & SIWES Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                  <CheckIcon size={12} className="text-[#6C63FF]" />
                </div>
                <span className="text-sm">Keep Activities, Photos & Records in One Place</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                  <CheckIcon size={12} className="text-[#6C63FF]" />
                </div>
                <span className="text-sm">Generate Institution-Ready Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8 bg-[#1F1F1F]">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #6C63FF 1px, transparent 1px), linear-gradient(to bottom, #6C63FF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <span className="text-sm text-red-400 font-medium">The Challenge</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
              The Problem Students Face
            </h2>
            <p className="text-base md:text-lg text-[#898989] max-w-2xl mx-auto">
              Industrial training reports shouldn't be a source of stress
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: DocumentsIcon, title: 'Poor Formatting', desc: 'Students struggle with proper academic formatting standards', color: 'red' },
              { icon: ZapIcon, title: 'Last-Minute Stress', desc: 'Procrastination leads to rushed, low-quality submissions', color: 'orange' },
              { icon: ShieldIcon, title: 'Rejected Reports', desc: 'Supervisors reject poorly formatted submissions', color: 'red' },
              { icon: SparklesIcon, title: 'Copying Old Projects', desc: 'Students copy from seniors instead of creating original work', color: 'orange' },
            ].map((item, index) => (
              <Card key={item.title} className="p-6 bg-[#171717] border border-[#2A2A2A] rounded-2xl hover:border-[#6C63FF]/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color === 'red' ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
                  <item.icon className={item.color === 'red' ? 'text-red-400' : 'text-orange-400'} size={24} />
                </div>
                <h3 className="font-semibold text-[#FFFFFF] mb-2 text-base">{item.title}</h3>
                <p className="text-[#898989] text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#171717] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6C63FF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6C63FF]/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #6C63FF 1px, transparent 1px), linear-gradient(to bottom, #6C63FF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Top gradient blend */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1F1F1F] to-transparent" />
        {/* Bottom gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#1F1F1F]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-full mb-6">
              <span className="text-sm text-[#6C63FF] font-medium">The Solution</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
              How Vemiq Solves This
            </h2>
            <p className="text-base md:text-lg text-[#898989] max-w-2xl mx-auto">
              Everything you need to create professional academic reports
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'AI-Assisted Writing', desc: 'Transform your weekly logs into professional academic content', icon: SparklesIcon },
              { title: 'Smart Formatting', desc: 'Automatic Times New Roman, 12pt, 1.5 spacing, proper margins', icon: DocumentsIcon },
              { title: 'Real-Time Preview', desc: 'See exactly how your report will look as you write', icon: ShieldIcon },
              { title: 'PDF Export', desc: 'Download print-ready PDFs with one click', icon: ZapIcon },
              { title: 'Weekly Logbook', desc: 'Track activities with images and notes throughout your training', icon: CheckIcon },
              { title: 'Institution Ready', desc: 'Reports formatted to meet university standards', icon: StarIcon },
            ].map((item, index) => (
              <Card key={item.title} className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl hover:border-[#6C63FF]/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mb-4">
                  <item.icon className="text-[#6C63FF]" size={24} />
                </div>
                <h3 className="font-semibold text-[#FFFFFF] mb-2 text-base">{item.title}</h3>
                <p className="text-[#898989] text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8 bg-[#1F1F1F]">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C63FF]/10 rounded-full blur-3xl" />
        </div>

        {/* Top gradient blend */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#171717] to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-full mb-6">
            <span className="text-sm text-[#6C63FF] font-medium">Get Started Today</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-6">
            Ready to Transform Your Industrial Training Experience?
          </h2>
          
          <p className="text-base md:text-lg text-[#898989] mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of engineering students who are already using Vemiq to create professional reports in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6C63FF] text-[#FFFFFF] rounded-xl hover:bg-[#6C63FF]/90 transition-all duration-200 font-semibold text-base hover:shadow-lg hover:shadow-[#6C63FF]/30 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#171717] text-[#FFFFFF] rounded-xl border border-[#2A2A2A] hover:border-[#6C63FF]/50 transition-all duration-200 font-semibold text-base hover:-translate-y-0.5"
            >
              View Pricing
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-[#898989]">
            <div className="flex items-center gap-2">
              <UsersIcon size={18} className="text-[#6C63FF]" />
              <span className="text-sm">Trusted by students</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#2A2A2A]" />
            <div className="flex items-center gap-2">
              <StarIcon size={18} className="text-[#6C63FF]" />
              <span className="text-sm">Professional reports</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#2A2A2A]" />
            <div className="flex items-center gap-2">
              <ShieldIcon size={18} className="text-[#6C63FF]" />
              <span className="text-sm">Secure & private</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
