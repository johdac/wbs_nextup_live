import { createContext, useContext, useRef, useState } from "react";
import {
  type PlayerState,
  type Player,
  type PlaylistItem,
} from "./playerTypes";
import { parseSong } from "./utils/parseSong";

const PlayerContext = createContext<Player | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerStateId, setPlayerStateId] = useState<string>(
    crypto.randomUUID(),
  );
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playerState, setPlayerState] = useState<PlayerState>("paused");

  const youtubeRef = useRef<any>(null);
  const soundcloudRef = useRef<any>(null);

  const addOneToPlaylist = (item: PlaylistItem) => {
    item.song = parseSong(item.song);
    setPlaylist((prev) => [...prev, item]);
  };

  const addManyToPlaylist = (items: PlaylistItem[]) => {
    const parsedItems = items.map((item) => ({
      ...item,
      song: parseSong(item.song),
    }));
    setPlaylist((prev) => [...prev, ...parsedItems]);
  };

  const emptyOutPlaylist = () => {
    setPlaylist([]);
  };

  const replacePlaylist = (items: PlaylistItem[]) => {
    setPlaylist(items);
  };

  const pauseCurrentBeforeSwitch = () => {
    if (
      playlist[currentIndex].song.vendor === "youtube" &&
      youtubeRef.current &&
      typeof youtubeRef.current.pauseVideo === "function"
    ) {
      youtubeRef.current.pauseVideo();
    }
    if (
      playlist[currentIndex].song.vendor === "soundcloud" &&
      soundcloudRef.current &&
      typeof soundcloudRef.current.pause === "function"
    ) {
      soundcloudRef.current.pause();
    }
  };

  /* This replaces the playlist with a list of track */
  const playTracks = (items: PlaylistItem[]) => {
    if (items.length === 0) return;
    // Enrich the song data with embedable autoplay url and vendor data
    const parsedItems = items.map((item) => ({
      ...item,
      song: parseSong(item.song),
    }));
    emptyOutPlaylist();
    setPlayerStateId(crypto.randomUUID()); // This removes old player instances
    setPlaylist(parsedItems);
    setCurrentIndex(0);
    setPlayerState("playing");
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    if (currentIndex >= playlist.length - 1) setCurrentIndex(-1);
    else setCurrentIndex((prev) => prev + 1);
  };

  const playPrev = () => {
    if (playlist.length === 0 || currentIndex <= 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const togglePlayPause = (): void => {
    if (currentIndex < 0) setCurrentIndex(0);
    if (playerState === "paused") setPlayerState("playing");
    if (playerState === "playing") setPlayerState("paused");
  };

  const favoriteEvent = (eventId: string) => {
    console.log(eventId);
  };

  const player: Player = {
    playerStateId,
    playlist,
    currentIndex,
    playerState,
    youtubeRef,
    soundcloudRef,
    addOneToPlaylist,
    addManyToPlaylist,
    emptyOutPlaylist,
    replacePlaylist,
    playNext,
    playPrev,
    togglePlayPause,
    playTracks,
    pauseCurrentBeforeSwitch,
    favoriteEvent,
  };

  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = (): Player => {
  const player = useContext(PlayerContext);
  if (!player) throw new Error("PlayerProvider missing");
  return player;
};
