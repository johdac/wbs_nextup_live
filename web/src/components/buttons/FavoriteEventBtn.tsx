import { CalendarHeart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  useDeleteEventRelation,
  useUpsertEventRelation,
} from "../../hooks/useEventRelation";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  withText?: boolean;
  interactionType: "hidden" | "favorite";
  eventId: string;
};

export const FavoriteEventBtn = ({
  interactionType,
  eventId,
  className,
  withText,
  ...props
}: Props) => {
  const { signedIn } = useAuth();
  const activeClass = interactionType === "favorite" ? "btn-icon-active" : "";

  // Handling button clicks with react query hooks
  const { mutate: upsertRelation } = useUpsertEventRelation();
  const { mutate: deleteRelation } = useDeleteEventRelation();

  const handleClick = () => {
    if (!signedIn) {
      toast.error("Please log in first");
    }
    if (interactionType === "favorite") {
      deleteRelation({
        id: eventId,
      });
    } else {
      upsertRelation({
        id: eventId,
        data: { interactionType: "favorite" },
      });
    }
  };

  return (
    <>
      <button
        {...props}
        className="flex group items-center "
        onClick={handleClick}
      >
        <CalendarHeart
          className={`w-6 h-6 sm:w-7 sm:h-7 btn-icon ${className} ${activeClass}`}
        />
        {withText && (
          <div className="btn-default px-4 py-2">
            {interactionType === "favorite"
              ? "Remove from favorites"
              : "Add event to favorites"}
          </div>
        )}
      </button>
    </>
  );
};
