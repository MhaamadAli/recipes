// app/layout.tsx
// Root layout component for the Recipe Management System
// Sets up global styles, metadata, and app structure

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Load Inter font for modern typography
const inter = Inter({ subsets: ['latin'] });

// App metadata for SEO and browser display
export const metadata: Metadata = {
  title: 'Recipe Management System',
  description: 'Manage your favorite recipes with AI-powered suggestions. Add, edit, search, and discover new recipes based on your available ingredients.',
  keywords: ['recipes', 'cooking', 'meal planning', 'AI suggestions', 'kitchen', 'food'],
  authors: [{ name: 'Recipe Management System' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Recipe Management System',
    description: 'Manage your favorite recipes with AI-powered suggestions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recipe Management System',
    description: 'Manage your favorite recipes with AI-powered suggestions',
  }
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global app container */}
        <div id="app-root" className="min-h-screen bg-gray-100">
          {/* Navigation/Header could go here if needed */}
          
          {/* Main content */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Footer could go here if needed */}
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-gray-600">
                <p className="text-sm">
                  Recipe Management System with AI-Powered Suggestions
                </p>
                <p className="text-xs mt-1">
                  Built with Next.js, TypeScript, and Tailwind CSS
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* Portal container for modals */}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}