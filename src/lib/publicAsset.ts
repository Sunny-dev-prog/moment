export function getPublicAssetUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${normalizedPath}`;
}
