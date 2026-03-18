import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Chip } from "../../components/ui/Chip";
import { useEffect, useRef } from "react";
import { usePlayer } from "../../features/player/PlayerContext";
import { format } from "date-fns";
import { Link } from "react-router";
import Marquee from "react-fast-marquee";

export const Player = () => {
  // We manage the player state in context and get it here
  const {
    playerStateId,
    currentIndex,
    playlist,
    playerState,
    youtubeRef,
    soundcloudRef,
    togglePlayPause,
    playNext,
    playPrev,
    setPlayerState,
  } = usePlayer();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Derived data from usePlayer context
  const currentSong = playlist[currentIndex];

  /**
   * If currentIndex loaded from context changes, we must switch out the players. By changing the src
   * of the iframe the players are automatically replaced. We then need to bind the api again to the
   * new iframe players. When doing that we also update the youtubeRef and soundcloudRef respectively
   */
  useEffect(() => {
    if (!currentSong) return;
    if (currentSong.song.vendor === "youtube") {
      bindYoutubePlayer(playerState === "playing");
    }
    if (currentSong.song.vendor === "soundcloud") {
      bindSoundCloudPlayer(playerState === "playing");
    }
  }, [currentIndex, playerStateId]);

  useEffect(() => {
    // after track change
    console.log("edit history");
    window.history.replaceState(null, "", window.location.href);
  }, [currentIndex]);

  const bindYoutubePlayer = (autoplay: boolean) => {
    const bindYoutube = () => {
      if (
        typeof (window as any).YT === "undefined" ||
        !(window as any).YT.Player
      )
        return;

      try {
        new (window as any).YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              // This is where we pass the instance of the player to the context
              youtubeRef.current = event.target;
              if (autoplay) event.target.playVideo();
            },
            onStateChange: (event: any) => {
              const YT = (window as any).YT;
              const state = event.data;

              if (state === YT.PlayerState.ENDED) {
                playNext();
              }

              if (state === YT.PlayerState.PLAYING) {
                setPlayerState("playing");
              }

              if (state === YT.PlayerState.PAUSED) {
                setPlayerState("paused");
              }
            },
          },
        });
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

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  };

  const bindSoundCloudPlayer = (autoplay: boolean) => {
    const bindSoundCloud = () => {
      const SC = (window as any).SC;

      if (!SC?.Widget || !iframeRef.current) return;

      try {
        const widget = SC.Widget(iframeRef.current);
        soundcloudRef.current = widget;
        if (autoplay) widget.play();
        widget.bind(SC.Widget.Events.FINISH, () => {
          playNext();
        });
      } catch (e) {
        console.warn("SoundCloud Player init:", e);
      }
    };

    if ((window as any).SC?.Widget) {
      bindSoundCloud();
    } else {
      const script = document.createElement("script");
      script.src = "https://w.soundcloud.com/player/api.js";
      script.onload = bindSoundCloud;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    if (!currentSong) return;
    const vendor = currentSong.song.vendor;
    if (playerState === "paused") {
      if (vendor === "youtube") youtubeRef.current?.pauseVideo();
      if (vendor === "soundcloud") soundcloudRef.current?.pause();
    } else if (playerState === "playing") {
      if (vendor === "youtube") youtubeRef.current?.playVideo();
      if (vendor === "soundcloud") soundcloudRef.current?.play();
    }
  }, [playerState]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < playlist.length - 1;

  return (
    <div className="w-full fixed bottom-0 z-990">
      <div className="w-full sm:container flex justify-end">
        {playlist.length > 0 && (
          <div className="bg-linear-to-r from-pink to-yellow h-20 sm:rounded-t-2xl px-2 sm:px-4 w-162.5  overflow-hidden flex flex-wrap sm:flex-nowrap">
            <div className="flex flex-col justify-end xs:flex-row">
              {/* Controls */}
              <div className="order-2 sm:order-0 flex items-center justify-center gap-1 xs:mx-2 sm:mr-5 py-2">
                <button
                  onClick={playPrev}
                  disabled={!canGoPrev}
                  className="p-2 btn-default rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="p-2 btn-default rounded-full text-white transition"
                >
                  {playerState === "playing" ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={playNext}
                  disabled={!canGoNext}
                  className="p-2 btn-default rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* iFrame */}
              <div className="w-40 sm:w-3xs order-0 overflow-hidden shrink-0 ">
                {currentSong && (
                  <iframe
                    ref={iframeRef}
                    src={`${currentSong.song.embedUrl}&${playerStateId}`}
                    className="w-40 sm:w-3xs aspect-video absolute bottom-14 xs:bottom-2 rounded-lg "
                    style={{
                      boxShadow: "rgb(255 191 81 / 20%) 0px 0px 20px 5px",
                    }}
                    title="Embedded player"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 order-5 overflow-hidden py-1.5">
              <p className="pl-3 text-xs mt-1">
                Now Playing {currentIndex + 1} / {playlist.length}
              </p>
              {currentSong && (
                <div className="text-md font-bold mb-0.5 overflow-hidden">
                  <div className="relative">
                    <Marquee
                      speed={20}
                      delay={5}
                      className="pl-3 marqueeGradient"
                    >
                      <span className="mr-20">
                        {currentSong?.song.artist.name} –{" "}
                        {currentSong?.song.title}
                      </span>
                    </Marquee>
                  </div>
                </div>
              )}
              <div className="text-sm mb-px ">
                {currentSong?.event && (
                  <>
                    <Link to={`/event/${currentSong.event.id}`}>
                      <div className="flex">
                        <Chip
                          className={"ml-3 whitespace-nowrap"}
                          string={format(
                            new Date(currentSong.event.start),
                            "dd MMM",
                          )}
                        />
                        <div className="relative flex-1 overflow-hidden">
                          <div className="marqueeGradient"></div>
                          <div>
                            <Marquee
                              speed={20}
                              delay={5}
                              className="pl-2 marqueeGradient"
                            >
                              <span className="mr-20">
                                {currentSong.event.location.city},{" "}
                                {currentSong.event.location.name}
                              </span>
                            </Marquee>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {/* Johannes: Implement after presentation */}
            {/* <div>
              {" "}
              <FavoriteEventBtn
                eventId={currentSong.event.id}
                interactionType={currentSong.event.interactionType}
                className="mr-4"
                withText={false}
              />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};
