export function resolveMediaUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  if (value.startsWith("/api/") || value.startsWith("/")) {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `/api/${value}`;
}

export function normalizeStoredMediaValue(value?: string | null) {
  if (!value) {
    return null;
  }

  if (value.startsWith("/api/media/")) {
    return `/api/${value.slice("/api/media/".length)}`;
  }

  if (value.startsWith("/api/")) {
    return value;
  }

  return value;
}
