import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#5a1f58",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "2rem",
    boxSizing: "border-box",
  },
  blob1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    top: -80,
    right: -80,
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    bottom: -60,
    left: -40,
    pointerEvents: "none",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "2.5rem 2.25rem 2rem",
    width: "100%",
    maxWidth: 400,
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },
  eyebrow: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontWeight: 300,
    fontSize: 13,
    color: "#9b59b6",
    letterSpacing: "0.02em",
    margin: "0 0 4px",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: "#1a0a1a",
    margin: "0 0 1.75rem",
    letterSpacing: "-0.02em",
  },
  demoBadge: {
    background: "#faf3fa",
    border: "1px dashed #d4b8d3",
    borderRadius: 8,
    padding: "9px 12px",
    marginBottom: "1.25rem",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#7a5a78",
    fontFamily: "monospace",
  },
  fieldWrap: {
    marginBottom: "1.1rem",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#6b5b6b",
    marginBottom: 6,
  },
  inputWrap: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 16,
    color: "#b89ab8",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    height: 44,
    padding: "0 12px 0 38px",
    border: "1.5px solid #e8dde8",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a0a1a",
    background: "#faf8fa",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.18s, background 0.18s",
  },
  eyeBtn: {
    position: "absolute",
    right: 11,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#b89ab8",
    fontSize: 16,
    padding: 2,
    display: "flex",
    alignItems: "center",
  },
  forgotLink: {
    display: "block",
    textAlign: "right",
    fontSize: 12,
    color: "#9b59b6",
    textDecoration: "none",
    marginTop: -6,
    marginBottom: "1.5rem",
    fontWeight: 500,
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #f5c6c6",
    borderRadius: 8,
    padding: "9px 12px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#c0392b",
  },
  submitBtn: {
    width: "100%",
    height: 46,
    background: "#802d7d",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background 0.18s, transform 0.1s",
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  signupRow: {
    textAlign: "center",
    fontSize: 13,
    color: "#9a829a",
    marginTop: "1.25rem",
  },
};

// Inject Google Fonts + keyframes once
const injectFonts = () => {
  if (document.getElementById("login-fonts")) return;
  const link = document.createElement("link");
  link.id = "login-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@1,300&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes login-spin { to { transform: rotate(360deg); } }
    .login-input:focus {
      border-color: #802d7d !important;
      background: #fff !important;
      box-shadow: 0 0 0 3px rgba(128,45,125,0.1) !important;
    }
    .login-submit:hover:not(:disabled) { background: #6a2368 !important; }
    .login-submit:active:not(:disabled) { transform: scale(0.98) !important; }
    .login-eye:hover { color: #802d7d !important; }
    .login-forgot:hover { text-decoration: underline !important; }
    .login-signup-link { color: #802d7d !important; font-weight: 600 !important; text-decoration: none !important; }
    .login-signup-link:hover { text-decoration: underline !important; }
  `;
  document.head.appendChild(style);
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  injectFonts();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const redirect = await login(email, password);
      navigate(redirect || "/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Header */}
        <p style={styles.eyebrow}>Welcome back</p>
        <h1 style={styles.title}>Sign in to continue</h1>


        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div style={styles.fieldWrap}>
            <label style={styles.label} htmlFor="login-email">Email address</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              </span>
              <input
                id="login-email"
                className="login-input"
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldWrap}>
            <label style={styles.label} htmlFor="login-password">Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="login-password"
                className="login-input"
                style={{ ...styles.input, paddingRight: 38 }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                style={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <a href="#" className="login-forgot" style={styles.forgotLink}>
            Forgot password?
          </a>

          {/* Error */}
          {error && (
            <div style={styles.errorBox} role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-submit"
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  style={{ animation: "login-spin 0.8s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Logging in…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Login
              </>
            )}
          </button>

          {/* Sign up */}
          <p style={styles.signupRow}>
            New user?{" "}
            <Link to="/signup" className="login-signup-link">
              Create account here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;