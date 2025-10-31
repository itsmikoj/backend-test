export const generateCitation = `Return a random Bible verse in the following format:
  "phrase" - author:verse
  Rules:
  - Choose a verse relevant to today's date in the Christian calendar (Catholic, Protestant, or Orthodox).
  - If near a significant observance (Easter, Christmas, Lent, Pentecost), select a verse reflecting that theme.
  - Ensure the verse is not repeated recently.
  - You must vary the output randomly to avoid repetition, even if asked the same prompt multiple times.
  - Do not include any verse that contains the word "beyond".
  Return only the verse as specified, without explanations.`;
