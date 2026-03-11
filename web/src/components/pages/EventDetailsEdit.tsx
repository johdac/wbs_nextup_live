import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import {
  Calendar,
  CirclePlay,
  MapPin,
  MapPinHouse,
  Share2,
  Play,
  Heart,
  ListPlus,
  Sparkles,
  Pencil,
  Trash2,
} from "lucide-react";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { ConfirmModal } from "../layout/ConfirmModal";

export const EventDetailsEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<EventListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await eventsService.deleteEvent(itemToDelete);
      navigate("/managed-events");
    } catch (err) {
      setError("Failed to delete event");
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(event.location.address)}&output=embed`;

  return (
    <div className="container mx-auto">
      {/* ACTION BUTTONS */}
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-3 justify-end">
        <button
          className="px-5 border border-gray text-white font-bold py-2 rounded-lg flex items-center justify-center  hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
          onClick={() =>
            navigate(`/managed-events/${event.id}/edit`, {
              state: { event },
            })
          }
        >
          <div className="flex flex-row pb-1 items-center text-white gap-1">
            <Pencil className="h-5 w-5" />
            <div className="text-lg">EDIT</div>
          </div>
        </button>
        <button
          className="px-5 border border-gray text-white font-bold py-2 rounded-lg flex items-center justify-center hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={() => {
            setItemToDelete(id!);
            setShowModal(true);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <ConfirmModal
        open={showModal}
        title="Delete Event"
        message="Are you sure you want to delete this?"
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
      <div className="pb-5 max-w-8xl mt-6 sm:mt-10 sm:px-0 flex flex-col justify-center items-center text-white">
        {/* image of the band */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-stretch">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase wrap-break-word">
            {event.title}
          </h1>
          <div className="h-full">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full rounded-xl max-w-md md:max-w-full object-cover"
            />
          </div>
        </div>
        <div className="max-w-8xl mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 grid grid-cols-1 gap-10 md:pr-8">
            {/* artists */}
            {event.artists?.length ? (
              <div className="space-y-3">
                <div className="text-3xl font-bold">ARTISTS</div>
                <div>
                  {event.artists.map((a) => (
                    <div
                      key={a.id}
                      className="grid md:grid-cols-3 items-center justify-center py-3 rounded-lg mb-2 gap-5"
                    >
                      <div>
                        <img src={a.imageUrl} alt={a.name} className="rounded-lg max-w-md md:max-w-full" />
                      </div>
                      <div className="grid grid-cols-4 gap-2 md:col-span-2 ">
                        <div className="col-span-3 flex flex-col gap-1">
                          <div className="text-xl">{a.name}</div>
                          <div
                            className="text-base text-gray line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(a.description) }}
                          />

                          <div>
                            <span className="inline-flex w-fit rounded text-white px-2 py-0.5 bg-purple text-[12px] font-bold uppercase tracking-wider">
                              {event.genre?.length ? event.genre : "-"}
                            </span>
                          </div>
                        </div>
                        <button className="flex justify-center items-center">
                          <CirclePlay className="w-10 h-10 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {/* description */}
            {event.description ? (
              <div className="space-y-3">
                <div className="text-3xl font-bold">DESCRIPTION</div>
                <p
                  className="text-lg font-light"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.description),
                  }}
                />
              </div>
            ) : null}
          </div>
          {/* RIGHT SIDE */}
          <aside className="flex flex-col items-start gap-10 p-6 rounded-xl transition-all bg-gray-800/35">
            <div className="flex gap-4 items-center">
              <button>
                <Heart className="w-8 h-8 transition-colors duration-100 hover:text-red-500 hover:scale-115 cursor-pointer" />
              </button>
              <button>
                <Play className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
              </button>
              <button>
                <ListPlus className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
              </button>
            </div>
            <div>
              <div className="flex flex-row pb-1 items-center">
                <Calendar className="mr-1 h-5 w-5" />
                <div className="text-lg">DATE</div>
              </div>
              <div>
                {startDate} - {endDate}
              </div>
            </div>

            <div>
              <div className="flex flex-row pb-1 items-center">
                <Sparkles className="mr-1 h-5 w-5" />
                <div className="text-lg">GENRES</div>
              </div>
              <span className="rounded text-white px-2 py-1 bg-purple text-[12px] font-bold uppercase tracking-wider">
                {event.genre?.length ? event.genre : "-"}
              </span>
            </div>

            <div>
              <div className="flex flex-row pb-1 items-center">
                <MapPinHouse className="mr-1 h-5 w-5" />
                <div className="text-lg">LOCATION</div>
              </div>
              <div>{event.location.name}</div>
              <div>{event.location.address}</div>
              <div>{event.location.city}</div>
            </div>

            <div>
              <div className="flex flex-row pb-1 items-center">
                <MapPin className="mr-1 h-5 w-5" />
                <div className="text-lg">MAP</div>
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
            <button>
              <Share2 className="w-8 h-8 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};
