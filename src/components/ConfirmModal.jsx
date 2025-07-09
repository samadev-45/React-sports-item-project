import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // required for accessibility

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation"
      className="bg-white max-w-md p-6 rounded-lg shadow-xl mx-auto mt-40 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-lg font-semibold mb-4">{message}</h2>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Yes, Remove
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
