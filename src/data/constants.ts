// ─── LANGUAGES ────────────────────────────────────────────────
export interface LangStrings {
  code: string; label: string; flag: string; welcome: string; subtitle: string;
  seekBtn: string; chooseDeity: string; chooseBook: string; placeholder: string;
  thinking: string; dailyBtn: string; tabGods: string; tabBooks: string;
  tabNava: string; tabPanch: string; changeBtn: string; mantraLabel: string;
  newChat: string; history: string; noHistory: string; quickPrompts: string[];
  panchTitle: string; panchSubtitle: string; panchBtn: string; panchName: string;
  panchDob: string; panchTime: string; panchPlace: string; panchGender: string;
  panchMale: string; panchFemale: string;
}

export const LANGS: Record<string, LangStrings> = {
  en: { code:"en", label:"English", flag:"🇬🇧", welcome:"Welcome, Dear Devotee", subtitle:"Share your heart • Receive divine guidance", seekBtn:"🙏 Seek Divine Guidance", chooseDeity:"— OR CHOOSE YOUR DEITY —", chooseBook:"— OR CHOOSE A SACRED SCRIPTURE —", placeholder:"Tell me your problem...", thinking:"Receiving divine wisdom...", dailyBtn:"✨ Today's Sacred Thought", tabGods:"🕉️ Gods", tabBooks:"📚 Scriptures", tabNava:"🪐 Navagraha", tabPanch:"🔯 Panchangam", changeBtn:"Change", mantraLabel:"MANTRA", newChat:"+ New Chat", history:"Chat History", noHistory:"No chats yet", quickPrompts:["What mantra should I chant?","Tell me a story about you","Today's guidance for me","What does this mean spiritually?"], panchTitle:"Vedic Panchangam", panchSubtitle:"Enter your birth details for personalized divine guidance", panchBtn:"🔯 Reveal My Cosmic Blueprint", panchName:"Your Name", panchDob:"Date of Birth", panchTime:"Birth Time (optional)", panchPlace:"Birth Place (optional)", panchGender:"Gender", panchMale:"Male", panchFemale:"Female" },
  ta: { code:"ta", label:"தமிழ்", flag:"🇮🇳", welcome:"வணக்கம், அன்பான பக்தரே", subtitle:"உங்கள் மனதை சொல்லுங்கள் • தெய்வீக வழிகாட்டுதல் பெறுங்கள்", seekBtn:"🙏 தெய்வீக வழிகாட்டுதல் தேடுங்கள்", chooseDeity:"— அல்லது உங்கள் தெய்வத்தை தேர்ந்தெடுங்கள் —", chooseBook:"— அல்லது புனித நூலை தேர்ந்தெடுங்கள் —", placeholder:"உங்கள் பிரச்சினையை சொல்லுங்கள்...", thinking:"தெய்வீக ஞானம் வருகிறது...", dailyBtn:"✨ இன்றைய புனித சிந்தனை", tabGods:"🕉️ கடவுள்கள்", tabBooks:"📚 வேதங்கள்", tabNava:"🪐 நவகிரகம்", tabPanch:"🔯 பஞ்சாங்கம்", changeBtn:"மாற்று", mantraLabel:"மந்திரம்", newChat:"+ புதிய உரையாடல்", history:"உரையாடல் வரலாறு", noHistory:"இன்னும் உரையாடல் இல்லை", quickPrompts:["என்ன மந்திரம் சொல்ல வேண்டும்?","உங்கள் கதை சொல்லுங்கள்","இன்றைய வழிகாட்டுதல்","ஆன்மீக அர்த்தம் என்ன?"], panchTitle:"வேத பஞ்சாங்கம்", panchSubtitle:"உங்கள் பிறப்பு விவரங்களை உள்ளிடுங்கள்", panchBtn:"🔯 என் ஜாதகம் காட்டுங்கள்", panchName:"உங்கள் பெயர்", panchDob:"பிறந்த தேதி", panchTime:"பிறந்த நேரம் (விரும்பினால்)", panchPlace:"பிறந்த ஊர் (விரும்பினால்)", panchGender:"பாலினம்", panchMale:"ஆண்", panchFemale:"பெண்" },
  hi: { code:"hi", label:"हिन्दी", flag:"🇮🇳", welcome:"स्वागत है, प्रिय भक्त", subtitle:"अपना दिल कहें • दिव्य मार्गदर्शन पाएं", seekBtn:"🙏 दिव्य मार्गदर्शन खोजें", chooseDeity:"— या अपना देवता चुनें —", chooseBook:"— या एक पवित्र ग्रंथ चुनें —", placeholder:"अपनी समस्या बताएं...", thinking:"दिव्य ज्ञान आ रहा है...", dailyBtn:"✨ आज का पवित्र विचार", tabGods:"🕉️ देवी-देवता", tabBooks:"📚 शास्त्र", tabNava:"🪐 नवग्रह", tabPanch:"🔯 पंचांग", changeBtn:"बदलें", mantraLabel:"मंत्र", newChat:"+ नई बातचीत", history:"बातचीत इतिहास", noHistory:"अभी कोई बातचीत नहीं", quickPrompts:["कौन सा मंत्र जपूं?","अपनी कथा सुनाएं","आज का मार्गदर्शन","आध्यात्मिक अर्थ क्या है?"], panchTitle:"वैदिक पंचांग", panchSubtitle:"व्यक्तिगत दिव्य मार्गदर्शन के लिए जन्म विवरण दें", panchBtn:"🔯 मेरी जन्मकुंडली दिखाएं", panchName:"आपका नाम", panchDob:"जन्म तिथि", panchTime:"जन्म समय (वैकल्पिक)", panchPlace:"जन्म स्थान (वैकल्पिक)", panchGender:"लिंग", panchMale:"पुरुष", panchFemale:"महिला" },
  te: { code:"te", label:"తెలుగు", flag:"🇮🇳", welcome:"స్వాగతం, ప్రియ భక్తుడా", subtitle:"మీ మనసు చెప్పండి • దైవ మార్గదర్శనం పొందండి", seekBtn:"🙏 దైవ మార్గదర్శనం కోసం", chooseDeity:"— లేదా మీ దైవాన్ని ఎంచుకోండి —", chooseBook:"— లేదా పవిత్ర గ్రంథం ఎంచుకోండి —", placeholder:"మీ సమస్య చెప్పండి...", thinking:"దైవ జ్ఞానం వస్తోంది...", dailyBtn:"✨ నేటి పవిత్ర ఆలోచన", tabGods:"🕉️ దేవతలు", tabBooks:"📚 శాస్త్రాలు", tabNava:"🪐 నవగ్రహాలు", tabPanch:"🔯 పంచాంగం", changeBtn:"మార్చు", mantraLabel:"మంత్రం", newChat:"+ కొత్త సంభాషణ", history:"సంభాషణ చరిత్ర", noHistory:"ఇంకా సంభాషణలు లేవు", quickPrompts:["ఏ మంత్రం జపించాలి?","మీ కథ చెప్పండి","నేటి మార్గదర్శనం","ఆధ్యాత్మిక అర్థం?"], panchTitle:"వైదిక పంచాంగం", panchSubtitle:"వ్యక్తిగత మార్గదర్శనానికి జన్మ వివరాలు ఇవ్వండి", panchBtn:"🔯 నా జాతకం చూపించు", panchName:"మీ పేరు", panchDob:"పుట్టిన తేదీ", panchTime:"పుట్టిన సమయం (ఐచ్ఛికం)", panchPlace:"పుట్టిన ప్రదేశం (ఐచ్ఛికం)", panchGender:"లింగం", panchMale:"పురుషుడు", panchFemale:"స్త్రీ" },
  kn: { code:"kn", label:"ಕನ್ನಡ", flag:"🇮🇳", welcome:"ಸ್ವಾಗತ, ಪ್ರಿಯ ಭಕ್ತರೇ", subtitle:"ನಿಮ್ಮ ಮನಸ್ಸು ಹೇಳಿ • ದೈವಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ", seekBtn:"🙏 ದೈವಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ", chooseDeity:"— ಅಥವಾ ನಿಮ್ಮ ದೇವತೆ ಆರಿಸಿ —", chooseBook:"— ಅಥವಾ ಪವಿತ್ರ ಗ್ರಂಥ ಆರಿಸಿ —", placeholder:"ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ...", thinking:"ದೈವಿಕ ಜ್ಞಾನ ಬರುತ್ತಿದೆ...", dailyBtn:"✨ ಇಂದಿನ ಪವಿತ್ರ ಚಿಂತನೆ", tabGods:"🕉️ ದೇವತೆಗಳು", tabBooks:"📚 ಶಾಸ್ತ್ರಗಳು", tabNava:"🪐 ನವಗ್ರಹ", tabPanch:"🔯 ಪಂಚಾಂಗ", changeBtn:"ಬದಲಿಸಿ", mantraLabel:"ಮಂತ್ರ", newChat:"+ ಹೊಸ ಸಂಭಾಷಣೆ", history:"ಸಂಭಾಷಣೆ ಇತಿಹಾಸ", noHistory:"ಇನ್ನೂ ಸಂಭಾಷಣೆ ಇಲ್ಲ", quickPrompts:["ಯಾವ ಮಂತ್ರ ಜಪಿಸಲಿ?","ನಿಮ್ಮ ಕಥೆ ಹೇಳಿ","ಇಂದಿನ ಮಾರ್ಗದರ್ಶನ","ಆಧ್ಯಾತ್ಮಿಕ ಅರ್ಥ?"], panchTitle:"ವೈದಿಕ ಪಂಚಾಂಗ", panchSubtitle:"ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಜನ್ಮ ವಿವರ ನೀಡಿ", panchBtn:"🔯 ನನ್ನ ಜಾತಕ ತೋರಿಸಿ", panchName:"ನಿಮ್ಮ ಹೆಸರು", panchDob:"ಹುಟ್ಟಿದ ದಿನಾಂಕ", panchTime:"ಹುಟ್ಟಿದ ಸಮಯ (ಐಚ್ಛಿಕ)", panchPlace:"ಹುಟ್ಟಿದ ಸ್ಥಳ (ಐಚ್ಛಿಕ)", panchGender:"ಲಿಂಗ", panchMale:"ಪುರುಷ", panchFemale:"ಮಹಿಳೆ" },
  ml: { code:"ml", label:"മലയാളം", flag:"🇮🇳", welcome:"സ്വാഗതം, പ്രിയ ഭക്താ", subtitle:"നിങ്ങളുടെ മനസ്സ് പറയൂ • ദൈവിക മാർഗദർശനം നേടൂ", seekBtn:"🙏 ദൈവിക മാർഗദർശനം തേടൂ", chooseDeity:"— അല്ലെങ്കിൽ നിങ്ങളുടെ ദേവനെ തിരഞ്ഞെടുക്കൂ —", chooseBook:"— അല്ലെങ്കിൽ ഒരു ഗ്രന്ഥം തിരഞ്ഞെടുക്കൂ —", placeholder:"നിങ്ങളുടെ പ്രശ്നം പറയൂ...", thinking:"ദൈവിക ജ്ഞാനം വരുന്നു...", dailyBtn:"✨ ഇന്നത്തെ പുണ്യ ചിന്ത", tabGods:"🕉️ ദേവതകൾ", tabBooks:"📚 ഗ്രന്ഥങ്ങൾ", tabNava:"🪐 നവഗ്രഹം", tabPanch:"🔯 പഞ്ചാംഗം", changeBtn:"മാറ്റുക", mantraLabel:"മന്ത്രം", newChat:"+ പുതിയ സംഭാഷണം", history:"സംഭാഷണ ചരിത്രം", noHistory:"ഇതുവരെ സംഭാഷണങ്ങൾ ഇല്ല", quickPrompts:["ഏത് മന്ത്രം ജപിക്കണം?","നിങ്ങളുടെ കഥ പറയൂ","ഇന്നത്തെ മാർഗദർശനം","ആത്മീയ അർഥം?"], panchTitle:"വൈദിക പഞ്ചാംഗം", panchSubtitle:"വ്യക്തിഗത മാർഗദർശനത്തിനായി ജനന വിവരം നൽകൂ", panchBtn:"🔯 എന്റെ ജാതകം കാണിക്കൂ", panchName:"നിങ്ങളുടെ പേര്", panchDob:"ജനനത്തീയതി", panchTime:"ജനന സമയം (ഐച്ഛികം)", panchPlace:"ജനനസ്ഥലം (ഐച്ഛികം)", panchGender:"ലിംഗഭേദം", panchMale:"പുരുഷൻ", panchFemale:"സ്ത്രീ" },
  bn: { code:"bn", label:"বাংলা", flag:"🇮🇳", welcome:"স্বাগতম, প্রিয় ভক্ত", subtitle:"আপনার মন বলুন • দিব্য নির্দেশনা পান", seekBtn:"🙏 দিব্য নির্দেশনা খুঁজুন", chooseDeity:"— অথবা আপনার দেবতা বেছে নিন —", chooseBook:"— অথবা পবিত্র গ্রন্থ বেছে নিন —", placeholder:"আপনার সমস্যা বলুন...", thinking:"দিব্য জ্ঞান আসছে...", dailyBtn:"✨ আজকের পবিত্র ভাবনা", tabGods:"🕉️ দেবতা", tabBooks:"📚 শাস্ত্র", tabNava:"🪐 নবগ্রহ", tabPanch:"🔯 পঞ্চাঙ্গ", changeBtn:"পরিবর্তন", mantraLabel:"মন্ত্র", newChat:"+ নতুন কথোপকথন", history:"কথোপকথনের ইতিহাস", noHistory:"এখনো কথোপকথন নেই", quickPrompts:["কোন মন্ত্র জপ করব?","আপনার গল্প বলুন","আজকের নির্দেশনা","আধ্যাত্মিক অর্থ?"], panchTitle:"বৈদিক পঞ্চাঙ্গ", panchSubtitle:"ব্যক্তিগত নির্দেশনার জন্য জন্ম বিবরণ দিন", panchBtn:"🔯 আমার জন্মকুণ্ডলী দেখান", panchName:"আপনার নাম", panchDob:"জন্ম তারিখ", panchTime:"জন্ম সময় (ঐচ্ছিক)", panchPlace:"জন্মস্থান (ঐচ্ছিক)", panchGender:"লিঙ্গ", panchMale:"পুরুষ", panchFemale:"মহিলা" },
};

