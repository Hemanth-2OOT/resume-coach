import { useState, useRef, useCallback } from "react";
import api from "../services/api";

// ─── Inject fonts + keyframes once ────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("ur-styles")) return;
  const link = document.createElement("link");
  link.id = "ur-styles";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@1,300&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes ur-spin   { to { transform: rotate(360deg); } }
    @keyframes ur-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
    @keyframes ur-ring   { from { stroke-dashoffset: 188; } }
    .ur-drop:hover   { border-color:#802d7d !important; background:#fdf5fd !important; }
    .ur-btn:hover:not(:disabled) { background:#6a2368 !important; }
    .ur-btn:active:not(:disabled){ transform:scale(0.98) !important; }
    .ur-clear:hover  { color:#802d7d !important; }
    .ur-result       { animation: ur-fadein 0.3s ease both; }
    .ur-ring-fill    { animation: ur-ring 1s ease both; }
  `;
  document.head.appendChild(style);
};

// ─── Score ring SVG ────────────────────────────────────────────────────────────
function ScoreRing({ score = 0 }) {
  const radius = 30;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color  = score >= 75 ? "#3b6d11" : score >= 50 ? "#802d7d" : "#a32d2d";
  const label  = score >= 75 ? "Good" : score >= 50 ? "Fair" : "Needs work";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#ede5ed" strokeWidth="7" />
        <circle
          className="ur-ring-fill"
          cx="36" cy="36" r={radius}
          fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x="36" y="41" textAnchor="middle" fontSize="16" fontWeight="600"
          fill="#1a0a1a" fontFamily="DM Sans,sans-serif">{score}</text>
      </svg>
      <div>
        <div style={{ fontSize: 12, color: "#9a829a", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
          Resume score
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, color: "#1a0a1a", lineHeight: 1 }}>
          {score} <span style={{ fontSize: 15, fontWeight: 400, color: "#9a829a" }}>/ 100</span>
        </div>
        <div style={{ fontSize: 12, color, marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Skill pill ────────────────────────────────────────────────────────────────
function SkillPill({ label }) {
  return (
    <span style={{
      padding: "5px 12px", background: "#faf3fa",
      border: "1px solid #e8d0e8", borderRadius: 20,
      fontSize: 12, fontWeight: 600, color: "#802d7d",
    }}>
      {label}
    </span>
  );
}

// ─── Suggestion row ────────────────────────────────────────────────────────────
function SuggestionRow({ type = "info", text }) {
  const isOk = type === "success";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 12px", background: isOk ? "#f4fbee" : "#faf8fa",
      borderRadius: 10, border: `1px solid ${isOk ? "#c0dd97" : "#ede5ed"}`,
      marginBottom: 8
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 1,
        background: isOk ? "#eaf3de" : "#fdf3fd",
        border: `1px solid ${isOk ? "#c0dd97" : "#e8d0e8"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: isOk ? "#3b6d11" : "#802d7d", fontSize: 13,
      }}>
        {isOk ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r={10} /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )
        }
      </div>
      <p style={{ fontSize: 13, color: "#3a2538", lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children, style }) {
  return (
    <p style={{
      fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
      textTransform: "uppercase", color: "#9a829a", marginBottom: 12, ...style
    }}>
      {children}
    </p>
  );
}

// ─── Main Upload Component ──────────────────────────────────────────────────────
export default function UploadResume() {
  injectStyles();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a PDF file only.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const clearFile = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Calls Route("/api/upload-pdf") from main.py
      const response = await api.post("/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.success) {
        setAnalysis(response.data.analysis);
      } else {
        setError(response.data.detail || "Failed to analyze the resume.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 20px", fontFamily: "DM Sans, sans-serif" }}>
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 32, fontWeight: 300, color: "#1a0a1a", marginBottom: 8 }}>
        Resume Intelligence Coach
      </h2>
      <p style={{ color: "#605060", fontSize: 15, marginBottom: 32 }}>
        Upload your PDF resume to evaluate ATS visibility, identify missing stack tech elements, and query roles.
      </p>

      {/* Drop Zone Box */}
      <div 
        className="ur-drop"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        style={{
          border: "2px dashed #ede5ed", background: "#fcfbfe", borderRadius: 16,
          padding: "40px 20px", textAlign: "center", cursor: file ? "default" : "pointer",
          transition: "all 0.2s ease"
        }}
      >
        <input 
          type="file" ref={fileInputRef} onChange={handleFileChange} 
          accept="application/pdf" style={{ display: "none" }} 
        />
        
        {!file ? (
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
            <p style={{ fontWeight: 500, color: "#1a0a1a", margin: "0 0 4px 0" }}>Drag and drop your PDF resume here</p>
            <p style={{ fontSize: 13, color: "#9a829a", margin: 0 }}>or click to browse your storage documents (Max 10MB)</p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontWeight: 600, color: "#1a0a1a", margin: "0 0 2px 0" }}>{file.name}</p>
              <p style={{ fontSize: 12, color: "#9a829a", margin: 0 }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button 
              className="ur-clear" onClick={clearFile}
              style={{ background: "none", border: "none", color: "#9a829a", cursor: "pointer", marginLeft: 20, fontSize: 13, fontWeight: 500 }}
            >
              Remove file
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ color: "#a32d2d", background: "#fdf2f2", padding: "12px", borderRadius: 8, marginTop: 16, fontSize: 14 }}>{error}</div>}

      {file && !analysis && (
        <button 
          className="ur-btn" onClick={handleUpload} disabled={loading}
          style={{
            width: "100%", marginTop: 20, padding: "14px", background: "#802d7d", color: "#fff",
            border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease"
          }}
        >
          {loading ? "Parsing & Analyzing with AI..." : "Begin Deep Evaluation"}
        </button>
      )}

      {/* Analysis Results View Output */}
      {analysis && (
        <div className="ur-result" style={{ marginTop: 40, borderTop: "1px solid #ede5ed", paddingTop: 40 }}>
          
          {/* Top Overview Segment Row */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 32 }}>
            <ScoreRing score={analysis.ats_score || analysis.score || 0} />
            {analysis.market_insight && (
              <div style={{ maxWidth: 360, background: "#fcfbfe", padding: 16, borderRadius: 12, border: "1px solid #ede5ed" }}>
                <SectionLabel style={{ marginBottom: 6 }}>Market Insight</SectionLabel>
                <p style={{ margin: 0, fontSize: 13, color: "#3a2538", lineHeight: 1.5 }}>{analysis.market_insight}</p>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 32 }}>
            <SectionLabel>Summary</SectionLabel>
            <p style={{ fontSize: 15, color: "#1a0a1a", lineHeight: 1.6, margin: 0 }}>
              {analysis.ai_summary || analysis.summary}
            </p>
          </div>

          {/* Extracted Skill Tags Section */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>Identified Skills</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(analysis.skills_found || []).map((skill, i) => (
                <SkillPill key={i} label={skill} />
              ))}
              {(analysis.soft_skills || []).map((skill, i) => (
                <SkillPill key={`soft-${i}`} label={`💡 ${skill}`} />
              ))}
            </div>
          </div>

          {/* Structural Suggestions Pipeline */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>Improvement Plan Actions</SectionLabel>
            {(analysis.suggestions || []).length > 0 ? (
              analysis.suggestions.map((text, idx) => (
                <SuggestionRow key={idx} text={text} />
              ))
            ) : (
              <SuggestionRow type="success" text="No baseline dynamic optimizations required! The target layout profiles appear optimal." />
            )}
          </div>

          {/* Job Target Predictions Mapping */}
          <div>
            <SectionLabel>Recommended Roles Target Match Profiles</SectionLabel>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
              {(analysis.recommended_roles || []).map((roleData, idx) => (
                <div key={idx} style={{ padding: 16, border: "1px solid #ede5ed", borderRadius: 12, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: "#1a0a1a" }}>{roleData.role}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#802d7d" }}>{roleData.match}% match</span>
                  </div>
                  {roleData.avg_salary_usd && (
                    <div style={{ fontSize: 12, color: "#605060", marginBottom: 8 }}>
                      💵 Est. Salary: {roleData.avg_salary_usd}
                    </div>
                  )}
                  {roleData.why && roleData.why.length > 0 && (
                    <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, fontSize: 13, color: "#3a2538", lineHeight: 1.5 }}>
                      {roleData.why.map((bullet, bIdx) => <li key={bIdx}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}