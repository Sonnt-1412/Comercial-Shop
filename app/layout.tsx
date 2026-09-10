import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { default: "NØR/SHOP — Hardware for builders", template: "%s — NØR/SHOP" },
  description: "Phần cứng, linh kiện và công cụ cho những người thích xây dựng mọi thứ từ đầu.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
