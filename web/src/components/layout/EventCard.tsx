import { Play, MapPin, Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import type { MusicEvent } from "../../data/MockData";

const genreColors: Record<string, string> = {
  Electronic: " bg-purple",
  Techno: " bg-pink",
  Rock: "bg-pink",
  Jazz: "bg-orange",
  "Hip-Hop": " bg-yellow",
  Indie: "bg-primary",
};

const EventCard = ({ event }: { event: MusicEvent }) => {
  const dateStr = format(new Date(event.startDate), "MMM dd, yyyy");
  const timeStr = format(new Date(event.startDate), "h:mm a");

  return (
    <Link
      to={`/event/${event.id}`}
      className="group flex items-center gap-5 rounded-lg  bg-[#333333] p-5 transition-all hover:border-purple/40 hover:bg-card sm:gap-"
    >
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-muted sm:h-32 sm:w-32">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 neon-gradient-bg opacity-60" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-display text-base font-bold tracking-wide text-foreground sm:text-lg">
          {event.title}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-secondary" />{" "}
            <div className="flex gap-3">
              <span>{dateStr}</span>
              <span>{timeStr}</span>
            </div>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" /> {event.location.city}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`rounded  px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${genreColors[event.genre] || "text-muted-foreground border-border"}`}
          >
            {event.genre}
          </span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="group flex items-center justify-center rounded-full border border-white/10 bg-white p-3 transition-all duration-100 hover:bg-purple cursor-pointer">
          <Play className="h-4 w-4 text-black transition-colors duration-100 hover:text-white" />
        </span>
        <span className="rounded-full border p-2">
          <Plus className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
};

export default EventCard;
