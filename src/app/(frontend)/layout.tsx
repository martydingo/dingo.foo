import type { Metadata } from "next";
import "./globals.css";
import { Titillium_Web, Bai_Jamjuree, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import config from '@payload-config'
import { getPayload } from 'payload'

const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin'], variable: '--font-bai-jamjuree', weight: ["200", "300", "400", "500", "600", "700"]
});

const titiliumWeb = Titillium_Web({
  subsets: ['latin'], variable: '--font-titillium-web', weight: ["200", "300", "400", "600", "700", "900"]
});
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });


export const metadata: Metadata = {
  title: "dingo.foo",
  description: "Like foobar, but with more dingo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getPayload({ config })
  const siteImage = await payload.findByID({ collection: "images", id: "site-logo" })
  const siteImageUri = siteImage.url
  return (
    <html
      lang="en"
      className={cn("antialiased h-full min-h-screen", baiJamjuree.variable, titiliumWeb.variable, jetbrainsMono.variable)}
    >
      {/* <body className="bg-linear-to-b from-sidebar from-35% to-background"> */}
      <body>
        <NavBar siteLogoUri={siteImageUri || ""} />
        {children}
      </body>
    </html>
  );
}
