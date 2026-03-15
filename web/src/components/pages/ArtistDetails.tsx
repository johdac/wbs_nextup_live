import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import { artistsService, type Artist } from "../../services/artistsApi";
import { Link } from "lucide-react";
import { EventByArtist } from "../artists/EventsByArtist";
import { GenresTag } from "../ui/GenresTag";
import { PlayBtn } from "../buttons/PlayBtn";
import { Kicker } from "../ui/Kicker";

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch w-full">
          {/* left */}

          {/* image of the artist */}
          <img
            src={artist.mainImageUrl ?? "/placeholder.jpeg"}
            alt={artist.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.jpeg";
            }}
            className="w-full aspect-3/2 rounded-xl object-cover"
          />
          {/* right */}
          <div className="flex flex-col items-start">
            <div className="pb-6">
              <Kicker text="Artist" />
              <div className="flex flex-row gap-10 items-center pb-2">
                <h1>{artist.name}</h1>
                <PlayBtn />
              </div>
              <GenresTag data={artist} />
            </div>

            {/* description */}
            {artist.description && (
              <div className="py-6 w-full un-border-b un-border-t">
                <p
                  className="text-lg font-light"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(artist.description),
                  }}
                />
              </div>
            )}

            <div className="py-5">
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
