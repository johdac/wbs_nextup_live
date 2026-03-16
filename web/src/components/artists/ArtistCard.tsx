import { Link } from "react-router";
import DOMPurify from "dompurify";
import type { Artist } from "../../services/artistsApi";
import { GenresTag } from "../ui/GenresTag";
import type { ReactNode } from "react";

export const ArtistCard = ({
  artist,
  actionSlot,
}: {
  artist: Artist;
  actionSlot?: ReactNode;
}) => {
  const artistId = artist.id || artist._id || "";

  return (
    <>
      <div
        key={artist.id}
        className="flex flex-col sm:flex-row items-start gap-4 w-full pb-5"
      >
        <div className="relative w-full sm:w-30 sm:h-30 shrink-0 overflow-visible rounded-md">
          <div className="h-full overflow-hidden rounded-md">
            <Link to={`/artist/${artistId}`} className="block h-full">
              <img
                src={artist.mainImageUrl || "/placeholder.jpeg"}
                alt={artist.name}
                onError={(e) => {
                  const current = e.currentTarget;
                  if (!current.src.endsWith("placeholder.jpeg")) {
                    current.onerror = null;
                    current.src = "/placeholder.jpeg";
                  }
                }}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="gap-1">
            <Link to={`/artist/${artistId}`}>
              <h3 className="text-white text-xl transition-colors duration-100 hover:text-purple cursor-pointer">
                {artist.name}
              </h3>
              <div
                className="text-md text-gray line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(artist.description || ""),
                }}
              />
            </Link>
            <GenresTag data={artist} />
          </div>
        </div>{" "}
        {actionSlot && <div>{actionSlot}</div>}
      </div>
    </>
  );
};
