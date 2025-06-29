"use client";

import React from 'react';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const ConvexClientProvider = ({ children }) => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    
    // Check if Convex URL is provided
    if (!convexUrl) {
        console.error('NEXT_PUBLIC_CONVEX_URL is not set. Please run `npx convex dev` and ensure your .env.local file is populated.');
        // Return children without Convex provider to prevent app crash
        return <>{children}</>;
    }
    
    const convex = new ConvexReactClient(convexUrl);
    
    return (
        <ConvexProvider client={convex}>
            {children}
        </ConvexProvider>
    );
};

export default ConvexClientProvider;