import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/app/(commonlayout)/Navbar";
import { Footer } from "@/app/(commonlayout)/Footer";
import { ChatBot } from "@/components/chatbot/ChatBot";


export const metadata: Metadata = {
  title: {
    default: "SkillSwap — Peer-to-Peer Skill Exchange",
    template: "%s | SkillSwap",
  },
  description: "Connect with mentors, learn new skills, and grow together.",

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer></Footer>
          <ChatBot />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1E1E2D",
                border: "1px solid #303045",
                color: "#E8E8EE",
                fontFamily: "var(--font-dm-sans)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
