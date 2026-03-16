import { Link } from "react-router";
import DOMPurify from "dompurify";
import type { Artist } from "../../services/artistsApi";
import { GenresTag } from "../ui/GenresTag";
import type { ReactNode } from "react";
import { Music2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const ArtistCard = ({
  artist,
  actionSlot,
}: {
  artist: Artist;
  actionSlot?: ReactNode;
}) => {
  const { user } = useAuth();
  const artistId = artist.id || artist._id || "";
  const currentUserId = String(
    (user as { _id?: string; id?: string } | null)?._id ||
      (user as { _id?: string; id?: string } | null)?.id ||
      "",
  );
  const ownerId =
    artist.organizerId ||
    (typeof artist.createdById === "string"
      ? artist.createdById
      : artist.createdById?._id ||
        (artist.createdById as { id?: string } | undefined)?.id ||
        "");
  const isOwner = !!currentUserId && String(ownerId) === currentUserId;
  const musicResources = artist.musicResources || [];

  return (
    <>
      <div
        key={artist.id}
        className="flex flex-wrap sm:flex-nowrap my-12 items-start text-white relative px-3 sm:px-0 gap-6"
      >
        <div className="relative w-full aspect-video sm:w-auto sm:h-40 sm:aspect-square md:aspect-4/3 shrink-0 overflow-visible rounded-md">
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
        <div className="flex flex-col gap-2">
          <div>
            <Link
              to={`/artist/${artistId}`}
              className="flex gap-2 items-center"
            >
              <h3 className="my-1 sm:mt-0 text-2xl md:text-2xl lg:text-3xl font-bold text-yellow transition-colors hover:text-purple">
                {artist.name}
              </h3>
              <div className="mb-1">
                <GenresTag data={artist} />
              </div>
            </Link>
          </div>
          <div
            className="text-md text-gray line-clamp-3 leading-tight"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(artist.description || ""),
            }}
          />
          <div className="flex flex-row items-center gap-1">
            {isOwner && musicResources.length > 0 && (
              <>
                <Music2 className="w-5 h-5" />
                <div className="flex flex-row gap-2">
                  {musicResources.map((music, index) => {
                    const isLast = index === musicResources.length - 1;
                    return (
                      <a
                        key={index}
                        href={music.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline"
                      >
                        {music.title}
                        {!isLast ? "," : ""}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4 absolute sm:static sm:bg-transparent bg-purple rounded-md right-0 top-[calc(-40px+50vw)] px-2 pt-1 pb-1.5 sm:p-0">
          {actionSlot && <div>{actionSlot}</div>}
        </div>
      </div>
    </>
  );
};
