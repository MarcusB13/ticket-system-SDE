export function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return initials;
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}
