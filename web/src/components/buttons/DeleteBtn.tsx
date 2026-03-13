import { Trash2 } from "lucide-react";

interface DeleteBtnProps {
  id: string;
  setItemToDelete: (id: string) => void;
  setShowModal: (show: boolean) => void;
}

export const DeleteBtn = ({ id, setItemToDelete, setShowModal }: DeleteBtnProps) => {
  return (
    <>
      <button
        onClick={() => {
          setItemToDelete(id!);
          setShowModal(true);
        }}
      >
        <Trash2 className="h-6 w-6 text-white transition-colors duration-100 hover:text-red-500" />
      </button>
    </>
  );
};
