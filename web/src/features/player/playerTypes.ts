import type { RefObject } from "react";

export type Vendors = "youtube" | "soundcloud";

export type PlaylistArtist = {
  id: string;
  name: string;
};

export type PlaylistLocation = {
  id: string;
  name: string;
  city: string;
};

export type PlaylistEvent = {
  id: string;
  location: PlaylistLocation;
  start: string;
  favoritedEvent: Boolean;
};

export type PlaylistSong = {
  id: string;
  artist: PlaylistArtist;
  sourceUrl: string;
  embedUrl?: string;
  vendor?: Vendors;
  title: string;
};

export type PlaylistItem = {
  played: Boolean;
  song: PlaylistSong;
  event: PlaylistEvent;
};

export type Playlist = PlaylistItem[];

export type PlayerState = "playing" | "paused";

export type Player = {
  playlist: Playlist;
  currentIndex: number;
  playerState: PlayerState;
  youtubeRef: RefObject<any>;
  soundcloudRef: RefObject<any>;

  addOneToPlaylist: (item: PlaylistItem) => void;
  addManyToPlaylist: (items: PlaylistItem[]) => void;
  emptyOutPlaylist: () => void;
  replacePlaylist: (items: PlaylistItem[]) => void;

  playTrack: (item: PlaylistItem) => void;
  playNext: () => void;
  playPrev: () => void;
  togglePlayPause: () => void;
  pauseCurrentBeforeSwitch: () => void;

  favoriteEvent: (eventId: string) => void;
};
