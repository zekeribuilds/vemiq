import { CheckIcon, DocumentsIcon, ZapIcon, SparklesIcon, DownloadIcon, EditIcon, ShieldIcon, ClockIcon } from '@/design-system';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#171717]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 pt-32 md:pt-40">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-[#FFFFFF] mb-2">Simple, Fair Pricing</h1>
          <p className="text-sm text-[#898989] max-w-3xl mx-auto">
            No subscriptions. No recurring charges. Only pay for the report pages you generate.
          </p>
        </div>

        {/* How Pricing Works */}
        <div className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl mb-6">
          <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 text-center">How Pricing Works</h2>
          <p className="text-sm text-[#898989] text-center max-w-3xl mx-auto">
            Vemiq helps you document your industrial training for free. When you're ready to generate report content and export your final report, you pay based on the number of pages generated.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
          {/* Documentation - Free */}
          <div className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl flex items-center justify-center">
                <ZapIcon className="text-[#898989]" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FFFFFF]">Documentation</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-[#FFFFFF]">₦0</span>
                  <span className="text-xs text-[#898989]">/forever</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#898989] mb-4">Capture and organize your training records at no cost.</p>

            <ul className="space-y-2 mb-6">
              {[
                'Activity logging',
                'Photo uploads',
                'Evidence storage',
                'Report workspace',
                'Institution selection',
                'Progress tracking',
                'Access from anywhere',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#2A2A2A]">
                    <CheckIcon className="text-[#898989]" size={12} />
                  </div>
                  <span className="text-sm text-[#898989]">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block w-full py-3 rounded-lg text-center border border-[#2A2A2A] text-[#898989] hover:text-[#FFFFFF] hover:border-[#3A3A3A] transition-colors text-sm font-medium"
            >
              Start Documenting Free
            </Link>
          </div>

          {/* Report Generation - ₦300/Page */}
          <div className="p-6 bg-[#1F1F1F] border-2 border-[#6C63FF] rounded-2xl relative">
            <div className="text-center mb-4">
              <div className="inline-block bg-[#6C63FF] text-[#FFFFFF] px-4 py-1.5 rounded-full text-xs font-semibold">
                Pay Per Page
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center">
                <DocumentsIcon className="text-[#6C63FF]" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FFFFFF]">Report Generation</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-[#FFFFFF]">₦300</span>
                  <span className="text-xs text-[#898989]">/page</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#898989] mb-4">Generate professional report content from your documented activities.</p>

            <ul className="space-y-2 mb-6">
              {[
                'AI-assisted report generation',
                'Institution-ready formatting',
                'Structured report sections',
                'Editable content',
                'Live report preview',
                'PDF export',
                'Download-ready report',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#6C63FF]/20">
                    <CheckIcon className="text-[#6C63FF]" size={12} />
                  </div>
                  <span className="text-sm text-[#898989]">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-[#898989] mb-4">Pay only for the pages you generate. No monthly subscription required.</p>

            <Link
              href="/signup"
              className="block w-full py-3 rounded-lg text-center bg-[#6C63FF] hover:bg-[#5A52D5] text-[#FFFFFF] transition-colors text-sm font-medium"
            >
              Start Generating
            </Link>
          </div>
        </div>

        {/* Typical Report Costs */}
        <div className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl mb-6">
          <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4 text-center">Typical Report Costs</h2>
          <div className="max-w-2xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left py-3 px-4 text-[#FFFFFF] font-semibold">Report Type</th>
                  <th className="text-left py-3 px-4 text-[#FFFFFF] font-semibold">Typical Length</th>
                  <th className="text-left py-3 px-4 text-[#FFFFFF] font-semibold">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#2A2A2A]">
                  <td className="py-3 px-4 text-[#898989]">SWEP Report</td>
                  <td className="py-3 px-4 text-[#898989]">10–20 Pages</td>
                  <td className="py-3 px-4 text-[#898989] font-semibold">₦3,000 – ₦6,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#898989]">SIWES Report</td>
                  <td className="py-3 px-4 text-[#898989]">20–40 Pages</td>
                  <td className="py-3 px-4 text-[#898989] font-semibold">₦6,000 – ₦12,000</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[#898989] mt-4 text-center">Actual costs depend on the final number of pages generated.</p>
          </div>
        </div>

        {/* Why Pay Per Page */}
        <div className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl mb-6">
          <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4 text-center">Why Pay Per Page?</h2>
          <p className="text-sm text-[#898989] text-center max-w-3xl mx-auto mb-4">
            Most students only need to generate one report. A subscription forces you to pay whether you use the platform or not. Vemiq's pricing is designed to be simple:
          </p>
          <ul className="max-w-2xl mx-auto space-y-2">
            {[
              'Document your activities for free',
              'Generate only the pages you need',
              'Pay once',
              'Download your report',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#6C63FF]/20">
                  <CheckIcon className="text-[#6C63FF]" size={12} />
                </div>
                <span className="text-sm text-[#898989]">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center">
            <p className="text-xs text-[#898989]">No recurring charges. No hidden fees. No long-term commitment.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
          <h3 className="text-base font-semibold text-[#FFFFFF] mb-4 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4 max-w-3xl mx-auto">
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
                className="border-b border-[#2A2A2A] pb-4 last:border-0 last:pb-0"
              >
                <h4 className="font-semibold text-[#FFFFFF] mb-2 text-sm">{faq.q}</h4>
                <p className="text-sm text-[#898989]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
