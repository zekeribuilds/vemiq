import { DocumentsIcon, SparklesIcon, ZapIcon, ShieldIcon, ClockIcon, DownloadIcon, CameraIcon, LayoutIcon, TrendingUpIcon, SuccessIcon, XCircleIcon } from '@/design-system';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function FeaturesPage() {
  const features = [
    {
      icon: ZapIcon,
      title: 'Activity Logging',
      subtitle: 'Record Your Work As It Happens',
      description: 'Keep track of daily and weekly activities throughout your SWEP or SIWES placement. Instead of trying to remember months of work later, build your documentation gradually while the details are still fresh.',
      details: [
        'Daily and weekly activity records',
        'Work descriptions and observations',
        'Organized training timeline',
        'Progress tracking throughout your attachment',
      ],
    },
    {
      icon: CameraIcon,
      title: 'Photo & Evidence Storage',
      subtitle: 'Keep Every Important Record in One Place',
      description: 'Training documentation is more than written notes. Store photos, screenshots, diagrams, documents, and other supporting evidence alongside your activity records. When report submission approaches, everything is already organized and easy to find.',
      details: [
        'Photo uploads',
        'Evidence management',
        'Secure cloud storage',
        'Organized activity attachments',
      ],
    },
    {
      icon: SparklesIcon,
      title: 'Smart Documentation Assistant',
      subtitle: 'Turn Raw Notes Into Professional Documentation',
      description: 'Convert rough activity descriptions into clear, structured academic content suitable for industrial training reports. Vemiq helps refine your documentation while preserving the details of your actual experience.',
      details: [
        'Structured writing assistance',
        'Professional report language',
        'Academic formatting support',
        'Context-aware content generation',
      ],
    },
    {
      icon: DocumentsIcon,
      title: 'Institution-Ready Report Generation',
      subtitle: 'Generate Reports From Your Existing Documentation',
      description: 'Your report is built from the activities, records, and evidence you\'ve collected throughout your training. No need to start from a blank page. Generate structured report sections based on the work you\'ve already documented.',
      details: [
        'Chapter generation',
        'Section-by-section workflow',
        'Report structure guidance',
        'Editable generated content',
      ],
    },
    {
      icon: LayoutIcon,
      title: 'Institution-Compliant Formatting',
      subtitle: 'Meet Academic Requirements Without Manual Formatting',
      description: 'Formatting issues are one of the most common reasons students receive corrections. Vemiq automatically structures reports according to academic standards, helping reduce formatting-related stress.',
      details: [
        'Proper report structure',
        'Academic document layouts',
        'Consistent formatting',
        'Submission-ready presentation',
      ],
    },
    {
      icon: ClockIcon,
      title: 'Live Report Preview',
      subtitle: 'See Your Report Take Shape in Real Time',
      description: 'View your report as it is generated and edited. Know exactly how your final document will look before exporting.',
      details: [
        'Real-time report preview',
        'Page-by-page viewing',
        'A4 document layout',
        'Instant content updates',
      ],
    },
    {
      icon: DownloadIcon,
      title: 'PDF Export',
      subtitle: 'Download a Submission-Ready Report',
      description: 'Export your completed report as a professionally formatted PDF ready for printing or digital submission.',
      details: [
        'High-quality PDF export',
        'Preserved formatting',
        'Download-ready files',
        'Easy sharing and printing',
      ],
    },
    {
      icon: TrendingUpIcon,
      title: 'Progress Tracking',
      subtitle: 'Never Lose Sight of What You\'ve Documented',
      description: 'Monitor your progress throughout the training period and identify missing records before submission deadlines arrive.',
      details: [
        'Documentation progress tracking',
        'Activity completion monitoring',
        'Report readiness indicators',
        'Organized training history',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background-secondary via-background to-background-tertiary m-0 p-0">
      <Navbar />
      <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 pt-32 sm:pt-32">
        <div className="text-center mb-6 sm:mb-12 animate-fade-in-up px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-4">Everything You Need to Document Your Industrial Training</h1>
          <p className="text-xs sm:text-sm md:text-lg text-text-secondary max-w-3xl mx-auto">
            From your first day on site to your final report submission, Vemiq helps you keep track of your activities, organize supporting evidence, and generate institution-ready documentation from the records you've already collected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card p-4 sm:p-6 md:p-8 group hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-accent rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <feature.icon className="text-white" size={18} />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-primary mb-1 sm:mb-2">{feature.title}</h3>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-primary mb-2 sm:mb-4">{feature.subtitle}</h4>
              <p className="text-xs sm:text-sm md:text-base text-text-secondary mb-3 sm:mb-6">{feature.description}</p>
              <ul className="space-y-2 sm:space-y-3">
                {feature.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-primary to-accent rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Why Students Use Vemiq */}
        <div className="card p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-4 sm:mb-8 text-center">Why Students Use Vemiq</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-text-primary mb-2 sm:mb-4 flex items-center gap-2">
                <XCircleIcon className="text-red-500" size={14} />
                Before Vemiq
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Activities scattered across notebooks and phones',
                  'Missing photos and evidence',
                  'Last-minute report writing',
                  'Formatting frustrations',
                  'Difficulty remembering completed work',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-text-primary mb-2 sm:mb-4 flex items-center gap-2">
                <SuccessIcon className="text-green-500" size={14} />
                With Vemiq
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Activities documented as they happen',
                  'Evidence stored in one place',
                  'Organized training records',
                  'Structured report generation',
                  'Faster, less stressful submissions',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Built for SWEP & SIWES Students */}
        <div className="card p-4 sm:p-6 md:p-8 text-center animate-fade-in-up">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-2 sm:mb-4">
            Built for SWEP & SIWES Students
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
            Whether you're documenting a four-month SWEP placement or a six-month SIWES attachment, Vemiq helps you keep accurate records throughout your training and transform them into institution-ready reports when it's time to submit.
          </p>
          <Link
            href="/signup"
            className="btn-primary inline-flex items-center text-sm sm:text-base"
          >
            Start Documenting Free
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
