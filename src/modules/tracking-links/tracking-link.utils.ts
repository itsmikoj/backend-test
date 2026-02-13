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
  if (size < 2) throw new Error("Size must be at least 2");

  const maxNumbers = Math.floor((size - 1) / 2);
  const numNumbers = crypto.randomInt(0, maxNumbers + 1);
  const numLetters = size - numNumbers;

  const result: string[] = [];

  for (let i = 0; i < numLetters; i++) {
    result.push(LETTERS[crypto.randomInt(0, LETTERS.length)]);
  }

  for (let i = 0; i < numNumbers; i++) {
    result.push(NUMBERS[crypto.randomInt(0, NUMBERS.length)]);
  }

  return secureShuffle(result).join("");
}
