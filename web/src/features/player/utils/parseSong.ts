import type { PlaylistSong, Vendors } from "../playerTypes";

/**
 * This function takes a PlaylistSong object and enriches the vendor and
 * embedUrl within it
 */

export const parseSong = (song: PlaylistSong): PlaylistSong => {
  //
  const YOUTUBE_PATTERN =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const SOUNDCLOUD = /soundcloud\.com\/[^\s,]+/i;

  const url = song.sourceUrl.trim();
  if (!url) return song;

  let vendor: Vendors | null = null;
  let embedUrl = "";

  if (YOUTUBE_PATTERN.test(url)) {
    const id = url.match(YOUTUBE_PATTERN)?.[1];
    if (!id) return song;
    vendor = "youtube";
    embedUrl = `https://www.youtube.com/embed/${id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&autoplay=1`;
  } else if (SOUNDCLOUD.test(url)) {
    vendor = "soundcloud";
    const encoded = encodeURIComponent(url.split("?")[0]);
    embedUrl = `https://w.soundcloud.com/player/?url=${encoded}&auto_play=true`;
  }

  if (!vendor || !embedUrl) return song;
  return {
    ...song,
    embedUrl,
    vendor,
  };
};
