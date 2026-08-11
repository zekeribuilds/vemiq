'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Skeleton, AvatarSkeleton, ButtonSkeleton } from '@/design-system/components/Skeleton';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        setUser(userData.user);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          institution: editedProfile.institution,
          department: editedProfile.department,
          level: editedProfile.level,
          matric_number: editedProfile.matric_number,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      setEditedProfile(null);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Profile" />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {isLoading ? (
          <>
            {/* Profile Header Skeleton */}
            <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
              <div className="flex flex-col items-center gap-6">
                <AvatarSkeleton />
                <div className="text-center space-y-3">
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-5 w-32 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
              </div>
            </Card>

            {/* Student Details Skeleton */}
            <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
              <Skeleton className="h-7 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between items-start pb-4 border-b border-[#2A2A2A] last:border-0">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              <ButtonSkeleton />
              <ButtonSkeleton />
              <ButtonSkeleton />
            </div>
          </>
        ) : profile && user ? (
          <>
            {/* Profile Header Card */}
            <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#2A2A2A]"
                    />
                  ) : (
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8B85FF] flex items-center justify-center border-4 border-[#2A2A2A]">
                      <span className="text-[#FFFFFF] font-bold text-4xl md:text-5xl">
                        {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#22C55E] rounded-full border-3 border-[#1F1F1F]" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-2">{profile.full_name}</h2>
                  <p className="text-base md:text-lg text-[#898989] mb-1">{profile.institution}</p>
                  <p className="text-sm text-[#898989]">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <span className="px-4 py-1.5 bg-[#6C63FF]/20 text-[#6C63FF] rounded-full text-sm font-medium border border-[#6C63FF]/30">
                      {profile.level}
                    </span>
                    <span className="px-4 py-1.5 bg-[#2A2A2A] text-[#898989] rounded-full text-sm border border-[#3A3A3A]">
                      {profile.department}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Student Details Card */}
            <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#FFFFFF]">Student Information</h3>
                {!isEditing && (
                  <Button
                    variant="secondary"
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-xl h-10 px-4"
                    leftIcon={<VemiqIcon category="action" name="edit" size={16} />}
                    onClick={handleEdit}
                  >
                    <span className="text-sm font-medium">Edit</span>
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#171717] rounded-xl space-y-2">
                  <p className="text-xs text-[#898989] font-medium uppercase tracking-wide">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#6C63FF]"
                    />
                  ) : (
                    <p className="text-base md:text-lg text-[#FFFFFF] font-semibold">{profile.full_name}</p>
                  )}
                </div>
                
                <div className="p-4 bg-[#171717] rounded-xl space-y-2">
                  <p className="text-xs text-[#898989] font-medium uppercase tracking-wide">Institution</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.institution || ''}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#6C63FF]"
                    />
                  ) : (
                    <p className="text-base md:text-lg text-[#FFFFFF] font-semibold">{profile.institution}</p>
                  )}
                </div>
                
                <div className="p-4 bg-[#171717] rounded-xl space-y-2">
                  <p className="text-xs text-[#898989] font-medium uppercase tracking-wide">Department</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#6C63FF]"
                    />
                  ) : (
                    <p className="text-base md:text-lg text-[#FFFFFF] font-semibold">{profile.department}</p>
                  )}
                </div>
                
                <div className="p-4 bg-[#171717] rounded-xl space-y-2">
                  <p className="text-xs text-[#898989] font-medium uppercase tracking-wide">Level</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.level || ''}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#6C63FF]"
                    />
                  ) : (
                    <p className="text-base md:text-lg text-[#FFFFFF] font-semibold">{profile.level}</p>
                  )}
                </div>
                
                <div className="p-4 bg-[#171717] rounded-xl space-y-2">
                  <p className="text-xs text-[#898989] font-medium uppercase tracking-wide">Matric Number</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.matric_number || ''}
                      onChange={(e) => handleInputChange('matric_number', e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-[#FFFFFF] focus:outline-none focus:border-[#6C63FF]"
                    />
                  ) : (
                    <p className="text-base md:text-lg text-[#FFFFFF] font-semibold">{profile.matric_number}</p>
                  )}
                </div>

                <div className="p-4 bg-[#171717] rounded-xl space-y-2">
                  <p className="text-xs text-[#898989] font-medium uppercase tracking-wide">Account Created</p>
                  <p className="text-base md:text-lg text-[#FFFFFF] font-semibold">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <Button
                    fullWidth
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl h-12"
                    leftIcon={<VemiqIcon category="action" name="save" size={20} />}
                  >
                    <span className="text-base font-medium">{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-xl h-12"
                  >
                    <span className="text-base font-medium">Cancel</span>
                  </Button>
                </div>
              )}
            </Card>

            {/* Actions Grid */}
            <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
              <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                    <VemiqIcon category="nav" name="settings" size={20} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[#FFFFFF] font-medium">Support</span>
                  </div>
                  <VemiqIcon category="action" name="add" size={16} className="text-[#898989]" />
                </button>
                
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                    <VemiqIcon category="status" name="error" size={20} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[#FFFFFF] font-medium">Report Bug</span>
                  </div>
                  <VemiqIcon category="action" name="add" size={16} className="text-[#898989]" />
                </button>
                
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                    <VemiqIcon category="status" name="success" size={20} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[#FFFFFF] font-medium">Rate Us</span>
                  </div>
                  <VemiqIcon category="action" name="add" size={16} className="text-[#898989]" />
                </button>
              </div>
            </Card>

            {/* Logout Button - Red text, centered, no background */}
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full py-4 text-red-500 hover:text-red-400 font-medium text-center transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] text-center rounded-2xl">
            <p className="text-[#898989]">Loading profile...</p>
          </Card>
        )}
      </div>
    </div>
  );
}
