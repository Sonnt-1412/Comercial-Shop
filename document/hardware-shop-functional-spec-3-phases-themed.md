# Hardware / Electronics Shop — Functional Specification theo 3 Phase

## Nguyên tắc chung

Website là một cửa hàng online tối giản chuyên bán phần cứng, linh kiện và đồ điện tử.

Ngôn ngữ giao diện ưu tiên **tiếng Việt**. Chỉ dùng một số nhãn tiếng Anh thật ngắn khi hợp vibe và dễ hiểu, ví dụ: `Shop`, `About`, `Cart`.

Website **không có chức năng thanh toán online**.

Flow mua hàng chính:

```text
Xem sản phẩm
   ↓
Thêm vào giỏ
   ↓
Chọn / nhập địa chỉ giao hàng
   ↓
Xem lại đơn
   ↓
Xác nhận đặt hàng
   ↓
Shop xử lý và gửi hàng
```

---

# UI / Visual Theme — Dark Industrial Hardware Shop

## Design direction

Website theo phong cách **modern industrial / hardware shop**, lấy cảm hứng từ visual reference đã chọn: tối vừa phải, có chiều sâu, hơi thô và technical nhưng vẫn sạch và dễ dùng.

Không sử dụng pure black hoặc pure white làm màu chủ đạo.

### Visual keywords

- Dark / muted
- Industrial
- Technical
- Minimal
- Premium
- Functional
- Slightly editorial
- Hardware / electronics aesthetic

## Color system

Ưu tiên palette charcoal / zinc / warm gray:

```text
Background        #181817
Surface            #222220
Surface elevated   #2A2926
Border             #3A3935

Primary text       #E8E5DE
Secondary text     #A8A49B
Muted text         #77736B

Accent             #C8A96B
Accent hover       #D8BA7B

Image background   #E4E0D7
```

### Nguyên tắc màu

- Background chính: charcoal rất tối nhưng không phải `#000000`.
- Card / surface: sáng hơn background một cấp để tạo depth.
- Text chính: off-white, không dùng `#FFFFFF` toàn bộ.
- Text phụ: warm gray.
- Accent dùng tiết chế cho CTA, giá, trạng thái hoặc chi tiết tương tác.
- Không lạm dụng gradient.
- Không dùng neon blue/purple kiểu SaaS hoặc crypto.
- Không biến website thành dashboard.

## Typography

Phong cách typography nên mạnh, gọn và có tính editorial.

- Heading: sans-serif hiện đại, weight 600–700.
- Body: sans-serif dễ đọc, weight 400–500.
- Product name: medium / semibold.
- Price: semibold, nổi bật nhưng không quá lớn.
- Metadata: nhỏ, uppercase hoặc letter-spacing nhẹ khi phù hợp.
- Có thể dùng typography tương phản giữa heading lớn và metadata nhỏ.

Ưu tiên cảm giác:

```text
BIG TITLE
small technical metadata

PRODUCT NAME
189.000₫
```

Không sử dụng quá nhiều font family.

## Layout

Layout ưu tiên nhiều khoảng thở nhưng không quá rộng.

- Desktop: product grid rõ ràng.
- Mobile: single-column hoặc 2-column tùy breakpoint.
- Navigation đơn giản.
- Header có thể sticky.
- Border mảnh thay cho shadow nặng.
- Card không cần bo góc quá lớn.
- Border radius nên nhỏ / vừa.
- Không dùng glassmorphism quá mức.

## Product cards

Product card là thành phần quan trọng nhất.

Card nên có:

```text
┌─────────────────────────┐
│                         │
│       PRODUCT IMAGE     │
│                         │
├─────────────────────────┤
│ ESP32 DEVELOPMENT BOARD │
│ Electronics · Board     │
│                         │
│ 189.000₫                │
└─────────────────────────┘
```

Visual:

