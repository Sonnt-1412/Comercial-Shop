import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";

export const metadata: Metadata = {
  title: {
    default: "Xuanquy — Sản phẩm",
    template: "%s — Xuanquy",
  },
  description: "Cửa hàng phần cứng, linh kiện và đồ điện tử.",
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
