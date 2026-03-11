interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export const ConfirmModal = ({ open, title, message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300">
              Cancel
            </button>

            <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
};
