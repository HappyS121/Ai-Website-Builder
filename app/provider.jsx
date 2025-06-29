"use client"
import React, { useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '@/components/custom/Header';
import { MessagesContext } from '@/context/MessagesContext';
import { ModelProvider } from '@/context/ModelContext';
import { EnvironmentProvider } from '@/context/EnvironmentContext';

function Provider({children}) {
  const [messages,setMessages]=useState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <ModelProvider>
        <EnvironmentProvider>
          <MessagesContext.Provider value={{messages,setMessages}}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem 
                disableTransitionOnChange
                >
                  <Header />
                {children}
            </NextThemesProvider>
          </MessagesContext.Provider>
        </EnvironmentProvider>
      </ModelProvider>
    </div>
  );
}

export default Provider;