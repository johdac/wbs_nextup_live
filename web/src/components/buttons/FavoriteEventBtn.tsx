import { CalendarHeart } from "lucide-react";
import type { EventListItem } from "../../services/eventsApi";
import {
  useDeleteEventRelation,
  useUpsertEventRelation,
} from "../../hooks/useEventRelation";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  withText?: boolean;
  event: EventListItem;
};

export const FavoriteEventBtn = ({
  event,
  className,
  withText,
  ...props
}: Props) => {
  const activeClass =
    event.interactionType === "favorite" ? "btn-icon-active" : "";

  // Handling button clicks with react query hooks
  const { mutate: upsertRelation } = useUpsertEventRelation();
  const { mutate: deleteRelation } = useDeleteEventRelation();

  const handleClick = () => {
    if (event.interactionType === "favorite") {
      deleteRelation({
        id: event.id,
      });
    } else {
      upsertRelation({
        id: event.id,
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
          className={`w-6 sm:w-7 btn-icon ${className} ${activeClass}`}
        />
        {withText && (
          <div className="btn-default px-4 py-2">
            {event.interactionType === "favorite"
              ? "Remove from favorites"
              : "Add event to favorites"}
          </div>
        )}
      </button>
    </>
  );
};
