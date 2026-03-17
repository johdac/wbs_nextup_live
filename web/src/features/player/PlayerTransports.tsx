import type { PlaylistItem } from "./playerTypes";
import { AddToListBtn } from "../../components/buttons/AddToListBtn";
import { PlayBtn } from "../../components/buttons/PlayBtn";
import { usePlayer } from "./PlayerContext";

/**
 * The addAllPrefix is an option we can set to true to display a "Play / Add All" prefix
 */

export const PlayerTransports = ({
  resources,
  addAllPrefix,
}: {
  resources: PlaylistItem[];
  addAllPrefix?: boolean;
}) => {
  const { addManyToPlaylist, playTracks } = usePlayer();

  if (addAllPrefix) {
    return (
      <div className="rounded-md overflow-hidden items-center text-white flex">
        <div className=" bg-gray text-black font-bold border-white rounded-l-md h-9 items-center pb-0.5 flex px-3">
          Play / Add All
        </div>
        <div className="bg-purple h-9 px-3 items-center flex gap-2">
          <PlayerTransports resources={resources} />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <PlayBtn onClick={() => playTracks(resources)} className="w-6 sm:w-7" />
        <AddToListBtn
          onClick={() => addManyToPlaylist(resources)}
          className="w-6 sm:w-7"
        />
      </>
    );
  }
};
