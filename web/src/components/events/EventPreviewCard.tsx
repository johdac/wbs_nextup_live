import { MapPin, MicVocal } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import type { EventListItem } from "../../services/eventsApi";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { EditBtn } from "../buttons/EditBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { GenresTag } from "../ui/GenresTag";

const EventPreviewCard = ({
  event,
  handleDelete,
  showModal,
  setItemToDelete,
  setShowModal,
}: {
  event: EventListItem;
  handleDelete: () => void;
  showModal: boolean;
  setItemToDelete: (id: string) => void;
  setShowModal: (show: boolean) => void;
}) => {
  const monthStr = format(new Date(event.startDate), "MMM");
  const dayStr = format(new Date(event.startDate), "dd");
  const timeStr = format(new Date(event.startDate), "h:mm a");
  const yearStr = format(new Date(event.startDate), "yyyy");

  return (
    <div className="managed-card">
      {/* DATE STICKER ON DESKTOP ONLY */}
      <div className="hidden w-1/12 sm:flex flex-col items-center justify-center rounded-lg gap-y-3 px-5 text-white shadow-xs">
        <span className="text-6xl font-black leading-none">{dayStr}</span>
        {/* <span className="text-md font-bold">{yearStr}</span> */}
        <span className="text-md font-bold uppercase tracking-wider">{monthStr}</span>
      </div>
      {/* IMAGE WITH MOBILE DATE STICKER */}
      <div className="relative w-full sm:w-30 sm:h-30 shrink-0 overflow-visible">
        <div className="h-full overflow-hidden rounded-md">
          <img
            src={event.mainImageUrl || "/placeholder.jpeg"}
            alt={event.title}
            onError={(e) => {
              const current = e.currentTarget;
              if (!current.src.endsWith("placeholder.jpeg")) {
                current.onerror = null;
                current.src = "/placeholder.jpeg";
              }
            }}
            className="w-full h-full object-cover"
          />
          {/* ACTION BUTTONS - Mobile view */}
          <div className="absolute right-1 top-2 z-50 flex gap-2 rounded-full bg-black/55 p-3 backdrop-blur-sm sm:hidden">
            <EditBtn data={event} path="managed-events" />
            <DeleteBtn id={event.id} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
          </div>
        </div>

        {/* DATE STICKER ON MOBILE ONLY */}
        <div className="absolute top-2 left-2 flex flex-col items-center justify-center rounded-lg px-5 py-5 text-white bg-black/70 backdrop-blur-sm sm:hidden">
          <span className="text-xs font-bold uppercase tracking-wider">{monthStr}</span>
          <span className="text-xl font-black leading-none">{dayStr}</span>
          <span className="text-xs font-bold">{yearStr}</span>
        </div>
      </div>
      {/* TEXT INFO */}
      <div className="flex flex-col gap-1 w-full ">
        <Link to={`/managed-events/${event.id}`}>
          <h3 className="text-xl md:text-2xl font-bold text-white transition-colors hover:text-purple">
            {event.title}
          </h3>
        </Link>
        <div className="my-1.5 flex flex-wrap items-center gap-2">
          <div className="text-white flex items-center">
            {event.artists.map((artist) => {
              return (
                <div className="flex flex-row px-1 hover:text-purple hover:scale-105">
                  <MicVocal className="mr-1" />
                  <Link to={`/managed-artists/${artist.id}`}>
                    <p key={artist.id}>{artist.name}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-md text-gray-400">
          <span>{timeStr}</span>
          <Link to={`/managed-locations/${event.location.id}`}>
            <span className="flex items-center hover:text-purple hover:scale-105">
              <MapPin className="mr-1 h-5 w-5 " />
              {event.location.city}
            </span>
          </Link>
        </div>
        <GenresTag data={event} />
      </div>

      {/* ACTION BUTTONS */}
      <div className="hidden sm:flex mt-2 sm:mt-0 sm:ml-auto gap-2">
        <EditBtn data={event} path="managed-events" />
        <DeleteBtn id={event.id} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
        <ConfirmModal name="event" handleDelete={handleDelete} showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
};

export default EventPreviewCard;