// ─── RASI LIST ────────────────────────────────────────────────
export interface Rasi { en: string; ta: string; symbol: string; planet: string; num: number; }
export const RASI_LIST: Rasi[] = [
  { en:"Mesha (Aries)",        ta:"மேஷம்",       symbol:"♈", planet:"Mars",    num:1 },
  { en:"Rishabha (Taurus)",    ta:"ரிஷபம்",      symbol:"♉", planet:"Venus",   num:2 },
  { en:"Mithuna (Gemini)",     ta:"மிதுனம்",     symbol:"♊", planet:"Mercury", num:3 },
  { en:"Kataka (Cancer)",      ta:"கடகம்",        symbol:"♋", planet:"Moon",    num:4 },
  { en:"Simha (Leo)",          ta:"சிம்மம்",      symbol:"♌", planet:"Sun",     num:5 },
  { en:"Kanya (Virgo)",        ta:"கன்னி",        symbol:"♍", planet:"Mercury", num:6 },
  { en:"Tula (Libra)",         ta:"துலாம்",       symbol:"♎", planet:"Venus",   num:7 },
  { en:"Vrishchika (Scorpio)", ta:"விருச்சிகம்",  symbol:"♏", planet:"Mars",    num:8 },
  { en:"Dhanu (Sagittarius)",  ta:"தனுசு",        symbol:"♐", planet:"Jupiter", num:9 },
  { en:"Makara (Capricorn)",   ta:"மகரம்",        symbol:"♑", planet:"Saturn",  num:10 },
  { en:"Kumbha (Aquarius)",    ta:"கும்பம்",      symbol:"♒", planet:"Saturn",  num:11 },
  { en:"Meena (Pisces)",       ta:"மீனம்",        symbol:"♓", planet:"Jupiter", num:12 },
];

