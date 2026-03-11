import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import DOMPurify from "dompurify";
import { artistsService, type Artist } from "../../services/artistsApi";
import { CirclePlay, Link, Pencil, Trash2 } from "lucide-react";

export const ArtistDetailsEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!artist) return <p>Artist not found</p>;

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this artist?")) {
      return;
    }

    try {
      setDeleteLoading(true);
      await artistsService.deleteArtist(id!);
      navigate("/managed-artists");
    } catch (err) {
      setError("Failed to delete artist");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container mx-auto pb-10">
      {/* ACTION BUTTONS */}
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4 justify-end">
        <button
          className="px-5 border border-gray text-white font-bold py-2 rounded-lg flex items-center justify-center  hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
          onClick={() =>
            navigate(`/managed-artists`, {
              state: { artist },
            })
          }
        >
          <div className="flex flex-row pb-1 items-center text-white gap-1">
            <Pencil className="h-5 w-5" />
            <div className="text-lg">EDIT</div>
          </div>
        </button>
        <button
          className="px-5 border border-gray text-white font-bold py-2 rounded-lg flex items-center justify-center hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleDeleteEvent}
          disabled={deleteLoading}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="pb-5 max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="max-w-8xl mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left */}
          <div className="grid grid-cols-1">
            {/* image of the artist */}
            <img
              src={artist.mainImageUrl}
              alt={artist.name}
              className="rounded-lg w-full h-64 lg:h-full object-cover"
            />
          </div>
          {/* right */}
          <div className="md:col-span-2 flex flex-col items-start gap-3">
            <div className="grid grid-cols-2 md:grid-cols-3">
              <h1 className="md:col-span-2 flex items-end gap-3 text-4xl sm:text-5xl md:text-5xl font-black tracking-tight uppercase text-white">
                {artist.name}
              </h1>
              <button className="flex justify-center items-center">
                <CirclePlay className="w-10 h-10 transition-colors duration-100 hover:text-purple hover:scale-115 cursor-pointer" />
              </button>
            </div>
            <div className="p-1">
              <span className="rounded text-white px-2 py-1 bg-purple text-[12px] font-bold uppercase tracking-wider">
                {artist.genres?.length ? artist.genres : "-"}
              </span>
            </div>
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
    </div>
  );
};
