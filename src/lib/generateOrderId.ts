// lib/generateOrderId.ts
export function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // 20240315
  const random = Math.random().toString(36).substring(2, 7).toUpperCase(); // X4K9P
  return `EB-${date}-${random}`; // EB-20240315-X4K9P
}
