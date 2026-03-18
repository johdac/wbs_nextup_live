import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import DOMPurify from "dompurify";
import { artistsService, type Artist } from "../../services/artistsApi";
import { Link } from "lucide-react";
import { EventByArtist } from "../artists/EventsByArtist";
import { GenresTag } from "../ui/GenresTag";
import { Kicker } from "../ui/Kicker";
import { GoBackBtn } from "../buttons/GoBackBtn";
import { EditBtn } from "../buttons/EditBtn";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../layout/ConfirmModal";
import { PlayerTransports } from "../../features/player/PlayerTransports";
import { eventsService, type EventListItem } from "../../services/eventsApi";

export const SingleArtistPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signedIn, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventListItem | null>(null);

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
        const artistData = await artistsService.getArtistById(id);
        const eventData = await eventsService.fetchEventsList(1, {
          artistId: id,
          limit: 1,
        });
        setArtist(artistData);
        setEvent(eventData[0]);
      } catch (err) {
        setError("Failed to load artist");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  /**
   * Construct the an PlaylistItem array to pass to the player. Since we are on the artist page we
   * are lacking a full event we can show in the player otherwise. We get the latest event for the artist
   * fresh from the api.
   */
  const playlistItems = useMemo(() => {
    if (!artist || !event) return [];

    return artist.musicResources?.map((el) => ({
      played: false,
      song: {
        id: el._id,
        artist: {
          id: artist.id,
          name: artist.name,
        },
        sourceUrl: el.url,
        title: el.title,
      },
      event: {
        id: event.id,
        location: {
          id: event.location.id,
          name: event.location.name,
          city: event.location.city,
        },
        start: event.startDate,
        interactionType: event.interactionType,
      },
    }));
  }, [artist, event]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!artist) return <p>Artist not found</p>;

  const artistOwnerId =
    artist.organizerId ||
    (typeof artist.createdById === "string"
      ? artist.createdById
      : artist.createdById?._id || "");
  const isOwner = signedIn && Boolean(user?._id) && user?._id === artistOwnerId;

  const handleDelete = async () => {
    if (!isOwner) return;
    if (!itemToDelete) return;

    try {
      await artistsService.deleteArtist(itemToDelete);
      navigate("/managed-artists");
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete("");
    }
  };

  return (
    <div className="container mx-auto">
      {isOwner && (
        <div className="pb-10 flex flex-row justify-between items-center">
          <div className="text-white">
            <GoBackBtn path="/managed-artists" />
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <EditBtn data={artist} path="managed-artists" />
            <DeleteBtn
              id={artist.id || artist._id || ""}
              setItemToDelete={setItemToDelete}
              setShowModal={setShowModal}
            />
          </div>
        </div>
      )}
      <div className="pb-20 max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-stretch w-full">
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
            <div className="pb-6 w-full">
              <Kicker text="Artist" />
              <div className="flex flex-row gap-10 items-center pb-2">
                <h1>{artist.name}</h1>
              </div>
              <div className="flex justify-between">
                <GenresTag data={artist} />
                {playlistItems && (
                  <div className="flex gap-2">
                    <PlayerTransports resources={playlistItems} />
                  </div>
                )}
              </div>
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
                target={"_blank"}
                rel="noopener noreferrer"
                className="flex flex-row gap-1 items-center text-lg underline cursor-pointer hover:text-purple"
              >
                <Link /> <div>Website</div>
              </a>
            </div>
          </div>
        </div>
        {isOwner && (
          <ConfirmModal
            name="artist"
            handleDelete={handleDelete}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </div>
      <EventByArtist artistId={artist.id || artist._id || ""} />
    </div>
  );
};
