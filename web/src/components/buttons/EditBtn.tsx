import { Pencil } from "lucide-react";
import { useNavigate } from "react-router";

export const EditBtn = <T extends { id?: string; _id?: string }>({ data, path }: { data: T; path: string }) => {
  const navigate = useNavigate();
  const id = data.id || data._id;

  if (!id) return null;

  return (
    <button
      onClick={() =>
        navigate(`/${path}/${id}/edit`, {
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
