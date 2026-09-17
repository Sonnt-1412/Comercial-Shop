"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminContext } from "@/lib/admin";
import { isUuid } from "@/lib/admin-permissions";

const productPath = "/admin/products";
function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}
function go(path: string, notice: string): never {
  redirect(`${path}?notice=${encodeURIComponent(notice)}`);
}
function refreshCatalog() {
  for (const path of ["/", "/shop", "/search", "/cart", "/checkout"])
    revalidatePath(path);
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/product/[slug]", "page");
}

export async function saveProduct(form: FormData) {
  const { supabase } = await adminContext();
  const originalSlug = text(form, "originalSlug");
  const slug = text(form, "slug");
  const path = originalSlug
    ? `${productPath}/${encodeURIComponent(originalSlug)}`
    : productPath;
  const name = text(form, "name");
  const shortName = text(form, "shortName");
  const category = text(form, "category");
  const price = Number(text(form, "price"));
  const stock = Number(text(form, "stock"));
  const accent = text(form, "accent");
  const art = text(form, "art");
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 120 ||
    name.length < 1 ||
    name.length > 160 ||
    shortName.length > 80 ||
    !category ||
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 1_000_000_000_000 ||
    !Number.isSafeInteger(stock) ||
    stock < 0 ||
    stock > 1_000_000_000 ||
    !/^#[a-fA-F0-9]{6}$/.test(accent) ||
    !["board", "sensor", "power", "tools", "module", "display"].includes(art)
  )
    go(path, "Thông tin sản phẩm không hợp lệ.");
  let specs: { label: string; value: string }[];
  try {
    const parsed: unknown = JSON.parse(text(form, "specs") || "[]");
    if (
      !Array.isArray(parsed) ||
      parsed.length > 30 ||
      !parsed.every(
        (item) =>
          item &&
          typeof item === "object" &&
          "label" in item &&
          "value" in item &&
          typeof item.label === "string" &&
          typeof item.value === "string" &&
          item.label.length <= 80 &&
          item.value.length <= 200,
      )
    )
      throw new Error();
    specs = parsed as { label: string; value: string }[];
  } catch {
    go(path, "Thông số kỹ thuật phải là danh sách JSON gồm label và value.");
  }
  const { data: foundCategory } = await supabase
    .from("categories")
    .select("slug")
    .eq("slug", category)
    .maybeSingle();
  if (!foundCategory) go(path, "Danh mục không tồn tại.");
  const { data: existing } = originalSlug
    ? await supabase
        .from("products")
        .select("images")
        .eq("slug", originalSlug)
        .maybeSingle()
    : { data: null };
  if (originalSlug && (!existing || originalSlug !== slug))
    go(productPath, "Sản phẩm không tồn tại hoặc mã không hợp lệ.");
  const removed = new Set(form.getAll("removeImage").map(String));
  const images = ((existing?.images ?? []) as string[]).filter(
    (url) => !removed.has(url),
  );
  const uploads = form
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);
  if (images.length + uploads.length > 6)
    go(path, "Chỉ được lưu tối đa 6 ảnh.");
  if (
    uploads.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    ) ||
    uploads.reduce((total, file) => total + file.size, 0) > 4 * 1024 * 1024
  )
    go(
      path,
      "Ảnh phải là JPG, PNG hoặc WebP; tổng ảnh mỗi lượt lưu tối đa 4 MB.",
    );
  const uploadedPaths: string[] = [];
  for (const file of uploads) {
    const extension = (
      {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      } as Record<string, string>
    )[file.type];
    const objectPath = `${slug}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(objectPath, file, { contentType: file.type, upsert: false });
    if (error) {
      if (uploadedPaths.length)
        await supabase.storage.from("product-images").remove(uploadedPaths);
      go(path, "Không tải được ảnh lên. Kiểm tra bucket product-images.");
    }
    uploadedPaths.push(objectPath);
    images.push(
      supabase.storage.from("product-images").getPublicUrl(objectPath).data
        .publicUrl,
    );
  }
  const payload = {
    slug,
    name,
    short_name: shortName || null,
    category,
    price,
    stock,
    description: text(form, "description").slice(0, 3000),
    art,
    accent,
    specs,
    images,
    is_active: form.get("isActive") === "on",
  };
  const { error } = originalSlug
    ? await supabase.from("products").update(payload).eq("slug", originalSlug)
    : await supabase.from("products").insert(payload);
  if (error) {
    if (uploadedPaths.length)
      await supabase.storage.from("product-images").remove(uploadedPaths);
    go(path, "Không lưu được sản phẩm. Kiểm tra mã và dữ liệu nhập.");
  }
  const removedPaths = ((existing?.images ?? []) as string[])
    .filter((url) => removed.has(url))
    .flatMap((url) => {
      try {
        const marker = "/storage/v1/object/public/product-images/";
        const pathname = new URL(url).pathname;
        const objectPath = decodeURIComponent(pathname.split(marker)[1] ?? "");
        return objectPath.startsWith(`${slug}/`) ? [objectPath] : [];
      } catch {
        return [];
      }
    });
  if (removedPaths.length)
    await supabase.storage.from("product-images").remove(removedPaths);
  revalidatePath(productPath);
  refreshCatalog();
  go(
    originalSlug ? path : `${productPath}/${encodeURIComponent(slug)}`,
    "Đã lưu sản phẩm.",
  );
}

export async function deleteProduct(form: FormData) {
  const { supabase } = await adminContext();
  const slug = text(form, "slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    go(productPath, "Mã sản phẩm không hợp lệ.");
  const { data: product } = await supabase
    .from("products")
    .select("images")
    .eq("slug", slug)
    .maybeSingle();
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error)
    go(
      `${productPath}/${encodeURIComponent(slug)}`,
      "Không thể xóa sản phẩm đã có trong đơn. Hãy bỏ chọn hiển thị.",
    );
  const imagePaths = ((product?.images ?? []) as string[]).flatMap((url) => {
    try {
      const path = decodeURIComponent(
        new URL(url).pathname.split(
          "/storage/v1/object/public/product-images/",
        )[1] ?? "",
      );
      return path.startsWith(`${slug}/`) ? [path] : [];
    } catch {
      return [];
    }
  });
  if (imagePaths.length)
    await supabase.storage.from("product-images").remove(imagePaths);
  revalidatePath(productPath);
  refreshCatalog();
  go(productPath, "Đã xóa sản phẩm.");
}

export async function saveCategory(form: FormData) {
  const { supabase } = await adminContext();
  const original = text(form, "originalSlug");
  const slug = text(form, "slug");
  const name = text(form, "name");
  const sort_order = Number(text(form, "sortOrder"));
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 80 ||
    !name ||
    name.length > 80 ||
    !Number.isSafeInteger(sort_order)
  )
    go("/admin/categories", "Danh mục không hợp lệ.");
  const { error } = original
    ? await supabase
        .from("categories")
        .update({ slug, name, sort_order })
        .eq("slug", original)
    : await supabase.from("categories").insert({ slug, name, sort_order });
  if (error)
    go(
      "/admin/categories",
      "Không lưu được danh mục. Kiểm tra mã hoặc sản phẩm liên quan.",
    );
  revalidatePath("/admin/categories");
  refreshCatalog();
  go("/admin/categories", "Đã lưu danh mục.");
}

export async function deleteCategory(form: FormData) {
  const { supabase } = await adminContext();
  const slug = text(form, "slug");
  const { error } = await supabase.from("categories").delete().eq("slug", slug);
  if (error)
    go(
      "/admin/categories",
      "Danh mục còn sản phẩm. Hãy chuyển sản phẩm trước khi xóa.",
    );
  revalidatePath("/admin/categories");
  refreshCatalog();
  go("/admin/categories", "Đã xóa danh mục.");
}

export async function updateOrder(form: FormData) {
  const { supabase } = await adminContext();
  const id = Number(text(form, "id"));
  const status = text(form, "status");
  if (
    !Number.isSafeInteger(id) ||
    id < 1 ||
    ![
      "pending",
      "confirmed",
      "preparing",
      "shipping",
      "delivered",
      "cancelled",
    ].includes(status)
  )
    go("/admin/orders", "Đơn hàng không hợp lệ.");
  const { error } = await supabase.rpc("admin_update_order_status", {
    p_order_id: id,
    p_status: status,
  });
  if (error)
    go(
      `/admin/orders/${id}`,
      "Không cập nhật được đơn hàng. Kiểm tra tồn kho nếu mở lại đơn đã hủy.",
    );
  refreshCatalog();
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${id}`);
  revalidatePath("/account/orders");
  go(`/admin/orders/${id}`, "Đã cập nhật trạng thái.");
}

