import crypto from "crypto";

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";

function secureShuffle(arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateId(size: number = 10): string {
  if (size < 1) throw new Error("Size must be at least 1");

  const result: string[] = [];

  const hasNumber = crypto.randomInt(0, 2) === 1;

  const numNumbers = hasNumber ? 1 : 0;
  const numLetters = size - numNumbers;

  for (let i = 0; i < numLetters; i++) {
    result.push(LETTERS[crypto.randomInt(0, LETTERS.length)]);
  }

  if (hasNumber) {
    result.push(NUMBERS[crypto.randomInt(0, NUMBERS.length)]);
  }

  return secureShuffle(result).join("");
}
