import Navbar from "@/components/Navbar"
import { ReactNode } from "react";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"


const Layout = ({ children }: { children: ReactNode }) => {
  return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>SynthSpells</title>
          <meta name="description" content="SynthSpells" />
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
          </ThemeProvider>
        </body>
      </html>

  )
}
export default Layout