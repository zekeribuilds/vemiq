'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { VemiqIcon } from '@/components/VemiqIcon';

export function DesktopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name || 'User');
          setUserAvatar(profile.avatar_url || '');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const navItems = [
    { path: '/home', label: 'Home', name: 'dashboard' },
    { path: '/evidence', label: 'Evidence', name: 'activity' },
    { path: '/reports', label: 'Reports', name: 'reports' },
  ];

  const currentPageLabel = navItems.find(item => item.path === pathname)?.label || 'Vemiq';

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-30 hidden md:flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#2A2A2A] rounded-full">
        <img src="/images/logo.svg" alt="Vemiq" className="w-8 h-8" />
        <span className="text-lg font-bold text-[#FFFFFF]">Vemiq</span>
      </div>

      {/* Navigation - Grouped with shared background */}
      <nav className="flex items-center gap-1 px-2 py-2 bg-[#2A2A2A] rounded-full">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-[#6C63FF] text-[#FFFFFF]'
                  : 'text-[#898989] hover:bg-[#3A3A3A] hover:text-[#FFFFFF]'
              }`}
            >
              <VemiqIcon category="nav" name={item.name} size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Section - Profile button with rounded background */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleNavigation('/profile')}
          className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-full transition-colors"
        >
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center">
              <span className="text-[#FFFFFF] font-medium text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-medium text-[#FFFFFF]">{userName}</span>
        </button>
      </div>
    </header>
  );
}
