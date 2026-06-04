import React, { useEffect, useState } from "react";
import api from "../services/api";

function StatCard({ label, value, icon, accent = "#802d7d" }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ede5ed",
        borderRadius: 16,
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#9a829a",
              margin: 0,
            }}
          >
            {label}
          </p>

          <h2
            style={{
              margin: "10px 0 0",
              fontSize: 38,
              fontWeight: 600,
              color: "#1a0a1a",
              letterSpacing: "-0.03em",
            }}
          >
            {value}
          </h2>
        </div>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#faf3fa",
            border: "1px solid #e8d0e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ score }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? "#3b6d11"
      : score >= 50
      ? "#802d7d"
      : "#a32d2d";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ede5ed",
        borderRadius: 16,
        padding: "1.5rem",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#9a829a",
          marginTop: 0,
        }}
      >
        Average Resume Score
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginTop: "1rem",
        }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke="#ede5ed"
            strokeWidth="8"
          />

          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />

          <text
            x="45"
            y="50"
            textAnchor="middle"
            fontSize="18"
            fontWeight="600"
            fill="#1a0a1a"
          >
            {score.toFixed(0)}
          </text>
        </svg>

        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#1a0a1a",
            }}
          >
            {score.toFixed(1)}
          </div>

          <div
            style={{
              fontSize: 13,
              color,
              fontWeight: 500,
            }}
          >
            {score >= 75
              ? "Excellent quality"
              : score >= 50
              ? "Moderate quality"
              : "Needs improvement"}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    total_resumes: 0,
    avg_score: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Inside Dashboard.jsx pseudo-logic
if (resumes.length === 0) {
  return <EmptyState message="You haven't uploaded any resumes yet. Head over to the Upload tab to get started!" />;
}

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f3f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "DM Sans, sans-serif",
          color: "#9a829a",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f7f3f7",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Header */}

      <p
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 13,
          color: "#9b59b6",
          marginBottom: 4,
        }}
      >
        Administration
      </p>

      <h1
        style={{
          fontSize: 30,
          fontWeight: 600,
          color: "#1a0a1a",
          margin: 0,
          letterSpacing: "-0.03em",
        }}
      >
        Dashboard
      </h1>

      <p
        style={{
          color: "#9a829a",
          fontSize: 13,
          marginTop: 6,
          marginBottom: "2rem",
        }}
      >
        Overview of resume uploads and analysis performance.
      </p>

      {/* Stats Grid */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          label="Total Resumes"
          value={stats.total_resumes}
          icon="📄"
        />

        <ScoreCard score={stats.avg_score} />
      </div>

      {/* Optional Overview Card */}

      <div
        style={{
          marginTop: "20px",
          background: "#fff",
          border: "1px solid #ede5ed",
          borderRadius: 16,
          padding: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#9a829a",
          }}
        >
          Summary
        </p>

        <h3
          style={{
            marginTop: 6,
            marginBottom: 10,
            color: "#1a0a1a",
          }}
        >
          Resume Analytics Overview
        </h3>

        <p
          style={{
            color: "#5d465d",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Your platform has analysed{" "}
          <strong>{stats.total_resumes}</strong> resumes with an
          average quality score of{" "}
          <strong>{stats.avg_score.toFixed(1)}</strong>.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;