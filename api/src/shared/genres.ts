export const GENRES = [
  "classical",
  "electronic",
  "hiphop",
  "jazz",
  "pop",
  "rock",
  "world",
] as const;

export type Genre = (typeof GENRES)[number];
