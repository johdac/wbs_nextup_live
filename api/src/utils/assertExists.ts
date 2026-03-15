// This util checks that the value is present and of type T for typescript safety
export function assertExists<T>(
  value: T | null | undefined,
): asserts value is T {
  if (value == null) {
    throw new Error("Unexpected null or undefined value");
  }
}
