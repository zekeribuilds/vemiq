'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-4 md:px-8 bg-[#171717] border-t border-[#2A2A2A]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.svg" alt="Vemiq" className="w-8 h-8" />
              <h3 className="font-semibold text-lg text-[#FFFFFF]">Vemiq</h3>
            </div>
            <p className="text-sm text-[#898989] leading-relaxed">
              AI-powered academic operating system for engineering students.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-[#FFFFFF] uppercase tracking-wide">Product</h4>
            <ul className="space-y-2 text-sm text-[#898989]">
              <li><Link href="/features" className="hover:text-[#FFFFFF] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[#FFFFFF] transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-[#FFFFFF] transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-[#FFFFFF] uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-[#898989]">
              <li><Link href="/privacy" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-[#FFFFFF] uppercase tracking-wide">Connect</h4>
            <ul className="space-y-2 text-sm text-[#898989]">
              <li><a href="https://twitter.com/vemiq" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFFFFF] transition-colors">Twitter</a></li>
              <li><a href="https://linkedin.com/company/vemiq" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFFFFF] transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/vemiq" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFFFFF] transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] pt-6 flex items-center justify-between text-xs text-[#898989]">
          <div>© Vemiq Corp</div>
        </div>
      </div>
    </footer>
  );
}
