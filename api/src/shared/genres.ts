export const GENRES = [
  "classical",
  "electronic",
  "hiphop",
  "jazz",
  "rock",
  "world",
] as const;

export type Genre = (typeof GENRES)[number];
