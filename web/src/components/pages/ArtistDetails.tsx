import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import { artistsService, type Artist } from "../../services/artistsApi";
import { Link } from "lucide-react";
import { EventByArtist } from "../artists/EventsByArtist";
import { CirclePlayBtn } from "../buttons/CirclePlayBtn";
import { GenresTag } from "../ui/GenresTag";

export const ArtistDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing artist id");
      setLoading(false);
      return;
    }

    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await artistsService.getArtistById(id);
        setArtist(data);
      } catch (err) {
        setError("Failed to load artist");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  console.log("detail:", artist);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!artist) return <p>Artist not found</p>;

  return (
    <div className="container mx-auto">
      <div className="pb-5 max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left */}
          <div className="">
            {/* image of the artist */}
            <img
              src={artist.mainImageUrl}
              alt={artist.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.jpeg";
              }}
              className="rounded-lg w-full h-64 lg:h-full object-cover"
            />
          </div>
          {/* right */}
          <div className="md:col-span-2 flex flex-col items-start gap-3">
            <div className="flex flex-row gap-5 justify-between items-center">
              <h1 className="flex items-end gap-3 text-4xl sm:text-5xl md:text-5xl font-black tracking-tight uppercase text-white">
                {artist.name}
              </h1>
              <CirclePlayBtn />
            </div>
            <GenresTag data={artist} />

            <div className="px-5 py-4 transition-all bg-gray-800/35">
              {/* description */}
              {artist.description ? (
                <div className="space-y-3">
                  <p
                    className="text-lg font-light"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(artist.description) }}
                  />
                </div>
              ) : null}
            </div>
            <div className="">
              <a
                href={artist.websiteUrl}
                className="flex flex-row gap-1 items-center text-lg underline cursor-pointer hover:text-purple"
              >
                <Link /> <div>Website</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <EventByArtist artistId={artist.id || artist._id || ""} />
    </div>
  );
};
