export function noticeUrl(path: string, message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}notice=${encodeURIComponent(message)}`;
}
