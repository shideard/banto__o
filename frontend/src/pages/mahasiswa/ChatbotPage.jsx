// frontend/src/pages/mahasiswa/ChatbotPage.jsx
import { useState, useRef, useEffect } from "react";
import { faqCategories } from "../../data/faqData";

/* ─── helper: render teks dengan **bold** ─────────────────────────────────── */
function parseText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

/* ─── bubble bot ──────────────────────────────────────────────────────────── */
function BotBubble({ children }) {
  return (
    <div className="cb-msg-row cb-bot">
      <div className="cb-avatar-sm">🤖</div>
      <div className="cb-bubble cb-bubble-bot">{children}</div>
    </div>
  );
}

/* ─── bubble user ─────────────────────────────────────────────────────────── */
function UserBubble({ text }) {
  return (
    <div className="cb-msg-row cb-user">
      <div className="cb-bubble cb-bubble-user">{text}</div>
      <div className="cb-avatar-sm cb-avatar-user">👤</div>
    </div>
  );
}

/* ─── tombol pilihan ──────────────────────────────────────────────────────── */
function QuickBtns({ items, onPick, disabled }) {
  return (
    <div className="cb-quick-wrap">
      {items.map((item) => (
        <button
          key={item.id}
          className="cb-quick-btn"
          onClick={() => !disabled && onPick(item)}
          disabled={disabled}
        >
          {item.icon && <span className="cb-btn-icon">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ─── konstanta ───────────────────────────────────────────────────────────── */
const GREETING =
  "Halo! Aku **BantO__O** 🤖 Asisten virtual IPB Help Center.\nApa yang bisa aku bantu hari ini? Silakan pilih kategori di bawah ini:";

const CATEGORY_ITEMS = faqCategories.map((c) => ({
  id: c.id,
  label: c.label,
  icon: c.icon,
}));

/* ─── main component ──────────────────────────────────────────────────────── */
export default function ChatbotPage() {
  /* pesan yang ditampilkan di layar (inisialisasi langsung) */
  const [messages, setMessages] = useState([
    { id: "greeting", from: "bot", text: GREETING }
  ]);
  
  /* tombol yang sedang aktif (inisialisasi langsung) */
  const [activeButtons, setActiveButtons] = useState({ 
    type: "category", 
    items: CATEGORY_ITEMS 
  }); 
  
  /* apakah sedang "mengetik" (animasi) */
  const [typing, setTyping] = useState(false);
  
  /* kategori yang sedang dipilih user */
  const [currentCategory, setCurrentCategory] = useState(null);

  const bottomRef = useRef(null);

  /* scroll ke bawah otomatis */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeButtons, typing]);

  /* ── bot "mengetik" lalu balas ──────────────────────────────────────────── */
  function botReply(text, nextButtons, delay = 600) {
    setTyping(true);
    setActiveButtons(null);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text },
      ]);
      if (nextButtons) setActiveButtons(nextButtons);
    }, delay);
  }

  /* ── user pilih kategori ─────────────────────────────────────────────────── */
  function handleCategory(item) {
    const category = faqCategories.find((c) => c.id === item.id);
    if (!category) return;

    setCurrentCategory(category);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: `${item.icon} ${item.label}` },
    ]);

    const qItems = category.questions.map((q) => ({
      id: q.id,
      label: q.q,
    }));

    botReply(
      `Baik! Berikut pertanyaan seputar **${category.label}**.\nSilakan pilih yang paling sesuai:`,
      { type: "question", items: qItems }
    );
  }

  /* ── user pilih pertanyaan ───────────────────────────────────────────────── */
  function handleQuestion(item) {
    if (!currentCategory) return;
    const qData = currentCategory.questions.find((q) => q.id === item.id);
    if (!qData) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: qData.q },
    ]);

    // bangun teks jawaban + link jika ada
    const answerNode = (
      <div>
        <p style={{ margin: "0 0 10px 0", lineHeight: 1.7 }}>
          {parseText(qData.a)}
        </p>
        {qData.links && qData.links.length > 0 && (
          <div className="cb-links">
            {qData.links.map((lk, i) => (
              <a key={i} href={lk.url} target="_blank" rel="noreferrer" className="cb-link-btn">
                🔗 {lk.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );

    const followUpBtns = {
      type: "followup",
      items: [
        { id: "more-same", label: "❓ Pertanyaan lain di kategori ini" },
        { id: "back-category", label: "🏠 Kembali ke menu utama" },
      ],
    };

    setTyping(true);
    setActiveButtons(null);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", node: answerNode },
      ]);
      setActiveButtons(followUpBtns);
    }, 700);
  }

  /* ── tombol follow-up ────────────────────────────────────────────────────── */
  function handleFollowUp(item) {
    if (item.id === "more-same" && currentCategory) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "user", text: "❓ Pertanyaan lain di kategori ini" },
      ]);
      const qItems = currentCategory.questions.map((q) => ({
        id: q.id,
        label: q.q,
      }));
      botReply(
        `Silakan pilih pertanyaan lain seputar **${currentCategory.label}**:`,
        { type: "question", items: qItems }
      );
    } else {
      setCurrentCategory(null);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "user", text: "🏠 Kembali ke menu utama" },
      ]);
      botReply(
        "Tentu! Ada hal lain yang bisa aku bantu? Silakan pilih kategori:",
        { type: "category", items: CATEGORY_ITEMS }
      );
    }
  }

  /* ── dispatch pilihan tombol ─────────────────────────────────────────────── */
  function handlePick(item) {
    if (!activeButtons || typing) return;
    if (activeButtons.type === "category") handleCategory(item);
    else if (activeButtons.type === "question") handleQuestion(item);
    else if (activeButtons.type === "followup") handleFollowUp(item);
  }

  /* ─────────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>
      <div className="cb-page">
        {/* HEADER */}
        <div className="cb-header">
          <div className="cb-header-avatar">🤖</div>
          <div>
            <div className="cb-header-name">BantO__O Assistant</div>
            <div className="cb-header-status">
              <span className="cb-dot" /> Online — siap membantu
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="cb-body">
          {messages.map((msg) =>
            msg.from === "bot" ? (
              <BotBubble key={msg.id}>
                {msg.node ? msg.node : <p style={{ margin: 0, lineHeight: 1.7 }}>{parseText(msg.text)}</p>}
              </BotBubble>
            ) : (
              <UserBubble key={msg.id} text={msg.text} />
            )
          )}

          {/* typing indicator */}
          {typing && (
            <div className="cb-msg-row cb-bot">
              <div className="cb-avatar-sm">🤖</div>
              <div className="cb-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* quick buttons */}
          {!typing && activeButtons && (
            <div className="cb-msg-row cb-bot">
              <div className="cb-avatar-sm" style={{ opacity: 0 }}>🤖</div>
              <QuickBtns
                items={activeButtons.items}
                onPick={handlePick}
                disabled={typing}
              />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* FOOTER info */}
        <div className="cb-footer-info">
          💡 Pilih tombol di atas untuk mendapatkan jawaban · Atau{" "}
          <a href="/tiket/buat" className="cb-footer-link">buat tiket bantuan</a> jika masalah belum teratasi
        </div>
      </div>
    </>
  );
}

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .cb-page {
    height: calc(100vh - 70px);
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc;
    overflow: hidden;
  }

  /* ── HEADER ── */
  .cb-header {
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    padding: 14px 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
  }
  .cb-header-avatar {
    width: 46px; height: 46px;
    background: linear-gradient(135deg, #0a1f5c, #2563eb);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .cb-header-name { font-size: 15px; font-weight: 700; color: #111827; }
  .cb-header-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #059669; font-weight: 500; margin-top: 2px; }
  .cb-dot { width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block; }

  /* ── BODY ── */
  .cb-body {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .cb-body::-webkit-scrollbar { width: 5px; }
  .cb-body::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

  /* ── MESSAGE ROW ── */
  .cb-msg-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: cbFadeIn .25s ease;
  }
  .cb-bot { align-self: flex-start; max-width: 80%; }
  .cb-user { align-self: flex-end; flex-direction: row-reverse; max-width: 75%; }

  .cb-avatar-sm {
    width: 34px; height: 34px; flex-shrink: 0;
    background: #dbeafe;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
  }
  .cb-avatar-user { background: #ede9fe; }

  /* ── BUBBLES ── */
  .cb-bubble {
    padding: 13px 18px;
    border-radius: 4px 16px 16px 16px;
    font-size: 14px;
    line-height: 1.65;
    color: #374151;
  }
  .cb-bubble-bot {
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
    white-space: pre-wrap;
  }
  .cb-bubble-user {
    background: #2563eb;
    color: #fff;
    border-radius: 16px 4px 16px 16px;
    border: none;
  }

  /* ── LINKS dalam jawaban ── */
  .cb-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .cb-link-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #eff6ff; color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 5px 12px;
    font-size: 13px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
    text-decoration: none;
    transition: background .15s, border-color .15s;
  }
  .cb-link-btn:hover { background: #dbeafe; border-color: #93c5fd; }

  /* ── QUICK BUTTONS ── */
  .cb-quick-wrap {
    display: flex; flex-wrap: wrap; gap: 8px;
    max-width: 560px;
  }
  .cb-quick-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fff;
    border: 1.5px solid #2563eb;
    color: #1d4ed8;
    border-radius: 24px;
    padding: 8px 16px;
    font-size: 13px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: background .15s, color .15s, transform .1s, box-shadow .15s;
    text-align: left;
    line-height: 1.4;
  }
  .cb-quick-btn:hover:not(:disabled) {
    background: #2563eb; color: #fff;
    box-shadow: 0 4px 12px rgba(37,99,235,.3);
    transform: translateY(-1px);
  }
  .cb-quick-btn:disabled { opacity: .5; cursor: not-allowed; }
  .cb-btn-icon { font-size: 15px; }

  /* ── TYPING ── */
  .cb-typing {
    display: flex; gap: 5px; align-items: center;
    background: #fff; border: 1px solid #e5e7eb;
    border-radius: 4px 16px 16px 16px;
    padding: 14px 18px;
  }
  .cb-typing span {
    width: 7px; height: 7px;
    background: #9ca3af; border-radius: 50%;
    animation: cbTyping 1s infinite;
  }
  .cb-typing span:nth-child(2) { animation-delay: .18s; }
  .cb-typing span:nth-child(3) { animation-delay: .36s; }

  /* ── FOOTER INFO ── */
  .cb-footer-info {
    background: #fff;
    border-top: 1px solid #e5e7eb;
    padding: 12px 32px;
    font-size: 12.5px;
    color: #6b7280;
    text-align: center;
    flex-shrink: 0;
  }
  .cb-footer-link { color: #2563eb; font-weight: 600; text-decoration: none; }
  .cb-footer-link:hover { text-decoration: underline; }

  /* ── ANIMASI ── */
  @keyframes cbFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cbTyping { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
`;