export function toTags(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
