"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      await supabase.auth.getSession();
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // sync session changes instantly
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return <>{children}</>;
}
