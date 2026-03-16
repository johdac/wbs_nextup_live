import type { PlaylistItem } from "./playerTypes";
import { AddToListBtn } from "../../components/buttons/AddToListBtn";
import { PlayBtn } from "../../components/buttons/PlayBtn";
import { usePlayer } from "./PlayerContext";

export const PlayerTransports = ({
  resources,
}: {
  resources: PlaylistItem[];
}) => {
  const { addManyToPlaylist, playTracks } = usePlayer();

  return (
    <>
      <PlayBtn onClick={() => playTracks(resources)} className="w-6 sm:w-7" />
      <AddToListBtn
        onClick={() => addManyToPlaylist(resources)}
        className="w-6 sm:w-7"
      />
    </>
  );
};
