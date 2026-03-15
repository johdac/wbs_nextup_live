import { useParams, Link } from "react-router";
import DOMPurify from "dompurify";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { eventsService } from "../../services/eventsApi";
import { ArtistCard } from "../artists/ArtistCard";
import { GenresTag } from "../ui/GenresTag";
import { Kicker } from "../ui/Kicker";
import { EventMetaItem } from "../ui/EventMetaItem";
import { format } from "date-fns";
import { PlayerTransports } from "../../features/player/PlayerTransports";
import type { PlaylistItem } from "../../features/player/playerTypes";
import { mergeMusicResources } from "../../features/player/utils/mergeMusicResources";
import { FavoriteEventBtn } from "../buttons/FavoriteEventBtn";
import { useQuery } from "@tanstack/react-query";

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => {
      if (!id) throw new Error("Missing event id");
      return eventsService.getEventById(id);
    },
    enabled: Boolean(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load event</p>;
  if (!event) return <p>Event not found</p>;

  const startDate = format(new Date(event.startDate), "dd MMM hh:mm a");
  const endDate = format(new Date(event.endDate), "dd MMM hh:mm a");

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(event.location.address)}&output=embed`;
  const mergedMusicResources: PlaylistItem[] = mergeMusicResources([event]);

  return (
    <div className="container mx-auto">
      <div className="pb-5 sm:mt-10 sm:px-0 text-white">
        {/* TOP SECTION */}

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-stretch w-full">
          <div className="mt-4 lg:mt-12">
            <Kicker text="Event" />
            <h1>{event.title}</h1>
            <div className="flex text-[17px] mt-1 ">
              <div className="w-20 bg-pink h-8 flex justify-center items-center rounded-md text-black font-black">
                {format(new Date(event.startDate), "dd MMM")}
              </div>
              <div className="ml-4 flex items-center font-light">
                <MapPin className="mr-1 h-5 w-5 " />
                {event.location.city && `${event.location.city}, `}
                {event.location.name}
              </div>
            </div>
          </div>
          {/* image of the band */}
          <img
            src={event.mainImageUrl}
            alt={event.title}
            className="w-full aspect-3/2 rounded-xl object-cover"
          />
        </div>

        {/* BOTTOM SECTION */}

        <div className="lg:mt-25 mt-10 flex flex-wrap md:flex-nowrap">
          {/* LEFT MAIN CONTENT */}
          <div className="order-2 md:order-1 md:col-span-2 gap-10 un-box-t-padding md:un-box-r-padding">
            {/* artists */}
            {event.artists?.length && (
              <div className="space-y-3 un-box-b-padding">
                <div className="flex justify-between">
                  <h2>Artists</h2>
                  <div className="flex gap-4">
                    <PlayerTransports resources={mergedMusicResources} />
                  </div>
                </div>
                <div>
                  {event.artists.map((a) => (
                    <ArtistCard key={a.id} artist={a} />
                  ))}
                </div>
              </div>
            )}
            {/* description */}
            {event.description && (
              <div className="space-y-3 un-border-t un-box-t-padding un-box-r-padding">
                <h2>Description</h2>
                <p
                  className="text-lg font-light"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.description),
                  }}
                />
              </div>
            )}
          </div>
          {/* RIGHT ASIDE */}
          <aside className="order-1 md:order-2 md:un-border-l basis-full md:basis-70 lg:basis-100 shrink-0">
            <div className="flex gap-4 items-center un-border-b un-box-t-padding md:un-box-l-padding un-box-b-padding w-full -mt-1">
              <FavoriteEventBtn
                event={event}
                className="mr-4"
                withText={true}
              />
            </div>
            <div className="un-box-t-padding md:un-box-l-padding un-border-b md:border-none">
              <EventMetaItem heading="Date" Icon={Calendar}>
                <div>
                  <span className="w-12 inline-block">Start</span> {startDate}
                </div>
                <div>
                  <span className="w-12 inline-block">End</span> {endDate}
                </div>
              </EventMetaItem>
              <EventMetaItem heading="Genres" Icon={Sparkles}>
                <GenresTag data={event} />
              </EventMetaItem>
              <EventMetaItem heading="Location" Icon={MapPin}>
                <Link to={`/location/${event.location.id}`}>
                  <div className="hover:text-purple cursor-pointer">
                    {event.location.name}
                  </div>
                </Link>
                <div>{event.location.address}</div>
                <div>{event.location.city}</div>
                <div className="w-full overflow-hidden rounded-lg mt-5">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="260"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </EventMetaItem>
            </div>
            {/* Johannes: Let's not implement share buttons for now */}
            {/* <button>
              <Share2 className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
            </button> */}
          </aside>
        </div>
      </div>
    </div>
  );
};