// ─── NAKSHATRA LIST ───────────────────────────────────────────
export interface Nakshatra { en: string; ta: string; deity: string; planet: string; num: number; }
export const NAKSHATRA_LIST: Nakshatra[] = [
  { en:"Ashwini",           ta:"அஸ்வினி",         deity:"Ashwini Kumaras", planet:"Ketu",    num:1  },
  { en:"Bharani",           ta:"பரணி",             deity:"Yama",            planet:"Venus",   num:2  },
  { en:"Krittika",          ta:"கார்த்திகை",       deity:"Agni",            planet:"Sun",     num:3  },
  { en:"Rohini",            ta:"ரோகிணி",           deity:"Brahma",          planet:"Moon",    num:4  },
  { en:"Mrigashira",        ta:"மிருகசீரிடம்",     deity:"Soma",            planet:"Mars",    num:5  },
  { en:"Ardra",             ta:"திருவாதிரை",       deity:"Rudra",           planet:"Rahu",    num:6  },
  { en:"Punarvasu",         ta:"புனர்பூசம்",       deity:"Aditi",           planet:"Jupiter", num:7  },
  { en:"Pushya",            ta:"பூசம்",             deity:"Brihaspati",      planet:"Saturn",  num:8  },
  { en:"Ashlesha",          ta:"ஆயில்யம்",          deity:"Nagas",           planet:"Mercury", num:9  },
  { en:"Magha",             ta:"மகம்",              deity:"Pitrs",           planet:"Ketu",    num:10 },
  { en:"Purva Phalguni",    ta:"பூரம்",             deity:"Bhaga",           planet:"Venus",   num:11 },
  { en:"Uttara Phalguni",   ta:"உத்திரம்",         deity:"Aryaman",         planet:"Sun",     num:12 },
  { en:"Hasta",             ta:"அஸ்தம்",            deity:"Savitar",         planet:"Moon",    num:13 },
  { en:"Chitra",            ta:"சித்திரை",          deity:"Vishwakarma",     planet:"Mars",    num:14 },
  { en:"Swati",             ta:"சுவாதி",            deity:"Vayu",            planet:"Rahu",    num:15 },
  { en:"Vishakha",          ta:"விசாகம்",           deity:"Indra-Agni",      planet:"Jupiter", num:16 },
  { en:"Anuradha",          ta:"அனுஷம்",            deity:"Mitra",           planet:"Saturn",  num:17 },
  { en:"Jyeshtha",          ta:"கேட்டை",            deity:"Indra",           planet:"Mercury", num:18 },
  { en:"Mula",              ta:"மூலம்",             deity:"Nirriti",         planet:"Ketu",    num:19 },
  { en:"Purva Ashadha",     ta:"பூராடம்",           deity:"Apas",            planet:"Venus",   num:20 },
  { en:"Uttara Ashadha",    ta:"உத்திராடம்",       deity:"Vishvadevas",     planet:"Sun",     num:21 },
  { en:"Shravana",          ta:"திருவோணம்",         deity:"Vishnu",          planet:"Moon",    num:22 },
  { en:"Dhanishta",         ta:"அவிட்டம்",          deity:"Eight Vasus",     planet:"Mars",    num:23 },
  { en:"Shatabhisha",       ta:"சதயம்",             deity:"Varuna",          planet:"Rahu",    num:24 },
  { en:"Purva Bhadrapada",  ta:"பூரட்டாதி",         deity:"Aja Ekapada",     planet:"Jupiter", num:25 },
  { en:"Uttara Bhadrapada", ta:"உத்திரட்டாதி",     deity:"Ahir Budhyana",   planet:"Saturn",  num:26 },
  { en:"Revati",            ta:"ரேவதி",             deity:"Pushan",          planet:"Mercury", num:27 },
];

