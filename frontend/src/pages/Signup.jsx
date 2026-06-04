import { useState } from "react";
import { API_PREFIX } from "../config";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";
import api from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_PREFIX}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      // Store token and set auth header
      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        setAuthToken(token);

        // Fetch user profile to populate context
        try {
          await api.get("/auth/me");
        } catch {
          // Non-fatal: user is registered, just proceed
        }
      }

      // Navigate to home — page will rehydrate auth from localStorage
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f3f7",
        fontFamily: "'DM Sans', sans-serif",
        padding: "1rem",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem 2rem",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #ede5ed",
          boxShadow: "0 4px 24px rgba(26, 10, 26, 0.02)",
        }}
      >
        {/* Header Branding Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 14,
              color: "#9b59b6",
              margin: "0 0 4px 0",
            }}
          >
            Join Us
          </p>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#1a0a1a",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#9a829a",
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            Get started by entering your credentials below.
          </p>
        </div>

        {/* Input/Form Layout */}
        <form onSubmit={handleSignup}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#9a829a",
                  marginBottom: 6,
                }}
              >
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#9a829a",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#9a829a",
                  marginBottom: 6,
                }}
              >
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Styled Clean Error Alert Box */}
          {error && (
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #f5c6c6",
                color: "#a32d2d",
                padding: "10px 14px",
                borderRadius: "8px",
                marginTop: "1.25rem",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form Submit Trigger */}
          <div style={{ marginTop: "2rem" }}>
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                background: loading ? "#ceb3da" : "#9b59b6",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s ease",
              }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </div>

          {/* Redirection Link Anchor */}
          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "13px",
              color: "#9a829a",
              marginBottom: 0,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#9b59b6",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#802d7d")}
              onMouseLeave={(e) => (e.target.style.color = "#9b59b6")}
            >
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default Signup;