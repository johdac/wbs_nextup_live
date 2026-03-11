import { Trash2 } from "lucide-react";

interface DeleteBtnProps {
  id: string;
  title: string;
  handleDelete: () => Promise<void> | void;
  showModal: boolean;
  setItemToDelete: (id: string) => void;
  setShowModal: (show: boolean) => void;
}

export const DeleteBtn = ({ id, title, handleDelete, showModal, setItemToDelete, setShowModal }: DeleteBtnProps) => {
  return (
    <>
      <button
        onClick={() => {
          setItemToDelete(id!);
          setShowModal(true);
        }}
      >
        <div className="flex flex-row pb-1 items-center text-white gap-1 transition-colors duration-100 hover:text-red-500">
          <Trash2 className="h-6 w-6" />
        </div>
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this?</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300">
                Cancel
              </button>

              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
