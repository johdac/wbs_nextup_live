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
      className="flex group items-center"
      onClick={() =>
        navigate(`/${path}/${id}/edit`, {
          state: { data },
        })
      }
    >
      <Pencil className="btn-icon" />
    </button>
  );
};