// ─── GODS ─────────────────────────────────────────────────────
export interface God {
  name: string; tamil: string; emoji: string; accent: string;
  bg: string; mantra: string; domain: string; forProblems: string[];
}
export const GODS: Record<string, God> = {
  krishna:   { name:"Lord Krishna",     tamil:"கிருஷ்ணன்",  emoji:"🦚", accent:"#4fc3f7", bg:"linear-gradient(135deg,#0d2137,#1a4a6b)", mantra:"Om Namo Bhagavate Vasudevaya", domain:"Love, Life Purpose, Bhakti", forProblems:["love","relationship","heartbreak","marriage","purpose","lonely","friendship"] },
  ganesha:   { name:"Lord Ganesha",     tamil:"கணேஷன்",    emoji:"🐘", accent:"#f4a261", bg:"linear-gradient(135deg,#2d1a0a,#5d3a1a)", mantra:"Om Gam Ganapataye Namaha",      domain:"New Beginnings, Obstacles, Wisdom", forProblems:["obstacle","beginning","exam","stuck","confused","new","start"] },
  lakshmi:   { name:"Goddess Lakshmi",  tamil:"லக்ஷ்மி",   emoji:"🪷", accent:"#f9c74f", bg:"linear-gradient(135deg,#1e0a1e,#4a1a4a)", mantra:"Om Shreem Mahalakshmiyei Namaha", domain:"Wealth, Career, Prosperity", forProblems:["money","wealth","business","job","career","finance","debt","income","work"] },
  muruga:    { name:"Lord Muruga",      tamil:"முருகன்",   emoji:"🌟", accent:"#56ab2f", bg:"linear-gradient(135deg,#0a1a0a,#1a3a1a)", mantra:"Om Saravana Bhava",             domain:"Courage, Victory, Tamil Devotion", forProblems:["courage","fear","enemy","victory","confidence","strength"] },
  saraswati: { name:"Goddess Saraswati",tamil:"சரஸ்வதி", emoji:"🎵", accent:"#a8d8ea", bg:"linear-gradient(135deg,#0a0a1e,#1a1a4a)", mantra:"Om Aim Saraswatyai Namaha",      domain:"Knowledge, Arts, Learning", forProblems:["study","exam","knowledge","music","art","learning","college","school","speech"] },
  shiva:     { name:"Lord Shiva",       tamil:"சிவன்",     emoji:"🌙", accent:"#c77dff", bg:"linear-gradient(135deg,#14091e,#3a1a4a)", mantra:"Om Namah Shivaya",             domain:"Liberation, Transformation, Meditation", forProblems:["grief","loss","anger","ego","addiction","transform","meditate","stress","depression"] },
  hanuman:   { name:"Lord Hanuman",     tamil:"ஆஞ்சநேயர்",emoji:"🐒", accent:"#ff6b6b", bg:"linear-gradient(135deg,#1e0a0a,#4a1a1a)", mantra:"Om Hanumate Namaha",            domain:"Health, Protection, Strength", forProblems:["health","sick","hospital","pain","surgery","body","protection","safety"] },
  durga:     { name:"Goddess Durga",    tamil:"துர்கா",    emoji:"⚔️", accent:"#ff9e00", bg:"linear-gradient(135deg,#1e1000,#4a2800)", mantra:"Om Dum Durgayei Namaha",       domain:"Protection, Power, Justice", forProblems:["injustice","abuse","evil","danger","power","women","harassment"] },
};

