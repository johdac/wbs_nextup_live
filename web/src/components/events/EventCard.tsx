import { MapPin, Music4 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import type { ReactNode } from "react";
import type { EventListItem } from "../../services/eventsApi";
import { GenresTag } from "../ui/GenresTag";
import type { PlaylistItem } from "../../features/player/playerTypes";
import { mergeMusicResources } from "../../features/player/utils/mergeMusicResources";
import { PlayerTransports } from "../../features/player/PlayerTransports";
import { FavoriteEventBtn } from "../buttons/FavoriteEventBtn";

const EventCard = ({
  event,
  actionSlot,
  showDefaultActions = true,
}: {
  event: EventListItem;
  actionSlot?: ReactNode;
  showDefaultActions?: boolean;
}) => {
  const monthStr = format(new Date(event.startDate), "MMM");
  const dayStr = format(new Date(event.startDate), "dd");
  // const timeStr = format(new Date(event.startDate), "h:mm a");
  // const yearStr = format(new Date(event.startDate), "yyyy");

  // Player integration
  const mergedMusicResources: PlaylistItem[] = mergeMusicResources([event]);

  return (
    <div className="flex flex-wrap sm:flex-nowrap py-10 items-start un-border-b text-white relative px-3 sm:px-0">
      <div className="flex items-start w-full sm:w-auto">
        {/* DATE*/}
        <div className="bg-pink p-2 rounded-md text-black text-center w-13 lg:w-15 -mr-5 z-10 -mt-3 left-0 absolute sm:relative">
          <div className="text-3xl lg:text-4xl font-black leading-none">
            {dayStr}
          </div>
          <div className="text-sm lg:text-md font-bold uppercase tracking-wider">
            {monthStr}
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative w-full aspect-video rounded-md overflow-hidden sm:mr-8 sm:w-auto sm:h-30 sm:aspect-square md:aspect-4/3">
          <Link to={`/event/${event.id}`}>
            <img
              src={event.mainImageUrl}
              alt={event.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.jpeg";
              }}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-1 flex-wrap">
        {/* EVENT TITLE AND LOCATION */}
        <div className="sm:mr-10 w-full lg:w-1/2">
          <Link to={`/event/${event.id}`}>
            <h3 className="my-3 sm:mt-0 text-2xl md:text-3xl lg:text-4xl font-bold text-yellow transition-colors hover:text-purple">
              {event.title}
            </h3>
          </Link>
          <Link to={`/location/${event.location.id}`}>
            <div className="flex items-start leading-[1.4rem] hover:text-purple mt-1 md:text-[18px]">
              <MapPin className="mr-1.5 mb-1 mt-0.5 h-5 w-5 shrink-0 " />
              <div>
                {event.location.city ? `${event.location.city}, ` : ``}
                {event.location.name}
              </div>
            </div>
          </Link>
        </div>

        {/* ARTISTS AND GENRES */}
        <div className="flex sm:w-auto">
          <div>
            <Music4 className="mr-1.5 mt-1 w-5 h-5 shrink-0" />
          </div>
          <div className="md:text-[18px]">
            {event.artists.map((artist, index) => {
              const isLast = index === event.artists.length - 1;
              return (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className=" hover:text-purple mr-2"
                >
                  {artist.name}
                  {!isLast && ", "}
                </Link>
              );
            })}
            <div className="mt-1">
              <GenresTag data={event} />
            </div>
          </div>
        </div>
      </div>

      {/* MUSICT TRANSPORT BUTTONS */}
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4 absolute sm:static sm:bg-transparent bg-purple rounded-md right-0 top-[calc(-40px+50vw)] px-2 pt-1 pb-1.5 sm:p-0">
        {showDefaultActions && (
          <div className="flex flex-row gap-4">
            <FavoriteEventBtn event={event} />
            <PlayerTransports resources={mergedMusicResources} />
          </div>
        )}
        {actionSlot && <div>{actionSlot}</div>}
      </div>
    </div>
  );
};

export default EventCard;
