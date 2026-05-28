import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/TicketService";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  .bt-main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .bt-header { 
    background: linear-gradient(135deg, var(--ipb-blue-dark) 0%, var(--ipb-blue) 60%, var(--ipb-blue-mid) 100%); 
    padding: 36px 0 48px; 
    position: relative; 
    overflow: hidden; 
  }
  .bt-header::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.06); top: -150px; right: -100px; pointer-events: none; }
  .bt-header::after { content: ''; position: absolute; width: 250px; height: 250px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.06); bottom: -100px; left: 10%; pointer-events: none; }
  
  .bt-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1; }
  .bt-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 14px; }
  .bt-breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.15s; }
  .bt-breadcrumb a:hover { color: rgba(255,255,255,0.9); }
  .bt-breadcrumb span { color: rgba(255,255,255,0.9); font-weight: 600; }
  
  .bt-header h1 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 900; color: var(--white); letter-spacing: -0.5px; margin-bottom: 6px; }
  .bt-header p { font-size: 14px; color: rgba(255,255,255,0.65); }

  .bt-alert { max-width: 1200px; margin: -20px auto 0; padding: 0 40px; position: relative; z-index: 2; }
  .bt-alert-inner { background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 12px; padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #92400e; line-height: 1.6; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  .bt-content { max-width: 1200px; margin: 24px auto 48px; padding: 0 40px; display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }

  .bt-form-card { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
  .bt-form-card-header { padding: 20px 24px; border-bottom: 1.5px solid var(--gray-200); display: flex; align-items: center; gap: 10px; }
  .bt-form-card-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .bt-form-card-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--gray-900); letter-spacing: -0.3px; }
  .bt-form-card-body { padding: 24px; }

  .bt-user-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; padding: 14px 16px; background: var(--gray-50); border: 1.5px solid var(--gray-200); border-radius: 10px; }
  .bt-user-info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--gray-400); margin-bottom: 3px; }
  .bt-user-info-value { font-size: 13px; font-weight: 600; color: var(--gray-700); }

  .bt-field { margin-bottom: 20px; }
  .bt-label { display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 7px; }
  .bt-label .required { color: var(--error); margin-left: 3px; }

  .bt-select, .bt-input, .bt-textarea { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: var(--gray-900); background: var(--white); outline: none; transition: all 0.2s ease; }
  .bt-select { height: 46px; padding: 0 14px; cursor: pointer; }
  .bt-input { height: 46px; padding: 0 14px; }
  .bt-textarea { padding: 12px 14px; resize: vertical; min-height: 120px; line-height: 1.6; }
  .bt-select:focus, .bt-input:focus, .bt-textarea:focus { border-color: var(--ipb-blue-lite); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .bt-select.has-error, .bt-input.has-error, .bt-textarea.has-error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(220,38,38,0.08); }
  .bt-field-error { margin-top: 5px; font-size: 12px; color: var(--error); }

  .bt-upload { border: 2px dashed var(--gray-200); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s ease; position: relative; }
  .bt-upload:hover, .bt-upload.drag-over { border-color: var(--ipb-blue-lite); background: rgba(59,130,246,0.03); }
  .bt-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .bt-upload-icon { display: flex; justify-content: center; margin-bottom: 8px; }
  .bt-upload-text { font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 4px; }
  .bt-upload-sub { font-size: 11.5px; color: var(--gray-400); }
  .bt-file-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
  .bt-file-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 8px; font-size: 12.5px; color: var(--gray-700); }
  .bt-file-remove { background: none; border: none; cursor: pointer; color: var(--gray-400); font-size: 14px; transition: color 0.15s; }
  .bt-file-remove:hover { color: var(--error); }

  .bt-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 20px; border-top: 1.5px solid var(--gray-200); margin-top: 8px; }
  .bt-btn-cancel { padding: 10px 20px; border: 1.5px solid var(--gray-200); border-radius: 9px; background: var(--white); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; font-weight: 600; color: var(--gray-700); cursor: pointer; transition: all 0.18s; }
  .bt-btn-cancel:hover { background: var(--gray-50); border-color: var(--gray-400); }
  .bt-btn-submit { padding: 10px 24px; border: none; border-radius: 9px; background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; font-weight: 700; color: var(--white); cursor: pointer; transition: all 0.18s; box-shadow: 0 2px 10px rgba(37,99,235,0.28); display: flex; align-items: center; gap: 7px; }
  .bt-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.38); }
  .bt-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

  .bt-chatbot { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.05); position: sticky; top: 20px; display: flex; flex-direction: column; height: 560px; }
  .bt-chatbot-header { padding: 16px 18px; background: linear-gradient(135deg, var(--ipb-blue-dark), var(--ipb-blue-mid)); display: flex; align-items: center; gap: 10px; }
  .chatbot-avatar { width: 36px; height: 36px; background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white; }
  .chatbot-header-name { font-size: 14px; font-weight: 700; color: var(--white); line-height: 1; margin-bottom: 3px; }
  .chatbot-header-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.65); }
  .chatbot-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 5px rgba(34,197,94,0.6); animation: pulse 2s infinite; }

  .bt-chatbot-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: var(--gray-50); }
  .chat-msg { display: flex; gap: 8px; animation: fadeIn 0.2s ease both; }
  .chat-msg.user { flex-direction: row-reverse; }
  .chat-msg-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; margin-top: 2px; }
  .chat-msg.bot .chat-msg-avatar { background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); }
  .chat-msg.user .chat-msg-avatar { background: var(--gray-200); }
  .chat-msg-bubble { max-width: 78%; padding: 10px 13px; border-radius: 12px; font-size: 13px; line-height: 1.6; }
  .chat-msg.bot .chat-msg-bubble { background: var(--white); border: 1px solid var(--gray-200); color: var(--gray-700); border-radius: 4px 12px 12px 12px; }
  .chat-msg.user .chat-msg-bubble { background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-blue-mid)); color: var(--white); border-radius: 12px 4px 12px 12px; }
  .chat-msg-time { font-size: 10px; color: var(--gray-400); margin-top: 4px; }
  .chat-msg.bot .chat-msg-time { text-align: left; }
  .chat-msg.user .chat-msg-time { text-align: right; }

  .chat-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .chat-quick-btn { padding: 5px 10px; border: 1.5px solid var(--ipb-blue-lite); border-radius: 100px; background: rgba(59,130,246,0.06); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11.5px; font-weight: 600; color: var(--ipb-blue-mid); cursor: pointer; transition: all 0.15s; }
  .chat-quick-btn:hover { background: var(--ipb-blue-mid); color: var(--white); border-color: var(--ipb-blue-mid); }

  .chat-typing { display: flex; gap: 4px; padding: 10px 13px; background: var(--white); border: 1px solid var(--gray-200); border-radius: 4px 12px 12px 12px; width: fit-content; }
  .chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--gray-400); animation: typingBounce 1.2s infinite; }
  .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
  .chat-typing span:nth-child(3) { animation-delay: 0.4s; }

  .bt-chatbot-input { padding: 12px 14px; border-top: 1.5px solid var(--gray-200); display: flex; gap: 8px; align-items: flex-end; background: var(--white); }
  .chatbot-input-field { flex: 1; border: 1.5px solid var(--gray-200); border-radius: 10px; padding: 9px 13px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: var(--gray-900); outline: none; resize: none; line-height: 1.5; max-height: 80px; transition: border-color 0.2s; }
  .chatbot-input-field:focus { border-color: var(--ipb-blue-lite); }
  .chatbot-input-field::placeholder { color: var(--gray-400); }
  .chatbot-send-btn { width: 36px; height: 36px; border: none; border-radius: 9px; background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); color: white; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s; box-shadow: 0 2px 8px rgba(37,99,235,0.28); }
  .chatbot-send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.38); }
  .chatbot-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.65s linear infinite; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

  @media (max-width: 900px) {
    .bt-content { grid-template-columns: 1fr; }
    .bt-chatbot { position: static; height: 420px; }
  }
