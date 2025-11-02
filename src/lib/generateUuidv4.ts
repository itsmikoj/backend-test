const { v4: uuidv4 } = require("uuid");

export const generateUuidv4 = (): string => {
  return uuidv4();
};