// ─── NAVAGRAHAS ───────────────────────────────────────────────
export interface Navagraha {
  name: string; tamil: string; emoji: string; accent: string;
  bg: string; mantra: string; domain: string;
}
export const NAVAGRAHAS: Record<string, Navagraha> = {
  surya:   { name:"Surya (Sun)",       tamil:"சூரியன்",   emoji:"☀️", accent:"#ffd60a", bg:"linear-gradient(135deg,#1e1800,#4a3a00)", mantra:"Om Suryaya Namaha",        domain:"Confidence, Father, Leadership, Government" },
  chandra: { name:"Chandra (Moon)",    tamil:"சந்திரன்",  emoji:"🌙", accent:"#c0c0ff", bg:"linear-gradient(135deg,#0a0a1e,#1e1e3a)", mantra:"Om Chandraya Namaha",      domain:"Mind, Mother, Emotions, Travel" },
  kuja:    { name:"Kuja (Mars)",       tamil:"செவ்வாய்",  emoji:"🔴", accent:"#ff4444", bg:"linear-gradient(135deg,#1e0000,#3a0000)", mantra:"Om Kujaya Namaha",         domain:"Courage, Property, Siblings, Energy" },
  budha:   { name:"Budha (Mercury)",   tamil:"புதன்",     emoji:"💚", accent:"#00cc88", bg:"linear-gradient(135deg,#001e10,#003a20)", mantra:"Om Budhaya Namaha",        domain:"Intelligence, Communication, Business" },
  guru:    { name:"Guru (Jupiter)",    tamil:"குரு",      emoji:"🟡", accent:"#ffcc00", bg:"linear-gradient(135deg,#1e1a00,#3a3200)", mantra:"Om Gurave Namaha",         domain:"Wisdom, Teacher, Wealth, Marriage" },
  shukra:  { name:"Shukra (Venus)",    tamil:"சுக்கிரன்", emoji:"🩷", accent:"#ff88cc", bg:"linear-gradient(135deg,#1e001a,#3a0030)", mantra:"Om Shukraya Namaha",       domain:"Love, Beauty, Luxury, Arts" },
  shani:   { name:"Shani (Saturn)",    tamil:"சனி",       emoji:"🪐", accent:"#8888ff", bg:"linear-gradient(135deg,#0a0a1e,#10103a)", mantra:"Om Shanaischaraya Namaha", domain:"Karma, Discipline, Delays, Justice" },
  rahu:    { name:"Rahu (North Node)", tamil:"ராகு",      emoji:"🌑", accent:"#aa88ff", bg:"linear-gradient(135deg,#0a001e,#18003a)", mantra:"Om Rahave Namaha",         domain:"Ambition, Foreign, Illusion, Sudden Events" },
  ketu:    { name:"Ketu (South Node)", tamil:"கேது",      emoji:"☁️", accent:"#88ffaa", bg:"linear-gradient(135deg,#001e0a,#003a18)", mantra:"Om Ketave Namaha",         domain:"Spirituality, Liberation, Past Life" },
};

