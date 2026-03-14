import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import DOMPurify from "dompurify";
import {
  Calendar,
  MapPin,
  MapPinHouse,
  Share2,
  Play,
  Heart,
  ListPlus,
  Sparkles,
  CalendarPlus,
  CalendarHeart,
} from "lucide-react";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { ArtistCard } from "../artists/ArtistCard";
import { GenresTag } from "../ui/GenresTag";
import { Kicker } from "../ui/Kicker";
import { EventMetaItem } from "../ui/EventMetaItem";
import { format } from "date-fns";
import { EventDate } from "../ui/EventDate";

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<EventListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing event id");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventsService.getEventById(id);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found</p>;

  console.log(event);

  //format Date
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleString("en", {
          dateStyle: "short",
          timeStyle: "short",
        });
  };
  const startDate = formatDate(event.startDate);
  const endDate = formatDate(event.endDate);

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(event.location.address)}&output=embed`;

  return (
    <div className="container mx-auto">
      <div className="pb-5 max-w-8xl mt-6 sm:mt-10 sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-stretch w-full">
          <div className="mt-12">
            <Kicker text="Event" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase wrap-break-word">
              {event.title}
            </h1>
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
          <div className="h-full">
            <img
              src={event.mainImageUrl}
              alt={event.title}
              className="w-full aspect-3/2 rounded-xl max-w-md md:max-w-full object-cover"
            />
          </div>
        </div>
        <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 grid grid-cols-1 gap-10 un-box-t-padding un-box-r-padding">
            {/* artists */}
            {event.artists?.length && (
              <div className="space-y-3">
                <div className="text-3xl font-bold">ARTISTS</div>
                <div>
                  {event.artists.map((a) => (
                    <ArtistCard key={a.id} artist={a} />
                  ))}
                </div>
              </div>
            )}
            {/* description */}
            {event.description && (
              <div className="space-y-3 un-border-t-default un-box-t-padding un-box-r-padding">
                <div className="text-3xl font-bold">DESCRIPTION</div>
                <p
                  className="text-lg font-light"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.description),
                  }}
                />
              </div>
            )}
          </div>
          {/* RIGHT SIDE */}
          <aside className="un-border-l-default ">
            <div className="flex gap-4 items-center un-border-b-default un-box-padding w-full">
              <button>
                <CalendarHeart className="w-8 h-8 transition-colors duration-100 hover:text-red-500 hover:scale-115 cursor-pointer" />
              </button>
              <div>Add Event to Favorites</div>
              {/* <button>
                <Heart className="w-8 h-8 transition-colors duration-100 hover:text-red-500 hover:scale-115 cursor-pointer" />
              </button>
              <button>
                <Play className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
              </button>
              <button>
                <ListPlus className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
              </button> */}
            </div>
            <div className="un-box-padding flex flex-col items-start ">
              <EventMetaItem heading="Date" Icon={Calendar}>
                {startDate} - {endDate}
              </EventMetaItem>
              <EventMetaItem heading="Genres" Icon={Sparkles}>
                <GenresTag data={event} />
              </EventMetaItem>
              <EventMetaItem heading="Location" Icon={MapPinHouse}>
                <Link to={`/location/${event.location.id}`}>
                  <div className="hover:text-purple cursor-pointer">
                    {event.location.name}
                  </div>
                </Link>
                <div>{event.location.address}</div>
                <div>{event.location.city}</div>
              </EventMetaItem>
              <EventMetaItem heading="Map" Icon={MapPin}>
                <div className="w-full overflow-hidden rounded-lg border-0">
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
            <button>
              <Share2 className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};
