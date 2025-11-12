export const generateSpanishPrompt = (englishPhrase: string): string => {
  return `
You are a Bible translator. Translate the following Bible verse from English to Spanish.
Return only the translated verse, and keep the exact format: "translated phrase" - author:verse
Do not add any commentary, explanation, or extra text.

Original:
${englishPhrase}
`;
};
