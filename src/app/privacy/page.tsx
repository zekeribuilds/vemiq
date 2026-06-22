import { SparklesIcon } from '@/design-system';
import { Card } from '@/design-system/components/Card';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background-secondary via-background to-background-tertiary m-0 p-0">
      <Navbar />
      <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 pt-32 sm:pt-32">
        <div className="text-center mb-6 sm:mb-12 animate-fade-in-up px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">Privacy Policy</h1>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Last updated: June 2026</p>
        </div>
        
        <Card className="p-4 sm:p-6 md:p-8 prose prose-gray max-w-none animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Introduction</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Welcome to Vemiq. Vemiq ("Vemiq," "we," "our," or "us") is a platform designed to help students document, organize, and generate industrial training records and reports, including SWEP and SIWES documentation.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            This Privacy Policy explains how we collect, use, store, disclose, and protect your information when you access or use our website, mobile applications, services, products, and related features (collectively, the "Services").
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            By using Vemiq, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this Privacy Policy, you should discontinue use of the Services.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Information We Collect</h2>
          
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-text-primary mt-3 sm:mt-4 mb-1 sm:mb-2">Information You Provide Directly</h3>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">When you use Vemiq, we may collect information that you voluntarily provide, including:</p>
          
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Account Information</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Profile picture (if provided)</li>
            <li>Password credentials (encrypted)</li>
            <li>Authentication provider information (e.g., Google Sign-In)</li>
          </ul>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Academic Information</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Institution name</li>
            <li>Faculty</li>
            <li>Department</li>
            <li>Matriculation number</li>
            <li>Academic session</li>
            <li>SWEP details</li>
            <li>SIWES details</li>
            <li>Coordinator information</li>
            <li>Supervisor information</li>
          </ul>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Training Information</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Training organization details</li>
            <li>Department within organization</li>
            <li>Training location</li>
            <li>Start and end dates</li>
            <li>Weekly activities</li>
            <li>Daily records</li>
            <li>Logbook entries</li>
            <li>Project information</li>
          </ul>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Uploaded Content</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Images</li>
            <li>Documents</li>
            <li>PDFs</li>
            <li>Audio recordings</li>
            <li>Notes</li>
            <li>Report drafts</li>
            <li>Generated reports</li>
            <li>Supporting evidence</li>
          </ul>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Communications</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Information you provide when contacting support, submitting feedback, reporting issues, or responding to surveys.</p>

          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-text-primary mt-3 sm:mt-4 mb-1 sm:mb-2">Information Collected Automatically</h3>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">When you access the Services, certain information may be collected automatically.</p>
          
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Device Information</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Device type</li>
            <li>Screen resolution</li>
            <li>Language settings</li>
          </ul>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Usage Information</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>Pages visited</li>
            <li>Features used</li>
            <li>Time spent on the platform</li>
            <li>Click interactions</li>
            <li>Login activity</li>
            <li>Session duration</li>
          </ul>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Technical Information</h4>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li>IP address</li>
            <li>Network information</li>
            <li>Error logs</li>
            <li>Performance data</li>
            <li>Security logs</li>
          </ul>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">AI Processing of Content</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Vemiq uses artificial intelligence and machine learning technologies to assist users in organizing and generating report content. When you use AI-powered features, we may process activity records, logbook entries, uploaded text, uploaded documents, user instructions, and report content.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            This processing is performed solely for the purpose of delivering requested features and improving service functionality. We do not claim ownership of content you submit.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">How We Use Your Information</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">We may use information collected for the following purposes:</p>
          
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Service Delivery</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To create accounts, authenticate users, generate reports, store documentation, and provide platform functionality.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Platform Improvement</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To improve product performance, develop new features, analyze usage patterns, and fix bugs and errors.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Communication</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To send account notifications, deliver support responses, provide service updates, and notify users about policy changes.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Security</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To prevent fraud, detect abuse, monitor unauthorized access, and enforce platform policies.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Legal Compliance</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To comply with applicable laws, respond to lawful requests, and protect legal rights.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Legal Basis for Processing</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Where required under applicable law, we process information based on user consent, contractual necessity, legitimate business interests, and legal obligations.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Ownership of Content</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Users retain ownership of uploaded files, logbook entries, notes, reports, images, and generated content. Vemiq does not acquire ownership rights over user-generated content. You grant Vemiq a limited license to store, process, and display content solely for providing the Services.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Payment Information</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Payments may be processed through third-party payment providers. Vemiq does not store complete payment card information. Payment providers may collect card details, transaction information, and billing information. Such processing is governed by the payment provider's privacy policies.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Data Storage and Retention</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            We retain information only for as long as necessary to provide services, maintain account functionality, comply with legal obligations, resolve disputes, and enforce agreements. Inactive accounts and associated content may be deleted after extended periods of inactivity, subject to operational and legal requirements.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Data Security</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            We implement reasonable administrative, technical, and organizational safeguards designed to protect information. These measures may include encryption in transit, secure authentication, access controls, database security measures, activity monitoring, and regular security reviews.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            However, no internet-based system can be guaranteed to be completely secure. Users acknowledge that information transmission occurs at their own risk.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Sharing of Information</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">We do not sell personal information. We may share information only in the following circumstances:</p>
          
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Service Providers</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">With trusted vendors that help us operate, including cloud infrastructure providers, authentication providers, payment processors, analytics providers, and customer support tools.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Legal Requirements</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">When required by court orders, government requests, regulatory authorities, or applicable laws.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Business Transactions</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">In connection with mergers, acquisitions, asset sales, or corporate restructuring.</p>

          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mt-2 sm:mt-3 mb-1 sm:mb-2">Protection of Rights</h4>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">To prevent fraud, enforce agreements, protect users, and protect Vemiq's rights.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">International Data Transfers</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Your information may be processed or stored in countries outside your country of residence. Where such transfers occur, we will take reasonable steps to ensure appropriate safeguards are implemented.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Your Rights</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Depending on applicable law, you may have rights to:</p>
          <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm md:text-base text-text-secondary space-y-1">
            <li><strong>Access:</strong> Request access to your information.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information.</li>
            <li><strong>Deletion:</strong> Request deletion of your information.</li>
            <li><strong>Restriction:</strong> Request limited processing of your information.</li>
            <li><strong>Portability:</strong> Request a copy of your information.</li>
            <li><strong>Objection:</strong> Object to certain processing activities.</li>
          </ul>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">Requests may be subject to identity verification and legal limitations.</p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Children's Privacy</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Vemiq is intended for students and educational users. We do not knowingly collect personal information from children under the age required by applicable law without appropriate authorization. If we become aware that such information has been collected improperly, we may delete it.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Cookies and Similar Technologies</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Vemiq may use cookies and similar technologies to maintain login sessions, improve user experience, analyze platform performance, remember preferences, and enhance security. Users may modify browser settings to manage cookie preferences. Some platform features may not function correctly if cookies are disabled.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">User Responsibilities</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Users are responsible for maintaining account security, protecting login credentials, ensuring uploaded content is lawful, and avoiding unauthorized sharing of sensitive information. Users should not upload confidential information unless necessary for their use of the Services.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Third-Party Services</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            Vemiq may contain links to third-party websites or services. We are not responsible for the privacy practices of third parties. Users should review applicable third-party policies independently.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Data Breach Notifications</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            If a security incident results in unauthorized access to personal information and notification is required by law, Vemiq will take reasonable steps to notify affected users and applicable authorities as required.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Changes to This Privacy Policy</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            We may update this Privacy Policy periodically. Changes become effective when posted on this page. Continued use of the Services after updates constitutes acceptance of the revised Privacy Policy.
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mt-4 sm:mt-6 mb-2 sm:mb-3">Contact Information</h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary">
            For questions, concerns, or privacy-related requests, contact:
          </p>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary font-semibold mt-2">
            <strong>Vemiq Privacy Team</strong><br />
            Email: <a href="mailto:privacy@vemiq.com" className="text-primary hover:underline">privacy@vemiq.com</a><br />
            Support Email: <a href="mailto:support@vemiq.com" className="text-primary hover:underline">support@vemiq.com</a><br />
            Website: vemiq.com
          </p>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
