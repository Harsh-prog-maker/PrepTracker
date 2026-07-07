import { useState } from "react";
import Select from "react-select";
import API from "../api/axios";
import "../styles/Dashboard.css";
import toast from "react-hot-toast";

function ProblemSelector({
  problems,
  fetchActivities,
  fetchStats,
  fetchStreak,
}) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const options = problems.map((problem) => ({
    value: problem.title,
    label: `${problem.title} (${problem.difficulty})`,
  }));

  const handleAdd = async () => {
    if (!selectedProblem) return;

    try {
      await API.post("/activity", {
        problemTitle: selectedProblem.value,
      });

      await fetchActivities();
      await fetchStats();
      await fetchStreak();
      toast.success("Problem added successfully!");

      setSelectedProblem(null);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="problem-selector">
      <div className="problem-actions">

        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          options={options}
          value={selectedProblem}
          onChange={setSelectedProblem}
          placeholder="Search a problem..."
        />

        <button
          className="add-btn"
          onClick={handleAdd}
        >
          Add Activity
        </button>

      </div>
    </div>
  );
}

export default ProblemSelector;