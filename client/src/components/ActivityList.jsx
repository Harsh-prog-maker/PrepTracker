import { useState } from "react";
import "../styles/ActivityList.css";
function ActivityList({ activities }) {
    const [currentPage, setCurrentPage] = useState(1);

const activitiesPerPage = 10;

const validActivities = activities.filter(
  (activity) => activity.problem
);

const totalPages = Math.ceil(
  validActivities.length / activitiesPerPage
);

const startIndex = (currentPage - 1) * activitiesPerPage;

const currentActivities = validActivities.slice(
  startIndex,
  startIndex + activitiesPerPage
);
  return (
    <div className="activity-container">
      <h2 className="activity-title">Recent Activities</h2>

      {validActivities.length === 0 ? (
<div className="empty-state">
  <div className="empty-icon">📚</div>

  <h3>No activities yet</h3>

  <p>
    Start solving your first coding problem and track your progress here.
  </p>
</div>      ) : (
        currentActivities.map((activity) => (
          <div key={activity._id} className="activity-card">
            <h3>
  <a
    href={activity.problem.url}
    target="_blank"
    rel="noopener noreferrer"
    className="problem-title"
  >
    {activity.problem.title}
  </a>
</h3>

<p className="activity-meta">
  <a
    href={activity.problem.url}
    target="_blank"
    rel="noopener noreferrer"
    className="problem-platform"
  >
    {activity.problem.platform}🔗
  </a>

  <span
    className={`badge ${activity.problem.difficulty.toLowerCase()}`}
  >
    {activity.problem.difficulty}
  </span>
</p>
            <p className="activity-topic">
              {activity.problem.topic}
            </p>
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
    </div>
  );
}

export default ActivityList;