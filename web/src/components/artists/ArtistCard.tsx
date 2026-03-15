import { Link } from "react-router";
import DOMPurify from "dompurify";
import type { Artist } from "../../services/artistsApi";
import { GenresTag } from "../ui/GenresTag";
import { PlayBtn } from "../buttons/PlayBtn";
import { AddToListBtn } from "../buttons/AddToListBtn";

export const ArtistCard = ({ artist }: { artist: Artist }) => {
  return (
    <>
      <div
        key={artist.id}
        className="grid md:grid-cols-3 py-3 rounded-lg mb-2 gap-5"
      >
        <img
          src={artist.mainImageUrl}
          alt={artist.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.jpeg";
          }}
          className="w-full rounded-lg aspect-3/2 object-cover"
        />
        <div className="flex gap-2">
          <div className="gap-1">
            <Link to={`/artist/${artist.id}`}>
              <h3 className="transition-colors duration-100 hover:text-purple cursor-pointer">
                {artist.name}
              </h3>
              <div
                className="text-base text-gray line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(artist.description || ""),
                }}
              />
            </Link>
            <GenresTag data={artist} />
          </div>
        </div>
      </div>
    </>
  );
};
