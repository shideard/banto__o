import { useState, useRef, useEffect, useMemo } from "react";

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

  .cb-page {
    height: calc(100vh - 70px); 
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--white);
    overflow: hidden;
  }

  .cb-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* --- SIDEBAR RIWAYAT CHAT --- */
  .cb-sidebar {
    width: 280px;
    background: var(--white);
    border-right: 1px solid var(--gray-200);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .cb-sidebar-top {
    padding: 20px 24px;
  }

  .btn-new-chat {
    width: 100%;
    padding: 12px;
    background: var(--ipb-blue-mid);
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }

  .btn-new-chat:hover {
    background: var(--ipb-blue);
  }

  .riwayat-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-400);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 24px;
    margin-bottom: 12px;
  }

  .cb-history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cb-history-list::-webkit-scrollbar { width: 4px; }
  .cb-history-list::-webkit-scrollbar-track { background: transparent; }
  .cb-history-list::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }

  .history-item {
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  .history-item:hover {
    background: var(--gray-50);
  }

  .history-item.active {
    background: #eff6ff;
    border-color: #bfdbfe;
  }

  .history-item h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-item p {
    font-size: 11px;
    color: var(--gray-500);
  }

  /* --- MAIN CHAT AREA --- */
  .cb-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--off-white);
  }

  .cb-header {
    background: var(--white);
    padding: 16px 32px;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .cb-avatar {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, var(--ipb-blue-dark), var(--ipb-blue-mid));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
  }

  .cb-header-info h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 2px;
  }

  .cb-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #059669;
    font-weight: 500;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
  }

  .cb-body {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .msg-row {
    display: flex;
    gap: 16px;
    max-width: 80%;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg-row.bot { align-self: flex-start; }
  .msg-row.user { align-self: flex-end; flex-direction: row-reverse; }

  .msg-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e0f2fe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .msg-bubble {
    background: var(--white);
    border: 1px solid var(--gray-200);
    padding: 16px 20px;
    border-radius: 0 16px 16px 16px;
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.6;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    white-space: pre-wrap;
  }

  .msg-row.user .msg-bubble {
    background: var(--ipb-blue-mid);
    color: var(--white);
    border: none;
    border-radius: 16px 0 16px 16px;
  }

  .quick-replies {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    margin-left: 52px;
    flex-wrap: wrap;
    animation: fadeIn 0.4s ease;
  }

  .qr-btn {
    background: var(--white);
    border: 1.5px solid var(--ipb-blue-mid);
    color: var(--ipb-blue-mid);
    padding: 8px 16px;
    border-radius: 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .qr-btn:hover {
    background: #eff6ff;
  }

  /* --- CHAT INPUT --- */
  .cb-footer {
    background: var(--white);
    padding: 24px 32px;
    border-top: 1px solid var(--gray-200);
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 100px;
    padding: 8px 8px 8px 24px;
    transition: border-color 0.2s;
  }

  .input-wrapper:focus-within {
    border-color: var(--ipb-blue-lite);
  }

  .cb-input {
    flex: 1;
    border: none;
    outline: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: var(--gray-900);
    background: transparent;
  }

  .cb-input::placeholder {
    color: var(--gray-400);
  }

  .btn-send {
    width: 40px;
    height: 40px;
    background: var(--ipb-blue-mid);
    border: none;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
  }

  .btn-send:hover:not(:disabled) { background: var(--ipb-blue); }
  .btn-send:disabled { background: var(--gray-200); cursor: not-allowed; }
  
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 16px 20px;
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 0 16px 16px 16px;
    width: fit-content;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: var(--gray-400);
    border-radius: 50%;
    animation: typing 1s infinite;
  }

  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
`;

const DEFAULT_GREETING = {
  id: 1,
  type: "bot",
  text: "Halo! Aku BantO__O 🤖 Asisten virtualmu untuk layanan IPB Help Center. Ada yang bisa aku bantu?",
};

const INITIAL_SESSIONS = [
  {
    id: 1,
    title: "Informasi beasiswa PPA",
    time: "Hari ini, 15:08",
    messages: [
      DEFAULT_GREETING,
      {
        id: 2,
        type: "bot",
        text: "Untuk beasiswa PPA, berikut informasinya:\n\n📌 Persyaratan:\n• IPK minimal 3.00\n• Aktif sebagai mahasiswa\n• Tidak sedang menerima beasiswa lain\n\n📌 Pendaftaran: melalui portal beasiswa IPB\n📌 Deadline: 15 Mei 2026\n\nAda yang ingin ditanyakan lebih lanjut?",
        quickReplies: ["Cara daftar beasiswa", "Syarat IPK", "Jadwal seleksi"]
      }
    ]
  },
  { 
    id: 2, 
    title: "Cara perbaikan nilai KRS", 
    time: "Kemarin, 10:23", 
    messages: [DEFAULT_GREETING, { id: 2, type: "bot", text: "Untuk perbaikan nilai KRS, kamu bisa mengisi form di menu Buat Tiket > Akademik & Kurikulum." }] 
  },
  { 
    id: 3, 
    title: "Surat keterangan kuliah", 
    time: "3 hari lalu", 
    messages: [DEFAULT_GREETING] 
  },
];

export default function ChatbotPage() {
  const [chatSessions, setChatSessions] = useState(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState(INITIAL_SESSIONS[0].id);
  
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeSession = chatSessions.find(session => session.id === activeSessionId);
  
  // PERBAIKAN 2: Menggunakan useMemo agar reference array tidak berganti-ganti setiap render
  const currentMessages = useMemo(() => activeSession?.messages || [], [activeSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const handleNewChat = () => {
    if (chatSessions[0].title === "Percakapan Baru" && chatSessions[0].messages.length === 1) {
      setActiveSessionId(chatSessions[0].id);
      return;
    }

    // PERBAIKAN 1: Generate ID murni menggunakan panjang array + 1 (Pengganti Date.now())
    const newSessionId = chatSessions.length > 0 ? Math.max(...chatSessions.map(s => s.id)) + 1 : 1;
    const newSession = {
      id: newSessionId,
      title: "Percakapan Baru",
      time: "Baru saja",
      messages: [DEFAULT_GREETING]
    };

    setChatSessions([newSession, ...chatSessions]);
    setActiveSessionId(newSessionId);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // PERBAIKAN 1: Generate ID pesan secara murni (Pengganti Date.now())
    const newUserMsgId = currentMessages.length > 0 ? Math.max(...currentMessages.map(m => m.id)) + 1 : 1;
    const newUserMsg = { id: newUserMsgId, type: "user", text: text };
    
    setChatSessions(prevSessions => prevSessions.map(session => {
      if (session.id === activeSessionId) {
        const newTitle = session.title === "Percakapan Baru" 
          ? text.length > 25 ? text.substring(0, 25) + "..." : text 
          : session.title;

        return {
          ...session,
          title: newTitle,
          time: "Baru saja",
          messages: [...session.messages, newUserMsg]
        };
      }
      return session;
    }));

    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botReply = {
        // PERBAIKAN 1: ID pesan bot adalah ID pesan user + 1
        id: newUserMsgId + 1,
        type: "bot",
        text: "Baik, saya bantu arahkan ke staf administrasi. Silakan jelaskan kebutuhan Anda sedikit lebih detail ya."
      };

      setChatSessions(prevSessions => prevSessions.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [...session.messages, botReply]
          };
        }
        return session;
      }));
    }, 1500); 
  };

  return (
    <>
      <style>{styles}</style>
      
      {/* LANGSUNG KE KONTEN CHAT - Tanpa Navbar/Sidebar Utama */}
      <div className="cb-page">
        <div className="cb-layout">
          {/* SIDEBAR RIWAYAT CHAT */}
          <aside className="cb-sidebar">
            <div className="cb-sidebar-top">
              <button className="btn-new-chat" onClick={handleNewChat}>+ Percakapan Baru</button>
            </div>
            
            <div className="riwayat-title">RIWAYAT</div>
            
            <div className="cb-history-list">
              {chatSessions.map((item) => (
                <div 
                  key={item.id} 
                  className={`history-item ${item.id === activeSessionId ? "active" : ""}`}
                  onClick={() => setActiveSessionId(item.id)}
                >
                  <h4>{item.title}</h4>
                  <p>{item.time}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CHAT AREA */}
          <main className="cb-main">
            <div className="cb-header">
              <div className="cb-avatar">🤖</div>
              <div className="cb-header-info">
                <h2>BantO__O Assistant</h2>
                <div className="cb-status">
                  <div className="status-dot"></div>
                  Online — siap membantu
                </div>
              </div>
            </div>

            <div className="cb-body">
              {currentMessages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={`msg-row ${msg.type}`}>
                    {msg.type === "bot" && <div className="msg-avatar">🤖</div>}
                    <div className="msg-bubble">{msg.text}</div>
                  </div>
                  {msg.quickReplies && msg.id === currentMessages[currentMessages.length - 1].id && (
                    <div className="quick-replies">
                      {msg.quickReplies.map((qr, idx) => (
                        <button 
                          key={idx} 
                          className="qr-btn"
                          onClick={() => handleSend(qr)}
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="msg-row bot">
                  <div className="msg-avatar">🤖</div>
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="cb-footer">
              <div className="input-wrapper">
                <input 
                  type="text" 
                  className="cb-input" 
                  placeholder="Tanya sesuatu..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend(inputText);
                  }}
                  disabled={isTyping}
                />
                <button 
                  className="btn-send" 
                  onClick={() => handleSend(inputText)}
                  disabled={!inputText.trim() || isTyping}
                >
                  ➤
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}