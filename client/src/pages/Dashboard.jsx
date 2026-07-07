import { useEffect, useState } from "react";
import API from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,} from "recharts";
import ProblemSelector from "../components/ProblemSelector";
import ActivityList from "../components/ActivityList";
import TopicProgress from "../components/TopicProgress";
import logo from "../assets/logo.svg";
import "../styles/Dashboard.css";

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [activities, setActivities] = useState([]);
 
  const [stats, setStats] = useState({
  totalSolved: 0,
  easy: 0,
  medium: 0,
  hard: 0,
});

const [streak, setStreak] = useState({
  currentStreak: 0,
  lastStreak: 0,
  bestStreak: 0,
  showLastStreak: false,
  message: "",
});

const [loading, setLoading] = useState(true);
const [user, setUser] = useState(null);
const fetchUser = async () => {
  try {
    const res = await API.get("/users/profile");
    setUser(res.data.user);
  } catch (err) {
    console.log(err);
  }
};
const COLORS = ["#00C49F", "#FFBB28", "#e65050"];
const chartData = [
  { name: "Easy", value: stats.easy },
  { name: "Medium", value: stats.medium },
  { name: "Hard", value: stats.hard },
];

useEffect(() => {
  async function loadDashboard() {
    setLoading(true);

    await Promise.all([
  fetchProblems(),
  fetchActivities(),
  fetchStats(),
  fetchStreak(),
  fetchUser(),
]);

    setLoading(false);
  }

  loadDashboard();
}, []);

  const fetchProblems = async () => {
    try {
      const res = await API.get("/problems");
      setProblems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await API.get("/activity");
      setActivities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStats = async () => {
  try {
    const res = await API.get("/activity/stats");
    setStats(res.data);
  } catch (err) {
    console.log(err);
  }
};

const fetchStreak = async () => {
  try {
    const res = await API.get("/activity/streak");
    setStreak(res.data);
  } catch (err) {
    console.log(err);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
if (loading) {
  return (
    <div className="loading-screen">
      <h2>Loading PrepTracker...</h2>
    </div>
  );
}

  return (
    <div className="dashboard-container">
  <div className="dashboard-header">

  <div className="dashboard-heading">

    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
<img
  src={logo}
  alt="PrepTracker"
  style={{
    width: "40px",
    height: "40px",
    borderRadius: "10px",
  }}
/>
  <h1 className="dashboard-title" style={{ margin: 0 }}>
    PrepTracker Dashboard
  </h1>
</div>

    <p className="welcome-text">
      Welcome back, {user?.name || "Coder"} 👋
    </p>

    <p className="dashboard-subtitle">
      Track your coding progress one problem at a time.
    </p>

  </div>

  <button className="logout-btn" onClick={handleLogout}>
     Logout
  </button>

</div>
  {/* STATS CARDS */}
<div className="dashboard-top">
<div className="dashboard-left">
  <div className="stats-container">
      <div className="stat-card">
        <h3>Total</h3>
        <p>{stats.totalSolved}</p>
      </div>

      <div className="stat-card">
        <h3>Easy</h3>
        <p>{stats.easy}</p>
      </div>

      <div className="stat-card">
        <h3>Medium</h3>
        <p>{stats.medium}</p>
      </div>

      <div className="stat-card">
        <h3>Hard</h3>
        <p>{stats.hard}</p>
      </div>
    </div>
    <TopicProgress
  problems={problems}
  activities={activities}
/>
  </div>
<div className="chart-container">
  <h3 className="insights-title">📊 Insights</h3>

  <div className="pie-wrapper">
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          /* Reduced outerRadius slightly from 75% to 65% to give labels more room */
          outerRadius="65%"
          innerRadius="0%" 
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="streak-section">
    <div className="streak-row">
      <span className="streak-label">
        🔥 {streak.showLastStreak ? "Last Streak" : "Current Streak"}
      </span>

      <span className="streak-value">
        {streak.showLastStreak
          ? streak.lastStreak
          : streak.currentStreak}{" "}
        Days
      </span>
    </div>

    <div className="streak-row">
      <span className="streak-label">
        🏆 Best Streak
      </span>

      <span className="streak-value">
        {streak.bestStreak} Days
      </span>
    </div>
  </div>
</div>
</div>
      <ProblemSelector
    problems={problems}
    fetchActivities={fetchActivities}
    fetchStats={fetchStats}
    fetchStreak={fetchStreak}
/>

      <hr className="dashboard-divider" />

<ActivityList
  activities={activities}
  fetchActivities={fetchActivities}
  fetchStats={fetchStats}
  fetchStreak={fetchStreak}
/>    </div>
  );
}
export default Dashboard;
