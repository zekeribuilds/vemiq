import { CheckIcon, DocumentsIcon, ZapIcon, SparklesIcon, DownloadIcon, EditIcon, ShieldIcon, ClockIcon } from '@/design-system';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background-secondary via-background to-background-tertiary m-0 p-0">
      <Navbar />
      <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 pt-32 sm:pt-32">
        <div className="text-center mb-6 sm:mb-12 animate-fade-in-up px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">Simple, Fair Pricing</h1>
          <p className="text-xs sm:text-sm md:text-lg text-text-secondary max-w-3xl mx-auto">
            No subscriptions. No recurring charges. Only pay for the report pages you generate.
          </p>
        </div>

        {/* How Pricing Works */}
        <div className="card p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 animate-fade-in-up">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-2 sm:mb-4 text-center">How Pricing Works</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary text-center max-w-3xl mx-auto px-2">
            Vemiq helps you document your industrial training for free. When you're ready to generate report content and export your final report, you pay based on the number of pages generated. This means you only pay for what you actually use.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl mx-auto">
          {/* Documentation - Free */}
          <div className="card p-4 sm:p-6 pt-6 sm:pt-8 border-2 border-neutral-200 relative animate-scale-in min-w-[280px] sm:min-w-[300px] max-w-[400px] sm:max-w-[500px] mx-auto" style={{ animationDelay: '0s' }}>
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg bg-neutral-100">
                <ZapIcon className="text-text-muted" size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-text-primary">Documentation</h3>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">₦0</span>
                  <span className="text-text-muted text-[10px] sm:text-xs">/forever</span>
                </div>
              </div>
            </div>

            <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">Capture and organize your training records at no cost.</p>

            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {[
                'Activity logging',
                'Photo uploads',
                'Evidence storage',
                'Report workspace',
                'Institution selection',
                'Progress tracking',
                'Access from anywhere',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center bg-neutral-100">
                    <CheckIcon className="text-text-muted" size={12} />
                  </div>
                  <span className="text-text-secondary text-[10px] sm:text-xs md:text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4">Perfect for documenting your training throughout SWEP or SIWES.</p>

            <Link
              href="/signup"
              className="block w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-center transition-all duration-300 btn-ghost text-xs sm:text-sm md:text-base"
            >
              Start Documenting Free
            </Link>
          </div>

          {/* Report Generation - ₦300/Page */}
          <div className="card p-4 sm:p-6 pt-6 sm:pt-8 border-2 border-primary shadow-2xl shadow-primary/20 scale-105 relative animate-scale-in min-w-[280px] sm:min-w-[300px] max-w-[400px] sm:max-w-[500px] mx-auto" style={{ animationDelay: '0.1s' }}>
            <div className="text-center mb-3 sm:mb-4">
              <div className="inline-block bg-gradient-to-r from-primary to-accent text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold shadow-lg shadow-primary/30">
                Pay Per Page
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg bg-gradient-to-br from-primary to-accent">
                <DocumentsIcon className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-text-primary">Report Generation</h3>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">₦300</span>
                  <span className="text-text-muted text-[10px] sm:text-xs">/page</span>
                </div>
              </div>
            </div>

            <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">Generate professional report content from your documented activities.</p>

            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {[
                'AI-assisted report generation',
                'Institution-ready formatting',
                'Structured report sections',
                'Editable content',
                'Live report preview',
                'PDF export',
                'Download-ready report',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center bg-primary/10">
                    <CheckIcon className="text-primary" size={12} />
                  </div>
                  <span className="text-text-secondary text-[10px] sm:text-xs md:text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4">Pay only for the pages you generate. No monthly subscription required.</p>

            <Link
              href="/signup"
              className="block w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-center transition-all duration-300 btn-primary text-xs sm:text-sm md:text-base"
            >
              Start Generating
            </Link>
          </div>
        </div>

        {/* Typical Report Costs */}
        <div className="card p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 animate-fade-in-up">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-4 sm:mb-6 text-center">Typical Report Costs</h2>
          <div className="max-w-2xl mx-auto overflow-x-auto">
            <table className="w-full text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-text-primary font-semibold">Report Type</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-text-primary font-semibold">Typical Length</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-text-primary font-semibold">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-text-secondary">SWEP Report</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-text-secondary">10–20 Pages</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-text-secondary font-semibold">₦3,000 – ₦6,000</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-text-secondary">SIWES Report</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-text-secondary">20–40 Pages</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-text-secondary font-semibold">₦6,000 – ₦12,000</td>
                </tr>
              </tbody>
            </table>
            <p className="text-text-muted text-[10px] sm:text-xs md:text-sm mt-3 sm:mt-4 text-center px-2">Actual costs depend on the final number of pages generated.</p>
          </div>
        </div>

        {/* Why Pay Per Page */}
        <div className="card p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 animate-fade-in-up">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-4 sm:mb-6 text-center">Why Pay Per Page?</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary text-center max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
            Most students only need to generate one report. A subscription forces you to pay whether you use the platform or not. Vemiq's pricing is designed to be simple:
          </p>
          <ul className="max-w-2xl mx-auto space-y-2 sm:space-y-3">
            {[
              'Document your activities for free',
              'Generate only the pages you need',
              'Pay once',
              'Download your report',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 sm:gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center bg-primary/10">
                  <CheckIcon className="text-primary" size={12} />
                </div>
                <span className="text-text-secondary text-[10px] sm:text-xs md:text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm">No recurring charges. No hidden fees. No long-term commitment.</p>
          </div>
        </div>

        {/* What Happens After Payment */}
        <div className="card p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 animate-fade-in-up">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-4 sm:mb-6 text-center">What Happens After Payment?</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary text-center max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
            Once payment is completed, you can:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { icon: DownloadIcon, text: 'Export your report as a PDF' },
              { icon: DocumentsIcon, text: 'Access your generated report version' },
              { icon: EditIcon, text: 'Continue editing your report' },
              { icon: ClockIcon, text: 'Download your report whenever needed' },
              { icon: ShieldIcon, text: 'Keep your documentation stored in your account' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-primary/20">
                    <Icon className="text-primary" size={16} />
                  </div>
                  <span className="text-text-primary text-[10px] sm:text-xs md:text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="card p-4 sm:p-6 animate-fade-in-up">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mb-3 sm:mb-4 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Do I need to pay before using Vemiq?',
                a: 'No. You can create an account, document your activities, upload evidence, and organize your records for free. Payment is only required when generating report pages and exporting your final report.',
              },
              {
                q: 'Why does Vemiq charge per page?',
                a: 'Industrial training reports vary in length. Charging per page ensures students only pay for the content they actually generate.',
              },
              {
                q: 'Is there a subscription?',
                a: 'No. Vemiq uses a pay-per-page model. You are not charged monthly or annually.',
              },
              {
                q: 'Can I generate only part of my report?',
                a: 'Yes. You can generate specific sections or pages and only pay for the content generated.',
              },
              {
                q: 'What happens if I need to make edits later?',
                a: 'Your report remains editable. You can update content and generate additional pages whenever needed.',
              },
              {
                q: 'Are PDF exports included?',
                a: 'Yes. PDF export is included for paid report generations.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept payments via Paystack, supporting debit cards, credit cards, and bank transfers.',
              },
            ].map((faq, index) => (
              <div 
                key={faq.q} 
                className="border-b border-neutral-200 pb-3 sm:pb-4 last:border-0 last:pb-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-semibold text-text-primary mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm">{faq.q}</h4>
                <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
