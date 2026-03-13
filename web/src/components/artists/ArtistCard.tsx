import { Link } from "react-router";
import DOMPurify from "dompurify";
import { CirclePlayBtn } from "../buttons/CirclePlayBtn";
import type { Artist } from "../../services/artistsApi";

export const ArtistCard = ({ artist }: { artist: Artist }) => {
  return (
    <>
      <div key={artist.id} className="grid md:grid-cols-3 items-center justify-center py-3 rounded-lg mb-2 gap-5">
        <div>
          <img
            src={artist.mainImageUrl}
            alt={artist.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.jpeg";
            }}
            className="w-full rounded-lg max-w-md md:max-w-full"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 md:col-span-2 ">
          <div className="col-span-3 flex flex-col gap-1">
            <Link to={`/artist/${artist.id}`}>
              <div className="text-xl transition-colors duration-100 hover:text-purple cursor-pointer">
                {artist.name}
              </div>
              <div
                className="text-base text-gray line-clamp-2"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(artist.description || "") }}
              />
            </Link>

            <div>
              {artist.genres?.length ? (
                artist.genres.map((g) => (
                  <span
                    key={g}
                    className="inline-flex w-fit rounded text-white px-2 py-0.5 bg-purple text-[10px] font-bold uppercase tracking-wider mr-1"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          </div>
          <CirclePlayBtn />
        </div>
      </div>
    </>
  );
};