export async function saveCustomer(form: FormData) {
  const { supabase } = await adminContext();
  const id = text(form, "id");
  const path = `/admin/customers/${encodeURIComponent(id)}`;
  const email = text(form, "email").toLowerCase();
  const full_name = text(form, "fullName");
  const phone = text(form, "phone");
  const password = text(form, "password");
  let customer_attributes: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text(form, "attributes") || "{}");
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      JSON.stringify(parsed).length > 10000
    )
      throw new Error();
    customer_attributes = parsed as Record<string, unknown>;
  } catch {
    go(path, "Thuộc tính bổ sung phải là một đối tượng JSON hợp lệ.");
  }
  if (
    !isUuid(id) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    full_name.length > 120 ||
    phone.length > 30 ||
    (password && password.length < 8)
  )
    go(path, "Thông tin khách hàng không hợp lệ.");
  const { data: authUser, error: userError } =
    await supabase.auth.admin.getUserById(id);
  if (userError || !authUser.user)
    go("/admin/customers", "Không tìm thấy khách hàng.");
  const attributes: { email?: string; password?: string } = {};
  if (email !== authUser.user.email) attributes.email = email;
  if (password) attributes.password = password;
  if (Object.keys(attributes).length) {
    const { error } = await supabase.auth.admin.updateUserById(id, attributes);
    if (error)
      go(
        path,
        "Không cập nhật được email hoặc mật khẩu. Kiểm tra email đã tồn tại chưa.",
      );
  }
  const { error } = await supabase.from("profiles").upsert({
    user_id: id,
    full_name: full_name || null,
    phone: phone || null,
    customer_attributes,
  });
  if (error) go(path, "Không lưu được họ tên hoặc số điện thoại.");
  revalidatePath("/admin/customers");
  revalidatePath("/account");
  go(path, "Đã lưu khách hàng.");
}

