import "../styles/ConfirmModal.css";

function ConfirmModal({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div
  className="confirm-overlay"
  onClick={onCancel}
>
  <div
    className="confirm-modal"
    onClick={(e) => e.stopPropagation()}
  >
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-buttons">

          <button
            className="confirm-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirm-delete-btn"
            onClick={onConfirm}
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;