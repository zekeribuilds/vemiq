'use client';

import { SearchIcon, ProfileIcon, ExportIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Topbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        
        // Query profiles table for user identity data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setUserName(profileData.full_name || user.email?.split('@')[0] || 'User');
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-6 ml-0 md:ml-64">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <div className="relative hidden sm:block w-full max-w-xs sm:max-w-96">
          <Input
            type="text"
            placeholder="Search reports..."
            leftIcon={<SearchIcon size={16} />}
            fullWidth
          />
        </div>
        <Button variant="ghost" size="sm" className="sm:hidden">
          <SearchIcon size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="sm">
          <SearchIcon size={16} />
        </Button>

        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
            <ProfileIcon className="text-primary-foreground" size={14} />
          </div>
          <div className="hidden sm:block text-xs sm:text-sm">
            <p className="font-medium text-foreground truncate max-w-[100px] sm:max-w-none">{userName}</p>
            <p className="text-muted-foreground truncate max-w-[100px] sm:max-w-none">{userEmail}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            title="Logout"
          >
            <ExportIcon size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
