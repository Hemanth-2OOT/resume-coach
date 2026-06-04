import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const userItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/resumes", label: "My Resumes", icon: "📄" },
  { to: "/upload", label: "Upload Resume", icon: "⬆️" },
];

const adminItems = [
  { to: "/admin/resumes", label: "All Resumes", icon: "🗂️" },
];

function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: isActive ? 600 : 400,
    color: isActive ? "#9b59b6" : "#5a445a",
    background: isActive ? "#f4eef9" : "transparent",
    textDecoration: "none",
    transition: "all 0.15s ease",
  });

  // If there is no user logged in yet, don't show the navigation panel
  if (!user) return null;

  return (
    <aside
      style={{
        width: "220px",
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #ede5ed",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1rem",
        fontFamily: "'DM Sans', sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        boxSizing: "border-box"
      }}
    >
      {/* Logo / Brand */}
      <div style={{ marginBottom: "2rem", paddingLeft: "4px" }}>
        <p
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 12,
            color: "#9b59b6",
            margin: "0 0 2px 0",
          }}
        >
          your career
        </p>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1a0a1a",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Resume Coach
        </h2>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, overflowY: "auto" }}>
        
        {/* Render standard items only for regular users / non-admins if you want separate layouts */}
        {!isAdmin && userItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => linkStyle(isActive)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Render Admin panel links */}
        {isAdmin && (
          <>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#c0a8c0",
                padding: "8px 14px 4px",
              }}
            >
              Admin Menu
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => linkStyle(isActive)}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Profile + Logout Footer */}
      <div
        style={{
          borderTop: "1px solid #ede5ed",
          paddingTop: "1rem",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "8px",
            background: "#faf5fc",
            marginBottom: "8px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#9b59b6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                color: "#1a0a1a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || "User"}
            </p>
            {isAdmin && (
              <p style={{ margin: 0, fontSize: 10, color: "#9b59b6", fontWeight: 500 }}>
                Admin Account
              </p>
            )}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#a32d2d",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ fontSize: 15 }}>🚪</span>
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;