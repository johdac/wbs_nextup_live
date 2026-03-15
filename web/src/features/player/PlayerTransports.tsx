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
      <PlayBtn onClick={() => playTracks(resources)} />
      <AddToListBtn onClick={() => addManyToPlaylist(resources)} />
    </>
  );
};
