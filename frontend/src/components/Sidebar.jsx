import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#2c3e50",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        overflowY: "auto"
      }}
    >
      <h2>Admin Panel</h2>
      <hr />
      
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", color: "#bbb" }}>{user?.email}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          <Link
            to="/admin"
            style={{ color: "white", textDecoration: "none" }}
          >
            Dashboard
          </Link>
        </p>

        <p>
          <Link
            to="/admin/resumes"
            style={{ color: "white", textDecoration: "none" }}
          >
            Resumes
          </Link>
        </p>
      </div>

      <div style={{ marginTop: "40px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
