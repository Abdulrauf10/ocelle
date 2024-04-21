export async function awaitable<T>(
  callable: () => Promise<T>,
  shouldBreak: (value: T) => boolean,
  maxRetry: number = 90,
  preiod: number = 2
) {
  for (let i = 0; i < maxRetry; i++) {
    const value = await callable();
    if (shouldBreak(value)) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * preiod));
  }
}
