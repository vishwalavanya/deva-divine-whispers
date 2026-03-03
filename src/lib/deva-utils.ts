import { GODS, LANGS } from "@/data/constants";

export function detectGod(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [key, g] of Object.entries(GODS)) {
    if (g.forProblems.some(k => lower.includes(k))) return key;
  }
  return null;
}

export function fmt(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function buildSystemPrompt(
  mode: string,
  key: string,
  lang: string,
  gods: typeof GODS,
  books: Record<string, any>,
  navagrahas: Record<string, any>
): string {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const langNote = `\n\nIMPORTANT: Respond in ${LANGS[lang].label} language. Today's date is ${today}.`;

  if (mode === "god") {
    const g = gods[key];
    return `You are ${g.name}, a divine Hindu deity speaking directly to a devotee. Domain: ${g.domain}. Mantra: ${g.mantra}. Speak with divine wisdom, compassion and warmth. Reference scriptural stories. Keep responses 3-4 paragraphs. End with a blessing.${langNote}`;
  }
  if (mode === "book") return books[key].systemPrompt + langNote;
  if (mode === "nava") {
    const n = navagrahas[key];
    return `You are the cosmic energy of ${n.name}. Domain: ${n.domain}. Mantra: ${n.mantra}. Guide the devotee as this planetary energy. Give specific Vedic remedies (gemstones, mantras, fasting days, worship). Reference Jyotisha wisdom.${langNote}`;
  }
  return "";
}
