import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [resumes, setResumes] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("resumes"); // Options: "resumes" | "users"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "resumes") {
        const res = await api.get("/resumes");
        setResumes(res.data);
      } else {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete resume?")) return;
    try {
      await api.delete(`/resume/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#f7f3f7",
        minHeight: "100vh",
        padding: "2rem",
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
        Administration Control Center
      </p>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#1a0a1a",
          margin: 0,
          letterSpacing: "-0.02em",
        }}
      >
        Management Console
      </h1>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab("resumes")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #ede5ed",
            background: activeTab === "resumes" ? "#9b59b6" : "#fff",
            color: activeTab === "resumes" ? "#fff" : "#1a0a1a",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📄 Resumes ({resumes.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #ede5ed",
            background: activeTab === "users" ? "#9b59b6" : "#fff",
            color: activeTab === "users" ? "#fff" : "#1a0a1a",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          👥 Registered Users ({users.length})
        </button>
      </div>

      {/* Main Container Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #ede5ed",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9a829a" }}>
            Loading data records...
          </div>
        ) : activeTab === "resumes" ? (
          /* RESUMES VIEW */
          resumes.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, margin: "0 auto 1rem", borderRadius: 16, background: "#faf3fa", border: "1px solid #e8d0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#802d7d" }}>📄</div>
              <h3 style={{ margin: 0, color: "#1a0a1a" }}>No resumes found</h3>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#faf3fa" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#9a829a", textTransform: "uppercase" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#9a829a", textTransform: "uppercase" }}>Filename</th>
                  <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 12, color: "#9a829a", textTransform: "uppercase" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume, index) => (
                  <tr key={resume.id} style={{ borderTop: index === 0 ? "none" : "1px solid #f0e8f0" }}>
                    <td style={{ padding: "16px 20px", color: "#5a2858", fontWeight: 500 }}>#{resume.id}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: "#faf3fa", border: "1px solid #e8d0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#802d7d" }}>📄</div>
                        <span style={{ color: "#1a0a1a", fontWeight: 500 }}>{resume.filename}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <button onClick={() => deleteResume(resume.id)} style={{ border: "1px solid #f5c6c6", background: "#fff5f5", color: "#a32d2d", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 600 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          /* USERS VIEW */
          users.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, margin: "0 auto 1rem", borderRadius: 16, background: "#faf3fa", border: "1px solid #e8d0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#802d7d" }}>👥</div>
              <h3 style={{ margin: 0, color: "#1a0a1a" }}>No registered users found</h3>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#faf3fa" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#9a829a", textTransform: "uppercase" }}>User ID</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: "#9a829a", textTransform: "uppercase" }}>Email Address</th>
                  <th style={{ textAlign: "right", padding: "14px 20px", fontSize: 12, color: "#9a829a", textTransform: "uppercase" }}>Privileges</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} style={{ borderTop: index === 0 ? "none" : "1px solid #f0e8f0" }}>
                    <td style={{ padding: "16px 20px", color: "#5a2858", fontWeight: 500 }}>#{user.id}</td>
                    <td style={{ padding: "16px 20px", color: "#1a0a1a", fontWeight: 500 }}>{user.email}</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <span
                        style={{
                          background: user.is_admin ? "#fff0f8" : "#f0fdf4",
                          color: user.is_admin ? "#9b59b6" : "#15803d",
                          border: user.is_admin ? "1px solid #f9d5ea" : "1px solid #bbf7d0",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {user.is_admin ? "Administrator" : "Standard User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}