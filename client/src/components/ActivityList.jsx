import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import LabelModal from "./LabelModal";
import "../styles/ActivityList.css";
function ActivityList({ activities, fetchActivities, fetchStats }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [activityToDelete, setActivityToDelete] = useState(null);

  const activitiesPerPage = 10;

  const validActivities = activities.filter((activity) => activity.problem);

  const totalPages = Math.ceil(validActivities.length / activitiesPerPage);

  const startIndex = (currentPage - 1) * activitiesPerPage;

  const currentActivities = validActivities.slice(
    startIndex,
    startIndex + activitiesPerPage,
  );
  const openDeleteModal = (activity) => {
  setActivityToDelete(activity);
  setIsDeleteModalOpen(true);
};

const handleDeleteActivity = async () => {
  if (!activityToDelete) return;

  try {
    await API.delete(`/activity/${activityToDelete._id}`);

    toast.success("Activity deleted successfully!");

    await fetchActivities();
    await fetchStats();

    setIsDeleteModalOpen(false);
    setActivityToDelete(null);

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message || "Failed to delete activity."
    );
  }
};
  const handleFavorite = async (activityId) => {
    try {
      await API.put(`/activity/${activityId}/favorite`);

      await fetchActivities();
      await fetchStats();

      toast.success("Favorite updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorite.");
    }
  };
  const openLabelModal = (activity) => {
  setSelectedActivity(activity);
  setIsLabelModalOpen(true);
};
  return (
    <div className="activity-container">
      <h2 className="activity-title">Recent Activities</h2>

      {validActivities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>

          <h3>No activities yet</h3>

          <p>
            Start solving your first coding problem and track your progress
            here.
          </p>
        </div>
      ) : (
        currentActivities.map((activity) => (
          <div key={activity._id} className="activity-card">
            <div className="activity-header">
              <a
                href={activity.problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="problem-title"
              >
                <h3>{activity.problem.title}</h3>
              </a>
            </div>

            <p className="activity-meta">
              <a
                href={activity.problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="problem-platform"
              >
                {activity.problem.platform} 🔗
              </a>

              <span
                className={`badge ${activity.problem.difficulty.toLowerCase()}`}
              >
                {activity.problem.difficulty}
              </span>
            </p>

            <p className="activity-topic">{activity.problem.topic}</p>
            <div className="activity-label">

  <button
    className="label-btn"
    onClick={() => openLabelModal(activity)}
  >
    {activity.label
      ? `🏷️ ${activity.label}`
      : "🏷️ Add Label"}
  </button>

</div>
            <div className="activity-actions">
              <button
                className={`favorite-btn ${
                  activity.isFavorite ? "favorited" : ""
                }`}
                onClick={() => handleFavorite(activity._id)}
              >
                {activity.isFavorite ? "❤️ Favorite" : "🤍 Favorite"}
              </button>

              <button
  className="delete-activity-btn"
  onClick={() => openDeleteModal(activity)}
>
  Delete
</button>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
      <LabelModal
  isOpen={isLabelModalOpen}
  onClose={() => setIsLabelModalOpen(false)}
  activity={selectedActivity}
  fetchActivities={fetchActivities}
/>
<ConfirmModal
  isOpen={isDeleteModalOpen}
  title="Delete Activity"
  message="Are you sure you want to delete this activity? This action cannot be undone."
  onCancel={() => {
    setIsDeleteModalOpen(false);
    setActivityToDelete(null);
  }}
  onConfirm={handleDeleteActivity}
/>
    </div>
  );
}

export default ActivityList;
