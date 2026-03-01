export const GENRES = [
  "rock",
  "jazz",
  "hiphop",
  "electronic",
  "classical",
] as const;

export type Genre = (typeof GENRES)[number];