// ─── BOOKS ────────────────────────────────────────────────────
export interface Book {
  name: string; tamil: string; emoji: string; accent: string;
  bg: string; desc: string; systemPrompt: string;
}
export const BOOKS: Record<string, Book> = {
  gita:        { name:"Bhagavad Gita",  tamil:"பகவத் கீதை",  emoji:"📖", accent:"#f9c74f", bg:"linear-gradient(135deg,#1a1200,#3a2800)", desc:"18 Chapters • Krishna's teachings on duty, life & liberation", systemPrompt:`You are a living embodiment of the Bhagavad Gita. When a devotee shares a problem: 1) Empathize warmly, 2) Give clear practical guidance, 3) ALWAYS end with an exact shloka and:\n📖 Bhagavad Gita — Chapter [X], Verse [Y]` },
  mahabharata: { name:"Mahabharata",    tamil:"மகாபாரதம்",   emoji:"⚔️", accent:"#ff8c42", bg:"linear-gradient(135deg,#1e0800,#3a1800)", desc:"Epic of Dharma • Stories of duty, war, wisdom & human complexity", systemPrompt:`You are a wise narrator of the Mahabharata. Find a parallel story or lesson. ALWAYS end with:\n📚 Mahabharata — [Parva Name], Chapter [X]` },
  rigveda:     { name:"Rig Veda",       tamil:"ரிக் வேதம்",   emoji:"🔥", accent:"#e63946", bg:"linear-gradient(135deg,#1e0000,#3a0a0a)", desc:"Oldest Veda • 1028 hymns • Cosmic truths, creation & prayers", systemPrompt:`You are a Rig Veda scholar. Connect question to cosmic truth. ALWAYS end with:\n🔥 Rig Veda — Mandala [X], Sukta [Y], Verse [Z]` },
  samaveda:    { name:"Sama Veda",      tamil:"சாம வேதம்",    emoji:"🎶", accent:"#ff6fd8", bg:"linear-gradient(135deg,#1e0018,#3a0030)", desc:"Veda of Melodies • 1875 verses • Sacred chants, music & worship", systemPrompt:`You are a Sama Veda chanter-scholar. Connect to sacred music and chanting wisdom. ALWAYS end with:\n🎶 Sama Veda — [Purvarchika/Uttararchika], Chapter [X], Verse [Y]` },
  yajurveda:   { name:"Yajur Veda",     tamil:"யஜுர் வேதம்",  emoji:"🪔", accent:"#ffa040", bg:"linear-gradient(135deg,#1e0e00,#3a1e00)", desc:"Veda of Rituals • Sacred duties, sacrificial formulas & right action", systemPrompt:`You are a Yajur Veda priest-scholar. Connect to duty and correct action. ALWAYS end with:\n🪔 Yajur Veda — Chapter [X], Verse [Y] (Shukla/Krishna Yajurveda)` },
  atharvaveda: { name:"Atharva Veda",   tamil:"அதர்வண வேதம்", emoji:"🌿", accent:"#50fa7b", bg:"linear-gradient(135deg,#001e08,#003a14)", desc:"Veda of Daily Life • Healing, protection, household & earthly wisdom", systemPrompt:`You are an Atharva Veda scholar. Share practical healing and protection wisdom. ALWAYS end with:\n🌿 Atharva Veda — Kanda [X], Sukta [Y], Verse [Z]` },
  thirukkural: { name:"Thirukkural",    tamil:"திருக்குறள்",  emoji:"🌺", accent:"#06d6a0", bg:"linear-gradient(135deg,#001e14,#003828)", desc:"Tamil classic • 1330 couplets • Ethics, Love & Statecraft", systemPrompt:`You are a Tamil Thirukkural scholar. Give Kural wisdom with Tamil text + meaning. ALWAYS end with:\n🌺 Thirukkural — Chapter: [Name], Kural #[Number]` },
  ramayana:    { name:"Ramayana",       tamil:"இராமாயணம்",   emoji:"🏹", accent:"#f8961e", bg:"linear-gradient(135deg,#1e0f00,#3a1e00)", desc:"Epic of Rama • Duty, Devotion, Ideal life & Victory of good", systemPrompt:`You are a Ramayana narrator. Find parallel characters/stories. ALWAYS end with:\n🏹 Ramayana — [Kanda] Kanda, Sarga [X]` },
};

