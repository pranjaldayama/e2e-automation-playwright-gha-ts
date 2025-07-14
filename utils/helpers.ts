export function getRandomElement<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

export function logSkip(reason: string) {
  console.warn(`SKIPPED: ${reason}`);
} 