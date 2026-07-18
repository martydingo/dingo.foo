import type { Metadata } from "next";
import "./globals.css";
import { Titillium_Web, Bai_Jamjuree, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar/NavBar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", baiJamjuree.variable, titiliumWeb.variable, jetbrainsMono.variable)}
    >
      <body className="min-h-full bg-linear-to-t from-secondary to-35% to-background">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
