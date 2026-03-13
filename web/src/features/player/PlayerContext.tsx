import { createContext, useContext, useRef, useState } from "react";
import {
  type PlayerState,
  type Player,
  type PlaylistItem,
} from "./playerTypes";
import { parseSong } from "./utils/parseSong";
import { pl } from "date-fns/locale";

const PlayerContext = createContext<Player | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
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
    const parsedItems = items.map((item) => {
      item.song = parseSong(item.song);
      return item;
    });
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

  /* This replaces the playlist with a single track */
  const playTrack = (item: PlaylistItem) => {
    // Enrich the song data with embedable autoplay url and vendor data
    item.song = parseSong(item.song);
    pauseCurrentBeforeSwitch();
    setCurrentIndex(0);
    setPlayerState("playing");
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    console.log(
      "currentIndex",
      currentIndex,
      "playlist.length",
      playlist.length,
    );
    if (currentIndex >= playlist.length - 1) setCurrentIndex(-1);
    else setCurrentIndex((prev) => prev + 1);
  };

  const playPrev = () => {};

  // const goPrev = () => {
  //     if (playlist.length === 0 || currentIndex <= 0) return;
  //     const newIndex = currentIndex - 1;
  //     setCurrentIndex(newIndex);
  //     showTrack(playlist[newIndex], true);
  //   };

  const togglePlayPause = (): void => {
    if (currentIndex < 0) setCurrentIndex(0);
    if (playerState === "paused") setPlayerState("playing");
    if (playerState === "playing") setPlayerState("paused");
  };

  const favoriteEvent = (eventId: string) => {};

  // const togglePlayPause = () => {
  //   if (currentVendor === "youtube" && ytPlayer) {
  //     if (isPlaying) {
  //       ytPlayer.pauseVideo?.();
  //     } else {
  //       ytPlayer.playVideo?.();
  //     }
  //     setIsPlaying(!isPlaying);
  //   } else if (currentVendor === "soundcloud" && scPlayer) {
  //     if (isPlaying) {
  //       scPlayer.pause?.();
  //     } else {
  //       scPlayer.play?.();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  // useEffect(() => {
  //   const items = parseInput(defaultUrls.join("\n"));
  //   setPlaylist(items);
  //   if (items.length > 0) {
  //     showTrack(items[0], false);
  //   }
  // }, []);

  const player: Player = {
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
    playTrack,
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
