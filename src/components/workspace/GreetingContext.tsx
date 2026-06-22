'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OrganizationIcon, GraduationCapIcon, CalendarIcon, BriefcaseIcon } from '@/design-system';

interface GreetingContextProps {
  userName: string;
  institution: string;
  department: string;
  academicSession: string;
  program: 'SIWES' | 'SWEP';
  organization: string;
}

export default function GreetingContext({
  userName,
  institution,
  department,
  academicSession,
  program,
  organization,
}: GreetingContextProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">
          {greeting}, {userName}
        </h1>
        <p className="text-tertiary text-sm">
          Welcome back to your SIWES workspace
        </p>
      </div>

      {/* Context Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <OrganizationIcon size={16} className="text-success" />
            <span className="text-xs text-tertiary">Institution</span>
          </div>
          <p className="text-sm font-medium text-primary line-clamp-2">{institution}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCapIcon size={16} className="text-success" />
            <span className="text-xs text-tertiary">Department</span>
          </div>
          <p className="text-sm font-medium text-primary line-clamp-2">{department}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon size={16} className="text-success" />
            <span className="text-xs text-tertiary">Session</span>
          </div>
          <p className="text-sm font-medium text-primary">{academicSession}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <BriefcaseIcon size={16} className="text-success" />
            <span className="text-xs text-tertiary">Organization</span>
          </div>
          <p className="text-sm font-medium text-primary line-clamp-2">{organization}</p>
        </div>
      </div>

      {/* Program Badge */}
      <div className="flex items-center justify-center">
        <span className="px-4 py-2 bg-success text-primary rounded-full text-sm font-medium">
          {program} Program
        </span>
      </div>
    </motion.div>
  );
}
