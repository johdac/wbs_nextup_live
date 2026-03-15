import { Pencil } from "lucide-react";
import { useNavigate } from "react-router";

export const EditBtn = <T extends { id?: string; _id?: string }>({
  data,
  path,
}: {
  data: T;
  path: string;
}) => {
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
      <div className="btn-icon">
        <Pencil className="h-6 w-6" />
      </div>
    </button>
  );
};
