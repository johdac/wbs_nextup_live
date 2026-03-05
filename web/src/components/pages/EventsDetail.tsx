import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Calendar, CirclePlay, MapPin, MapPinHouse, Share2, Play, SquarePlus } from "lucide-react";
import { eventsService, type EventListItem } from "../../services/eventsApi";

export const EventsDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<EventListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
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

  if (!event) return <p>Event not found</p>;

  const startdate = new Date(event.startDate).toLocaleString("en", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const enddate = new Date(event.endDate).toLocaleString("en", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(event.location.address)}&output=embed`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="pb-5 max-w-8xl mt-6 sm:mt-10 px-4 sm:px-0 flex flex-col justify-center items-center text-white">
        {/* image of the band */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h1 className="flex items-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1] tracking-tight uppercase text-white">
            {event.title}
          </h1>
          <div>
            <img src={event.coverImage} alt={event.title} className="w-dvw rounded-xl max-w-md lg:max-w-full" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 item-end w-full pt-2">
          <div className="col-span-3"></div>
          <div className="flex gap-4 items-center justify-end pr-5">
            <button>
              <Play />
            </button>
            <button>
              <SquarePlus />
            </button>
            <button>
              <Share2 />
            </button>
          </div>
        </div>
        <div className="max-w-8xl mt-6 sm:mt-10 px-4 sm:px-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left */}
          <div className="md:col-span-2 grid grid-cols-1 gap-2 md:pr-8">
            {/* artists */}
            {event.artists?.length ? (
              <div className="space-y-2">
                <div className="text-2xl">ARTISTS</div>
                <div>
                  {event.artists.map((a) => (
                    <div className="grid md:grid-cols-3 items-center justify-center py-3 rounded-lg mb-2">
                      <div>
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-full items-center rounded-xl max-w-md md:max-w-full"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2 md:col-span-2 md:px-2" key={a.id}>
                        <div className="col-span-3 flex flex-col gap-1 p-2">
                          <div className="text-xl">{a.name}</div>
                          <div className="text-sm text-gray" dangerouslySetInnerHTML={{ __html: a.description }} />
                          <div>
                            <span className="inline-flex w-fit rounded text-white px-2 py-0.5 bg-purple text-[10px] font-bold uppercase tracking-wider">
                              {event.genre?.length ? event.genre : "-"}
                            </span>
                          </div>
                        </div>
                        <button className="flex justify-center items-center">
                          <CirclePlay className="w-8 h-8 transition-colors duration-100 hover:text-purple" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {/* description */}
            {event.description ? (
              <div className="space-y-2">
                <div className="text-2xl">DESCRIPTION</div>
                <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />
              </div>
            ) : null}
          </div>
          {/* right */}
          <aside className="flex flex-col items-start gap-10 p-6 rounded-xl transition-all bg-gray-800/35">
            <div className="">
              <div className="flex flex-row pb-1 text-base">
                <Calendar className="mr-1 h-5 w-5" />
                <div className="text-base">DATE</div>
              </div>
              <div>
                {startdate ?? "-"} - {enddate ?? "-"}
              </div>
            </div>

            <div>
              <div className="flex flex-row pb-1 text-base">GENRES</div>
              <span className="rounded text-white px-2 py-1 bg-purple text-[10px] font-bold uppercase tracking-wider">
                {event.genre?.length ? event.genre : "-"}
              </span>
            </div>

            <div>
              <div className="flex flex-row pb-1 text-base">
                <MapPinHouse className="mr-1 h-5 w-5" />
                <div className="text-base">ADDRESS</div>
              </div>
              <div>{event.location.address ?? "-"}</div>
            </div>

            <div>
              <div className="flex flex-row pb-1 text-base">
                <MapPin className="mr-1 h-5 w-5" />
                <div className="text-base">MAP</div>
              </div>
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
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
