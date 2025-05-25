"use client";

import { ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/app/[lang]/ThemeProvider";
import DictionaryProvider, { type Dictionary } from "@/contexts/DictionaryProvider";

export default function Providers({ children, dictionary }: { children: React.ReactNode, dictionary: Dictionary }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 30  , // 30 minutes
          refetchOnWindowFocus: false,
        },
      },
    })
  );
  
  return (
    <DictionaryProvider dictionary={dictionary}>
      <QueryClientProvider client={queryClient} >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </DictionaryProvider>
  );
} 