import { saveProduct, deleteProduct } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import Image from "next/image";

type EditableProduct = {
  slug: string;
  name: string;
  short_name: string | null;
  category: string;
  price: number;
  stock: number | null;
  description: string;
  art: string;
  accent: string;
  specs: unknown;
  images: string[];
  is_active: boolean;
};

export function ProductForm({
  product,
  categories,
}: {
  product?: EditableProduct;
  categories: { slug: string; name: string }[];
}) {
  return (
    <div>
      <form
        className="admin-form form-stack"
        action={saveProduct}
        encType="multipart/form-data"
      >
        {product ? (
          <input type="hidden" name="originalSlug" value={product.slug} />
        ) : null}
        <div className="form-grid">
          <label>
            Mã sản phẩm
            <input
              name="slug"
              defaultValue={product?.slug}
              readOnly={!!product}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxLength={120}
            />
          </label>
          <label>
            Tên sản phẩm
            <input
              name="name"
              defaultValue={product?.name}
              required
              maxLength={160}
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Tên ngắn
            <input
              name="shortName"
              defaultValue={product?.short_name ?? ""}
              maxLength={80}
            />
          </label>
          <label>
            Danh mục
            <select name="category" defaultValue={product?.category} required>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-grid">
          <label>
            Giá (₫)
            <input
              name="price"
              type="number"
              min="0"
              max="1000000000000"
              step="1"
              defaultValue={product?.price ?? 0}
              required
            />
          </label>
          <label>
            Tồn kho
            <input
              name="stock"
              type="number"
              min="0"
              max="1000000000"
              step="1"
              defaultValue={product ? (product.stock ?? "") : 0}
              required
              placeholder="Nhập số lượng thực tế"
            />
          </label>
        </div>
        <label>
          Mô tả
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
            maxLength={3000}
          />
        </label>
        <div className="form-grid">
          <label>
            Minh họa
            <select name="art" defaultValue={product?.art ?? "module"}>
              {["board", "sensor", "power", "tools", "module", "display"].map(
                (art) => (
                  <option key={art} value={art}>
                    {art}
                  </option>
                ),
              )}
            </select>
          </label>
          <label>
            Màu minh họa
            <input
              name="accent"
              type="color"
              defaultValue={product?.accent ?? "#c8a96b"}
            />
          </label>
        </div>
        <label>
          Thông số kỹ thuật (JSON)
          <textarea
            name="specs"
            rows={6}
            defaultValue={JSON.stringify(product?.specs ?? [], null, 2)}
          />
        </label>
        {product?.images?.length ? (
          <fieldset className="admin-images">
            <legend>Ảnh hiện có</legend>
            {product.images.map((url) => (
              <label key={url}>
                <Image
                  src={url}
                  alt="Ảnh sản phẩm"
                  width={120}
                  height={90}
                  unoptimized
                />
                <span>
                  <input type="checkbox" name="removeImage" value={url} /> Xóa
                  ảnh này
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}
        <label>
          Thêm ảnh (tối đa 6 ảnh; tổng ảnh mỗi lượt lưu tối đa 4 MB)
          <input
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
          />
        </label>
        <label className="check-label">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={product?.is_active ?? true}
          />{" "}
          Hiển thị ở cửa hàng
        </label>
        <button className="button button-primary" type="submit">
          {product ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </button>
      </form>
      {product ? (
        <form className="admin-delete" action={deleteProduct}>
          <input type="hidden" name="slug" value={product.slug} />
          <ConfirmSubmitButton
            className="danger-link"
            message={`Xóa sản phẩm ${product.name}? Nếu đã có đơn hàng, hãy ẩn sản phẩm thay vì xóa.`}
          >
            Xóa sản phẩm
          </ConfirmSubmitButton>
        </form>
      ) : null}
    </div>
  );
}
