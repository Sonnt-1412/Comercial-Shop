import { SearchIcon } from "@/components/icons";

export function SearchForm({ initialValue = "" }: { initialValue?: string }) {
  return (
    <form className="search-form" action="/search">
      <SearchIcon />
      <input
        aria-label="Tìm sản phẩm"
        defaultValue={initialValue}
        name="q"
        autoComplete="off"
        placeholder="Tên sản phẩm, từ khóa hoặc danh mục…"
        type="search"
      />
      <button type="submit">Tìm</button>
    </form>
  );
}
