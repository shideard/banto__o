// frontend/src/pages/mahasiswa/ChatbotPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import chatService from "../../services/ChatService";

const GREETING = "Halo! Aku BantO__O 🤖 Asisten virtualmu untuk layanan IPB Help Center. Ada yang bisa aku bantu?";

const styles = `
  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --off-white:      #f9fafb;
    --gray-50:        #f1f5f9;
    --gray-100:       #f3f4f6;
    --gray-200:       #e5e7eb;
    --gray-400:       #9ca3af;
    --gray-500:       #6b7280;
    --gray-700:       #374151;
    --gray-900:       #111827;
  }

  .cb-page { height: calc(100vh - 70px); display: flex; flex-direction: column; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--white); overflow: hidden; }
  .cb-layout { display: flex; flex: 1; overflow: hidden; }

  .cb-sidebar { width: 280px; background: var(--white); border-right: 1px solid var(--gray-200); display: flex; flex-direction: column; flex-shrink: 0; }
  .cb-sidebar-top { padding: 20px 24px; }
  .btn-new-chat { width: 100%; padding: 12px; background: var(--ipb-blue-mid); color: var(--white); border: none; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; }
  .btn-new-chat:hover { background: var(--ipb-blue); }
  .btn-new-chat:disabled { opacity: 0.6; cursor: not-allowed; }

  .riwayat-title { font-size: 11px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; padding: 0 24px; margin-bottom: 12px; }
  .cb-history-list { flex: 1; overflow-y: auto; padding: 0 16px 20px; display: flex; flex-direction: column; gap: 8px; }
  .cb-history-list::-webkit-scrollbar { width: 4px; }
  .cb-history-list::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }

  .history-item { padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .history-item:hover { background: var(--gray-50); }
  .history-item.active { background: #eff6ff; border-color: #bfdbfe; }
  .history-item h4 { font-size: 13px; font-weight: 600; color: var(--gray-900); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
  .history-item p { font-size: 11px; color: var(--gray-500); }
  .btn-delete-session { background: none; border: none; cursor: pointer; color: var(--gray-400); font-size: 14px; padding: 2px; border-radius: 4px; flex-shrink: 0; transition: color 0.15s; }
  .btn-delete-session:hover { color: #dc2626; }

  .cb-main { flex: 1; display: flex; flex-direction: column; background: var(--off-white); }
  .cb-header { background: var(--white); padding: 16px 32px; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; gap: 16px; }
  .cb-avatar { width: 44px; height: 44px; background: linear-gradient(135deg, var(--ipb-blue-dark), var(--ipb-blue-mid)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .cb-header-info h2 { font-size: 16px; font-weight: 700; color: var(--gray-900); margin-bottom: 2px; }
  .cb-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #059669; font-weight: 500; }
  .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }

  .cb-body { flex: 1; overflow-y: auto; padding: 32px; display: flex; flex-direction: column; gap: 24px; }
  .cb-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--gray-400); font-size: 14px; gap: 12px; }

  .msg-row { display: flex; gap: 16px; max-width: 80%; animation: fadeIn 0.3s ease; }
  .msg-row.bot { align-self: flex-start; }
  .msg-row.user { align-self: flex-end; flex-direction: row-reverse; }
  .msg-avatar { width: 36px; height: 36px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .msg-bubble { background: var(--white); border: 1px solid var(--gray-200); padding: 16px 20px; border-radius: 0 16px 16px 16px; font-size: 14px; color: var(--gray-700); line-height: 1.6; white-space: pre-wrap; }
  .msg-row.user .msg-bubble { background: var(--ipb-blue-mid); color: var(--white); border: none; border-radius: 16px 0 16px 16px; }

  .cb-footer { background: var(--white); padding: 24px 32px; border-top: 1px solid var(--gray-200); }
  .input-wrapper { display: flex; align-items: center; gap: 16px; background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 100px; padding: 8px 8px 8px 24px; transition: border-color 0.2s; }
  .input-wrapper:focus-within { border-color: var(--ipb-blue-mid); }
  .cb-input { flex: 1; border: none; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: var(--gray-900); background: transparent; }
  .cb-input::placeholder { color: var(--gray-400); }
  .btn-send { width: 40px; height: 40px; background: var(--ipb-blue-mid); border: none; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: background 0.2s; }
  .btn-send:hover:not(:disabled) { background: var(--ipb-blue); }
  .btn-send:disabled { background: var(--gray-200); cursor: not-allowed; }

  .typing-indicator { display: flex; gap: 4px; padding: 16px 20px; background: var(--white); border: 1px solid var(--gray-200); border-radius: 0 16px 16px 16px; width: fit-content; }
  .typing-indicator span { width: 6px; height: 6px; background: var(--gray-400); border-radius: 50%; animation: typing 1s infinite; }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
`;

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return "Kemarin";
  return `${diffDay} hari lalu`;
}

