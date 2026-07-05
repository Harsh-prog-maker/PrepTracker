import { useMemo, useState } from "react";
import "../styles/TopicProgress.css";

function TopicProgress({ problems, activities }) {
  const [expandedTopic, setExpandedTopic] = useState(null);
const [showAllTopics, setShowAllTopics] = useState(false);
  const topicData = useMemo(() => {
    const solvedProblems = new Set(
      activities
        .filter((activity) => activity.problem)
        .map((activity) => activity.problem._id)
    );

    const groupedTopics = {};

    problems.forEach((problem) => {
      if (!groupedTopics[problem.topic]) {
        groupedTopics[problem.topic] = {
          total: 0,
          solved: 0,
          problems: [],
        };
      }

      groupedTopics[problem.topic].total++;

      const solved = solvedProblems.has(problem._id);

      if (solved) {
        groupedTopics[problem.topic].solved++;
      }

      groupedTopics[problem.topic].problems.push({
        ...problem,
        solved,
      });
    });

    return Object.entries(groupedTopics).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [problems, activities]);
const solvedTopics = topicData.filter(
  ([, data]) => data.solved > 0
);

const remainingTopics = topicData.filter(
  ([, data]) => data.solved === 0
);

const displayedTopics = showAllTopics
  ? [...solvedTopics, ...remainingTopics]
  : solvedTopics.slice(0, 6);
    return (
    <div className="topic-progress-card">

      <div className="topic-progress-header">
  <h3>📚 Topic Progress</h3>
</div>

{displayedTopics.map(([topic, data]) => {
        const percentage = Math.round(
          (data.solved / data.total) * 100
        );

        return (
          <div
            key={topic}
            className="topic-section"
          >
            <div
  className="topic-header"
  onClick={() =>
    setExpandedTopic(
      expandedTopic === topic ? null : topic
    )
  }
>
  <div className="topic-info">

    <div className="topic-title-row">

      <strong>
        {expandedTopic === topic ? "▼" : "▶"} {topic}
      </strong>

      <span className="topic-count">
        {data.solved} / {data.total}
      </span>

    </div>

    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>

  </div>
</div>
            {expandedTopic === topic && (

              <div className="topic-problems">

                {data.problems.map((problem) => (

                  <div
                    key={problem._id}
                    className="topic-problem"
                  >

                    <span>

                      {problem.solved ? "✅" : "⬜"}

                    </span>

                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {problem.title}
                    </a>

                  </div>

                ))}

              </div>

            )}

          </div>
        );
            })}

      {topicData.length > 6 && (
        <button
          className="show-all-topics-btn"
          onClick={() => setShowAllTopics(!showAllTopics)}
        >
          {showAllTopics
  ? "▲ Hide Remaining Topics"
  : `▼ Explore Remaining Topics (${remainingTopics.length})`}
        </button>
      )}

    </div>
  );
}

export default TopicProgress;