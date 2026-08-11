import { TargetIcon, LightbulbIcon, UsersIcon, BookOpenIcon, ClockIcon, DocumentsIcon, ZapIcon, TrendingUpIcon } from '@/design-system';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#171717]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 pt-32 md:pt-40">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-[#FFFFFF] mb-2">About Vemiq</h1>
          <p className="text-sm text-[#898989]">
            Built Around How Students Actually Complete SIWES
          </p>
        </div>

        <div className="space-y-6">
          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              Vemiq is a documentation platform designed to help students capture, organize, and transform their industrial training records into institution-ready reports.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              Most students begin their training with good intentions. They plan to keep detailed records, take photos, update their logbooks regularly, and stay organized throughout the attachment period.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-4 font-semibold">
              In reality, life gets busy.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              Activities are forgotten. Photos get lost. Notes become scattered across different apps and notebooks. By the time report submission approaches, many students are forced to reconstruct months of work from memory.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed">
              Vemiq was created to solve this problem.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mt-4">
              Instead of waiting until the end of training to start writing, students can document their activities as they happen, keep evidence in one place, and build a complete record of their industrial experience from day one.
            </p>
            <p className="text-sm text-[#FFFFFF] leading-relaxed mt-4 font-semibold">
              When it's time to submit, the documentation is already there.
            </p>
          </section>

          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TargetIcon className="text-[#6C63FF]" size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#FFFFFF]">Our Mission</h2>
            </div>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              To help students document their industrial training with confidence and transform their records into professional, institution-ready reports.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed">
              We believe industrial training is too important to be reduced to last-minute report writing. Students should be able to focus on learning, gaining practical experience, and developing professional skills while having a reliable system that keeps track of their journey.
            </p>
          </section>

          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <LightbulbIcon className="text-green-500" size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#FFFFFF]">Our Vision</h2>
            </div>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              To become the documentation operating system for students across Africa.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed">
              We envision a future where students no longer struggle to remember months of activities, search for missing evidence, or spend stressful weeks preparing reports before submission deadlines.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mt-4">
              Instead, documentation becomes a continuous process that supports learning, reflection, and professional growth.
            </p>
          </section>

          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <h2 className="text-base font-semibold text-[#FFFFFF] mb-4">Why Vemiq Exists</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <ClockIcon className="text-orange-500" size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#FFFFFF]">The SIWES Memory Gap</h3>
            </div>
            <p className="text-sm text-[#898989] leading-relaxed mb-2">
              Week one is easy to remember.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-2">
              Week six becomes harder.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              By the end of a six-month attachment, accurately recalling everything you've done becomes nearly impossible.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              This challenge affects thousands of students every year.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed">
              Vemiq bridges this gap by helping students capture activities, photos, observations, and achievements throughout their training period, creating a reliable record that can later be transformed into structured academic documentation.
            </p>
          </section>

          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <h2 className="text-base font-semibold text-[#FFFFFF] mb-4">What We Believe</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="text-[#6C63FF]" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFFFFF] mb-1 text-sm">Documentation Should Be Continuous</h3>
                  <p className="text-[#898989] text-xs">Great reports are not written in a weekend. They are built from consistent records collected throughout training.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="text-green-500" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFFFFF] mb-1 text-sm">Students Deserve Better Tools</h3>
                  <p className="text-[#898989] text-xs">Students should spend less time worrying about paperwork and more time learning practical skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentsIcon className="text-orange-500" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFFFFF] mb-1 text-sm">Evidence Matters</h3>
                  <p className="text-[#898989] text-xs">Photos, logs, observations, and records provide context that memory alone cannot preserve.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ZapIcon className="text-purple-500" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFFFFF] mb-1 text-sm">Technology Should Simplify Academic Work</h3>
                  <p className="text-[#898989] text-xs">Technology should remove unnecessary friction, not create more complexity.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <UsersIcon className="text-purple-500" size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#FFFFFF]">Who We Build For</h2>
            </div>
            <p className="text-sm text-[#898989] mb-4">Vemiq is designed for:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Engineering Students',
                'Science Students',
                'Technology Students',
                'Polytechnic Students',
                'University Undergraduates',
                'SWEP Participants',
                'SIWES Participants',
                'Industrial Training Students',
              ].map((item) => (
                <div key={item} className="text-center p-3 bg-[#171717] rounded-lg">
                  <p className="text-[#898989] text-xs font-medium">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#898989] mt-4">
              Whether you're documenting a four-month SWEP attachment or a six-month SIWES placement, Vemiq helps you keep everything organized from start to finish.
            </p>
          </section>

          <section className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUpIcon className="text-[#6C63FF]" size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#FFFFFF]">Building the Future of Student Documentation</h2>
            </div>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              Today, Vemiq helps students manage their industrial training records and generate institution-ready reports.
            </p>
            <p className="text-sm text-[#898989] leading-relaxed mb-4">
              Tomorrow, we aim to become the platform where students capture, organize, and preserve every important part of their practical learning journey.
            </p>
            <p className="text-sm text-[#FFFFFF] leading-relaxed font-semibold">
              Because the best reports don't start during submission week.
            </p>
            <p className="text-sm text-[#FFFFFF] leading-relaxed font-semibold">
              They start on the very first day of training.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
