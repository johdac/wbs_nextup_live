import { MapPin, MicVocal, Music4 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import type { EventListItem } from "../../services/eventsApi";
import { GenresTag } from "../ui/GenresTag";
import type { PlaylistItem } from "../../features/player/playerTypes";
import { mergeMusicResources } from "../../features/player/utils/mergeMusicResources";
import { PlayerTransports } from "../../features/player/PlayerTransports";
import { FavoriteEventBtn } from "../buttons/FavoriteEventBtn";

const EventCard = ({
  event,
  index,
}: {
  event: EventListItem;
  index: number;
}) => {
  const monthStr = format(new Date(event.startDate), "MMM");
  const dayStr = format(new Date(event.startDate), "dd");
  const timeStr = format(new Date(event.startDate), "h:mm a");
  const yearStr = format(new Date(event.startDate), "yyyy");

  // Player integration
  const mergedMusicResources: PlaylistItem[] = mergeMusicResources([event]);

  return (
    <div className="flex py-10 items-start lg:un-border-b text-white ">
      {/* DATE STICKER ON DESKTOP ONLY */}
      <div className="bg-pink p-2 rounded-md text-black text-center w-18 mr-8">
        <div className="text-5xl font-black leading-none">{dayStr}</div>
        <div className="text-md font-bold uppercase tracking-wider">
          {monthStr}
        </div>
      </div>

      <div className="mr-10 w-1/3">
        <Link to={`/event/${event.id}`}>
          <h3 className="text-4xl font-bold text-yellow transition-colors hover:text-purple">
            {event.title}
          </h3>
        </Link>
        <Link to={`/location/${event.location.id}`}>
          <div className="flex items-start leading-[1.4rem] hover:text-purple mt-1 text-[18px]">
            <MapPin className="mr-1.5 mt-0.5 h-5 w-5 " />
            <div>
              {event.location.city ? `${event.location.city}, ` : ``}
              {event.location.name}
            </div>
          </div>
        </Link>
      </div>

      {/* IMAGE WITH MOBILE DATE STICKER */}
      <div className="relative  h-25 aspect-4/3  rounded-md overflow-hidden mr-8">
        {event.mainImageUrl ? (
          <img
            src={event.mainImageUrl}
            alt={event.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.jpeg";
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 neon-gradient-bg opacity-60" />
        )}

        {/* DATE STICKER ON MOBILE ONLY */}
        <div className="absolute top-2 left-2 flex flex-col items-center justify-center rounded-lg px-5 py-5 text-white bg-black/70 backdrop-blur-sm sm:hidden">
          <span className="text-xs font-bold uppercase tracking-wider">
            {monthStr}
          </span>
          <span className="text-xl font-black leading-none">{dayStr}</span>
          <span className="text-xs font-bold">{yearStr}</span>
        </div>
      </div>

      {/* TEXT INFO */}
      <div className="flex gap-1 w-full sm:w-auto">
        <div>
          <Music4 className="mr-2 mt-1" />
        </div>
        <div className="">
          <div className="flex items-center">
            {event.artists.map((artist, index) => {
              const isLast = index === event.artists.length - 1;

              return (
                <div
                  key={artist.id}
                  className="flex flex-row mr-2 text-[18px] hover:text-purple"
                >
                  <Link to={`/artist/${artist.id}`}>
                    {artist.name}
                    {!isLast && ","}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-1">
            <GenresTag data={event} />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4">
        <FavoriteEventBtn event={event} />
        <PlayerTransports resources={mergedMusicResources} />
      </div>
    </div>
  );
};

export default EventCard;
