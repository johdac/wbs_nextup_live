import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { Calendar, MapPin, MapPinHouse, Share2, Sparkles } from "lucide-react";
import { eventsService, type EventListItem } from "../../services/eventsApi";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { EditBtn } from "../buttons/EditBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { ArtistCard } from "../artists/ArtistCard";
import { LikeBtn } from "../buttons/LikeBtn";
import { PlayBtn } from "../buttons/PlayBtn";
import { AddToListBtn } from "../buttons/AddToListBtn";
import { GenresTag } from "../ui/GenresTag";

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
      setError("Failed to delete this event");
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
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-5 justify-end pr-1">
        <EditBtn data={event} path="managed-events" />
        <DeleteBtn id={event.id} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
        <ConfirmModal name="event" handleDelete={handleDelete} showModal={showModal} setShowModal={setShowModal} />
      </div>
      <div className="pb-5 max-w-8xl mt-6 sm:mt-10 sm:px-0 flex flex-col justify-center items-center text-white">
        {/* image of the band */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-stretch">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase wrap-break-word">
            {event.title}
          </h1>
          <div className="h-full">
            <img
              src={event.mainImageUrl}
              alt={event.title}
              className="w-full h-full rounded-xl max-w-md md:max-w-full object-cover"
            />
          </div>
        </div>
        <div className="max-w-8xl mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 grid grid-cols-1 md:pr-8">
            {/* artists */}
            {event.artists?.length ? (
              <div>
                <div className="text-3xl font-bold">ARTISTS</div>
                {event.artists.map((a) => (
                  <ArtistCard artist={a} />
                ))}
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
              <LikeBtn />
              <PlayBtn />
              <AddToListBtn />
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
              <GenresTag data={event} />
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
