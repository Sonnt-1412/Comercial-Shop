import Link from "next/link";
import { notFound } from "next/navigation";
import { adminContext } from "@/lib/admin";
import {
  deleteCustomerAddress,
  saveCustomer,
  saveCustomerAddress,
} from "@/app/admin/actions";
import { AdminForm } from "@/components/admin-form";
import { formatOrderDate, orderStatuses } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { isUuid } from "@/lib/admin-permissions";

export default async function AdminCustomerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { supabase } = await adminContext();
  const [
    { data: auth, error: authError },
    { data: profile, error: profileError },
    { data: addresses, error: addressError },
    { data: orders, error: orderError },
  ] = await Promise.all([
    supabase.auth.admin.getUserById(id),
    supabase
      .from("profiles")
      .select("full_name, phone, customer_attributes")
      .eq("user_id", id)
      .maybeSingle(),
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", id)
      .order("is_default", { ascending: false }),
    supabase
      .from("orders")
      .select("id, order_number, created_at, total, status")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  if (authError?.status === 404) notFound();
  if (authError || profileError || addressError || orderError)
    throw new Error("Không tải được khách hàng.");
  if (!auth.user) notFound();
  const notice = (await searchParams).notice;
  return (
    <section>
      <Link className="text-link" href="/admin/customers">
        ← Khách hàng
      </Link>
      <div className="admin-section-heading">
        <h2>{profile?.full_name || auth.user.email}</h2>
        <span>{id}</span>
      </div>
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      <div className="admin-panel">
        <h3>Thông tin tài khoản</h3>
        <AdminForm className="form-stack" action={saveCustomer}>
          <input type="hidden" name="id" value={id} />
          <div className="form-grid">
            <label>
              Họ tên
              <input
                name="fullName"
                defaultValue={profile?.full_name ?? ""}
                maxLength={120}
              />
            </label>
            <label>
              Điện thoại
              <input
                name="phone"
                defaultValue={profile?.phone ?? ""}
                maxLength={30}
              />
            </label>
          </div>
          <label>
            Email đăng nhập
            <input
              name="email"
              type="email"
              defaultValue={auth.user.email ?? ""}
              required
            />
          </label>
          <label>
            Mật khẩu mới (để trống nếu không đổi)
            <input
              name="password"
              type="password"
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
            />
          </label>
          <label>
            Ghi chú khách hàng
            <textarea
              name="customerNote"
              rows={4}
              maxLength={2000}
              defaultValue={
                typeof profile?.customer_attributes?.note === "string"
                  ? profile.customer_attributes.note
                  : ""
              }
              placeholder="Nhu cầu, lưu ý khi chăm sóc khách hàng…"
            />
          </label>
          <button className="button button-primary" type="submit">
            Lưu khách hàng
          </button>
        </AdminForm>
      </div>
      <div className="admin-panel">
        <h3>Địa chỉ giao hàng</h3>
        {(addresses ?? []).map((address) => (
          <details className="admin-address" key={address.id}>
            <summary>
              {address.recipient_name} · {address.address_line},{" "}
              {address.province}
              {address.is_default ? " · Mặc định" : ""}
            </summary>
            <CustomerAddressForm userId={id} address={address} />
            <AdminForm
              action={deleteCustomerAddress}
              confirm={`Xóa địa chỉ của ${address.recipient_name}?`}
            >
              <input type="hidden" name="userId" value={id} />
              <input type="hidden" name="id" value={address.id} />
              <button type="submit" className="danger-link">
                Xóa địa chỉ
              </button>
            </AdminForm>
          </details>
        ))}
        <details className="admin-address">
          <summary>+ Thêm địa chỉ</summary>
          <CustomerAddressForm userId={id} />
        </details>
      </div>
      <div className="admin-panel">
        <div className="admin-section-heading">
          <h3>Lịch sử đơn hàng gần đây</h3>
          <Link className="text-link" href={`/admin/orders?customer=${id}`}>
            Xem tất cả →
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày</th>
                <th>Tổng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>
                      {order.order_number}
                    </Link>
                  </td>
                  <td>{formatOrderDate(order.created_at)}</td>
                  <td>{formatPrice(Number(order.total))}</td>
                  <td>{orderStatuses[order.status] ?? order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders?.length ? <p>Chưa có đơn hàng.</p> : null}
      </div>
    </section>
  );
}

type CustomerAddress = {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  ward: string;
  district: string;
  province: string;
  note: string | null;
  is_default: boolean;
};
function CustomerAddressForm({
  userId,
  address,
}: {
  userId: string;
  address?: CustomerAddress;
}) {
  return (
    <AdminForm
      className="form-stack"
      action={saveCustomerAddress}
      resetOnSuccess={!address}
    >
      <input type="hidden" name="userId" value={userId} />
      {address ? <input type="hidden" name="id" value={address.id} /> : null}
      <div className="form-grid">
        <label>
          Người nhận
          <input
            name="recipientName"
            defaultValue={address?.recipient_name}
            required
            maxLength={120}
          />
        </label>
        <label>
          Số điện thoại
          <input
            name="phone"
            defaultValue={address?.phone}
            required
            maxLength={30}
          />
        </label>
      </div>
      <label>
        Số nhà, đường
        <input
          name="addressLine"
          defaultValue={address?.address_line}
          required
          maxLength={240}
        />
      </label>
      <div className="form-grid form-grid-three">
        <label>
          Phường / Xã
          <input
            name="ward"
            defaultValue={address?.ward}
            required
            maxLength={120}
          />
        </label>
        <label>
          Quận / Huyện
          <input
            name="district"
            defaultValue={address?.district}
            required
            maxLength={120}
          />
        </label>
        <label>
          Tỉnh / Thành phố
          <input
            name="province"
            defaultValue={address?.province}
            required
            maxLength={120}
          />
        </label>
      </div>
      <label>
        Ghi chú
        <textarea
          name="note"
          defaultValue={address?.note ?? ""}
          maxLength={500}
        />
      </label>
      <label className="check-label">
        <input
          name="isDefault"
          type="checkbox"
          defaultChecked={address?.is_default}
        />{" "}
        Mặc định
      </label>
      <button className="button button-primary" type="submit">
        {address ? "Lưu địa chỉ" : "Thêm địa chỉ"}
      </button>
    </AdminForm>
  );
}
