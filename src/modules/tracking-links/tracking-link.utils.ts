import crypto from "crypto";

export function generateId(size: number): string {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const charset = letters + numbers;

  const bytes = crypto.randomBytes(size);
  let result = "";

  for (let i = 0; i < size; i++) {
    const char = charset[bytes[i] % charset.length];
    if (numbers.includes(char)) {
      if (i > size * 0.2) continue;
    }
    result += char;
  }

  if (result.length < size) {
    const remaining = size - result.length;
    const letterBytes = crypto.randomBytes(remaining);
    for (let i = 0; i < remaining; i++) {
      result += letters[letterBytes[i] % letters.length];
    }
  }

  return result;
}
