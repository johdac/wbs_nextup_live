interface DeleteBtnProps {
  name: string;
  handleDelete: () => Promise<void> | void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const ConfirmModal = ({ name, handleDelete, showModal, setShowModal }: DeleteBtnProps) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4 uppercase">delete {name}</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this {name}?</p>

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
