// ============================================================
// ChatbotPage.jsx — COMBINED & REFACTORED
// Menggabungkan:
//   - Alur quick-button FAQ bertingkat (versi baru)
//   - CSS variables dari design-tokens (--color-*)
//   - AppIcon dari lucide-react (ganti semua emoji ikon)
//   - parseText helper untuk **bold**
// ============================================================

import { useState, useRef, useEffect } from "react";
import { faqCategories } from "../../data/faqData";
import AppIcon from "../../components/ui/AppIcon";

/* ── helper: render **bold** dalam teks ──────────────────── */
function parseText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

/* ── BotBubble ───────────────────────────────────────────── */
function BotBubble({ children }) {
  return (
    <div className="cb-msg-row cb-bot">
      <div className="cb-avatar-sm">
        <AppIcon name="Bot" variant="md" />
      </div>
      <div className="cb-bubble cb-bubble-bot">{children}</div>
    </div>
  );
}

/* ── UserBubble ──────────────────────────────────────────── */
function UserBubble({ text }) {
  return (
    <div className="cb-msg-row cb-user">
      <div className="cb-bubble cb-bubble-user">{text}</div>
      <div className="cb-avatar-sm cb-avatar-user">
        <AppIcon name="User" variant="md" />
      </div>
    </div>
  );
}

/* ── QuickBtns ───────────────────────────────────────────── */
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

/* ── Konstanta ───────────────────────────────────────────── */
const GREETING =
  "Halo! Aku **BantO__O** — Asisten virtual IPB Help Center.\nApa yang bisa aku bantu hari ini? Silakan pilih kategori di bawah ini:";

const CATEGORY_ITEMS = faqCategories.map((c) => ({
  id: c.id,
  label: c.label,
  icon: c.icon,   // tetap pakai emoji dari data (bukan ikon UI)
}));

