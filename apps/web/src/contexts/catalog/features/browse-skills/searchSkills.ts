export function searchSkills<T extends { title: string; description: string }>(
  items: readonly T[],
  query: string,
) {
  const normalized = query.trim().toLowerCase();
  return normalized
    ? items.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(normalized))
    : items;
}
