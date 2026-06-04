import { useState, useRef, useCallback } from "react";
import axios from "axios";

// ─── Inject fonts + global styles once ───────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("resumes-styles")) return;

  const link = document.createElement("link");
  link.id = "resumes-styles";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@1,300&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes resume-spin { to { transform: rotate(360deg); } }
    @keyframes resume-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .resume-icon-btn:hover { background: #faf3fa !important; color: #802d7d !important; border-color: #d4b8d3 !important; }
    .resume-upload-btn:hover:not(:disabled) { background: #6a2368 !important; }
    .resume-upload-btn:active:not(:disabled) { transform: scale(0.98) !important; }
    .resume-card-row { animation: resume-fadein 0.25s ease both; }
    .resume-drop-zone:hover { border-color: #802d7d !important; background: #fdf5fd !important; }
    .resume-search:focus-within { border-color: #802d7d !important; box-shadow: 0 0 0 3px rgba(128,45,125,0.1) !important; }
    .resume-row-btn:hover { background: #faf3fa !important; }
  `;
  document.head.appendChild(style);
};

// ─── Constants ────────────────────────────────────────────────────────────────
const BADGE = {
  new:        { bg: "#faf3fa", color: "#802d7d", border: "#e8d0e8", label: "New" },
  reviewed:   { bg: "#eaf3de", color: "#3b6d11", border: "#c0dd97", label: "Reviewed" },
  shortlisted:{ bg: "#e6f1fb", color: "#185fa5", border: "#b5d4f4", label: "Shortlisted" },
  rejected:   { bg: "#fff0f0", color: "#a32d2d", border: "#f7c1c1", label: "Rejected" },
};

const MOCK_RESUMES = [
  { id: 1, name: "Arjun_Sharma_Resume.pdf",   size: "1.2 MB", role: "Senior Frontend Dev",  uploaded: "2 min ago",  status: "new",         type: "pdf" },
  { id: 2, name: "Priya_Mehta_CV.docx",        size: "890 KB", role: "Product Designer",     uploaded: "1 hr ago",   status: "shortlisted", type: "doc" },
  { id: 3, name: "Rahul_Verma_Resume.pdf",     size: "2.1 MB", role: "Backend Engineer",     uploaded: "Yesterday",  status: "reviewed",    type: "pdf" },
  { id: 4, name: "Sneha_Iyer_Portfolio.pdf",   size: "3.4 MB", role: "UX Researcher",        uploaded: "2 days ago", status: "new",         type: "pdf" },
  { id: 5, name: "Karthik_Nair_Resume.docx",   size: "750 KB", role: "DevOps Engineer",      uploaded: "3 days ago", status: "rejected",    type: "doc" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "1rem 1.25rem",
      border: "1px solid #ede5ed", boxSizing: "border-box",
    }}>
      <div style={{ fontSize: 12, color: "#9a829a", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: "#1a0a1a" }}>
        {value}{" "}
        <span style={{ fontSize: 13, fontWeight: 400, color: "#9b59b6" }}>{sub}</span>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const b = BADGE[status] || BADGE.new;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, marginLeft: 6,
      background: b.bg, color: b.color, border: `1px solid ${b.border}`,
    }}>
      {b.label}
    </span>
  );
}

function FileIcon({ type }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: "#faf3fa", border: "1px solid #e8d8e8",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, color: "#802d7d",
    }}>
      {type === "pdf" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="13" x2="15" y2="13"/>
        </svg>
      )}
    </div>
  );
}

function IconButton({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="resume-icon-btn"
      style={{
        width: 32, height: 32, borderRadius: 8,
        border: "1px solid #ede5ed", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#9a829a", fontSize: 15,
        transition: "all 0.15s", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function ResumeRow({ resume, onDelete, onView, onDownload }) {
  return (
    <div className="resume-card-row" style={{
      background: "#fff", borderRadius: 12, border: "1px solid #ede5ed",
      padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: 14,
    }}>
      <FileIcon type={resume.type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a0a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {resume.name}
          <Badge status={resume.status} />
        </div>
        <div style={{ fontSize: 12, color: "#9a829a", marginTop: 2 }}>
          Uploaded {resume.uploaded} &nbsp;·&nbsp; {resume.size} &nbsp;·&nbsp; {resume.role}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <IconButton title="View" onClick={() => onView(resume)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </IconButton>
        <IconButton title="Download" onClick={() => onDownload(resume)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </IconButton>
        <IconButton title="Delete" onClick={() => onDelete(resume.id)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </IconButton>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function Resumes() {
  injectStyles();

  const [resumes, setResumes] = useState(MOCK_RESUMES);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── File upload handler ──
  const handleFiles = useCallback(async (files) => {
    const validTypes = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const valid = Array.from(files).filter((f) => validTypes.includes(f.type) && f.size <= 10 * 1024 * 1024);

    if (!valid.length) {
      showToast("Only PDF/DOC/DOCX files under 10 MB are accepted.", "error");
      return;
    }

    setUploading(true);
    try {
      // Replace this block with your real axios upload:
      // const formData = new FormData();
      // valid.forEach((f) => formData.append("resumes", f));
      // await axios.post("/api/resumes/upload", formData);

      await new Promise((r) => setTimeout(r, 1200)); // simulate upload

      const newRows = valid.map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        role: "—",
        uploaded: "Just now",
        status: "new",
        type: f.name.endsWith(".pdf") ? "pdf" : "doc",
      }));
      setResumes((prev) => [...newRows, ...prev]);
      showToast(`${valid.length} resume${valid.length > 1 ? "s" : ""} uploaded successfully.`);
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id) => {
    // await axios.delete(`/api/resumes/${id}`);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    showToast("Resume deleted.");
  };

  const handleView   = (r) => showToast(`Opening ${r.name}…`);
  const handleDownload = (r) => showToast(`Downloading ${r.name}…`);

  const filtered = resumes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: resumes.length,
    shortlisted: resumes.filter((r) => r.status === "shortlisted").length,
    pending: resumes.filter((r) => r.status === "new").length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f7f3f7", minHeight: "100vh", padding: "2rem", boxSizing: "border-box" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 999,
          background: toast.type === "error" ? "#fff0f0" : "#eaf3de",
          border: `1px solid ${toast.type === "error" ? "#f5c6c6" : "#c0dd97"}`,
          color: toast.type === "error" ? "#a32d2d" : "#3b6d11",
          borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          animation: "resume-fadein 0.2s ease both",
        }}>
          {toast.type === "error"
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: 13, color: "#9b59b6", marginBottom: 4 }}>
            Talent pipeline
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#1a0a1a", letterSpacing: "-0.02em", margin: 0 }}>
            Resume management
          </h1>
          <p style={{ fontSize: 13, color: "#9a829a", marginTop: 4 }}>
            Review, filter and manage all candidate resumes
          </p>
        </div>
        <button
          className="resume-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: "#802d7d", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1, transition: "background 0.18s, transform 0.1s",
          }}
        >
          {uploading ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ animation: "resume-spin 0.8s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload resume
            </>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" multiple style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "2rem" }}>
        <StatCard label="Total resumes"  value={stats.total}       sub="uploaded"   />
        <StatCard label="Shortlisted"    value={stats.shortlisted} sub="candidates" />
        <StatCard label="Pending review" value={stats.pending}     sub="resumes"    />
      </div>

      {/* ── Drop zone ── */}
      <div
        className="resume-drop-zone"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#802d7d" : "#d4b8d3"}`,
          borderRadius: 14, background: dragOver ? "#fdf5fd" : "#fdf8fd",
          padding: "2.5rem", textAlign: "center", marginBottom: "2rem",
          cursor: "pointer", transition: "all 0.18s",
        }}
      >
        <div style={{ fontSize: 32, color: "#c49bc3", marginBottom: 10 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, color: "#5a2858", marginBottom: 4 }}>
          Drop resumes here to upload
        </p>
        <p style={{ fontSize: 12, color: "#b89ab8" }}>
          Supports PDF, DOC, DOCX &nbsp;·&nbsp; Max 10 MB per file &nbsp;·&nbsp; or{" "}
          <span style={{ color: "#802d7d", fontWeight: 600, textDecoration: "underline" }}>browse files</span>
        </p>
      </div>

      {/* ── Search ── */}
      <div
        className="resume-search"
        style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff", border: "1.5px solid #e8dde8",
          borderRadius: 10, padding: "0 12px", marginBottom: "1.5rem",
          transition: "border-color 0.18s, box-shadow 0.18s",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b89ab8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name, role, or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none", outline: "none", fontSize: 14,
            fontFamily: "'DM Sans', sans-serif", color: "#1a0a1a",
            width: "100%", height: 42, background: "transparent",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#b89ab8", fontSize: 18, lineHeight: 1, padding: 0 }}>
            ×
          </button>
        )}
      </div>

      {/* ── List ── */}
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a829a", marginBottom: 12 }}>
        {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : "Recent uploads"}
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#b89ab8" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#9a829a" }}>No resumes found</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Try a different search or upload a new resume</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((r) => (
            <ResumeRow
              key={r.id}
              resume={r}
              onDelete={handleDelete}
              onView={handleView}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Resumes;