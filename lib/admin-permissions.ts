export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function isAllowedAdminId(
  userId: string,
  configuredIds: string | undefined,
) {
  if (!isUuid(userId)) return false;
  return (configuredIds ?? "")
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .includes(userId.toLowerCase());
}
