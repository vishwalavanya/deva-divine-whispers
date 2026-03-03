import { useState, useRef, useEffect } from "react";
import {
  LANGS, GODS, NAVAGRAHAS, BOOKS, RASI_LIST, NAKSHATRA_LIST,
  PANCHANGAM_PROMPT, PARTICLES,
} from "@/data/constants";
import { detectGod, fmt, stripHtml, timeAgo, buildSystemPrompt } from "@/lib/deva-utils";
import { callAnthropicAPI, type AIMessage } from "@/lib/ai-service";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  key?: string;
}

interface ChatSession {
  id: number;
  mode: string;
  key: string;
  entityName: string;
  entityEmoji: string;
  preview: string;
  messages: ChatMessage[];
  timestamp: number;
}

interface PanchForm {
  name: string;
  dob: string;
  time: string;
  place: string;
  gender: string;
  rasi: string;
  nakshatra: string;
}

let chatIdCounter = 0;

export default function DevaAI() {
  const [lang, setLang] = useState("en");
  const [showLang, setShowLang] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("gods");
  const [phase, setPhase] = useState<"home" | "detecting" | "chat" | "panchangam">("home");
  const [mode, setMode] = useState("god");
  const [selKey, setSelKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentMsg, setAgentMsg] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [panchForm, setPanchForm] = useState<PanchForm>({ name: "", dob: "", time: "", place: "", gender: "male", rasi: "", nakshatra: "" });
  const [rasiQuery, setRasiQuery] = useState("");
  const [nakQuery, setNakQuery] = useState("");
  const [showRasiDrop, setShowRasiDrop] = useState(false);
  const [showNakDrop, setShowNakDrop] = useState(false);
  const [panchLoading, setPanchLoading] = useState(false);
  const [panchResult, setPanchResult] = useState<string | null>(null);
  const [panchFollowInput, setPanchFollowInput] = useState("");
  const [panchHistory, setPanchHistory] = useState<AIMessage[]>([]);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const t = LANGS[lang];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, panchResult, panchHistory]);

  function getEntity() {
    if (!selKey) return null;
    if (mode === "god") return GODS[selKey];
    if (mode === "book") return BOOKS[selKey];
    if (mode === "nava") return NAVAGRAHAS[selKey];
    return null;
  }

  const entity = getEntity();
  const accent = entity?.accent || (phase === "panchangam" ? "#a78bfa" : "#f4a261");

  function saveSession(m: string, k: string, msgs: ChatMessage[]) {
    const e = m === "god" ? GODS[k] : m === "book" ? BOOKS[k] : NAVAGRAHAS[k];
    const firstUserMsg = msgs.find(x => x.role === "user");
    const preview = firstUserMsg ? firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "") : e.name;
    const id = ++chatIdCounter;
    const session: ChatSession = { id, mode: m, key: k, entityName: e.name, entityEmoji: e.emoji, preview, messages: msgs, timestamp: Date.now() };
    setChatSessions(prev => [session, ...prev.slice(0, 49)]);
    setActiveChatId(id);
    return id;
  }

  function updateSession(id: number, msgs: ChatMessage[]) {
    setChatSessions(prev => prev.map(s => s.id === id ? { ...s, messages: msgs, timestamp: Date.now() } : s));
  }

  async function doAI(m: string, k: string, hist: AIMessage[], curMsgs: ChatMessage[], sid: number | null) {
    setLoading(true);
    try {
      const sysPrompt = buildSystemPrompt(m, k, lang, GODS, BOOKS, NAVAGRAHAS);
      const reply = await callAnthropicAPI(sysPrompt, hist, 1000);
      const aMsg: ChatMessage = { role: "assistant", content: reply, key: k };
      setMessages(prev => {
        const updated = [...prev, aMsg];
        if (sid) updateSession(sid, updated);
        return updated;
      });
      setHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "🙏 Connection interrupted. Please try again.", key: k }]);
    }
    setLoading(false);
  }

  async function startChat(m: string, k: string, initMsg: string | null = null) {
    setMode(m);
    setSelKey(k);
    const e = m === "god" ? GODS[k] : m === "book" ? BOOKS[k] : NAVAGRAHAS[k];
    const greeting = m === "book"
      ? `${e.emoji} **Welcome to ${e.name}**\n\n*${"desc" in e ? e.desc : ""}*\n\nShare your problem or ask any question — I will guide you with the exact verse and location.\n\n💡 Try: **"Give me today's sacred thought"**`
      : `${e.emoji} **Om ${e.name} Namaha!** 🙏\n\n*${"domain" in e ? e.domain : ""}*\n\n**Mantra:** *${"mantra" in e ? e.mantra : ""}*\n\nTell me what is in your heart.`;
    const initMsgs: ChatMessage[] = [{ role: "assistant", content: greeting, key: k }];
    if (initMsg) initMsgs.push({ role: "user", content: initMsg });
    setMessages(initMsgs);
    const hist: AIMessage[] = initMsg ? [{ role: "user", content: initMsg }] : [];
    setHistory(hist);
    const sid = saveSession(m, k, initMsgs);
    setPhase("chat");
    if (initMsg) await doAI(m, k, hist, initMsgs, sid);
  }

  function loadSession(session: ChatSession) {
    setMode(session.mode);
    setSelKey(session.key);
    setMessages(session.messages);
    const hist = session.messages
      .filter((_m, i) => _m.role !== "assistant" || i > 0)
      .map(m => ({ role: m.role, content: m.content }));
    setHistory(hist);
    setActiveChatId(session.id);
    setPhase("chat");
    setSidebarOpen(false);
  }

  async function handleHome() {
    if (!input.trim()) return;
    const txt = input.trim();
    setInput("");
    setPhase("detecting");
    setAgentMsg("🔍 Analyzing your situation...");
    await new Promise(r => setTimeout(r, 900));
    setAgentMsg("🕉️ Consulting sacred wisdom...");
    await new Promise(r => setTimeout(r, 800));
    const g = detectGod(txt);
    if (g) {
      setAgentMsg(`✨ ${GODS[g].emoji} ${GODS[g].name} will guide you!`);
      await new Promise(r => setTimeout(r, 900));
      setAgentMsg("");
      await startChat("god", g, txt);
    } else {
      setAgentMsg("");
      setPhase("home");
    }
  }

  async function send() {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    const newMsg: ChatMessage = { role: "user", content: txt };
    const newMsgs = [...messages, newMsg];
    setMessages(newMsgs);
    if (activeChatId) updateSession(activeChatId, newMsgs);
    const newHist: AIMessage[] = [...history, { role: "user", content: txt }];
    setHistory(newHist);
    await doAI(mode, selKey!, newHist, newMsgs, activeChatId);
  }

  async function runPanchangam() {
    if (!panchForm.dob) return;
    setPanchLoading(true);
    setPanchResult(null);
    setPanchHistory([]);
    const prompt = `Please give a complete Vedic Panchangam / Jyotisha reading for:
Name: ${panchForm.name || "Devotee"}
Date of Birth: ${panchForm.dob}
Time of Birth: ${panchForm.time || "Unknown"}
Place of Birth: ${panchForm.place || "India"}
Gender: ${panchForm.gender}
Rasi (Moon Sign): ${panchForm.rasi || "Unknown"}
Nakshatra (Birth Star): ${panchForm.nakshatra || "Unknown"}

IMPORTANT: The user has already confirmed their own Rasi and Nakshatra above. Do NOT recalculate these. Use exactly the Rasi and Nakshatra they provided and build all guidance based on these.

${PANCHANGAM_PROMPT}`;
    try {
      const sysPrompt = `You are a master Vedic astrologer (Jyotishi) with expertise in both Tamil Panchangam and North Indian Panchang. You have deep knowledge of 27 Nakshatras, 12 Rasis, Navagrahas, and temple recommendations. Always respond in ${LANGS[lang].label}.`;
      const reply = await callAnthropicAPI(sysPrompt, [{ role: "user", content: prompt }], 2000);
      setPanchResult(reply);
      setPanchHistory([{ role: "user", content: prompt }, { role: "assistant", content: reply }]);
      const session: ChatSession = {
        id: ++chatIdCounter, mode: "panchangam", key: "panchangam",
        entityName: "Panchangam", entityEmoji: "🔯",
        preview: `Birth reading for ${panchForm.name || "Devotee"} — ${panchForm.dob}`,
        messages: [{ role: "assistant", content: reply }], timestamp: Date.now()
      };
      setChatSessions(prev => [session, ...prev.slice(0, 49)]);
      setActiveChatId(session.id);
    } catch {
      setPanchResult("🙏 Connection issue. Please try again.");
    }
    setPanchLoading(false);
  }

  async function sendPanchFollow() {
    if (!panchFollowInput.trim() || loading) return;
    const txt = panchFollowInput.trim();
    setPanchFollowInput("");
    const newHist: AIMessage[] = [...panchHistory, { role: "user", content: txt }];
    setPanchHistory(newHist);
    setLoading(true);
    try {
      const sysPrompt = `You are a master Vedic astrologer continuing a Panchangam reading session. Respond in ${LANGS[lang].label}. Be specific and reference Jyotisha principles.`;
      const reply = await callAnthropicAPI(sysPrompt, newHist, 800);
      setPanchHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setPanchHistory(prev => [...prev, { role: "assistant", content: "🙏 Please try again." }]);
    }
    setLoading(false);
  }

  function speak(text: string, idx: number) {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
    } else {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(stripHtml(fmt(text)));
      utt.rate = 0.88;
      utt.pitch = 1.05;
      utt.onend = () => setSpeakingIdx(null);
      utt.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utt);
    }
  }

  function resetToHome() {
    window.speechSynthesis.cancel();
    setSpeakingIdx(null);
    setPhase("home");
    setSelKey(null);
    setMessages([]);
    setHistory([]);
    setActiveChatId(null);
    setPanchResult(null);
    setPanchHistory([]);
  }

  const bgStyle = phase === "panchangam"
    ? { background: "linear-gradient(135deg,#0a0014,#150028,#0a0014)" }
    : entity ? { background: entity.bg } : { background: "linear-gradient(135deg,#080808,#160e00)" };

  return (
    <div
      onClick={() => { setShowRasiDrop(false); setShowNakDrop(false); }}
      style={{ minHeight: "100vh", ...bgStyle, fontFamily: "'Georgia',serif", display: "flex", position: "relative", overflow: "hidden", transition: "background 1s ease" }}
    >
      {/* Particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        {PARTICLES.map(p => (
          <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%", background: accent, opacity: 0.2, animation: `fp ${p.dur}s ${p.delay}s ease-in-out infinite alternate` }} />
        ))}
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 299, backdropFilter: "blur(2px)" }} />
      )}

      {/* Sidebar */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: "rgba(10,8,5,.97)", borderRight: `1px solid ${accent}25`, zIndex: 300, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform .3s ease", display: "flex", flexDirection: "column", backdropFilter: "blur(20px)" }}>
        <div style={{ padding: "16px", borderBottom: `1px solid ${accent}20`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🕉️</span>
            <span style={{ color: accent, fontSize: "15px", fontWeight: "bold", letterSpacing: "1px" }}>DEVA AI</span>
          </div>
          <button className="deva-btn" onClick={() => setSidebarOpen(false)} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "6px", color: "rgba(255,255,255,.5)", padding: "4px 9px", fontSize: "14px" }}>✕</button>
        </div>
        <div style={{ padding: "12px" }}>
          <button className="deva-btn" onClick={() => { setSidebarOpen(false); resetToHome(); }} style={{ width: "100%", padding: "10px", background: `${accent}18`, border: `1px solid ${accent}40`, borderRadius: "10px", color: accent, fontSize: "13px", fontWeight: "bold" }}>{t.newChat}</button>
        </div>
        <div style={{ padding: "4px 16px 8px", color: "rgba(255,255,255,.3)", fontSize: "10px", letterSpacing: "2px" }}>{t.history.toUpperCase()}</div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {chatSessions.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,.25)", fontSize: "12px", textAlign: "center", padding: "20px" }}>{t.noHistory}</div>
          ) : chatSessions.map(s => (
            <button key={s.id} className="deva-btn" onClick={() => {
              if (s.mode === "panchangam") {
                setSidebarOpen(false); setPhase("panchangam"); setTab("panch");
                setPanchResult(s.messages[0]?.content || ""); setActiveChatId(s.id);
              } else loadSession(s);
            }} style={{ width: "100%", padding: "10px 12px", background: activeChatId === s.id ? `${accent}18` : "transparent", border: `1px solid ${activeChatId === s.id ? accent + "35" : "transparent"}`, borderRadius: "10px", textAlign: "left", marginBottom: "4px", display: "flex", gap: "9px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{s.entityEmoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: activeChatId === s.id ? accent : "rgba(255,255,255,.7)", fontSize: "12px", fontWeight: "bold", marginBottom: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{s.entityName}</div>
                <div style={{ color: "rgba(255,255,255,.35)", fontSize: "11px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{s.preview}</div>
                <div style={{ color: "rgba(255,255,255,.2)", fontSize: "10px", marginTop: "2px" }}>{timeAgo(s.timestamp)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="glass-surface" style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "11px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 200, background: "rgba(0,0,0,.55)", borderBottom: `1px solid ${accent}28` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="deva-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "rgba(255,255,255,.07)", border: `1px solid ${accent}30`, borderRadius: "8px", color: accent, padding: "7px 10px", fontSize: "16px", lineHeight: 1 }}>☰</button>
          <span className="animate-divine-pulse" style={{ fontSize: "22px" }}>🕉️</span>
          <div>
            <div style={{ color: accent, fontSize: "17px", fontWeight: "bold", letterSpacing: "2px" }}>DEVA AI</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: "9px", letterSpacing: "3px" }}>DIVINE WISDOM • SACRED GUIDANCE</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {entity && phase === "chat" && (
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ fontSize: "18px" }}>{entity.emoji}</span>
              <div>
                <div style={{ color: accent, fontSize: "12px" }}>{entity.name}</div>
                {"tamil" in entity && lang === "ta" && <div style={{ color: "rgba(255,255,255,.3)", fontSize: "10px" }}>{entity.tamil}</div>}
              </div>
              <button className="deva-btn" onClick={() => { setPhase("home"); setSelKey(null); setMessages([]); setHistory([]); setPanchResult(null); }} style={{ marginLeft: "5px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: "6px", color: "rgba(255,255,255,.5)", padding: "3px 9px", fontSize: "10px" }}>{t.changeBtn}</button>
            </div>
          )}
          <div style={{ position: "relative" }}>
            <button className="deva-btn" onClick={() => setShowLang(!showLang)} style={{ background: `${accent}18`, border: `1px solid ${accent}45`, borderRadius: "8px", color: accent, padding: "5px 11px", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
              {LANGS[lang].flag} {LANGS[lang].label} ▾
            </button>
            {showLang && (
              <div style={{ position: "absolute", top: "110%", right: 0, background: "#121212", border: "1px solid rgba(255,255,255,.12)", borderRadius: "10px", overflow: "hidden", zIndex: 300, minWidth: "140px", boxShadow: "0 8px 24px rgba(0,0,0,.7)" }}>
                {Object.entries(LANGS).map(([code, l]) => (
                  <button key={code} className="deva-btn" onClick={() => { setLang(code); setShowLang(false); }} style={{ width: "100%", padding: "8px 14px", background: lang === code ? `${accent}20` : "transparent", border: "none", color: lang === code ? accent : "rgba(255,255,255,.65)", textAlign: "left", fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: phase === "chat" ? "flex-start" : "center", padding: "20px", marginTop: "60px", width: "100%" }}>

        {/* HOME / DETECTING */}
        {(phase === "home" || phase === "detecting") && (
          <div style={{ maxWidth: "680px", width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <div className="animate-divine-pulse" style={{ fontSize: "52px", marginBottom: "10px" }}>🕉️</div>
              <h1 style={{ color: "#f4a261", fontSize: "26px", letterSpacing: "4px", margin: "0 0 5px", fontWeight: "normal" }}>नमस्ते • வணக்கம்</h1>
              <h2 style={{ color: "rgba(255,255,255,.85)", fontSize: "17px", margin: "0 0 4px", fontWeight: "normal" }}>{t.welcome}</h2>
              <p style={{ color: "rgba(255,255,255,.3)", fontSize: "11px", letterSpacing: "2px" }}>{t.subtitle.toUpperCase()}</p>
            </div>

            {phase === "detecting" ? (
              <div className="animate-fade-up" style={{ background: "rgba(255,200,50,.07)", border: "1px solid rgba(255,200,50,.2)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <div className="animate-spin-slow" style={{ fontSize: "28px", marginBottom: "10px" }}>☸️</div>
                <div style={{ color: "#f4a261", fontSize: "14px" }}>{agentMsg}</div>
              </div>
            ) : (
              <>
                <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,200,50,.16)", borderRadius: "18px", padding: "18px", marginBottom: "16px" }}>
                  <p style={{ color: "rgba(255,255,255,.45)", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>Tell me your problem — I'll find your perfect divine guide</p>
                  <textarea
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleHome(); } }}
                    placeholder={t.placeholder}
                    style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,200,50,.2)", borderRadius: "10px", padding: "11px 14px", color: "#fff", fontSize: "14px", fontFamily: "Georgia,serif", resize: "none", height: "72px", boxSizing: "border-box", marginBottom: "10px" }}
                  />
                  <button className="deva-btn animate-divine-glow" onClick={handleHome} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#b8860b,#daa520)", border: "none", borderRadius: "10px", color: "#000", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px" }}>{t.seekBtn}</button>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                  {([["gods", t.tabGods], ["books", t.tabBooks], ["nava", t.tabNava], ["panch", t.tabPanch]] as [string, string][]).map(([k, label]) => (
                    <button key={k} className="deva-btn" onClick={() => { setTab(k); if (k === "panch") setPhase("panchangam"); }} style={{ flex: 1, padding: "8px 4px", background: tab === k ? "rgba(255,200,50,.17)" : "rgba(255,255,255,.04)", border: `1px solid ${tab === k ? "#daa520" : "rgba(255,255,255,.08)"}`, borderRadius: "10px", color: tab === k ? "#f4a261" : "rgba(255,255,255,.4)", fontSize: "11px" }}>{label}</button>
                  ))}
                </div>

                {/* Gods Grid */}
                {tab === "gods" && (
                  <div>
                    <p style={{ color: "rgba(255,255,255,.28)", fontSize: "10px", letterSpacing: "2px", textAlign: "center", marginBottom: "10px" }}>{t.chooseDeity}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
                      {Object.entries(GODS).map(([k, g]) => (
                        <button key={k} className="deva-btn" onClick={() => startChat("god", k)} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${g.accent}28`, borderRadius: "12px", padding: "12px 5px", color: g.accent, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "22px" }}>{g.emoji}</span>
                          <span style={{ fontSize: "10px", lineHeight: 1.2 }}>{g.name.replace("Lord ", "").replace("Goddess ", "")}</span>
                          {lang === "ta" && <span style={{ fontSize: "9px", color: "rgba(255,255,255,.25)" }}>{g.tamil}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Books Grid */}
                {tab === "books" && (
                  <div>
                    <p style={{ color: "rgba(255,255,255,.28)", fontSize: "10px", letterSpacing: "2px", textAlign: "center", marginBottom: "10px" }}>{t.chooseBook}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px", marginBottom: "10px" }}>
                      {Object.entries(BOOKS).map(([k, b]) => (
                        <button key={k} className="deva-btn" onClick={() => startChat("book", k)} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${b.accent}28`, borderRadius: "12px", padding: "12px 10px", color: b.accent, textAlign: "left", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "22px", flexShrink: 0 }}>{b.emoji}</span>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: "bold" }}>{b.name}</div>
                            <div style={{ fontSize: "9px", color: "rgba(255,255,255,.28)", marginTop: "2px", lineHeight: 1.3 }}>{b.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button className="deva-btn" onClick={() => startChat("book", "gita", "Give me today's sacred thought with verse reference")} style={{ width: "100%", padding: "10px", background: "rgba(255,200,50,.08)", border: "1px solid rgba(255,200,50,.22)", borderRadius: "10px", color: "#f4a261", fontSize: "12px" }}>{t.dailyBtn}</button>
                  </div>
                )}

                {/* Navagraha Grid */}
                {tab === "nava" && (
                  <div>
                    <p style={{ color: "rgba(255,255,255,.28)", fontSize: "10px", letterSpacing: "2px", textAlign: "center", marginBottom: "10px" }}>— CHOOSE YOUR NAVAGRAHA PLANET —</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                      {Object.entries(NAVAGRAHAS).map(([k, n]) => (
                        <button key={k} className="deva-btn" onClick={() => startChat("nava", k)} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${n.accent}28`, borderRadius: "12px", padding: "12px 6px", color: n.accent, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "20px" }}>{n.emoji}</span>
                          <span style={{ fontSize: "10px", lineHeight: 1.2 }}>{n.name.split("(")[0].trim()}</span>
                          {lang === "ta" && <span style={{ fontSize: "9px", color: "rgba(255,255,255,.25)" }}>{n.tamil}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* PANCHANGAM */}
        {phase === "panchangam" && (
          <div style={{ maxWidth: "680px", width: "100%" }}>
            <button className="deva-btn" onClick={() => { setPhase("home"); setTab("gods"); setPanchResult(null); setPanchHistory([]); }} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "8px", color: "rgba(255,255,255,.5)", padding: "5px 12px", fontSize: "12px", marginBottom: "16px" }}>← Back</button>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div className="animate-divine-pulse" style={{ fontSize: "44px", marginBottom: "8px" }}>🔯</div>
              <h2 style={{ color: "#a78bfa", fontSize: "22px", letterSpacing: "3px", margin: "0 0 5px", fontWeight: "normal" }}>{t.panchTitle}</h2>
              <p style={{ color: "rgba(255,255,255,.35)", fontSize: "12px" }}>{t.panchSubtitle}</p>
            </div>

            {!panchResult && !panchLoading && (
              <div style={{ background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)", borderRadius: "18px", padding: "22px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "5px" }}>{t.panchName}</label>
                    <input value={panchForm.name} onChange={e => setPanchForm({ ...panchForm, name: e.target.value })} placeholder="e.g. Arjun Kumar" style={{ width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(167,139,250,.25)", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "5px" }}>{t.panchDob} *</label>
                    <input type="date" value={panchForm.dob} onChange={e => setPanchForm({ ...panchForm, dob: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(167,139,250,.25)", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "5px" }}>{t.panchTime}</label>
                    <input type="time" value={panchForm.time} onChange={e => setPanchForm({ ...panchForm, time: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(167,139,250,.25)", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "5px" }}>{t.panchPlace}</label>
                    <input value={panchForm.place} onChange={e => setPanchForm({ ...panchForm, place: e.target.value })} placeholder="e.g. Chennai, Tamil Nadu" style={{ width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(167,139,250,.25)", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* Rasi + Nakshatra */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                    <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "5px" }}>♈ Rasi (Moon Sign) *</label>
                    <input
                      value={panchForm.rasi || rasiQuery}
                      onChange={e => { setRasiQuery(e.target.value); setPanchForm({ ...panchForm, rasi: "" }); setShowRasiDrop(true); }}
                      onFocus={() => setShowRasiDrop(true)}
                      placeholder="Type e.g. Rishabha..."
                      style={{ width: "100%", background: panchForm.rasi ? "rgba(167,139,250,.18)" : "rgba(255,255,255,.07)", border: `1px solid ${panchForm.rasi ? "#a78bfa" : "rgba(167,139,250,.25)"}`, borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", boxSizing: "border-box" }}
                    />
                    {showRasiDrop && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1020", border: "1px solid rgba(167,139,250,.3)", borderRadius: "8px", zIndex: 400, maxHeight: "180px", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,.8)" }}>
                        {RASI_LIST.filter(r => !rasiQuery || r.en.toLowerCase().includes(rasiQuery.toLowerCase()) || r.ta.includes(rasiQuery)).map(r => (
                          <button key={r.num} className="deva-btn" onClick={() => { setPanchForm({ ...panchForm, rasi: r.en }); setRasiQuery(""); setShowRasiDrop(false); }} style={{ width: "100%", padding: "9px 12px", background: "transparent", border: "none", borderBottom: "1px solid rgba(167,139,250,.1)", color: "#e8d5ff", textAlign: "left", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px" }}>{r.symbol}</span>
                            <div>
                              <div style={{ fontWeight: "bold" }}>{r.en}</div>
                              <div style={{ color: "rgba(255,255,255,.4)", fontSize: "10px" }}>{r.ta} • Lord: {r.planet}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {panchForm.rasi && <div style={{ color: "#a78bfa", fontSize: "10px", marginTop: "3px" }}>✓ {RASI_LIST.find(r => r.en === panchForm.rasi)?.ta}</div>}
                  </div>

                  <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                    <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "5px" }}>⭐ Nakshatra (Birth Star) *</label>
                    <input
                      value={panchForm.nakshatra || nakQuery}
                      onChange={e => { setNakQuery(e.target.value); setPanchForm({ ...panchForm, nakshatra: "" }); setShowNakDrop(true); }}
                      onFocus={() => setShowNakDrop(true)}
                      placeholder="Type e.g. Rohini..."
                      style={{ width: "100%", background: panchForm.nakshatra ? "rgba(167,139,250,.18)" : "rgba(255,255,255,.07)", border: `1px solid ${panchForm.nakshatra ? "#a78bfa" : "rgba(167,139,250,.25)"}`, borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", boxSizing: "border-box" }}
                    />
                    {showNakDrop && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1020", border: "1px solid rgba(167,139,250,.3)", borderRadius: "8px", zIndex: 400, maxHeight: "180px", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,.8)" }}>
                        {NAKSHATRA_LIST.filter(n => !nakQuery || n.en.toLowerCase().includes(nakQuery.toLowerCase()) || n.ta.includes(nakQuery)).map(n => (
                          <button key={n.num} className="deva-btn" onClick={() => { setPanchForm({ ...panchForm, nakshatra: n.en }); setNakQuery(""); setShowNakDrop(false); }} style={{ width: "100%", padding: "9px 12px", background: "transparent", border: "none", borderBottom: "1px solid rgba(167,139,250,.1)", color: "#e8d5ff", textAlign: "left", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ color: "#f9c74f", fontSize: "13px" }}>⭐</span>
                            <div>
                              <div style={{ fontWeight: "bold" }}>{n.en}</div>
                              <div style={{ color: "rgba(255,255,255,.4)", fontSize: "10px" }}>{n.ta} • {n.deity} • {n.planet}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {panchForm.nakshatra && <div style={{ color: "#a78bfa", fontSize: "10px", marginTop: "3px" }}>✓ {NAKSHATRA_LIST.find(n => n.en === panchForm.nakshatra)?.ta}</div>}
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ color: "rgba(255,255,255,.45)", fontSize: "11px", display: "block", marginBottom: "7px" }}>{t.panchGender}</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {(["male", "female"] as const).map(g => (
                      <button key={g} className="deva-btn" onClick={() => setPanchForm({ ...panchForm, gender: g })} style={{ flex: 1, padding: "8px", background: panchForm.gender === g ? "rgba(167,139,250,.2)" : "rgba(255,255,255,.04)", border: `1px solid ${panchForm.gender === g ? "#a78bfa" : "rgba(255,255,255,.1)"}`, borderRadius: "8px", color: panchForm.gender === g ? "#a78bfa" : "rgba(255,255,255,.4)", fontSize: "13px" }}>
                        {g === "male" ? `♂ ${t.panchMale}` : `♀ ${t.panchFemale}`}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="deva-btn" onClick={runPanchangam} disabled={!panchForm.dob || !panchForm.rasi || !panchForm.nakshatra} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "bold", letterSpacing: "1px", opacity: (panchForm.dob && panchForm.rasi && panchForm.nakshatra) ? 1 : 0.5 }}>{t.panchBtn}</button>
              </div>
            )}

            {panchLoading && (
              <div className="animate-fade-up" style={{ background: "rgba(167,139,250,.07)", border: "1px solid rgba(167,139,250,.2)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
                <div className="animate-spin-slow" style={{ fontSize: "36px", marginBottom: "12px" }}>☸️</div>
                <div style={{ color: "#a78bfa", fontSize: "14px", marginBottom: "6px" }}>Consulting the celestial charts...</div>
                <div style={{ color: "rgba(255,255,255,.3)", fontSize: "12px" }}>Calculating your Rasi, Nakshatra & cosmic blueprint</div>
              </div>
            )}

            {panchResult && !panchLoading && (
              <div>
                <button className="deva-btn" onClick={() => { setPanchResult(null); setPanchHistory([]); setPanchForm({ name: "", dob: "", time: "", place: "", gender: "male", rasi: "", nakshatra: "" }); }} style={{ background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.3)", borderRadius: "8px", color: "#a78bfa", padding: "5px 14px", fontSize: "12px", marginBottom: "12px" }}>🔄 New Reading</button>
                <div style={{ background: "rgba(0,0,0,.4)", border: "1px solid rgba(167,139,250,.25)", borderRadius: "16px", padding: "20px", marginBottom: "14px", maxHeight: "420px", overflowY: "auto" }}>
                  <div style={{ color: "#e8d5ff", fontSize: "13px", lineHeight: "1.8" }} dangerouslySetInnerHTML={{ __html: fmt(panchResult) }} />
                </div>

                {panchHistory.length > 2 && (
                  <div style={{ marginBottom: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {panchHistory.slice(2).map((m, i) => (
                      <div key={i} className="animate-fade-up" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                        {m.role === "assistant" && <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(167,139,250,.2)", border: "1px solid rgba(167,139,250,.4)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "8px", flexShrink: 0, fontSize: "13px" }}>🔯</div>}
                        <div style={{ maxWidth: "80%", position: "relative" }}>
                          <div style={{ padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "rgba(167,139,250,.15)" : "rgba(0,0,0,.4)", border: `1px solid rgba(167,139,250,${m.role === "user" ? ".35" : ".18"})`, color: "#e8d5ff", fontSize: "13px", lineHeight: "1.7" }} dangerouslySetInnerHTML={{ __html: fmt(m.content) }} />
                          {m.role === "assistant" && (
                            <button className="deva-btn" onClick={() => speak(m.content, 9000 + i)} style={{ position: "absolute", bottom: "-12px", right: "6px", width: "26px", height: "26px", borderRadius: "50%", background: speakingIdx === (9000 + i) ? "#a78bfa" : "rgba(0,0,0,.6)", border: "1px solid rgba(167,139,250,.5)", color: speakingIdx === (9000 + i) ? "#000" : "#fff", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
                              {speakingIdx === (9000 + i) ? "⏹" : "🔊"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {loading && <div style={{ display: "flex", gap: "5px", paddingLeft: "36px" }}>{[0, 1, 2].map(d => <div key={d} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", opacity: .65, animation: `dot-pulse .85s ${d * .22}s ease-in-out infinite alternate` }} />)}</div>}
                  </div>
                )}

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                  {["Which temple should I visit this week?", "What is my lucky gemstone?", "What career suits me best?", "My marriage compatibility?", "What mantra should I chant daily?"].map(q => (
                    <button key={q} className="deva-btn" onClick={() => setPanchFollowInput(q)} style={{ background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", borderRadius: "20px", padding: "4px 10px", color: "#a78bfa", fontSize: "11px" }}>{q}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <textarea value={panchFollowInput} onChange={e => setPanchFollowInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendPanchFollow(); } }} placeholder="Ask anything about your birth chart..." style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(167,139,250,.3)", borderRadius: "10px", padding: "10px 13px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", resize: "none", height: "46px", lineHeight: "1.35" }} />
                  <button className="deva-btn" onClick={sendPanchFollow} disabled={loading || !panchFollowInput.trim()} style={{ width: "46px", height: "46px", borderRadius: "10px", background: loading ? "rgba(255,255,255,.07)" : "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>🔯</button>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {/* CHAT */}
        {phase === "chat" && entity && (
          <div style={{ maxWidth: "740px", width: "100%", height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
            {/* Banner */}
            <div className="glass-surface" style={{ background: `${entity.accent}12`, border: `1px solid ${entity.accent}28`, borderRadius: "16px 16px 0 0", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>{entity.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: entity.accent, fontSize: "14px", fontWeight: "bold" }}>{entity.name}</div>
                <div style={{ color: "rgba(255,255,255,.38)", fontSize: "11px" }}>{"domain" in entity ? entity.domain : "desc" in entity ? (entity as any).desc : ""}</div>
                {"tamil" in entity && lang === "ta" && <div style={{ color: "rgba(255,255,255,.25)", fontSize: "10px" }}>{entity.tamil}</div>}
              </div>
              {"mantra" in entity && entity.mantra && <div style={{ textAlign: "right" as const }}>
                <div style={{ color: "rgba(255,255,255,.2)", fontSize: "9px", letterSpacing: "1px" }}>{t.mantraLabel}</div>
                <div style={{ color: entity.accent, fontSize: "10px", fontStyle: "italic" }}>{entity.mantra}</div>
              </div>}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)" }}>
              {messages.map((msg, i) => (
                <div key={i} className="animate-fade-up" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `${entity.accent}20`, border: `1px solid ${entity.accent}42`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: "7px", flexShrink: 0, fontSize: "14px" }}>{entity.emoji}</div>}
                  <div style={{ maxWidth: "78%", position: "relative" }}>
                    <div style={{ padding: "11px 14px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: msg.role === "user" ? `${entity.accent}1c` : "rgba(0,0,0,.42)", border: `1px solid ${msg.role === "user" ? entity.accent + "3a" : entity.accent + "1e"}`, color: "#f0e6cc", fontSize: "13px", lineHeight: "1.75", backdropFilter: "blur(8px)" }} dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
                    {msg.role === "assistant" && (
                      <button className="deva-btn" onClick={() => speak(msg.content, i)} title={speakingIdx === i ? "Stop speaking" : "Read aloud"} style={{ position: "absolute", bottom: "-12px", right: "6px", width: "26px", height: "26px", borderRadius: "50%", background: speakingIdx === i ? entity.accent : "rgba(0,0,0,.6)", border: `1px solid ${entity.accent}60`, color: speakingIdx === i ? "#000" : "#fff", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, transition: "all .2s", boxShadow: speakingIdx === i ? `0 0 10px ${entity.accent}` : "none" }}>
                        {speakingIdx === i ? "⏹" : "🔊"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `${entity.accent}20`, border: `1px solid ${entity.accent}42`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{entity.emoji}</div>
                  <div style={{ background: "rgba(0,0,0,.42)", border: `1px solid ${entity.accent}1e`, borderRadius: "14px 14px 14px 4px", padding: "10px 14px", display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0, 1, 2].map(d => <div key={d} style={{ width: "5px", height: "5px", borderRadius: "50%", background: entity.accent, opacity: .6, animation: `dot-pulse .85s ${d * .22}s ease-in-out infinite alternate` }} />)}
                    <span style={{ color: "rgba(255,255,255,.28)", fontSize: "11px", marginLeft: "6px" }}>{t.thinking}</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="glass-surface" style={{ background: "rgba(0,0,0,.55)", border: `1px solid ${entity.accent}20`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: "11px" }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap" }}>
                {(mode === "book"
                  ? [t.dailyBtn, "Verse about fear", "Verse about karma", "Most important chapter", "Verse about duty"]
                  : t.quickPrompts
                ).map(q => (
                  <button key={q} className="deva-btn" onClick={() => setInput(q)} style={{ background: `${entity.accent}0e`, border: `1px solid ${entity.accent}22`, borderRadius: "20px", padding: "3px 9px", color: entity.accent, fontSize: "11px" }}>{q}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "7px" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={`Ask ${entity.name}...`} style={{ flex: 1, background: "rgba(255,255,255,.06)", border: `1px solid ${entity.accent}28`, borderRadius: "10px", padding: "9px 12px", color: "#fff", fontSize: "13px", fontFamily: "Georgia,serif", resize: "none", height: "44px", lineHeight: "1.35" }} />
                <button className="deva-btn" onClick={send} disabled={loading || !input.trim()} style={{ width: "44px", height: "44px", borderRadius: "10px", background: loading ? "rgba(255,255,255,.07)" : `linear-gradient(135deg,${entity.accent},${entity.accent}99)`, border: "none", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>🙏</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}