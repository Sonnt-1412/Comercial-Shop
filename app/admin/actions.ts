"use server";

import { revalidatePath } from "next/cache";
import { adminMutation } from "@/lib/admin-mutation";
import { isUuid } from "@/lib/admin-permissions";
import {
  formText as text,
  integerField,
  productImagePaths,
  validSlug,
} from "@/lib/admin-forms";
import { orderStatuses } from "@/lib/orders";

function refreshCatalog() {
  for (const path of [
    "/",
    "/shop",
    "/search",
    "/cart",
    "/checkout",
    "/admin",
    "/admin/products",
    "/admin/categories",
  ])
    revalidatePath(path);
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/admin/products/[slug]", "page");
}

export async function saveProduct(form: FormData) {
  return adminMutation(async (supabase) => {
    const originalSlug = text(form, "originalSlug");
    const slug = text(form, "slug");
    const name = text(form, "name");
    const shortName = text(form, "shortName");
    const category = text(form, "category");
    const price = integerField(text(form, "price"), 0, 1_000_000_000_000);
    const stock = integerField(text(form, "stock"), 0, 1_000_000_000);
    const accent = text(form, "accent");
    const art = text(form, "art");
    if (
      !validSlug(slug) ||
      !name ||
      name.length > 160 ||
      shortName.length > 80 ||
      !category ||
      price === null ||
      stock === null ||
      !/^#[a-fA-F0-9]{6}$/.test(accent) ||
      !["board", "sensor", "power", "tools", "module", "display"].includes(art)
    )
      return {
        error:
          "Kiểm tra mã, tên, danh mục, giá và tồn kho. Giá và tồn kho phải là số nguyên không âm.",
      };
    const labels = form.getAll("specLabel").map(String);
    const values = form.getAll("specValue").map(String);
    const specs = labels
      .map((label, index) => ({
        label: label.trim(),
        value: (values[index] ?? "").trim(),
      }))
      .filter((spec) => spec.label || spec.value);
    if (
      specs.length > 30 ||
      specs.some(
        (spec) =>
          !spec.label ||
          !spec.value ||
          spec.label.length > 80 ||
          spec.value.length > 200,
      )
    )
      return {
        error: "Mỗi thông số cần có tên và giá trị; tối đa 30 thông số.",
      };
    const { data: foundCategory, error: categoryError } = await supabase
      .from("categories")
      .select("slug")
      .eq("slug", category)
      .maybeSingle();
    if (categoryError)
      return { error: "Không kiểm tra được danh mục. Vui lòng thử lại." };
    if (!foundCategory)
      return { error: "Danh mục không còn tồn tại. Hãy chọn danh mục khác." };
    const { data: existing, error: existingError } = originalSlug
      ? await supabase
          .from("products")
          .select("images,updated_at")
          .eq("slug", originalSlug)
          .maybeSingle()
      : { data: null, error: null };
    if (existingError) return { error: "Không tải được sản phẩm hiện tại." };
    if (originalSlug && (!existing || originalSlug !== slug))
      return {
        error:
          "Sản phẩm không còn tồn tại hoặc mã đã thay đổi. Hãy tải lại danh sách.",
      };
    // Stock may have changed because a customer placed an order while this form was open.
    if (existing && text(form, "updatedAt") !== existing.updated_at)
      return {
        error:
          "Sản phẩm hoặc tồn kho vừa thay đổi. Hãy tải lại trang để xem số lượng mới trước khi lưu.",
      };
    const removed = new Set(form.getAll("removeImage").map(String));
    const images = ((existing?.images ?? []) as string[]).filter(
      (url) => !removed.has(url),
    );
    const uploads = form
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);
    if (images.length + uploads.length > 6)
      return {
        error:
          "Chỉ được lưu tối đa 6 ảnh. Chọn xóa ảnh cũ hoặc giảm số ảnh mới.",
      };
    if (
      uploads.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type),
      ) ||
      uploads.reduce((total, file) => total + file.size, 0) > 4 * 1024 * 1024
    )
      return {
        error:
          "Ảnh phải là JPG, PNG hoặc WebP; tổng ảnh mỗi lượt lưu tối đa 4 MB.",
      };
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
        return {
          error: "Không tải được ảnh lên. Hãy thử lại với ảnh nhỏ hơn.",
        };
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
    const { data, error } = existing
      ? await supabase
          .from("products")
          .update(payload)
          .eq("slug", originalSlug)
          .eq("updated_at", existing.updated_at)
          .select("slug")
          .maybeSingle()
      : await supabase.from("products").insert(payload).select("slug").single();
    if (error || !data) {
      if (uploadedPaths.length)
        await supabase.storage.from("product-images").remove(uploadedPaths);
      return {
        error:
          error?.code === "23505"
            ? "Mã sản phẩm đã tồn tại. Hãy dùng mã khác."
            : !error
              ? "Tồn kho vừa thay đổi. Hãy tải lại trang trước khi lưu."
              : "Không lưu được sản phẩm. Hãy kiểm tra dữ liệu và thử lại.",
      };
    }
    const removedPaths = productImagePaths(
      ((existing?.images ?? []) as string[]).filter((url) => removed.has(url)),
      slug,
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    );
    if (removedPaths.length)
      await supabase.storage.from("product-images").remove(removedPaths);
    refreshCatalog();
    return {
      message: "Đã lưu sản phẩm.",
      redirectTo: `/admin/products/${encodeURIComponent(slug)}?notice=${encodeURIComponent("Đã lưu sản phẩm.")}`,
    };
  });
}

