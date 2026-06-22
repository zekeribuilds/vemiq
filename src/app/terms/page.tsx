import { SparklesIcon } from '@/design-system';
import { Card } from '@/design-system/components/Card';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background-secondary via-background to-background-tertiary m-0 p-0">
      <Navbar />
      <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 pt-32 sm:pt-32">
        <div className="text-center mb-6 sm:mb-12 animate-fade-in-up px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">Terms of Service</h1>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Last updated: June 2026</p>
        </div>
        
        <Card className="p-4 sm:p-6 md:p-8 prose prose-gray max-w-none animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">1. Introduction</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Welcome to Vemiq. These Terms of Service ("Terms") govern your access to and use of Vemiq's website, applications, software, products, features, and services (collectively, the "Services").
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Throughout these Terms, "Vemiq," "we," "our," and "us" refer to Vemiq and its operators.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            By creating an account, accessing the Services, or using any part of the platform, you agree to be legally bound by these Terms. If you do not agree with these Terms, you must not use the Services.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">2. Eligibility</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To use Vemiq, you must:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Be at least 13 years old or the minimum age required under applicable law.</li>
            <li>Have the legal capacity to enter into a binding agreement.</li>
            <li>Use the Services in compliance with all applicable laws and regulations.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            If you are using Vemiq on behalf of an institution, organization, or business, you represent that you have authority to bind that entity to these Terms.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">3. Description of Services</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Vemiq provides tools designed to help users:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Document industrial training activities.</li>
            <li>Organize records and evidence.</li>
            <li>Store training-related information.</li>
            <li>Generate academic report content.</li>
            <li>Export formatted reports.</li>
            <li>Manage SWEP and SIWES documentation.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary font-semibold mt-2 sm:mt-3">Vemiq is a documentation and productivity platform.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary font-semibold">Vemiq is not:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>A university</li>
            <li>An educational institution</li>
            <li>A certification authority</li>
            <li>A grading service</li>
            <li>A legal advisor</li>
            <li>A professional accreditation body</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Use of Vemiq does not guarantee academic success, report approval, course credit, graduation, or acceptance by any institution.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">4. User Accounts</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To access certain features, users may be required to create an account.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You agree to:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Provide accurate information.</li>
            <li>Keep account details current.</li>
            <li>Maintain the security of your credentials.</li>
            <li>Notify us of unauthorized account access.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You are responsible for all activities conducted through your account.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">5. User Content</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            "User Content" includes any information uploaded, submitted, generated, stored, or shared through the Services, including text, images, audio recordings, logbook entries, documents, reports, feedback, and messages.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You retain ownership of User Content.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            However, by uploading content, you grant Vemiq a limited, non-exclusive, worldwide license to store content, process content, display content to you, generate requested outputs, and operate and improve the Services.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">This license exists solely to provide the Services.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">6. User Responsibilities</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You are solely responsible for:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>The accuracy of information submitted.</li>
            <li>Verifying generated content.</li>
            <li>Reviewing exported reports.</li>
            <li>Ensuring compliance with institutional requirements.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You agree not to upload content that:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Violates laws.</li>
            <li>Infringes intellectual property rights.</li>
            <li>Contains malware.</li>
            <li>Contains harmful code.</li>
            <li>Invades privacy rights.</li>
            <li>Contains fraudulent information.</li>
          </ul>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">7. Academic Integrity</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Users are responsible for ensuring that any content submitted through Vemiq complies with their institution's academic policies.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Vemiq does not guarantee that generated content will satisfy:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Academic integrity requirements.</li>
            <li>Departmental requirements.</li>
            <li>Institutional standards.</li>
            <li>Supervisor expectations.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Users must independently review all generated content before submission.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">8. Artificial Intelligence Features</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Certain features utilize artificial intelligence technologies.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">AI-generated outputs may:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Contain inaccuracies.</li>
            <li>Omit important information.</li>
            <li>Produce unexpected results.</li>
            <li>Require editing or correction.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Users acknowledge that:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>AI outputs are generated automatically.</li>
            <li>Outputs should be reviewed carefully.</li>
            <li>Vemiq does not warrant factual accuracy.</li>
            <li>Users remain responsible for final submissions.</li>
          </ul>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">9. No Academic Guarantee</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Vemiq does not guarantee:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Report approval.</li>
            <li>Higher grades.</li>
            <li>Positive evaluations.</li>
            <li>Supervisor acceptance.</li>
            <li>Departmental acceptance.</li>
            <li>SIWES approval.</li>
            <li>SWEP approval.</li>
            <li>Graduation outcomes.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Academic decisions remain solely under the authority of educational institutions.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">10. Payments</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Certain features may require payment.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">By making a purchase, you agree to:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Provide valid payment information.</li>
            <li>Pay all applicable fees.</li>
            <li>Comply with payment processor requirements.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Payments may be processed through third-party providers.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Vemiq is not responsible for errors caused by payment providers.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">11. Pricing</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Prices may change at any time.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Price changes will not affect purchases already completed before the change takes effect.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Current pricing is displayed within the platform.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">12. Refund Policy</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Unless required by law:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Payments for generated content may be non-refundable.</li>
            <li>Payments for completed services may be non-refundable.</li>
            <li>Refund requests may be evaluated on a case-by-case basis.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Refunds may be denied where:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Services have already been delivered.</li>
            <li>Content has already been generated.</li>
            <li>Abuse is suspected.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Nothing in these Terms limits any rights that cannot legally be excluded under applicable consumer protection laws.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">13. Intellectual Property</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">All rights, title, and interest in the Services remain the property of Vemiq and its licensors.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">This includes:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Software</li>
            <li>Branding</li>
            <li>Logos</li>
            <li>Designs</li>
            <li>User interface elements</li>
            <li>Platform architecture</li>
            <li>Documentation</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">These rights are protected by intellectual property laws.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">14. Restrictions</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You may not:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Reverse engineer the platform.</li>
            <li>Copy platform features for competing services.</li>
            <li>Attempt unauthorized access.</li>
            <li>Circumvent security measures.</li>
            <li>Interfere with platform operation.</li>
            <li>Use automated scraping tools.</li>
            <li>Exploit vulnerabilities.</li>
          </ul>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">15. Service Availability</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">We strive to maintain reliable access.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">However, Vemiq does not guarantee:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Continuous availability.</li>
            <li>Error-free operation.</li>
            <li>Uninterrupted access.</li>
            <li>Permanent storage of data.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">The Services may be modified, suspended, or discontinued at any time.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">16. Data Loss Disclaimer</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">While we implement reasonable safeguards, users acknowledge that:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Data loss may occur.</li>
            <li>Technical failures may occur.</li>
            <li>System outages may occur.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Users are encouraged to maintain independent copies of important records.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Vemiq shall not be liable for losses arising from data loss beyond obligations imposed by applicable law.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">17. Third-Party Services</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">The Services may integrate with third-party providers, including:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Authentication services</li>
            <li>Payment processors</li>
            <li>Cloud storage providers</li>
            <li>Analytics providers</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Vemiq is not responsible for the actions, policies, or availability of third-party services.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">18. Suspension and Termination</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">We reserve the right to suspend or terminate access where:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>These Terms are violated.</li>
            <li>Fraud is suspected.</li>
            <li>Abuse is detected.</li>
            <li>Security risks arise.</li>
            <li>Legal obligations require action.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Termination may occur without prior notice where necessary.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">19. Disclaimer of Warranties</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To the maximum extent permitted by law, the Services are provided "As Is" and "As Available" without warranties of any kind.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">We disclaim all warranties, including:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy</li>
            <li>Reliability</li>
            <li>Availability</li>
          </ul>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">20. Limitation of Liability</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To the fullest extent permitted by law, Vemiq and its affiliates shall not be liable for:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Lost profits</li>
            <li>Lost opportunities</li>
            <li>Academic penalties</li>
            <li>Grade reductions</li>
            <li>Data loss</li>
            <li>Service interruptions</li>
            <li>Indirect damages</li>
            <li>Incidental damages</li>
            <li>Consequential damages</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Where liability cannot be excluded by law, liability shall be limited to the amount paid by the user to Vemiq during the twelve months preceding the claim.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">21. Indemnification</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">You agree to defend, indemnify, and hold harmless Vemiq, its officers, employees, affiliates, and partners from claims arising from:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Your use of the Services.</li>
            <li>Your content.</li>
            <li>Your violations of these Terms.</li>
            <li>Violations of third-party rights.</li>
          </ul>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">22. Governing Law</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Any disputes shall be subject to the jurisdiction of competent courts located within Nigeria unless otherwise required by applicable law.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">23. Changes to These Terms</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">We may modify these Terms at any time.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Updated versions will be posted on the platform.</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Continued use of the Services after changes become effective constitutes acceptance of the revised Terms.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">24. Severability</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            If any provision of these Terms is determined to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">25. Entire Agreement</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            These Terms, together with our Privacy Policy and any additional policies referenced herein, constitute the entire agreement between you and Vemiq regarding the Services.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">26. Contact Information</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">For legal inquiries regarding these Terms:</p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary font-semibold mt-2">
            <strong>Vemiq Legal Team</strong><br />
            Email: <a href="mailto:legal@vemiq.com" className="text-primary hover:underline">legal@vemiq.com</a><br />
            Support: <a href="mailto:support@vemiq.com" className="text-primary hover:underline">support@vemiq.com</a><br />
            Website: vemiq.com
          </p>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