- Ảnh sản phẩm chiếm phần lớn card.
- Background ảnh sáng hơn UI để sản phẩm nổi bật.
- Tên sản phẩm rõ ràng.
- Giá dễ nhìn.
- Metadata nhỏ và muted.
- Hover chỉ cần subtle: image scale nhẹ, border hoặc surface thay đổi.
- Không dùng animation phức tạp.

## Homepage

Homepage phải tạo **vibe của shop ngay từ lần đầu mở trang**.

Hero không cần quá giống landing page SaaS.

Ưu tiên:

```text
SHOP NAME

Hardware / components / electronics
for people who like building things.

[ SHOP PRODUCTS ]

                         [ LARGE PRODUCT / HARDWARE VISUAL ]
```

Sau hero:

```text
NEW / FEATURED

[ product ] [ product ] [ product ] [ product ]
```

Sau đó có thể có một section About ngắn theo phong cách editorial.

## Navigation

Navigation tối giản:

```text
[LOGO]

SHOP     ABOUT                         SEARCH     CART
```

Hoặc:

```text
[LOGO]

SẢN PHẨM     GIỚI THIỆU              TÌM KIẾM     GIỎ HÀNG
```

Không tạo quá nhiều menu.

## Buttons

Button mang tính functional.

Primary:

- Background accent hoặc off-white.
- Text tối.
- Không gradient.
- Radius nhỏ / vừa.

Secondary:

- Transparent.
- Border muted.
- Text off-white.

Ví dụ:

```text
[ SHOP NOW ]
[ ADD TO CART ]
[ CONTINUE SHOPPING ]
```

## Product detail

Product detail nên mang cảm giác catalogue / editorial:

```text
┌──────────────────────┐
│                      │
│   PRODUCT IMAGE      │
│                      │
└──────────────────────┘

ESP32 DEVELOPMENT BOARD

189.000₫

IN STOCK

Short description...

[ ADD TO CART ]

TECHNICAL SPECIFICATIONS
─────────────────────────
Model       ESP32-WROOM-32
Voltage     3.3V
Flash       4MB
Wi-Fi       Yes
Bluetooth   Yes
```

Thông số kỹ thuật nên trình bày sạch, có divider mảnh, không dùng card dày đặc.

## Category / Shop page

Shop page tập trung vào catalogue.

```text
SHOP

ALL     BOARD     COMPONENTS     ACCESSORIES

[ PRODUCT ] [ PRODUCT ] [ PRODUCT ] [ PRODUCT ]
[ PRODUCT ] [ PRODUCT ] [ PRODUCT ] [ PRODUCT ]
```

Filter và search phải gọn.

Không làm sidebar nặng nếu không cần thiết.

## Cart / checkout

Giữ cùng visual language với storefront.

- Dark charcoal background.
- Product image rõ.
- Tổng tiền nổi bật.
- Step flow đơn giản.
- Form có border rõ.
- Không dùng payment UI vì website không thanh toán online.

## Account / order

Account page vẫn là storefront, không phải admin dashboard.

Có thể dùng:

```text
ACCOUNT

PROFILE
ADDRESSES
ORDERS
LOG OUT
```

Order status sử dụng badge nhỏ, muted, dễ đọc.

## Admin

Admin có thể khác storefront một chút để ưu tiên usability, nhưng vẫn giữ:

- charcoal / zinc palette
- typography đồng nhất
- border rõ
- accent tiết chế

Không cần ép admin phải giống hoàn toàn visual của storefront.

## Images

Ảnh sản phẩm là visual focal point.

Ưu tiên:

- nền neutral / light gray / warm gray
- crop nhất quán
- object rõ
- ít background noise
- tỷ lệ ảnh đồng nhất trong product grid

Không thêm filter màu mạnh lên ảnh sản phẩm.

## Motion

Animation rất tiết chế:

- hover transition: 150–250ms
- image scale: rất nhẹ
- page transition: không bắt buộc
- skeleton/loading state đơn giản

Không dùng:

- excessive parallax
- bouncing animation
- glowing effects
- flashy gradients