export async function deleteProduct(form: FormData) {
  return adminMutation(async (supabase) => {
    const slug = text(form, "slug");
    if (!validSlug(slug)) return { error: "Mã sản phẩm không hợp lệ." };
    const { data: product, error: readError } = await supabase
      .from("products")
      .select("images")
      .eq("slug", slug)
      .maybeSingle();
    if (readError) return { error: "Chưa thể kiểm tra sản phẩm." };
    if (!product)
      return {
        message: "Sản phẩm đã được xóa.",
        redirectTo: "/admin/products",
      };
    const { error } = await supabase.from("products").delete().eq("slug", slug);
    if (error?.code === "23503") {
      const { error: hideError } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("slug", slug);
      if (hideError) return { error: "Chưa thể ẩn sản phẩm. Hãy thử lại." };
      refreshCatalog();
      return {
        message:
          "Đã ẩn sản phẩm khỏi cửa hàng. Lịch sử đơn hàng vẫn được giữ nguyên.",
        redirectTo: `/admin/products?notice=${encodeURIComponent("Đã ẩn sản phẩm đã có đơn hàng; lịch sử đơn vẫn được giữ.")}`,
      };
    }
    if (error) return { error: "Chưa thể xóa sản phẩm. Hãy thử lại." };
    const paths = productImagePaths(
      product.images ?? [],
      slug,
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    );
    if (paths.length)
      await supabase.storage.from("product-images").remove(paths);
    refreshCatalog();
    return {
      message: "Đã xóa sản phẩm.",
      redirectTo: `/admin/products?notice=${encodeURIComponent("Đã xóa sản phẩm.")}`,
    };
  });
}

export async function setProductVisibility(form: FormData) {
  return adminMutation(async (supabase) => {
    const slug = text(form, "slug");
    const value = text(form, "active");
    if (!validSlug(slug) || !["true", "false"].includes(value))
      return { error: "Sản phẩm không hợp lệ." };
    const { data, error } = await supabase
      .from("products")
      .update({ is_active: value === "true" })
      .eq("slug", slug)
      .select("slug")
      .maybeSingle();
    if (error || !data)
      return { error: "Không đổi được hiển thị. Sản phẩm có thể đã bị xóa." };
    refreshCatalog();
    return {
      message: value === "true" ? "Đã hiện sản phẩm." : "Đã ẩn sản phẩm.",
    };
  });
}