export default function ChatbotPage() {
  const [sessions, setSessions]               = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages]               = useState([]);
  const [inputText, setInputText]             = useState("");
  const [isTyping, setIsTyping]               = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const messagesEndRef = useRef(null);

  // ── Load sesi dari backend ─────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    try {
      const res = await chatService.getSessions();
      setSessions(res.data || []);
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  // ── Saat sesi aktif berubah, load messages-nya ─────────────────────────────
  useEffect(() => {
    if (!activeSessionId) { setMessages([]); return; }
    const session = sessions.find(s => s.id === activeSessionId);
    if (session) {
      const dbMessages = session.messages || [];
      const greetingMsg = { id: "greeting", type: "bot", text: GREETING };
      setMessages([greetingMsg, ...dbMessages]);
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Buat sesi baru ─────────────────────────────────────────────────────────
  const handleNewChat = async () => {
    try {
      const res = await chatService.createSession("Percakapan Baru");
      const newSession = res.data;
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    } catch {
      alert("Gagal membuat sesi baru.");
    }
  };

  // ── Kirim pesan ────────────────────────────────────────────────────────────
  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;
    if (!activeSessionId) {
      try {
        const res = await chatService.createSession(text.slice(0, 40));
        const newSession = res.data;
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        await doSend(newSession.id, text);
      } catch { return; }
      return;
    }
    await doSend(activeSessionId, text);
  };

  const doSend = async (sessionId, text) => {
    const tempUserMsg = { id: `tmp-${Date.now()}`, type: "user", text };
    setMessages(prev => [...prev, tempUserMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await chatService.sendMessage(sessionId, text);
      const [userMsg, botMsg] = res.data;

      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        userMsg,
        botMsg,
      ]);

      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, title: text.slice(0, 40) + (text.length > 40 ? "..." : ""), updated_at: new Date().toISOString() }
          : s
      ));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
      alert("Gagal mengirim pesan.");
    } finally {
      setIsTyping(false);
    }
  };

  // ── Hapus sesi ─────────────────────────────────────────────────────────────
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!confirm("Hapus sesi percakapan ini?")) return;
    try {
      await chatService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch {
      alert("Gagal menghapus sesi.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cb-page">
        <div className="cb-layout">

          {/* ── SIDEBAR ── */}
          <aside className="cb-sidebar">
            <div className="cb-sidebar-top">
              <button className="btn-new-chat" onClick={handleNewChat}>
                + Percakapan Baru
              </button>
            </div>

            <div className="riwayat-title">RIWAYAT</div>

            <div className="cb-history-list">
              {loadingSessions ? (
                <div style={{ padding: "12px 16px", color: "var(--gray-400)", fontSize: 13 }}>Memuat...</div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: "12px 16px", color: "var(--gray-400)", fontSize: 13 }}>Belum ada percakapan.</div>
              ) : (
                sessions.map(s => (
                  <div
                    key={s.id}
                    className={`history-item ${s.id === activeSessionId ? "active" : ""}`}
                    onClick={() => setActiveSessionId(s.id)}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <h4>{s.title}</h4>
                      <p>{formatTime(s.updated_at)}</p>
                    </div>
                    <button
                      className="btn-delete-session"
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      title="Hapus sesi"
                    >✕</button>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* ── MAIN CHAT ── */}
          <main className="cb-main">
            <div className="cb-header">
              <div className="cb-avatar">🤖</div>
              <div className="cb-header-info">
                <h2>BantO__O Assistant</h2>
                <div className="cb-status">
                  <div className="status-dot" />
                  Online — siap membantu
                </div>
              </div>
            </div>

            <div className="cb-body">
              {!activeSessionId ? (
                <div className="cb-empty">
                  <span style={{ fontSize: 40 }}>🤖</span>
                  <span>Pilih percakapan atau mulai yang baru</span>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={msg.id ?? idx} className={`msg-row ${msg.type}`}>
                      {msg.type === "bot" && <div className="msg-avatar">🤖</div>}
                      <div className="msg-bubble">{msg.text}</div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="msg-row bot">
                      <div className="msg-avatar">🤖</div>
                      <div className="typing-indicator">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="cb-footer">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="cb-input"
                  placeholder={activeSessionId ? "Tanya sesuatu..." : "Ketik untuk memulai percakapan baru..."}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSend(inputText); }}
                  disabled={isTyping}
                />
                <button
                  className="btn-send"
                  onClick={() => handleSend(inputText)}
                  disabled={!inputText.trim() || isTyping}
                >➤</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}