// app/layout.tsx

import Navbar from "@/components/Navbar"
import { ReactNode } from "react";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PetWidget from "@/components/PetWidget"

export const metadata = {
  title: 'SynthSpells - AI Generated YouTube Playlists',
  description: 'Create YouTube playlists from vibes or moods with AI',
  openGraph: {
    title: 'SynthSpells',
    description: 'AI Generated YouTube Playlists',
    url: 'https://synthspells.vercel.app/',
    siteName: 'SynthSpells',
    images: [
      {
        url: 'https://synthspells.vercel.app/cover.png',
        width: 1200,
        height: 630,
        alt: 'SynthSpells Cover',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SynthSpells',
    description: 'Create YouTube playlists from vibes or moods with AI',
    images: ['https://synthspells.vercel.app/cover.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <PetWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
