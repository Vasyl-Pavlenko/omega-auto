export function isExpired(validUntil: string): boolean {
  return new Date(validUntil) < new Date();
}