`;

const INITIAL_MESSAGES = [
  {
    id: 1, type: "bot",
    text: "Halo! Aku BantO__O 🤖 Asisten virtualmu. Ada yang bisa aku bantu sebelum kamu buat tiket?",
    time: "Sekarang",
    quickReplies: ["Cara mengisi tiket", "Topik apa yang tersedia?", "Berapa lama proses tiket?"],
  },
];

const BOT_RESPONSES = {
  "cara mengisi tiket": "Untuk mengisi tiket: 1️⃣ Pilih topik bantuan yang sesuai, 2️⃣ Isi deskripsi masalah secara detail, 3️⃣ Lampirkan dokumen pendukung jika ada, 4️⃣ Klik Buat Tiket. Staf kami akan segera memproses!",
  "topik apa yang tersedia?": "Topik bantuan tersedia sesuai kategori yang sudah disiapkan admin. Pilih yang paling sesuai dengan kebutuhanmu dari dropdown di formulir.",
  "berapa lama proses tiket?": "Tiket biasanya diproses dalam 1-3 hari kerja. Kamu bisa memantau status tiket di menu Tiket Saya. Kami akan notifikasi kamu setiap ada update! 📬",
  default: "Terima kasih sudah bertanya! Untuk pertanyaan lebih lanjut, silakan buat tiket dan staf kami akan membantu kamu secara langsung. 😊",
};

function getNow() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function BuatTiketPage() {
  const { user } = useAuth();

  const [topik, setTopik]           = useState("");
  const [subjek, setSubjek]         = useState("");
  const [deskripsi, setDeskripsi]   = useState("");
  const [files, setFiles]           = useState([]);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver]     = useState(false);
  const [messages, setMessages]     = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput]   = useState("");
  const [botTyping, setBotTyping]   = useState(false);
  const [kategoriList, setKategoriList] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  useEffect(() => {
    ticketService.getKategori().then(setKategoriList).catch(() => {});
  }, []);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    const now = getNow();
    setMessages(prev => [...prev, { id: prev.length + 1, type: "user", text: trimmed, time: now }]);
    setChatInput("");
    setBotTyping(true);

    setTimeout(() => {
      const key = trimmed.toLowerCase();
      const reply = BOT_RESPONSES[key] || BOT_RESPONSES.default;
      const replyTime = getNow();
      setBotTyping(false);
      setMessages(prev => [...prev, { id: prev.length + 2, type: "bot", text: reply, time: replyTime }]);
    }, 1200);
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const validate = () => {
    const errs = {};
    if (!topik) errs.topik = "Pilih topik bantuan terlebih dahulu";
    if (!subjek.trim()) errs.subjek = "Subjek wajib diisi";
    if (!deskripsi.trim()) errs.deskripsi = "Deskripsi wajib diisi";
    else if (deskripsi.trim().length < 20) errs.deskripsi = "Deskripsi minimal 20 karakter";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      await ticketService.createTicket({
        subjek,
        deskripsi,
        kategori_id: topik ? parseInt(topik) : null,
      });
      alert("Tiket berhasil dibuat!");
      window.location.href = "/tiket/saya";
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Gagal membuat tiket.";
      alert("Error: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <main className="bt-main">
        <div className="bt-header">
          <div className="bt-header-inner">
            <div className="bt-breadcrumb">
              <Link to="/dashboard">Dashboard</Link>
              <span>›</span>
              <span>Buka Tiket Baru</span>
            </div>
            <h1>🎫 Buka Tiket Baru</h1>
            <p>Sampaikan kebutuhanmu dan tim administrasi IPB akan segera membantu.</p>
          </div>
        </div>

        <div className="bt-alert">
          <div className="bt-alert-inner">
            <span><AppIcon name="AlertTriangle" variant="sm" /></span>
            <span>Pastikan kamu mengecek kembali tiket secara rutin untuk melihat tanggapan dari staff. Tiket yang tidak ada tanggapan dalam <strong>3 hari kerja</strong> akan ditutup otomatis.</span>
          </div>
        </div>

        <div className="bt-content">
          <div className="bt-form-card">
            <div className="bt-form-card-header">
              <div className="bt-form-card-icon">
                <AppIcon name="FileText" size={16} color="white" />
              </div>
              <div className="bt-form-card-title">Formulir Tiket</div>
            </div>
            <div className="bt-form-card-body">
              <div className="bt-user-info">
                <div className="bt-user-info-item">
                  <div className="bt-user-info-label">Email</div>
                  <div className="bt-user-info-value">{user?.identifier || "G6401231002"}@apps.ipb.ac.id</div>
                </div>
                <div className="bt-user-info-item">
                  <div className="bt-user-info-label">Klien</div>
                  <div className="bt-user-info-value">{user?.identifier || "G6401231002"} — {user?.nama || "Mut"}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="bt-field">
                  <label className="bt-label">Topik Bantuan <span className="required">*</span></label>
                  <select
                    className={`bt-select ${errors.topik ? "has-error" : ""}`}
                    value={topik}
                    onChange={(e) => { setTopik(e.target.value); setErrors(p => ({...p, topik: ""})); }}
                  >
                    <option value="">— Pilih Topik Bantuan —</option>
                    {kategoriList.map(k => (
                      <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                    ))}
                  </select>
                  {errors.topik && <div className="bt-field-error"><AppIcon name="AlertCircle" variant="xs" /> {errors.topik}</div>}
                </div>

                <div className="bt-field">
                  <label className="bt-label">Subjek <span className="required">*</span></label>
                  <input
                    type="text"
                    className={`bt-input ${errors.subjek ? "has-error" : ""}`}
                    placeholder="Tuliskan judul singkat masalahmu"
                    value={subjek}
                    onChange={(e) => { setSubjek(e.target.value); setErrors(p => ({...p, subjek: ""})); }}
                  />
                  {errors.subjek && <div className="bt-field-error"><AppIcon name="AlertCircle" variant="xs" /> {errors.subjek}</div>}
                </div>

                <div className="bt-field">
                  <label className="bt-label">Deskripsi Masalah <span className="required">*</span></label>
                  <textarea
                    className={`bt-textarea ${errors.deskripsi ? "has-error" : ""}`}
                    placeholder="Jelaskan masalahmu secara detail..."
                    value={deskripsi}
                    onChange={(e) => { setDeskripsi(e.target.value); setErrors(p => ({...p, deskripsi: ""})); }}
                    rows={5}
                  />
                  <div style={{ fontSize: "11px", color: "var(--gray-400)", marginTop: "4px", textAlign: "right" }}>{deskripsi.length} karakter</div>
                  {errors.deskripsi && <div className="bt-field-error"><AppIcon name="AlertCircle" variant="xs" /> {errors.deskripsi}</div>}
                </div>

                <div className="bt-field">
                  <label className="bt-label">Lampiran <span style={{ color: "var(--gray-400)", fontWeight: 500 }}>(opsional, maks. 5 file)</span></label>
                  <div
                    className={`bt-upload ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)].slice(0, 5)); }}
                  >
                    <input type="file" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                    <div className="bt-upload-icon">
                      <AppIcon name="Paperclip" size={26} color="#94a3b8" />
                    </div>
                    <div className="bt-upload-text">Drag & drop atau klik untuk upload</div>
                    <div className="bt-upload-sub">PDF, DOC, JPG, PNG — Maks. 10MB per file</div>
                  </div>
                  {files.length > 0 && (
                    <div className="bt-file-list">
                      {files.map((f, i) => (
                        <div key={i} className="bt-file-item">
                          <span>📄 {f.name}</span>
                          <button type="button" className="bt-file-remove" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bt-actions">
                  <button type="button" className="bt-btn-cancel" onClick={() => window.history.back()}>Batal</button>
                  <button type="submit" className="bt-btn-submit" disabled={submitting}>
                    {submitting ? <><div className="spinner" /> Mengirim...</> : <><AppIcon name="Ticket" variant="sm" /> Buat Tiket</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Chatbot */}
          <div className="bt-chatbot">
            <div className="bt-chatbot-header">
              <div className="chatbot-avatar">
                <AppIcon name="Bot" size={18} color="white" />
              </div>
              <div className="chatbot-header-info">
                <div className="chatbot-header-name">BantO__O Assistant</div>
                <div className="chatbot-header-status">
                  <div className="chatbot-status-dot" />
                  Online — siap membantu
                </div>
              </div>
            </div>

            <div className="bt-chatbot-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`chat-msg ${msg.type}`}>
                  <div className="chat-msg-avatar">
                    {msg.type === "bot"
                      ? <AppIcon name="Bot"  variant="sm" />
                      : <AppIcon name="User" variant="sm" />}
                  </div>
                  <div>
                    <div className="chat-msg-bubble">{msg.text}</div>
                    {msg.quickReplies && (
                      <div className="chat-quick-replies">
                        {msg.quickReplies.map((qr, i) => (
                          <button key={i} className="chat-quick-btn" onClick={() => sendMessage(qr)}>{qr}</button>
                        ))}
                      </div>
                    )}
                    <div className="chat-msg-time">{msg.time}</div>
                  </div>
                </div>
              ))}
              {botTyping && (
                <div className="chat-msg bot">
                  <div className="chat-msg-avatar">
                    <AppIcon name="Bot" variant="sm" />
                  </div>
                  <div className="chat-typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bt-chatbot-input">
              <textarea
                className="chatbot-input-field"
                placeholder="Tanya sesuatu..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput); } }}
                rows={1}
              />
              <button className="chatbot-send-btn" onClick={() => sendMessage(chatInput)} disabled={!chatInput.trim() || botTyping}>➤</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}