## Responsive

Mobile phải giữ nguyên visual identity.

Header:

```text
[☰]  LOGO                 [CART]
```

Product grid:

```text
[ PRODUCT ] [ PRODUCT ]
[ PRODUCT ] [ PRODUCT ]
```

Hero chuyển thành vertical layout.

Không để dark UI trở nên quá nặng trên mobile.

## Overall feeling

Khi người dùng mở website, cảm giác nên là:

> "Một shop hardware/electronics nhỏ, có gu, hơi industrial, được thiết kế kỹ."

Không phải:

> "Một SaaS dashboard."

Không phải:

> "Một ecommerce template đại trà."

Không phải:

> "Một website cyberpunk neon."

---


---

# PHASE 1 — CỬA HÀNG CƠ BẢN

## Mục tiêu

Phase 1 tập trung tạo ra phần người dùng nhìn thấy đầu tiên.

Mục tiêu là có một website đủ để:

- Vào trang chủ.
- Xem danh sách sản phẩm.
- Xem theo danh mục.
- Tìm kiếm sản phẩm.
- Xem chi tiết từng sản phẩm.

Chưa cần tài khoản, giỏ hàng hoàn chỉnh hay đặt hàng.

## Các trang chính

### 1. Trang chủ

Trang chủ giữ đơn giản, tập trung vào sản phẩm.

Nội dung gồm:

- Logo / tên shop.
- Menu chính.
- Ảnh hoặc visual lớn.
- Một câu giới thiệu ngắn.
- Danh sách sản phẩm nổi bật hoặc sản phẩm mới.
- Một phần giới thiệu ngắn về shop.
- Footer.

Navigation có thể là:

```text
[LOGO]      SHOP      ABOUT                 TÌM KIẾM
```

Hoặc full tiếng Việt:

```text
[LOGO]      SẢN PHẨM      GIỚI THIỆU        TÌM KIẾM
```

### 2. Trang Shop

Trang hiển thị toàn bộ sản phẩm.

Mỗi sản phẩm chỉ cần:

- Ảnh.
- Tên.
- Giá.
- Trạng thái hàng nếu cần.

Ví dụ:

```text
[ẢNH]          [ẢNH]          [ẢNH]

ESP32          Sensor         Module
189.000₫       80.000₫        120.000₫
```

### 3. Danh mục

Cho phép xem sản phẩm theo danh mục.

Ví dụ:

```text
TẤT CẢ   BOARD   LINH KIỆN   PHỤ KIỆN
```

Danh mục phải là dữ liệu động, không hard-code.

### 4. Tìm kiếm

Người dùng có thể tìm theo:

- Tên sản phẩm.
- Từ khóa.
- Danh mục.

Kết quả trả về đơn giản:

```text
TÌM KIẾM

[ Nhập tên sản phẩm... ]

[ẢNH] ESP32 Development Board
      189.000₫
```

### 5. Chi tiết sản phẩm

Trang chi tiết gồm:

- Ảnh chính.
- Ảnh phụ nếu có.
- Tên sản phẩm.
- Giá.
- Tình trạng hàng.
- Mô tả.
- Thông số kỹ thuật.

Ví dụ:

```text
[ ẢNH SẢN PHẨM ]       ESP32 Development Board

                       189.000₫

                       Còn hàng

                       Mô tả ngắn...
```

Thông số kỹ thuật là dữ liệu động.

```text
THÔNG SỐ

Model          ESP32-WROOM-32
Điện áp        3.3V
Flash          4MB
Wi-Fi          Có
Bluetooth      Có
```

## Kết quả mong muốn của Phase 1

Sau phase này, web đã có cảm giác như một shop thật:

```text
HOME
 ↓
SHOP
 ↓
CATEGORY
 ↓
PRODUCT DETAIL
 ↓
SEARCH
```

Nhưng chưa có flow mua hàng.

---

# PHASE 2 — GIỎ HÀNG, TÀI KHOẢN VÀ ĐẶT HÀNG

