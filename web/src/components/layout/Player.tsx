import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Track {
  vendor: "youtube" | "soundcloud";
  embedUrl: string;
  displayTitle: string;
  rawUrl: string;
}

export const Player = () => {
  // Default playlist of YouTube URLs
  const defaultUrls = [
    // {
    //   artistName:
    //   eventDate:
    //   eventUrl:
    //   musicSourceUrl:
    //   musicSourceTitle:
    //   locationName:
    // }
    "https://www.youtube.com/watch?v=UrA8LSXXdJY",
    "https://www.youtube.com/watch?v=MdspvyVWz-Q",
    "https://www.youtube.com/watch?v=9rrmcNksO9U",
    "https://www.youtube.com/watch?v=Tu9IhkPQuqg",
    "https://www.youtube.com/watch?v=iWy9nZ6zjb8",
    "https://www.youtube.com/watch?v=o_IflRBvEUk",
    "https://www.youtube.com/watch?v=h02HzYIxZBM",
    "https://www.youtube.com/watch?v=cjeaN_KDn9s",
    "https://www.youtube.com/watch?v=RtvErp7AX0I",
    "https://www.youtube.com/watch?v=U-x8PZ6DgQQ",
  ];

  // STATE
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [played, setPlayed] = useState<Track[]>([]);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [scPlayer, setScPlayer] = useState<any>(null);
  const [currentVendor, setCurrentVendor] = useState<
    "youtube" | "soundcloud" | null
  >(null);
  const [embedUrl, setEmbedUrl] = useState("");
  const [nowPlayingTitle, setNowPlayingTitle] = useState("—");
  const [nowPlayingVendor, setNowPlayingVendor] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const urlInputRef = useRef<HTMLTextAreaElement>(null);

  // HELPER FUNCTIONS

  const parseUrl = (raw: string): Track | null => {
    const YOUTUBE_PATTERN =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const SOUNDCLOUD = /soundcloud\.com\/[^\s,]+/i;

    const url = raw.trim();
    if (!url) return null;

    let vendor: "youtube" | "soundcloud" | null = null;
    let embedUrl = "";
    let displayTitle = url;

    if (YOUTUBE_PATTERN.test(url)) {
      const id = url.match(YOUTUBE_PATTERN)?.[1];
      if (!id) return null;
      vendor = "youtube";
      embedUrl = `https://www.youtube.com/embed/${id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
      displayTitle = `YouTube ${id}`;
    } else if (SOUNDCLOUD.test(url)) {
      vendor = "soundcloud";
      const encoded = encodeURIComponent(url.split("?")[0]);
      embedUrl = `https://w.soundcloud.com/player/?url=${encoded}&auto_play=false`;
      displayTitle = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }

    if (!vendor || !embedUrl) return null;
    return { vendor, embedUrl, displayTitle, rawUrl: url };
  };

  const parseInput = (text: string): Track[] => {
    const parts = text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const items: Track[] = [];
    for (const part of parts) {
      const item = parseUrl(part);
      if (item) items.push(item);
    }
    return items;
  };

  const destroyCurrentPlayer = () => {
    setYtPlayer(null);
    setScPlayer(null);
    setCurrentVendor(null);
  };

  const pauseCurrentBeforeSwitch = () => {
    if (
      currentVendor === "youtube" &&
      ytPlayer &&
      typeof ytPlayer.pauseVideo === "function"
    ) {
      ytPlayer.pauseVideo();
    }
    if (
      currentVendor === "soundcloud" &&
      scPlayer &&
      typeof scPlayer.pause === "function"
    ) {
      scPlayer.pause();
    }
  };

  const initYoutubePlayer = (embedUrl: string, autoplay: boolean) => {
    const bindYoutube = () => {
      if (
        typeof (window as any).YT === "undefined" ||
        !(window as any).YT.Player
      )
        return;
      try {
        const newPlayer = new (window as any).YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              setCurrentVendor("youtube");
              if (autoplay) event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                goNext();
              }
            },
          },
        });
        setYtPlayer(newPlayer);
      } catch (e) {
        console.warn("YouTube Player init:", e);
      }
    };

    if (
      typeof (window as any).YT !== "undefined" &&
      (window as any).YT.Player
    ) {
      bindYoutube();
    } else {
      (window as any).onYouTubeIframeAPIReady = bindYoutube;
      // Load YouTube API script
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  };

  const initSoundCloudWidget = (autoplay: boolean) => {
    if (iframeRef.current?.onload) {
      iframeRef.current.onload = () => {
        try {
          if (
            typeof (window as any).SC !== "undefined" &&
            (window as any).SC.Widget
          ) {
            const widget = (window as any).SC.Widget(iframeRef.current);
            setScPlayer(widget);
            setCurrentVendor("soundcloud");
            if (autoplay && widget.play) widget.play();
            widget.bind((window as any).SC.Widget.Events.FINISH, () => {
              goNext();
            });
          }
        } catch (e) {
          console.warn("SoundCloud Widget init:", e);
        }
      };
    }
  };

  const showTrack = (item: Track, autoplay: boolean) => {
    if (!item) return;
    pauseCurrentBeforeSwitch();
    destroyCurrentPlayer();

    setNowPlayingTitle(item.displayTitle);
    setNowPlayingVendor(item.vendor);
    setEmbedUrl("");

    if (item.vendor === "youtube") {
      let ytUrl = item.embedUrl;
      if (autoplay) {
        ytUrl += (ytUrl.includes("?") ? "&" : "?") + "autoplay=1";
      }
      setEmbedUrl(ytUrl);
      setTimeout(() => {
        initYoutubePlayer(item.embedUrl, autoplay);
      }, 0);
    } else if (item.vendor === "soundcloud") {
      let scUrl = item.embedUrl;
      if (autoplay) {
        scUrl = scUrl.replace("auto_play=false", "auto_play=true");
      }
      setEmbedUrl(scUrl);
      setTimeout(() => {
        initSoundCloudWidget(autoplay);
      }, 0);
    }

    setCurrentVendor(item.vendor);
    setIsPlaying(autoplay);
  };

  const goPrev = () => {
    if (playlist.length === 0 || currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    showTrack(playlist[newIndex], true);
  };

  const goNext = () => {
    if (playlist.length === 0) return;
    const current = playlist[currentIndex];
    if (current) {
      setPlayed((prev) => [...prev, current]);
    }
    if (currentIndex >= playlist.length - 1) {
      setNowPlayingTitle("—");
      setNowPlayingVendor("");
      setEmbedUrl("");
      setCurrentIndex(playlist.length);
      destroyCurrentPlayer();
      return;
    }
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    showTrack(playlist[newIndex], true);
  };

  const togglePlayPause = () => {
    if (currentVendor === "youtube" && ytPlayer) {
      if (isPlaying) {
        ytPlayer.pauseVideo?.();
      } else {
        ytPlayer.playVideo?.();
      }
      setIsPlaying(!isPlaying);
    } else if (currentVendor === "soundcloud" && scPlayer) {
      if (isPlaying) {
        scPlayer.pause?.();
      } else {
        scPlayer.play?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const items = parseInput(defaultUrls.join("\n"));
    setPlaylist(items);
    if (items.length > 0) {
      showTrack(items[0], false);
    }
  }, []);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < playlist.length - 1;

  return (
    <div className="w-full fixed bottom-0 z-20">
      <div className="w-full container">
        {playlist.length > 0 && (
          <div className="bg-slate-800 rounded-t-2xl px-6 py-4 flex ml-40">
            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mr-5">
              <button
                onClick={goPrev}
                disabled={!canGoPrev}
                className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={goNext}
                disabled={!canGoNext}
                className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* iFrame */}
            {embedUrl && (
              <div className="w-3xs overflow-hidden mr-6 ">
                <iframe
                  ref={iframeRef}
                  className="w-3xs aspect-video absolute bottom-4 rounded-lg "
                  style={{
                    boxShadow: "rgb(36 47 56 / 79%) 0px 0px 20px 5px",
                  }}
                  title="Embedded player"
                  allow="autoplay; encrypted-media"
                  src={embedUrl}
                  allowFullScreen
                />
              </div>
            )}

            {/* Song Info */}
            <div className="pb-">
              <p className="text-slate-400 text-sm mb-0.5">
                Now Playing{" "}
                <span className="text-slate-400">
                  {currentIndex + 1} / {playlist.length}
                </span>
              </p>
              <h2 className="text-2xl font-bold text-white mb-2">
                {nowPlayingTitle}{" "}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
