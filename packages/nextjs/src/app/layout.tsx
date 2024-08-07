import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: {
    default: "",
    template: "",
  },
  description: "",
  icons: [{ rel: "icon", url: "./logo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              >
              {/* <Header /> */}
              {children}
            </ThemeProvider> 
          </body>
      </html>
  );
}
