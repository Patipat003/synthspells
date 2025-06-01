import Navbar from "@/components/Navbar"
import { ReactNode } from "react";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PetWidget from "@/components/PetWidget"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>SynthSpells</title>
          <meta name="description" content="Generate AI-powered YouTube playlists from your mood or prompt" />
          <meta property="og:title" content="SynthSpells – AI Curated YouTube Playlists" />
          <meta property="og:description" content="Generate AI-powered YouTube playlists from your mood or prompt" />
          <meta property="og:image" content="https://synthspells.vercel.app/cover.png" />
          <meta property="og:url" content="https://synthspells.vercel.app/" />
          <link rel="icon" href="/favicon.ico" />
        </head>
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

  )
}
export default Layout