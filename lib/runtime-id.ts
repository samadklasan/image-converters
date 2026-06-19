function createFallbackId() {
  const timestampPart = Date.now().toString(36);

  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);

    const randomPart = Array.from(bytes, (value) =>
      value.toString(16).padStart(2, "0"),
    ).join("");

    return `${timestampPart}-${randomPart}`;
  }

  return `${timestampPart}-${Math.random().toString(36).slice(2, 12)}`;
}

export function createRuntimeId() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return createFallbackId();
}
