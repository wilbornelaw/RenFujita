import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { MouseSpotlight } from "@/components/mouse-spotlight";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ren Fujita",
  description: "Flickr-inspired personal photo sharing site",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerSupabaseClient();
    const response = await supabase.auth.getUser();
    user = response.data.user;
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <MouseSpotlight />
        <Header isAuthenticated={Boolean(user)} />
        <Container>
          <main className="relative z-10 pb-10 pt-7">{children}</main>
        </Container>
        <Footer />
      </body>
    </html>
  );
}