## Mục tiêu

Phase 2 thêm toàn bộ flow mua hàng.

Người dùng có thể:

- Thêm sản phẩm vào giỏ.
- Đăng ký / đăng nhập.
- Lưu địa chỉ.
- Chọn địa chỉ đã có.
- Nhập địa chỉ mới.
- Xác nhận đơn hàng.

Website vẫn **không thanh toán online**.

## Chức năng chính

### 1. Giỏ hàng

Giỏ hàng lưu:

- Sản phẩm.
- Số lượng.
- Giá.

Người dùng có thể:

- Tăng số lượng.
- Giảm số lượng.
- Xóa sản phẩm.
- Tiếp tục mua hàng.
- Tiến hành đặt hàng.

Ví dụ:

```text
GIỎ HÀNG

ESP32 Board
189.000₫
[-] 1 [+]

Sensor Module
80.000₫
[-] 2 [+]

------------------------

TỔNG
349.000₫

[ TIẾP TỤC ĐẶT HÀNG ]
```

### 2. Đăng nhập / đăng ký

Hỗ trợ trong Phase 2:

- Email + mật khẩu.
- Quên / đặt lại mật khẩu.

Ví dụ:

```text
ĐĂNG NHẬP

Email
Mật khẩu

[ ĐĂNG NHẬP ]

Quên mật khẩu?

Tạo tài khoản
```

### 3. Tài khoản

Sau khi đăng nhập:

```text
TÀI KHOẢN

Thông tin cá nhân
Địa chỉ
Đơn hàng
Đăng xuất
```

### 4. Địa chỉ giao hàng

Người dùng có thể:

- Thêm địa chỉ.
- Sửa địa chỉ.
- Xóa địa chỉ.
- Chọn địa chỉ mặc định.
- Lưu nhiều địa chỉ.

Thông tin địa chỉ gồm:

- Họ tên người nhận.
- Số điện thoại.
- Địa chỉ.
- Phường / Xã.
- Quận / Huyện.
- Tỉnh / Thành phố.
- Ghi chú nếu cần.

### 5. Đặt hàng

Flow:

```text
GIỎ HÀNG
   ↓
ĐĂNG NHẬP
   ↓
CHỌN ĐỊA CHỈ
   ↓
XEM LẠI ĐƠN
   ↓
XÁC NHẬN ĐẶT HÀNG
   ↓
TẠO ĐƠN
```

Nếu người dùng đã có địa chỉ:

```text
ĐỊA CHỈ GIAO HÀNG

○ Nguyễn Văn A
  09xxxxxxxx
  Địa chỉ...

○ Nguyễn Văn A
  09xxxxxxxx
  Địa chỉ khác...

[ + THÊM ĐỊA CHỈ MỚI ]
```

### 6. Xem lại đơn

Hiển thị:

- Sản phẩm.
- Số lượng.
- Giá.
- Tổng tiền.
- Địa chỉ giao hàng.

Không có:

- Thẻ ngân hàng.
- Cổng thanh toán.
- Bước thanh toán online.

### 7. Xác nhận đơn

Sau khi xác nhận:

```text
ĐẶT HÀNG THÀNH CÔNG

Mã đơn: #10024

Đơn hàng của bạn đã được ghi nhận.

[ XEM ĐƠN HÀNG ]
[ TIẾP TỤC MUA SẮM ]
```

### 8. Lịch sử đơn hàng

Người dùng xem được:

- Mã đơn.
- Ngày đặt.
- Tổng tiền.
- Trạng thái.

Trạng thái cơ bản:

```text
Chờ xác nhận
Đã xác nhận
Đang chuẩn bị
Đang giao
Đã giao
Đã hủy
```

## Kết quả mong muốn của Phase 2

Website đã hoàn chỉnh flow người dùng:

