import { TargetIcon, LightbulbIcon, UsersIcon, BookOpenIcon, ClockIcon, DocumentsIcon, ZapIcon, TrendingUpIcon } from '@/design-system';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background-secondary via-background to-background-tertiary m-0 p-0">
      <Navbar />
      <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 pt-32 sm:pt-32">
        <div className="text-center mb-6 sm:mb-12 animate-fade-in-up px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">About Vemiq</h1>
          <p className="text-xs sm:text-sm md:text-lg text-text-secondary">
            Built Around How Students Actually Complete SIWES
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              Vemiq is a documentation platform designed to help students capture, organize, and transform their industrial training records into institution-ready reports.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              Most students begin their training with good intentions. They plan to keep detailed records, take photos, update their logbooks regularly, and stay organized throughout the attachment period.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4 font-semibold">
              In reality, life gets busy.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              Activities are forgotten. Photos get lost. Notes become scattered across different apps and notebooks. By the time report submission approaches, many students are forced to reconstruct months of work from memory.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
              Vemiq was created to solve this problem.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mt-3 sm:mt-4">
              Instead of waiting until the end of training to start writing, students can document their activities as they happen, keep evidence in one place, and build a complete record of their industrial experience from day one.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-primary leading-relaxed mt-3 sm:mt-4 font-semibold">
              When it's time to submit, the documentation is already there.
            </p>
          </section>

          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <TargetIcon className="text-white" size={18} />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary">Our Mission</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              To help students document their industrial training with confidence and transform their records into professional, institution-ready reports.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
              We believe industrial training is too important to be reduced to last-minute report writing. Students should be able to focus on learning, gaining practical experience, and developing professional skills while having a reliable system that keeps track of their journey.
            </p>
          </section>

          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-success to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <LightbulbIcon className="text-white" size={18} />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary">Our Vision</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              To become the documentation operating system for students across Africa.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
              We envision a future where students no longer struggle to remember months of activities, search for missing evidence, or spend stressful weeks preparing reports before submission deadlines.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mt-3 sm:mt-4">
              Instead, documentation becomes a continuous process that supports learning, reflection, and professional growth.
            </p>
          </section>

          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mb-3 sm:mb-4">Why Vemiq Exists</h2>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-warning to-orange-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <ClockIcon className="text-white" size={18} />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-text-primary">The SIWES Memory Gap</h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-2">
              Week one is easy to remember.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-2">
              Week six becomes harder.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              By the end of a six-month attachment, accurately recalling everything you've done becomes nearly impossible.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              This challenge affects thousands of students every year.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
              Vemiq bridges this gap by helping students capture activities, photos, observations, and achievements throughout their training period, creating a reliable record that can later be transformed into structured academic documentation.
            </p>
          </section>

          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mb-4 sm:mb-6">What We Believe</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <BookOpenIcon className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1 text-xs sm:text-sm md:text-base">Documentation Should Be Continuous</h3>
                  <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm">Great reports are not written in a weekend. They are built from consistent records collected throughout training.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-success to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <UsersIcon className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1 text-xs sm:text-sm md:text-base">Students Deserve Better Tools</h3>
                  <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm">Students should spend less time worrying about paperwork and more time learning practical skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-warning to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <DocumentsIcon className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1 text-xs sm:text-sm md:text-base">Evidence Matters</h3>
                  <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm">Photos, logs, observations, and records provide context that memory alone cannot preserve.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <ZapIcon className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1 text-xs sm:text-sm md:text-base">Technology Should Simplify Academic Work</h3>
                  <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm">Technology should remove unnecessary friction, not create more complexity.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <UsersIcon className="text-white" size={18} />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary">Who We Build For</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">Vemiq is designed for:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
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
                <div key={item} className="text-center p-2 sm:p-3 bg-background-tertiary rounded-xl hover:bg-background-secondary transition-colors">
                  <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mt-3 sm:mt-4">
              Whether you're documenting a four-month SWEP attachment or a six-month SIWES placement, Vemiq helps you keep everything organized from start to finish.
            </p>
          </section>

          <section className="card p-4 sm:p-6 animate-scale-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUpIcon className="text-white" size={18} />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary">Building the Future of Student Documentation</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              Today, Vemiq helps students manage their industrial training records and generate institution-ready reports.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
              Tomorrow, we aim to become the platform where students capture, organize, and preserve every important part of their practical learning journey.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-primary leading-relaxed font-semibold">
              Because the best reports don't start during submission week.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-text-primary leading-relaxed font-semibold">
              They start on the very first day of training.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
