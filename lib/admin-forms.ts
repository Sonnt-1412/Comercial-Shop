export type AdminResult = {
  error?: string;
  message?: string;
  redirectTo?: string;
};

export function formText(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function integerField(value: string, min: number, max: number) {
  if (!/^-?\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= min && number <= max
    ? number
    : null;
}

export function validSlug(value: string, max = 120) {
  return value.length <= max && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function adminPage(value?: string) {
  return integerField(value ?? "1", 1, 100000) ?? 1;
}

// Keep search text out of PostgREST's filter syntax and wildcard operators.
export function searchText(value?: string) {
  return (value ?? "")
    .replace(/[^\p{L}\p{N}\s@.+-]/gu, " ")
    .trim()
    .slice(0, 100);
}

export function productImagePaths(
  images: string[],
  slug: string,
  origin: string,
) {
  return images.flatMap((image) => {
    try {
      const url = new URL(image);
      const prefix = "/storage/v1/object/public/product-images/";
      if (
        url.origin !== new URL(origin).origin ||
        !url.pathname.startsWith(prefix)
      )
        return [];
      const path = decodeURIComponent(url.pathname.slice(prefix.length));
      return path.startsWith(`${slug}/`) && !path.includes("..") ? [path] : [];
    } catch {
      return [];
    }
  });
}
