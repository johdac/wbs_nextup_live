import { Pencil } from "lucide-react";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { EditBtn } from "../buttons/EditBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { GenresTag } from "../ui/GenresTag";
import DOMPurify from "dompurify";
import { Link } from "react-router";

interface ArtistPreviewData {
  _id?: string;
  id?: string;
  name: string;
  genres: string[];
  description?: string;
  mainImageUrl?: string;
  websiteUrl?: string;
}

interface ArtistPreviewCardProps {
  artist: ArtistPreviewData;
  handleDelete?: () => void;
  showModal?: boolean;
  setItemToDelete?: (id: string) => void;
  setShowModal?: (show: boolean) => void;
  canEdit?: boolean;
  onEdit?: () => void;
  linkTo?: string;
}

export const ArtistCardEdit = ({
  artist,
  handleDelete,
  showModal,
  setItemToDelete,
  setShowModal,
  canEdit = true,
  onEdit,
  linkTo,
}: ArtistPreviewCardProps) => {
  const artistId = artist.id || artist._id || "";
  const detailsLink = linkTo ?? `/managed-artists/${artistId}`;
  const showDeleteAction =
    Boolean(handleDelete) && Boolean(setItemToDelete) && Boolean(setShowModal) && artistId.length > 0;
  const hasActionButtons = canEdit || showDeleteAction;

  const EditAction = () => {
    if (!canEdit) {
      return null;
    }

    if (onEdit) {
      return (
        <button type="button" onClick={onEdit} aria-label="Edit artist">
          <div className="btn-icon">
            <Pencil />
          </div>
        </button>
      );
    }

    return <EditBtn data={artist} path="managed-artists" />;
  };

  return (
    <div className="managed-card relative isolate">
      <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
        <div className="relative w-full sm:w-30 sm:h-30 shrink-0 overflow-visible rounded-md">
          <div className="h-full overflow-hidden rounded-md">
            <Link to={detailsLink} className="block h-full">
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
          {hasActionButtons && (
            <div className="absolute right-1 top-2 z-50 flex gap-2 rounded-full bg-black/55 p-3 backdrop-blur-sm sm:hidden">
              <EditAction />
              {showDeleteAction && setItemToDelete && setShowModal && (
                <DeleteBtn id={artistId} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
              )}
            </div>
          )}
        </div>

        <Link to={detailsLink} className="block">
          <div className="flex flex-col gap-1">
            <p className="text-white text-xl font-semibold">{artist.name}</p>
            <p
              className="text-gray text-md font-light line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(artist.description || ""),
              }}
            />
            <GenresTag data={artist} />
          </div>
        </Link>
      </div>

      {hasActionButtons && (
        <div className="hidden sm:flex mt-2 sm:mt-0 sm:ml-auto gap-2">
          <EditAction />
          {showDeleteAction && setItemToDelete && setShowModal && (
            <DeleteBtn id={artistId} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
          )}
        </div>
      )}

      {showDeleteAction && handleDelete && setShowModal && (
        <ConfirmModal
          name="artist"
          handleDelete={handleDelete}
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};
