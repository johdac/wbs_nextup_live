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

    const params = new URLSearchParams({
      enablejsapi: "1",
      origin: window.location.origin,
      autoplay: "1",
      controls: "1",
      modestbranding: "1",
      rel: "0",
      fs: "1",
      disablekb: "1",
      playsinline: "1",
      mute: "1",
    });

    embedUrl = `https://www.youtube.com/embed/${id}?${params.toString()}`;
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