export async function saveCategory(form: FormData) {
  return adminMutation(async (supabase) => {
    const original = text(form, "originalSlug");
    const slug = text(form, "slug");
    const name = text(form, "name");
    const sort_order = integerField(
      text(form, "sortOrder"),
      -2147483648,
      2147483647,
    );
    if (
      !validSlug(slug, 80) ||
      !name ||
      name.length > 80 ||
      sort_order === null
    )
      return {
        error: "Nhập mã danh mục không dấu, tên và thứ tự là số nguyên.",
      };
    const { data, error } = original
      ? await supabase
          .from("categories")
          .update({ slug, name, sort_order })
          .eq("slug", original)
          .select("slug")
          .maybeSingle()
      : await supabase
          .from("categories")
          .insert({ slug, name, sort_order })
          .select("slug")
          .single();
    if (error || !data)
      return {
        error:
          error?.code === "23505"
            ? "Mã danh mục đã tồn tại. Hãy dùng mã khác."
            : "Không lưu được danh mục. Hãy tải lại dữ liệu và thử lại.",
      };
    refreshCatalog();
    return { message: "Đã lưu danh mục." };
  });
}

export async function deleteCategory(form: FormData) {
  return adminMutation(async (supabase) => {
    const slug = text(form, "slug");
    if (!validSlug(slug, 80)) return { error: "Mã danh mục không hợp lệ." };
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("slug", slug);
    if (error)
      return {
        error:
          error.code === "23503"
            ? "Danh mục còn sản phẩm (kể cả sản phẩm ẩn). Hãy chuyển chúng sang danh mục khác trước khi xóa."
            : "Chưa thể xóa danh mục. Hãy thử lại.",
      };
    refreshCatalog();
    return { message: "Đã xóa danh mục." };
  });
}

export async function updateOrder(form: FormData) {
  return adminMutation(async (supabase) => {
    const id = integerField(text(form, "id"), 1, Number.MAX_SAFE_INTEGER);
    const status = text(form, "status");
    if (!id || !Object.hasOwn(orderStatuses, status))
      return { error: "Đơn hàng hoặc trạng thái không hợp lệ." };
    const { error } = await supabase.rpc("admin_update_order_status", {
      p_order_id: id,
      p_status: status,
    });
    if (error)
      return {
        error:
          error.code === "22023"
            ? "Không cập nhật được trạng thái: đơn đã bị xóa hoặc tồn kho không đủ để mở lại đơn đã hủy. Hãy kiểm tra tồn kho."
            : "Chưa cập nhật được đơn hàng. Vui lòng thử lại.",
      };
    refreshCatalog();
    for (const path of [
      "/admin/orders",
      `/admin/orders/${id}`,
      "/account/orders",
      `/account/orders/${id}`,
      "/admin/customers",
    ])
      revalidatePath(path);
    revalidatePath("/admin/customers/[id]", "page");
    return { message: "Đã cập nhật trạng thái đơn hàng." };
  });
}