// ─── PANCHANGAM PROMPT ────────────────────────────────────────
export const PANCHANGAM_PROMPT = `You are an expert Vedic astrologer with deep knowledge of both Tamil Panchangam and North Indian Panchang systems. When given a person's birth details, you MUST provide a comprehensive reading structured EXACTLY as follows (use the section headers):

**🌟 COSMIC PROFILE**
Name, Rasi (Moon Sign), Nakshatra (Birth Star), Lagna (Ascendant if time given), Tithi

**🎨 LUCKY ELEMENTS**
Lucky Colors (with explanation), Lucky Numbers, Lucky Days, Lucky Gemstone, Lucky Metal

**🛕 TEMPLES TO VISIT**
List 3-5 specific temples strongly recommended for this person based on their Rasi/Nakshatra. Include temple name, location (city/state), presiding deity, and WHY this temple is ideal for them.

**⭐ NAKSHATRA GUIDANCE**
Full meaning of their birth star, its ruling deity, its ruling planet, character traits, strengths, challenges

**💼 CAREER & SUCCESS PATH**
Best career fields, success direction (Vastu), auspicious years, what actions lead to success

**💕 RELATIONSHIPS & LOVE**
Compatible Rasis for marriage/friendship, relationship advice based on their chart

**📿 DAILY SPIRITUAL PRACTICE**
Morning rituals, specific mantras to chant daily, fasting day recommendation, deity to worship

**⚠️ REMEDIES & DOSHAS**
Any doshas to be aware of, specific remedies (puja, donation, mantra, gemstone)

**🌅 LIFE PURPOSE (DHARMA)**
Their life purpose based on Vedic astrology, what they came to achieve in this birth

Be specific, warm, and authentic. Reference actual Vedic/Jyotisha principles. Respond in the user's selected language.`;

// ─── PARTICLES ────────────────────────────────────────────────
export const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  dur: Math.random() * 4 + 3,
  delay: Math.random() * 4,
}));
