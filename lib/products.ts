export type ProductArt =
  | "board"
  | "sensor"
  | "power"
  | "tools"
  | "module"
  | "display";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryLabel: string;
  price: number;
  status: "Còn hàng" | "Sắp hết";
  description: string;
  art: ProductArt;
  accent: string;
  badge?: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "esp32-development-board",
    name: "ESP32 Development Board",
    shortName: "ESP32",
    category: "board",
    categoryLabel: "Board",
    price: 189000,
    status: "Còn hàng",
    description:
      "Bo mạch phát triển nhỏ gọn cho những dự án kết nối đầu tiên và những thử nghiệm không ngại đi xa.",
    art: "board",
    accent: "#d6b675",
    badge: "Bán chạy",
    specs: [
      { label: "Model", value: "ESP32-WROOM-32" },
      { label: "Điện áp", value: "3.3V" },
      { label: "Flash", value: "4MB" },
      { label: "Wi-Fi", value: "Có" },
      { label: "Bluetooth", value: "Có" },
    ],
  },
  {
    slug: "bme280-environment-sensor",
    name: "BME280 Environment Sensor",
    shortName: "BME280",
    category: "sensor",
    categoryLabel: "Cảm biến",
    price: 80000,
    status: "Còn hàng",
    description:
      "Cảm biến khí quyển chính xác để đo nhiệt độ, độ ẩm và áp suất trong cùng một module.",
    art: "sensor",
    accent: "#9db7a6",
    specs: [
      { label: "Model", value: "BME280" },
      { label: "Giao tiếp", value: "I²C / SPI" },
      { label: "Độ ẩm", value: "0–100% RH" },
      { label: "Nhiệt độ", value: "-40–85°C" },
      { label: "Điện áp", value: "1.8–3.6V" },
    ],
  },
  {
    slug: "usb-c-power-module",
    name: "USB-C Power Module",
    shortName: "USB-C POWER",
    category: "module",
    categoryLabel: "Module",
    price: 120000,
    status: "Còn hàng",
    description:
      "Nguồn USB-C gọn gàng cho các mạch cần một điểm cấp điện ổn định và dễ tiếp cận.",
    art: "power",
    accent: "#bb9f7b",
    specs: [
      { label: "Input", value: "USB-C 5V" },
      { label: "Output", value: "5V / 3A" },
      { label: "Bảo vệ", value: "OVP / OCP" },
      { label: "Đèn báo", value: "LED xanh" },
      { label: "Kích thước", value: "22 × 18mm" },
    ],
  },
  {
    slug: "precision-screwdriver-set",
    name: "Precision Screwdriver Set",
    shortName: "PRECISION SET",
    category: "accessories",
    categoryLabel: "Phụ kiện",
    price: 265000,
    status: "Còn hàng",
    description:
      "Bộ tua vít chính xác 24 đầu cho những thao tác lắp ráp cần cảm giác tay và sự kiên nhẫn.",
    art: "tools",
    accent: "#c8a96b",
    badge: "Essential",
    specs: [
      { label: "Số đầu", value: "24 mũi" },
      { label: "Chuôi", value: "Nhôm anodized" },
      { label: "Đầu vít", value: "S2 steel" },
      { label: "Case", value: "Nam châm" },
      { label: "Trọng lượng", value: "280g" },
    ],
  },
  {
    slug: "rp2040-microcontroller",
    name: "RP2040 Microcontroller",
    shortName: "RP2040",
    category: "board",
    categoryLabel: "Board",
    price: 145000,
    status: "Còn hàng",
    description:
      "Vi điều khiển hai nhân mạnh mẽ cho các project cần nhiều GPIO và phản hồi nhanh.",
    art: "module",
    accent: "#a7b2c3",
    specs: [
      { label: "CPU", value: "Dual-core ARM Cortex-M0+" },
      { label: "Tốc độ", value: "133 MHz" },
      { label: "RAM", value: "264KB SRAM" },
      { label: "GPIO", value: "30 pins" },
      { label: "Logic", value: "3.3V" },
    ],
  },
  {
    slug: "oled-display-128x64",
    name: "OLED Display 128×64",
    shortName: "OLED 128×64",
    category: "display",
    categoryLabel: "Hiển thị",
    price: 95000,
    status: "Sắp hết",
    description:
      "Màn hình OLED đơn sắc, tương phản cao cho các thiết bị nhỏ và giao diện thông tin tối giản.",
    art: "display",
    accent: "#9db7a6",
    specs: [
      { label: "Độ phân giải", value: "128 × 64 px" },
      { label: "Giao tiếp", value: "I²C" },
      { label: "Kích thước", value: "0.96 inch" },
      { label: "Màu", value: "Trắng đơn sắc" },
      { label: "Điện áp", value: "3.3–5V" },
    ],
  },
  {
    slug: "jumper-wire-kit",
    name: "Jumper Wire Kit",
    shortName: "JUMPER KIT",
    category: "accessories",
    categoryLabel: "Phụ kiện",
    price: 55000,
    status: "Còn hàng",
    description:
      "Bộ dây nối nhiều màu, nhiều chuẩn pin để đi dây nhanh trong quá trình prototyping.",
    art: "tools",
    accent: "#b9a1b8",
    specs: [
      { label: "Số lượng", value: "120 dây" },
      { label: "Đầu nối", value: "M–M / M–F / F–F" },
      { label: "Chiều dài", value: "20cm" },
      { label: "Bước pin", value: "2.54mm" },
      { label: "Vỏ", value: "PVC mềm" },
    ],
  },
  {
    slug: "logic-level-converter",
    name: "Logic Level Converter",
    shortName: "LEVEL SHIFT",
    category: "module",
    categoryLabel: "Module",
    price: 65000,
    status: "Còn hàng",
    description:
      "Chuyển đổi mức logic hai chiều giữa 3.3V và 5V để các mạch khác thế hệ nói chuyện với nhau.",
    art: "module",
    accent: "#c7a47e",
    specs: [
      { label: "Kênh", value: "4 kênh hai chiều" },
      { label: "Mức thấp", value: "1.8–3.3V" },
      { label: "Mức cao", value: "3.3–5V" },
      { label: "Tốc độ", value: "≤ 2MHz" },
      { label: "Kiểu", value: "BSS138" },
    ],
  },
];

export const categories = [
  { slug: "all", label: "Tất cả" },
  { slug: "board", label: "Board" },
  { slug: "sensor", label: "Cảm biến" },
  { slug: "module", label: "Module" },
  { slug: "display", label: "Hiển thị" },
  { slug: "accessories", label: "Phụ kiện" },
];

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}₫`;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