```text
SẢN PHẨM
   ↓
GIỎ HÀNG
   ↓
ĐĂNG NHẬP
   ↓
ĐỊA CHỈ
   ↓
XÁC NHẬN ĐƠN
   ↓
THEO DÕI ĐƠN
```

---

# PHASE 3 — QUẢN LÝ SHOP VÀ HOÀN THIỆN

## Mục tiêu

Phase 3 tập trung vào phần vận hành shop và hoàn thiện sản phẩm.

Người quản trị có thể tự thêm sản phẩm và xử lý đơn hàng mà không cần sửa code.

## Chức năng quản trị chính

### 1. Quản lý sản phẩm

Admin có thể:

- Thêm sản phẩm.
- Sửa sản phẩm.
- Xóa sản phẩm.
- Ẩn / hiện sản phẩm.
- Upload nhiều ảnh.
- Nhập giá.
- Nhập tồn kho.
- Nhập mô tả.
- Nhập thông số kỹ thuật.

### 2. Quản lý danh mục

Admin có thể:

- Tạo danh mục.
- Đổi tên.
- Xóa.
- Sắp xếp.

Danh mục hoàn toàn động.

### 3. Quản lý đơn hàng

Admin xem được:

- Người mua.
- Sản phẩm.
- Số lượng.
- Địa chỉ giao hàng.
- Tổng giá trị đơn.
- Ngày tạo.
- Trạng thái.

Admin có thể cập nhật:

```text
Chờ xác nhận
   ↓
Đã xác nhận
   ↓
Đang chuẩn bị
   ↓
Đang giao
   ↓
Đã giao
```

Hoặc:

```text
Đã hủy
```

### 4. Quản lý người dùng

Admin có thể xem:

- Tên.
- Email.
- Số điện thoại.
- Địa chỉ.
- Lịch sử đơn hàng.

### 5. Quản lý tồn kho

Mỗi sản phẩm có:

- Số lượng còn lại.
- Trạng thái còn hàng / hết hàng.

Khi hết hàng, storefront hiển thị:

```text
HẾT HÀNG
```

và không cho thêm vào giỏ.

### 6. About và thông tin shop

Admin có thể chỉnh:

- Nội dung About.
- Thông tin liên hệ.
- Social links.
- Ảnh chính.
- Footer.

### 7. Đăng nhập mạng xã hội

Sau khi có tài khoản email hoạt động ổn định, bổ sung:

- Đăng nhập Google.
- Đăng nhập Facebook.
- Liên kết tài khoản mạng xã hội với tài khoản đã có khi phù hợp.

Phần này cần OAuth credentials, redirect URL và cấu hình ứng dụng từ từng nền tảng.

### 8. Hoàn thiện trải nghiệm

Sau khi các chức năng chính đã hoạt động:

- Responsive cho mobile.
- Loading state.
- Empty state.
- Trang 404.
- Tối ưu ảnh.
- SEO cơ bản.
- Bảo mật.
- Performance.

Ví dụ empty cart:

```text
GIỎ HÀNG

Giỏ hàng của bạn đang trống.

[ TIẾP TỤC MUA SẮM ]
```

## Kết quả mong muốn của Phase 3

Website hoàn chỉnh ở mức có thể vận hành:

```text
KHÁCH HÀNG
Xem → Chọn → Đặt → Theo dõi đơn

SHOP
Thêm hàng → Nhận đơn → Xử lý → Gửi hàng
```

---

# Tổng thể 3 Phase

```text
PHASE 1
CỬA HÀNG
Home / Shop / Category / Search / Product

        ↓

PHASE 2
MUA HÀNG
Cart / Login / Address / Order

        ↓

PHASE 3
QUẢN LÝ
Admin / Products / Orders / Users / Polish
```

Nguyên tắc triển khai:

**Phase 1 phải ra được vibe của shop trước.**

Sau khi phần trưng bày sản phẩm ổn mới thêm flow mua hàng ở Phase 2.

Cuối cùng mới làm hệ thống quản trị và hoàn thiện ở Phase 3.
