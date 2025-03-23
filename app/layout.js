import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";

const inter = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Interview-Saathi.AI",
  description:
    "Interview-Saathi.AI helps you practice for interview through AI mock interview",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          {children}
          <ScrollToTop />
        </body>
      </html>
    </ClerkProvider>
  );
}