/* ── Main Component ──────────────────────────────────────── */
export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id: "greeting", from: "bot", text: GREETING },
  ]);
  const [activeButtons, setActiveButtons] = useState({
    type: "category",
    items: CATEGORY_ITEMS,
  });
  const [typing, setTyping]               = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeButtons, typing]);

  /* bot "mengetik" lalu balas */
  function botReply(text, nextButtons, delay = 600) {
    setTyping(true);
    setActiveButtons(null);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text }]);
      if (nextButtons) setActiveButtons(nextButtons);
    }, delay);
  }

  /* user pilih kategori */
  function handleCategory(item) {
    const category = faqCategories.find((c) => c.id === item.id);
    if (!category) return;
    setCurrentCategory(category);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: `${item.icon} ${item.label}` },
    ]);
    const qItems = category.questions.map((q) => ({ id: q.id, label: q.q }));
    botReply(
      `Baik! Berikut pertanyaan seputar **${category.label}**.\nSilakan pilih yang paling sesuai:`,
      { type: "question", items: qItems }
    );
  }

  /* user pilih pertanyaan */
  function handleQuestion(item) {
    if (!currentCategory) return;
    const qData = currentCategory.questions.find((q) => q.id === item.id);
    if (!qData) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: qData.q },
    ]);

    const answerNode = (
      <div>
        <p style={{ margin: "0 0 10px 0", lineHeight: 1.7 }}>
          {parseText(qData.a)}
        </p>
        {qData.links?.length > 0 && (
          <div className="cb-links">
            {qData.links.map((lk, i) => (
              <a key={i} href={lk.url} target="_blank" rel="noreferrer" className="cb-link-btn">
                <AppIcon name="ExternalLink" variant="xs" />
                {lk.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );

    const followUpBtns = {
      type: "followup",
      items: [
        { id: "more-same",     label: "Pertanyaan lain di kategori ini" },
        { id: "back-category", label: "Kembali ke menu utama" },
      ],
    };

    setTyping(true);
    setActiveButtons(null);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", node: answerNode }]);
      setActiveButtons(followUpBtns);
    }, 700);
  }

  /* tombol follow-up */
  function handleFollowUp(item) {
    if (item.id === "more-same" && currentCategory) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "user", text: "Pertanyaan lain di kategori ini" },
      ]);
      const qItems = currentCategory.questions.map((q) => ({ id: q.id, label: q.q }));
      botReply(
        `Silakan pilih pertanyaan lain seputar **${currentCategory.label}**:`,
        { type: "question", items: qItems }
      );
    } else {
      setCurrentCategory(null);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "user", text: "Kembali ke menu utama" },
      ]);
      botReply(
        "Tentu! Ada hal lain yang bisa aku bantu? Silakan pilih kategori:",
        { type: "category", items: CATEGORY_ITEMS }
      );
    }
  }

  /* dispatch pilihan tombol */
  function handlePick(item) {
    if (!activeButtons || typing) return;
    if (activeButtons.type === "category") handleCategory(item);
    else if (activeButtons.type === "question") handleQuestion(item);
    else if (activeButtons.type === "followup") handleFollowUp(item);
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>
      <div className="cb-page">

        {/* HEADER */}
        <div className="cb-header">
          <div className="cb-header-avatar">
            <AppIcon name="Bot" size={22} />
          </div>
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
                {msg.node
                  ? msg.node
                  : <p style={{ margin: 0, lineHeight: 1.7 }}>{parseText(msg.text)}</p>
                }
              </BotBubble>
            ) : (
              <UserBubble key={msg.id} text={msg.text} />
            )
          )}

          {/* typing indicator */}
          {typing && (
            <div className="cb-msg-row cb-bot">
              <div className="cb-avatar-sm">
                <AppIcon name="Bot" variant="md" />
              </div>
              <div className="cb-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* quick buttons */}
          {!typing && activeButtons && (
            <div className="cb-msg-row cb-bot">
              {/* spacer agar tombol sejajar dengan bubble */}
              <div className="cb-avatar-sm" style={{ opacity: 0 }} aria-hidden>
                <AppIcon name="Bot" variant="md" />
              </div>
              <QuickBtns
                items={activeButtons.items}
                onPick={handlePick}
                disabled={typing}
              />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* FOOTER */}
        <div className="cb-footer-info">
          <AppIcon name="Lightbulb" variant="xs" style={{ display: "inline", verticalAlign: "middle", marginRight: 5 }} />
          Pilih tombol di atas untuk mendapatkan jawaban ·{" "}
          <a href="/tiket/buat" className="cb-footer-link">Buat tiket bantuan</a>{" "}
          jika masalah belum teratasi
        </div>

      </div>
    </>
  );
}

/* ── CSS ─────────────────────────────────────────────────── */
const CSS = `
  .cb-page {
    height: calc(100vh - 70px);
    display: flex;
    flex-direction: column;
    font-family: var(--font-sans);
    background: var(--color-gray-50);
    overflow: hidden;
  }

  /* HEADER */
  .cb-header {
    background: var(--color-white);
    border-bottom: 1px solid var(--color-gray-200);
    padding: 14px 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }
  .cb-header-avatar {
    width: 46px; height: 46px;
    background: linear-gradient(135deg, var(--color-brand-darkest), var(--color-brand));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--color-white);
    flex-shrink: 0;
  }
  .cb-header-name   { font-size: 15px; font-weight: 700; color: var(--color-gray-900); }
  .cb-header-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #059669; font-weight: 500; margin-top: 2px; }
  .cb-dot           { width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block; }

  /* BODY */
  .cb-body {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .cb-body::-webkit-scrollbar       { width: 5px; }
  .cb-body::-webkit-scrollbar-thumb { background: var(--color-gray-200); border-radius: 4px; }

  /* MESSAGE ROW */
  .cb-msg-row { display: flex; align-items: flex-start; gap: 10px; animation: cbFadeIn .25s ease; }
  .cb-bot     { align-self: flex-start; max-width: 82%; }
  .cb-user    { align-self: flex-end; flex-direction: row-reverse; max-width: 75%; }

  /* AVATARS */
  .cb-avatar-sm {
    width: 34px; height: 34px; flex-shrink: 0;
    background: var(--color-info-bg);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--color-brand);
  }
  .cb-avatar-user {
    background: #ede9fe;
    color: #7c3aed;
  }

  /* BUBBLES */
  .cb-bubble {
    padding: 13px 18px;
    border-radius: 4px 16px 16px 16px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--color-gray-700);
  }
  .cb-bubble-bot {
    background: var(--color-white);
    border: 1px solid var(--color-gray-200);
    box-shadow: var(--shadow-md);
    white-space: pre-wrap;
  }
  .cb-bubble-user {
    background: var(--color-brand);
    color: var(--color-white);
    border-radius: 16px 4px 16px 16px;
    border: none;
  }

  /* LINKS dalam jawaban */
  .cb-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .cb-link-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--color-info-bg); color: #1d4ed8;
    border: 1px solid var(--color-brand-light);
    border-radius: var(--radius-md);
    padding: 5px 12px;
    font-size: 13px; font-weight: 600; font-family: var(--font-sans);
    text-decoration: none;
    transition: background .15s, border-color .15s;
  }
  .cb-link-btn:hover { background: #dbeafe; border-color: var(--color-brand-light); }

  /* QUICK BUTTONS */
  .cb-quick-wrap { display: flex; flex-wrap: wrap; gap: 8px; max-width: 560px; }
  .cb-quick-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--color-white);
    border: 1.5px solid var(--color-brand);
    color: #1d4ed8;
    border-radius: var(--radius-full);
    padding: 8px 16px;
    font-size: 13px; font-weight: 600; font-family: var(--font-sans);
    cursor: pointer;
    transition: background .15s, color .15s, transform .1s, box-shadow .15s;
    text-align: left;
    line-height: 1.4;
  }
  .cb-quick-btn:hover:not(:disabled) {
    background: var(--color-brand); color: var(--color-white);
    box-shadow: 0 4px 12px rgba(37,99,235,.28);
    transform: translateY(-1px);
  }
  .cb-quick-btn:disabled { opacity: .5; cursor: not-allowed; }
  .cb-btn-icon { font-size: 15px; }

  /* TYPING INDICATOR */
  .cb-typing {
    display: flex; gap: 5px; align-items: center;
    background: var(--color-white);
    border: 1px solid var(--color-gray-200);
    border-radius: 4px 16px 16px 16px;
    padding: 14px 18px;
  }
  .cb-typing span {
    width: 7px; height: 7px;
    background: var(--color-gray-400); border-radius: 50%;
    animation: cbTyping 1s infinite;
  }
  .cb-typing span:nth-child(2) { animation-delay: .18s; }
  .cb-typing span:nth-child(3) { animation-delay: .36s; }

  /* FOOTER */
  .cb-footer-info {
    background: var(--color-white);
    border-top: 1px solid var(--color-gray-200);
    padding: 12px 32px;
    font-size: 12.5px;
    color: var(--color-gray-500);
    text-align: center;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .cb-footer-link { color: var(--color-brand); font-weight: 600; text-decoration: none; }
  .cb-footer-link:hover { text-decoration: underline; }

  /* ANIMASI */
  @keyframes cbFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cbTyping  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
`;