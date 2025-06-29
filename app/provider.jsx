"use client"
import React, { useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '@/components/custom/Header';
import { MessagesContext } from '@/context/MessagesContext';
import { ModelProvider } from '@/context/ModelContext';

function Provider({children}) {
  const [messages,setMessages]=useState();
  return (
    <div>
      <ModelProvider>
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
      </ModelProvider>
    </div>
  );
}

export default Provider;