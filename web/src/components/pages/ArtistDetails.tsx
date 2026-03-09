import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import { eventsService, type EventCardArtist } from "../../services/eventsApi";
import EventList from "../layout/Events";

export const ArtistDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<EventCardArtist | null>(null);
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
        const data = await eventsService.getArtistById(id);
        setArtist(data);
      } catch (err) {
        setError("Failed to load artist");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!artist) return <p>Artist not found</p>;

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

  return (
    <div className="container mx-auto">
      <div className="max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="max-w-8xl mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left */}
          <div className="grid grid-cols-1">
            {/* image of the artist */}
            <img
              src={"https://theocroker.com/assets/images/share.jpg?v=14ef552c"} //artist.imageUrl
              alt={artist.name}
              className="w-fit rounded-lg max-w-md lg:max-w-full"
            />
          </div>
          {/* right */}
          <div className="md:col-span-2 flex flex-col items-start gap-3">
            <h1 className="flex items-end gap-3 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white">
              {artist.name}
              <span className="rounded text-white px-2 py-1 bg-purple text-[12px] font-bold uppercase tracking-wider">
                {artist.genre?.length ? artist.genre : "-"}
              </span>
            </h1>
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
          </div>
        </div>
      </div>
      <EventList />
    </div>
  );
};
