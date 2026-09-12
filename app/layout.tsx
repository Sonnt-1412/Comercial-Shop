import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";

export const metadata: Metadata = {
  title: {
    default: "NØR/SHOP — Hardware for builders",
    template: "%s — NØR/SHOP",
  },
  description:
    "Phần cứng, linh kiện và công cụ cho những người thích xây dựng mọi thứ từ đầu.",
};

export const viewport: Viewport = { themeColor: "#181817" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <a className="skip-link" href="#main-content">
            Bỏ qua đến nội dung
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
