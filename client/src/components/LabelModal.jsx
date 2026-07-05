import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import "../styles/LabelModal.css";

function LabelModal({
  isOpen,
  onClose,
  activity,
  fetchActivities,
}) {
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (activity) {
      setLabel(activity.label || "");
      setNote(activity.note || "");
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleSave = async () => {
    try {
      await API.put(`/activity/${activity._id}/label`, {
        label,
        note,
      });

      toast.success("Label updated successfully!");

      await fetchActivities();

      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Failed to update label.");
    }
  };

  return (
    <div
  className="modal-overlay"
  onClick={onClose}
>

  <div
    className="label-modal"
    onClick={(e) => e.stopPropagation()}
  >
        <h2>Edit Label</h2>

        <label>Label</label>

        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        >
          <option value="">None</option>
          <option value="Need Revision">
            Need Revision
          </option>
          <option value="Marked for Review">
            Marked for Review
          </option>
          <option value="Revised">
            Revised
          </option>
          <option value="Interview Ready">
            Interview Ready
          </option>
        </select>

        <label>Notes</label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={250}
          rows={5}
          placeholder="Write your notes..."
        />

        <p>
          {note.length}/250
        </p>

        <div className="modal-buttons">

          <button
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="save-btn"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default LabelModal;