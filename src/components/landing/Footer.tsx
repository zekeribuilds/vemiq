'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-8 lg:px-16 bg-card text-foreground">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <img src="/images/logo.svg" alt="Vemiq" className="w-8 h-8 sm:w-10 sm:h-10" />
              <h3 className="font-bold text-lg sm:text-2xl text-foreground">vemiq</h3>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              AI-powered academic operating system for engineering students.
              Create professional reports in minutes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-lg text-foreground">Product</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-lg text-foreground">Legal</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-lg text-foreground">Connect</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li><a href="https://twitter.com/vemiq" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://linkedin.com/company/vemiq" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/vemiq" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 sm:pt-8 flex flex-row items-center justify-between gap-4 text-xs sm:text-sm border-border text-muted-foreground">
          <div>© Vemiq Inc</div>
        </div>
      </div>
    </footer>
  );
}
