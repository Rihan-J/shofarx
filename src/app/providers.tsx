'use client';

import React, { useState } from 'react';
import { AuthProvider } from '../admin/context/AuthContext';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AIAssistant = dynamic(() => import('../components/AIAssistant'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <AIAssistant />
      </AuthProvider>
    </QueryClientProvider>
  );
}
