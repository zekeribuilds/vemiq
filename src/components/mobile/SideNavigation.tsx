'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { VemiqIcon } from '@/components/VemiqIcon';

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
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

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const navItems = [
    { path: '/home', label: 'Home', name: 'dashboard' },
    { path: '/evidence', label: 'Evidence', name: 'activity' },
    { path: '/reports', label: 'Reports', name: 'reports' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#1F1F1F] border-r border-[#2A2A2A] z-50 transform transition-transform duration-300 ease-in-out rounded-r-2xl md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <img src="/images/logo.svg" alt="Vemiq" className="w-8 h-8" />
              <span className="text-lg font-bold text-[#FFFFFF]">Vemiq</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#898989] hover:text-[#FFFFFF] transition-colors"
            >
              <VemiqIcon category="action" name="close" size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#6C63FF] text-[#FFFFFF]'
                      : 'text-[#898989] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]'
                  }`}
                >
                  <VemiqIcon category="nav" name={item.name} size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-[#2A2A2A]">
            <button
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
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
        </div>
      </div>
    </>
  );
}