export async function saveCustomer(form: FormData) {
  return adminMutation(async (supabase) => {
    const id = text(form, "id");
    const email = text(form, "email").toLowerCase();
    const full_name = text(form, "fullName");
    const phone = text(form, "phone");
    const password = String(form.get("password") ?? "");
    const note = text(form, "customerNote");
    if (
      !isUuid(id) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      full_name.length > 120 ||
      phone.length > 30 ||
      note.length > 2000 ||
      (password && (password.length < 8 || password.length > 128))
    )
      return {
        error:
          "Kiểm tra email, họ tên, điện thoại và mật khẩu (8–128 ký tự nếu đổi).",
      };
    const [
      { data: authUser, error: userError },
      { data: profile, error: profileError },
    ] = await Promise.all([
      supabase.auth.admin.getUserById(id),
      supabase
        .from("profiles")
        .select("customer_attributes")
        .eq("user_id", id)
        .maybeSingle(),
    ]);
    if (userError || !authUser.user)
      return { error: "Không tìm thấy khách hàng." };
    if (profileError) return { error: "Không tải được hồ sơ khách hàng." };
    const attributes: { email?: string; password?: string } = {};
    if (email !== authUser.user.email) attributes.email = email;
    if (password) attributes.password = password;
    if (Object.keys(attributes).length) {
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        attributes,
      );
      if (error)
        return {
          error:
            "Không cập nhật được email hoặc mật khẩu. Email có thể đã tồn tại hoặc mật khẩu chưa đủ mạnh.",
        };
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: id,
        full_name: full_name || null,
        phone: phone || null,
        customer_attributes: { ...(profile?.customer_attributes ?? {}), note },
      });
    if (error)
      return {
        error: Object.keys(attributes).length
          ? "Email/mật khẩu đã cập nhật, nhưng hồ sơ chưa lưu được. Hãy thử lưu hồ sơ lại."
          : "Không lưu được hồ sơ khách hàng.",
      };
    for (const path of [
      "/admin/customers",
      `/admin/customers/${id}`,
      "/account",
    ])
      revalidatePath(path);
    return { message: "Đã lưu khách hàng." };
  });
}

export async function saveCustomerAddress(form: FormData) {
  return adminMutation(async (supabase) => {
    const user_id = text(form, "userId");
    const rawId = text(form, "id");
    const id = rawId ? integerField(rawId, 1, Number.MAX_SAFE_INTEGER) : null;
    const payload = {
      user_id,
      recipient_name: text(form, "recipientName"),
      phone: text(form, "phone").replace(/[ .-]/g, ""),
      address_line: text(form, "addressLine"),
      ward: text(form, "ward"),
      district: text(form, "district"),
      province: text(form, "province"),
      note: text(form, "note") || null,
      is_default: form.get("isDefault") === "on",
    };
    if (
      !isUuid(user_id) ||
      (rawId && !id) ||
      !payload.recipient_name ||
      payload.recipient_name.length > 120 ||
      !/^(?:\+84|0)[0-9]{9,10}$/.test(payload.phone) ||
      !payload.address_line ||
      payload.address_line.length > 240 ||
      [payload.ward, payload.district, payload.province].some(
        (value) => !value || value.length > 120,
      ) ||
      (payload.note?.length ?? 0) > 500
    )
      return { error: "Nhập đầy đủ địa chỉ và số điện thoại Việt Nam hợp lệ." };
    const { data, error } = id
      ? await supabase
          .from("addresses")
          .update(payload)
          .eq("id", id)
          .eq("user_id", user_id)
          .select("id")
          .maybeSingle()
      : await supabase.from("addresses").insert(payload).select("id").single();
    if (error || !data)
      return {
        error: "Không lưu được địa chỉ. Kiểm tra khách hàng và thử lại.",
      };
    for (const path of [
      `/admin/customers/${user_id}`,
      "/account/addresses",
      "/checkout",
    ])
      revalidatePath(path);
    return { message: "Đã lưu địa chỉ." };
  });
}

export async function deleteCustomerAddress(form: FormData) {
  return adminMutation(async (supabase) => {
    const userId = text(form, "userId");
    const id = integerField(text(form, "id"), 1, Number.MAX_SAFE_INTEGER);
    if (!isUuid(userId) || !id) return { error: "Địa chỉ không hợp lệ." };
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) return { error: "Không xóa được địa chỉ. Vui lòng thử lại." };
    for (const path of [
      `/admin/customers/${userId}`,
      "/account/addresses",
      "/checkout",
    ])
      revalidatePath(path);
    return { message: "Đã xóa địa chỉ." };
  });
}
