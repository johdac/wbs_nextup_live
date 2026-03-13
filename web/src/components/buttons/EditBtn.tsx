import { Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import type { EventListItem } from "../../services/eventsApi";

export const EditBtn = ({ data, path }: { data: EventListItem; path: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() =>
        navigate(`/${path}/${data.id}/edit`, {
          state: { data },
        })
      }
    >
      <div className="flex flex-row pb-1 items-center text-white gap-1 transition-colors duration-100 hover:text-purple">
        <Pencil className="h-6 w-6" />
      </div>
    </button>
  );
};