export async function saveCustomerAddress(form: FormData) {
  const { supabase } = await adminContext();
  const user_id = text(form, "userId");
  const path = `/admin/customers/${encodeURIComponent(user_id)}`;
  const id = Number(text(form, "id"));
  const payload = {
    user_id,
    recipient_name: text(form, "recipientName"),
    phone: text(form, "phone"),
    address_line: text(form, "addressLine"),
    ward: text(form, "ward"),
    district: text(form, "district"),
    province: text(form, "province"),
    note: text(form, "note") || null,
    is_default: form.get("isDefault") === "on",
  };
  if (
    !isUuid(user_id) ||
    !payload.recipient_name ||
    !/^(?:\+84|0)[0-9]{9,10}$/.test(payload.phone.replace(/[ .-]/g, "")) ||
    !payload.address_line ||
    !payload.ward ||
    !payload.district ||
    !payload.province
  )
    go(path, "Địa chỉ không hợp lệ.");
  const { data, error } =
    Number.isSafeInteger(id) && id > 0
      ? await supabase
          .from("addresses")
          .update(payload)
          .eq("id", id)
          .eq("user_id", user_id)
          .select("id")
          .maybeSingle()
      : await supabase
          .from("addresses")
          .insert(payload)
          .select("id")
          .maybeSingle();
  if (error || !data) go(path, "Không lưu được địa chỉ.");
  revalidatePath(path);
  revalidatePath("/account/addresses");
  go(path, "Đã lưu địa chỉ.");
}

export async function deleteCustomerAddress(form: FormData) {
  const { supabase } = await adminContext();
  const userId = text(form, "userId");
  const id = Number(text(form, "id"));
  const path = `/admin/customers/${encodeURIComponent(userId)}`;
  if (!Number.isSafeInteger(id) || id < 1) go(path, "Địa chỉ không hợp lệ.");
  const { data, error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();
  if (error || !data) go(path, "Không xóa được địa chỉ.");
  revalidatePath(path);
  revalidatePath("/account/addresses");
  go(path, "Đã xóa địa chỉ.");
}
