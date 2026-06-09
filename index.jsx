import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// ─── THEME & DATA ──────────────────────────────────────────────────────────────
const C = {
  primary: "#1a5276", primaryDark: "#154360", primaryLight: "#2980b9",
  accent: "#e67e22", accentDark: "#ca6f1e", green: "#1e8449",
  red: "#c0392b", white: "#fff", lightBg: "#f4f6f8", border: "#dde3ea",
  textDark: "#1a1a2e", textGray: "#5d6d7e", textLight: "#8d9ba8",
};

const NAV_ITEMS = [
  { label: "गृहपृष्ठ", path: "/" },
  { label: "हाम्रो बारेमा", children: [
    { label: "पृष्ठभुमी", path: "/about/background" },
    { label: "परिकल्पना", path: "/about/vision" },
    { label: "ध्येय", path: "/about/mission" },
    { label: "लक्ष्य", path: "/about/goals" },
    { label: "उद्देश्य", path: "/about/objectives" },
    { label: "आबद्धता", path: "/about/joining" },
  ]},
  { label: "मानवीय श्रोत", children: [
    { label: "संचालक समिति", path: "/hr/bod" },
    { label: "लेखा सुपरिवेक्षण समिति", path: "/hr/audit" },
    { label: "सल्लाहकार मण्डल", path: "/hr/advisory" },
    { label: "ऋण उपसमिति", path: "/hr/loan-committee" },
    { label: "सम्पति खरिद उपसमिति", path: "/hr/assets-committee" },
    { label: "प्रशासन व्यवस्थापन समूह", path: "/hr/management" },
    { label: "सेवाकेन्द्रहरु", path: "/branches" },
  ]},
  { label: "हाम्रा सेवाहरु", children: [
    { label: "बचत सेवा", path: "/services/saving" },
    { label: "ऋण सेवा", path: "/services/loan" },
    { label: "अन्य सदस्य सेवा", path: "/services/other" },
    { label: "सदस्य सम्मान कार्यक्रम", path: "/services/honor" },
    { label: "सामाजिक सेवा", path: "/services/social" },
  ]},
  { label: "प्रतिवेदन", children: [
    { label: "पर्ल्स प्रतिवेदन", path: "/reports/perls" },
    { label: "मासिक प्रतिवेदन", path: "/reports/monthly" },
    { label: "वाषिर्क प्रतिवेदन", path: "/reports/yearly" },
  ]},
  { label: "संस्थागत सम्मानहरु", path: "/awards" },
  { label: "सफलताका कथा", path: "/success-stories" },
  { label: "शेयर सदस्यता", path: "/membership" },
  { label: "क्यालेण्डर", path: "/calendar" },
  { label: "फोटो फिचर", path: "/gallery" },
  { label: "News", path: "/news" },
];

const BRANCHES = [
  { name: "Kotihawa Service Center", location: "Kotihawa", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80", phone: "071-514010", head: "Devendra Bahadur Basnet" },
  { name: "Pahuch Service Center", location: "Bhairahawa", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", phone: "071-520015", head: "Radha Devi Khatiwada" },
  { name: "Manigram Service Center", location: "Manigram", img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80", phone: "071-560022", head: "Keshav Prasad Timilsina" },
  { name: "Sudridh Service Center", location: "Manpakadi", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80", phone: "071-530018", head: "Manju Devi Gautam" },
  { name: "Pataksar Service Center", location: "Thutipipal", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80", phone: "071-541030", head: "Tika Ram Poudel" },
  { name: "Lumbini Service Center", location: "Lumbini Bajar", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&q=80", phone: "071-580044", head: "Savitri Kumari Rai" },
  { name: "Rudrapur Service Center", location: "Thakalichok", img: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=400&q=80", phone: "071-592060", head: "Nabin Kumar Upadhyay" },
  { name: "Butwal Service Center", location: "Butwal", img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80", phone: "071-440055", head: "Jeevan Lal Vaidya" },
  { name: "Tamnagar Service Center", location: "Tamanagar", img: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=400&q=80", phone: "071-507070", head: "Sushila Kumari Malla" },
  { name: "Murgiya Service Center", location: "Murgiya", img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80", phone: "071-519088", head: "Pushpa Raj Regmi" },
];

const NEWS_LIST = [
  { id: 1, title: "नया वर्ष नया कक्षामा सहकारीको कपि उपहार", date: "वैशाख ५, २०८२", category: "शिक्षा", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", body: "सहकारी बचत तथा ऋण सहकारी संस्थाले नया शैक्षिक वर्षको अवसर पारेर आफ्ना बालबालिका सदस्यहरुलाई कपि उपहार वितरण गर्यो। यो कार्यक्रम संस्थाको सामाजिक उत्तरदायित्वको हिस्साको रुपमा आयोजना गरिएको थियो।" },
  { id: 2, title: "सहकारी छात्रवृत्ती २०८२ सम्बन्धि सूचना", date: "मंसिर १०, २०८२", category: "छात्रवृत्ती", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", body: "सहकारी सहकारीले वार्षिक छात्रवृत्ती कार्यक्रम २०८२ को लागि आवेदन खुला गरेको छ। प्लस टु र ब्याचलर तहमा अध्ययनरत सदस्यका सन्तानहरुले मंसिर २० गतेभित्र निकटतम सेवाकेन्द्रमा आवेदन दिन सक्नेछन्।" },
  { id: 3, title: "कर्मचारीहरुको सदस्य सेवा क्षमता अभिवृद्धि तालिम", date: "असोज २०, २०८२", category: "तालिम", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", body: "सहकारी सहकारीले आफ्ना सबै सेवाकेन्द्रका कर्मचारीहरुको लागि सदस्य सेवा क्षमता अभिवृद्धि तालिम आयोजना गर्यो। तालिममा सदस्यसँगको व्यवहार, वित्तीय साक्षरता र डिजिटल सेवाहरुको प्रयोगबारे जानकारी दिइयो।" },
  { id: 4, title: "वार्षिक साधारण सभा सफलतापूर्वक सम्पन्न", date: "पौष १२, २०८२", category: "सभा", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", body: "सहकारी सहकारीको वार्षिक साधारण सभा पौष १२ गते कोटिहावा मुख्य कार्यालयमा सफलतापूर्वक सम्पन्न भयो। सभामा आर्थिक वर्षको प्रगति प्रतिवेदन, लेखापरीक्षण प्रतिवेदन र आगामी वर्षको कार्ययोजना प्रस्तुत गरियो।" },
  { id: 5, title: "मोबाइल बैंकिङ सेवा विस्तार गरियो", date: "भाद्र ८, २०८२", category: "सेवा", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80", body: "सहकारी सहकारीले आफ्नो मोबाइल बैंकिङ एपमा नया सुविधाहरु थपेको छ। अब सदस्यहरुले घरबाटै बचत, ऋण तिर्नु र खाता विवरण हेर्न सक्नेछन्।" },
  { id: 6, title: "स्वास्थ्य शिविर कार्यक्रम आयोजना", date: "जेठ १५, २०८२", category: "स्वास्थ्य", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", body: "सहकारी सहकारीले स्थानीय अस्पतालको सहकार्यमा निःशुल्क स्वास्थ्य शिविर आयोजना गर्यो। शिविरमा ५०० भन्दा बढि सदस्यहरुले निःशुल्क स्वास्थ्य जाँच गराए।" },
];

const SUCCESS_STORIES = [
  { name: "शान्ता देवी न्यौपाने", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80", location: "कोटिहावा", story: "सहकारी सहकारीको ऋण सेवा लिएर मैले साना किराना पसल खोलें। अहिले मेरो व्यापार राम्रो भएको छ र परिवारको जीवनस्तर उकासिएको छ।", loan: "रू ३ लाख" },
  { name: "सुधीर बहादुर थापा", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", location: "भैरहवा", story: "संस्थाबाट ऋण लिएर पोल्ट्री फार्म स्थापना गरें। आज मेरो फार्मबाट महिनाको राम्रो आम्दानी भइरहेको छ।", loan: "रू ७ लाख" },
  { name: "लक्ष्मी देवी भण्डारी", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80", location: "मणिग्राम", story: "नियमित बचत गरेर सन्तानको शिक्षामा लगानी गर्न सकें। सहकारी सहकारी मेरो परिवारको विश्वस्त साथी हो।", loan: "रू ५ लाख" },
  { name: "नवीन कुमार उपाध्याय", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80", location: "बुटवल", story: "संस्थाको सहयोगले छोटो समयमै आफ्नो घर निर्माण गर्न सफल भएँ। सहकारीको सेवा अत्यन्त सजिलो र भरपर्दो छ।", loan: "रू १५ लाख" },
];

const AWARDS = [
  { title: "उत्कृष्ट सहकारी पुरस्कार २०८०", org: "राष्ट्रिय सहकारी महासंघ", year: "२०८०", img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80" },
  { title: "सामाजिक उत्तरदायित्व पुरस्कार", org: "रुपन्देही जिल्ला सहकारी संघ", year: "२०७९", img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80" },
  { title: "डिजिटल सहकारी उत्कृष्टता पुरस्कार", org: "नेपाल सरकार, सहकारी विभाग", year: "२०७८", img: "https://images.unsplash.com/photo-1559523161-0fc0d8b814b4?w=400&q=80" },
  { title: "सदस्य सेवा श्रेष्ठता पुरस्कार", org: "लुम्बिनी प्रदेश सहकारी महासंघ", year: "२०७७", img: "https://images.unsplash.com/photo-1548504769-900b70ed122e?w=400&q=80" },
];

const BOD = [
  { name: "अर्जुन बहादुर क्षेत्री", role: "का.व. अध्यक्ष", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  { name: "विमला देवी शर्मा", role: "उपाध्यक्ष", img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=200&q=80" },
  { name: "प्रकाश चन्द्र भट्ट", role: "कोषाध्यक्ष", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "सावित्री कुमारी राई", role: "सचिव", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { name: "टीका राम पौडेल", role: "सदस्य", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
  { name: "पार्वती देवी अधिकारी", role: "सदस्य", img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80" },
  { name: "राजेश कुमार सिंह", role: "सदस्य", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80" },
];

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80",
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500&q=80",
  "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&q=80",
  "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=500&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&q=80",
  "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=500&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&q=80",
  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=500&q=80",
];

const SLIDES = [
  { badge: "बचत सेवा", title: "आफ्नो सपना पुरा गर्नुस्\nसहकारी संगै", sub: "सुरक्षित बचत, सहज ऋण — तपाईंको समृद्धिको साथी", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80" },
  { badge: "ऋण सेवा", title: "सजिलो ऋण सेवा\nकम ब्याजदरमा", sub: "विनाधितो रू ५ लाख र धितो राखी रू ५० लाख सम्म ऋण", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80" },
  { badge: "सदस्यता", title: "हाम्रो परिवारको\nसदस्य बन्नुहोस्", sub: "रू २,०००/- मात्रमा सदस्यता लिनुहोस् र सुविधाहरु उपभोग गर्नुहोस्", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&q=80" },
  { badge: "सामाजिक सेवा", title: "समुदायको लागि\nहामी प्रतिबद्ध छौं", sub: "छात्रवृत्ती, स्वास्थ्य शिविर र सामाजिक कार्यक्रमहरुमा सहभागी हुनुहोस्", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=80" },
];

const FAQS = [
  { q: "सदस्यता लिनको लागि के गर्नु पर्छ?", a: "सहकारी साकोसको नया शेयर सदस्य लिनको लागि आफ्नो र हकवालाको ओरिजीनल नागरिकता र पासपोर्ट साइजको फोटो १/१ प्रति लिएर नजिकको कार्यालयमा सर्म्पर्क राख्न सक्नुहुनेछ । नया सदस्य बन्दा शेयर रु. १०००।- र बचत रु. १०००।- गरि जम्मा रु. २०००।- मात्र लाग्नेछ ।" },
  { q: "सहकारी साकोसको बारेमा थप कुरा जान्नलाई के गर्ने?", a: "सहकारी साकोसको बारेमा थप कुरा जान्न परेमा कार्यालय समयमा ९८०२६५२७१९ मा मिसकल गर्नुहोस् । त्यस पश्चात अर्को नम्बरबाट यहाँलाई कल ब्याक आउनेछ ।" },
  { q: "मोबाइल बैंकिङ एप लिनको लागि के गर्ने?", a: "कार्यालयमा आफै उपस्थित भएर मोबाइल बैंकिङ एपको लागि आवेदन फारम भर्नु पर्नेछ र कुनै पनि चालु किसिमको बचत खातामा न्यूनतम मौजदात भन्दा बढि रकम राखेर मोबाइल बैंकिङ एप लिन सकिनेछ ।" },
  { q: "सहकारी साकोसबाट ऋण लिनको लागि के गर्ने?", a: "सदस्य बनेको ३ महिना पुगेका शेयर सदस्यले नियमित मासिक बचत कम्तिमा रु. ५,०००।- र शेयर कम्तिमा १०,०००।- पुरा गरेपछि नियमित मासिक बचतको ५ गुणा सम्म विनाधितो ऋण माग गर्न सकिनेछ । विनाधितो अधिकतम ५ लाख र धितो राखेर बढिमा ५० लाख सम्म ऋण माग गर्न सकिनेछ ।" },
  { q: "धितो राखेर लिने ऋणको लागि के गर्ने?", a: "धितोको लालपुर्जा, चौकिल्ला प्रमाणित, तिरो तिरेको रसिद, नापी नक्सा, राष्ट्रिय परिचय पत्र, पान दर्ता प्रमाणपत्र लिएर कार्यालयमा सर्म्पर्क राखेर ऋण माग दर्ता गर्न सकिनेछ ।" },
  { q: "छात्रवृत्ती प्राप्त गर्नको लागि के गर्ने?", a: "हरेक वर्षको पौष महिनाको पहिलो शनिबारमा प्लस टु वा ब्याचलर अध्ययन गर्ने विद्यार्थीहरुलाई ५/५ हजार छात्रवृत्ती दिइन्छ । मंसिर २० गतेभित्र नजिकको कार्यालयमा विद्यालयको सिफारिस सहित आवेदन दिनुहोस् ।" },
  { q: "सहकारी सहकारीमा कर्मचारी बन्नको लागि के गर्ने?", a: "शेयर सदस्यका सन्तानहरुले आफ्नो बायो डाटा र सर्टिफिकेटहरु कार्यालयमा पेश गर्नु पर्नेछ । छनौट भएकाहरुलाई ३ महिना स्वयम सेवकको रुपमा र पछि ६ महिना प्रशिक्षणार्थीको रुपमा खटाइनेछ ।" },
  { q: "तीर्थ यात्रा जानको लागि के गर्ने?", a: "५० वर्ष कटेका जेष्ठ तथा एकल महिला वा पुरुष शेयर सदस्यहरुलाई हरेक ३ वर्षमा तीर्थ यात्रा लाइन्छ । कार्तिक २० गतेभित्र रु. ५००।- दर्ता शुल्क तिरेर नाम टिपाउनु पर्नेछ ।" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const gStyles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Hind Siliguri','Poppins',sans-serif;color:#1a1a2e;background:#fff;overflow-x:hidden}
a{text-decoration:none;color:inherit}
img{max-width:100%}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:#f1f1f1}
::-webkit-scrollbar-thumb{background:#2980b9;border-radius:3px}

/* TOP BAR */
.topbar{background:#154360;color:rgba(255,255,255,0.85);font-size:13px;padding:6px 0;border-bottom:2px solid #e67e22}
.topbar .wrap{max-width:1200px;margin:0 auto;padding:0 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px}
.topbar-left{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.topbar-left span{display:flex;align-items:center;gap:6px}
.icon-accent{color:#e67e22}
.social-row{display:flex;align-items:center;gap:8px}
.social-row span{margin-right:4px}
.soc-btn{width:28px;height:28px;background:rgba(255,255,255,0.12);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;transition:.25s;cursor:pointer}
.soc-btn:hover{background:#e67e22;color:#fff}

/* HEADER */
.hdr{background:#fff;padding:12px 0;box-shadow:0 2px 12px rgba(0,0,0,0.07);position:sticky;top:0;z-index:1000}
.hdr .wrap{max-width:1200px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo-area{display:flex;align-items:center;gap:14px;cursor:pointer}
.logo-icon{width:68px;height:68px;background:linear-gradient(135deg,#1a5276,#2980b9);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;box-shadow:0 4px 14px rgba(26,82,118,.35);flex-shrink:0}
.logo-text h1{font-size:21px;font-weight:700;color:#1a5276;line-height:1.2}
.logo-text p{font-size:12px;color:#5d6d7e;margin-top:2px}
.logo-text em{font-size:11px;background:#e67e22;color:#fff;padding:1px 7px;border-radius:20px;font-style:normal}
.ticker-wrap{flex:1;overflow:hidden;background:#f4f6f8;border-radius:6px;border:1px solid #dde3ea;padding:7px 14px;display:flex;align-items:center;gap:10px;max-width:480px}
.ticker-label{background:#c0392b;color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;white-space:nowrap;flex-shrink:0}
.ticker-inner{display:inline-block;animation:ticker 28s linear infinite;font-size:13px;color:#5d6d7e;white-space:nowrap}
@keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-180%)}}

/* NAVBAR */
.navbar{background:#1a5276;position:relative;z-index:999}
.navbar .wrap{max-width:1200px;margin:0 auto;padding:0 20px;display:flex;align-items:center;position:relative}
.nav-toggle{display:none;background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:12px 0}
.nav-menu{display:flex;list-style:none;flex-wrap:wrap}
.nav-item{position:relative}
.nav-link{display:block;padding:13px 13px;color:rgba(255,255,255,.9);font-size:13px;font-weight:500;white-space:nowrap;transition:.25s;border-bottom:3px solid transparent;cursor:pointer}
.nav-link:hover,.nav-link.active{color:#fff;background:rgba(255,255,255,.1);border-bottom-color:#e67e22}
.dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;min-width:230px;box-shadow:0 8px 30px rgba(0,0,0,.15);border-top:3px solid #e67e22;border-radius:0 0 8px 8px;z-index:1000}
.nav-item:hover .dropdown{display:block}
.dropdown-item{display:block;padding:10px 18px;font-size:13px;color:#1a1a2e;border-bottom:1px solid #dde3ea;transition:.2s;cursor:pointer}
.dropdown-item:last-child{border-bottom:none}
.dropdown-item:hover{background:#f4f6f8;color:#1a5276;padding-left:24px}

/* HERO SLIDER */
.slider-wrap{position:relative;overflow:hidden;background:#0a1628}
.slider-track{display:flex;transition:transform .7s cubic-bezier(.77,0,.175,1)}
.slide{min-width:100%;height:480px;background-size:cover;background-position:center;position:relative;flex-shrink:0}
.slide::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.65),rgba(26,82,118,.35))}
.slide-content{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:60px 80px;max-width:680px}
.slide-badge{background:#e67e22;color:#fff;font-size:12px;font-weight:600;padding:4px 14px;border-radius:20px;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px}
.slide-title{font-size:38px;font-weight:700;color:#fff;line-height:1.25;margin-bottom:14px;white-space:pre-line;text-shadow:0 2px 10px rgba(0,0,0,.3)}
.slide-sub{font-size:16px;color:rgba(255,255,255,.85);margin-bottom:26px;line-height:1.6}
.slide-btn{background:#e67e22;color:#fff;padding:11px 28px;border-radius:6px;font-size:14px;font-weight:600;display:inline-block;transition:.25s;box-shadow:0 4px 14px rgba(230,126,34,.4);cursor:pointer}
.slide-btn:hover{background:#ca6f1e;transform:translateY(-2px)}
.s-arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.3);color:#fff;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;z-index:10;transition:.25s;backdrop-filter:blur(4px)}
.s-arrow:hover{background:#e67e22;border-color:#e67e22}
.s-arrow.prev{left:18px}
.s-arrow.next{right:18px}
.s-dots{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}
.s-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4);cursor:pointer;transition:.25s;border:2px solid transparent}
.s-dot.on{background:#e67e22;border-color:#fff;transform:scale(1.2)}

/* STATS BAR */
.stats-bar{background:linear-gradient(135deg,#1a5276,#154360);padding:20px 0}
.stats-grid{max-width:1200px;margin:0 auto;padding:0 20px;display:grid;grid-template-columns:repeat(4,1fr)}
.stat-item{text-align:center;padding:12px 20px;border-right:1px solid rgba(255,255,255,.15)}
.stat-item:last-child{border-right:none}
.stat-num{font-size:28px;font-weight:700;color:#e67e22;line-height:1}
.stat-lbl{font-size:13px;color:rgba(255,255,255,.8);margin-top:4px}

/* SECTION */
.section{padding:60px 0}
.section-alt{background:#f4f6f8}
.wrap{max-width:1200px;margin:0 auto;padding:0 20px}
.sec-hdr{text-align:center;margin-bottom:40px}
.sec-hdr h2{font-size:26px;font-weight:700;color:#1a5276;position:relative;display:inline-block;padding-bottom:14px}
.sec-hdr h2::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:55px;height:3px;background:#e67e22;border-radius:2px}
.sec-hdr p{color:#5d6d7e;margin-top:12px;font-size:15px}
.view-all-btn{display:inline-block;margin-top:12px;background:#1a5276;color:#fff;padding:8px 22px;border-radius:5px;font-size:13px;font-weight:500;transition:.25s;cursor:pointer}
.view-all-btn:hover{background:#154360}

/* WELCOME */
.welcome-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.welcome-text h2{font-size:28px;font-weight:700;color:#1a5276;margin-bottom:18px;padding-left:18px;border-left:4px solid #e67e22}
.welcome-text p{line-height:1.9;color:#5d6d7e;font-size:15px;margin-bottom:12px}
.sig strong{font-size:16px;color:#1a5276;display:block;margin-top:16px}
.sig span{font-size:13px;color:#5d6d7e}
.readmore-btn{display:inline-flex;align-items:center;gap:8px;background:#1a5276;color:#fff;padding:10px 24px;border-radius:6px;margin-top:18px;font-size:14px;font-weight:500;transition:.25s;cursor:pointer}
.readmore-btn:hover{background:#154360;gap:14px}
.welcome-img-wrap{border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.14);position:relative}
.welcome-img-wrap img{width:100%;height:360px;object-fit:cover;display:block}
.img-badge{position:absolute;bottom:18px;left:18px;background:#e67e22;color:#fff;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,.2)}

/* SERVICES */
.srv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.srv-card{background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;transition:.3s;border:1px solid #dde3ea;cursor:pointer}
.srv-card:hover{transform:translateY(-6px);box-shadow:0 8px 30px rgba(0,0,0,.14)}
.srv-img{position:relative;overflow:hidden;height:170px}
.srv-img img{width:100%;height:100%;object-fit:cover;transition:.4s}
.srv-card:hover .srv-img img{transform:scale(1.06)}
.srv-icon{position:absolute;bottom:-16px;right:16px;width:42px;height:42px;border-radius:50%;background:#e67e22;color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(230,126,34,.4)}
.srv-body{padding:24px 16px 16px}
.srv-body h3{font-size:15px;font-weight:600;color:#1a5276;margin-bottom:8px}
.srv-body p{font-size:13px;color:#5d6d7e;line-height:1.7;margin-bottom:12px}
.srv-link{font-size:13px;color:#e67e22;font-weight:600;display:inline-flex;align-items:center;gap:6px;transition:.2s}
.srv-link:hover{gap:10px}

/* NEWS */
.news-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.news-card{background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea;transition:.3s;cursor:pointer;display:flex;flex-direction:column}
.news-card:hover{transform:translateY(-5px);box-shadow:0 8px 30px rgba(0,0,0,.14)}
.news-card-img{height:190px;overflow:hidden}
.news-card-img img{width:100%;height:100%;object-fit:cover;transition:.4s}
.news-card:hover .news-card-img img{transform:scale(1.05)}
.news-body{padding:18px;flex:1;display:flex;flex-direction:column}
.news-meta{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.news-cat{background:#1a5276;color:#fff;font-size:11px;padding:2px 10px;border-radius:20px}
.news-date{font-size:12px;color:#8d9ba8}
.news-body h3{font-size:14px;font-weight:600;line-height:1.5;flex:1}
.read-link{display:inline-flex;align-items:center;gap:6px;color:#e67e22;font-size:13px;font-weight:600;margin-top:12px;transition:.2s}
.read-link:hover{gap:10px}

/* BRANCHES */
.br-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.br-card{background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea;text-align:center;transition:.3s;cursor:pointer}
.br-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,.14);border-color:#1a5276}
.br-card img{width:100%;height:110px;object-fit:cover}
.br-info{padding:10px 8px}
.br-info h4{font-size:12px;font-weight:600;color:#1a5276;line-height:1.4;margin-bottom:3px}
.br-info span{font-size:11px;color:#8d9ba8}

/* FAQ */
.faq-wrap{max-width:880px;margin:0 auto}
.faq-item{border:1px solid #dde3ea;border-radius:8px;margin-bottom:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.faq-q{width:100%;background:#fff;border:none;cursor:pointer;padding:16px 20px;text-align:left;display:flex;align-items:center;justify-content:space-between;font-size:14.5px;font-weight:600;color:#1a5276;font-family:inherit;transition:.25s}
.faq-q:hover{background:#f4f6f8}
.faq-q.open{background:#1a5276;color:#fff}
.faq-q .faq-icon{font-size:14px;transition:.25s;flex-shrink:0;margin-left:10px}
.faq-q.open .faq-icon{transform:rotate(45deg)}
.faq-a{padding:16px 20px;background:#fafcff;font-size:14px;color:#5d6d7e;line-height:1.85;border-top:1px solid #dde3ea}

/* MESSAGES */
.msg-grid{display:grid;grid-template-columns:1fr 1fr;gap:36px}
.msg-card{background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea}
.msg-hdr{background:linear-gradient(135deg,#1a5276,#2980b9);padding:22px 26px;display:flex;align-items:center;gap:16px}
.msg-avatar{width:76px;height:76px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.5);flex-shrink:0}
.msg-person h3{color:#fff;font-size:17px;font-weight:600}
.msg-person span{color:rgba(255,255,255,.8);font-size:13px}
.msg-body{padding:22px 26px;font-size:14px;color:#5d6d7e;line-height:1.9}
.quote-mark{font-size:56px;line-height:1;color:#e67e22;opacity:.22;font-family:Georgia,serif;float:left;margin-right:6px;margin-top:-6px}

/* GALLERY */
.gallery-strip{display:flex;gap:10px;overflow-x:auto;padding:8px 0;scrollbar-width:thin}
.gallery-strip img{height:175px;width:240px;object-fit:cover;border-radius:8px;flex-shrink:0;transition:.3s;cursor:pointer}
.gallery-strip img:hover{transform:scale(1.04);box-shadow:0 8px 30px rgba(0,0,0,.14)}
.gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.gallery-grid img{width:100%;height:200px;object-fit:cover;border-radius:8px;cursor:pointer;transition:.3s}
.gallery-grid img:hover{transform:scale(1.04);box-shadow:0 8px 30px rgba(0,0,0,.14)}

/* POPUP */
.popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.popup-box{background:#fff;border-radius:12px;overflow:hidden;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:popIn .35s cubic-bezier(.34,1.56,.64,1)}
@keyframes popIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
.popup-hdr{background:#1a5276;color:#fff;padding:14px 22px;display:flex;align-items:center;justify-content:space-between}
.popup-hdr h4{font-size:15px;font-weight:600}
.popup-close{background:rgba(255,255,255,.2);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:.2s}
.popup-close:hover{background:#c0392b}
.popup-img{width:100%;height:240px;object-fit:cover}
.popup-body{padding:18px 22px}
.popup-body h3{font-size:15px;font-weight:600;color:#1a5276;margin-bottom:7px}
.popup-body p{font-size:13px;color:#5d6d7e;line-height:1.7}
.popup-body .popup-btn{display:inline-block;margin-top:12px;background:#1a5276;color:#fff;padding:8px 18px;border-radius:5px;font-size:13px;transition:.2s;cursor:pointer}
.popup-body .popup-btn:hover{background:#154360}

/* FOOTER */
.footer{background:#154360;color:rgba(255,255,255,.85)}
.footer-top{padding:48px 0 28px}
.footer-grid{display:grid;grid-template-columns:2fr 1.2fr 1.2fr 1.5fr;gap:38px}
.f-brand h3{font-size:17px;font-weight:700;color:#fff;margin-bottom:8px}
.f-brand p{font-size:13px;line-height:1.8;color:rgba(255,255,255,.7)}
.f-contact{margin-top:14px;display:flex;flex-direction:column;gap:8px}
.f-contact span{display:flex;align-items:center;gap:10px;font-size:13px}
.f-contact i{color:#e67e22;width:16px}
.f-col h4{font-size:14px;font-weight:600;color:#fff;margin-bottom:14px;padding-bottom:9px;border-bottom:2px solid #e67e22}
.f-col ul{list-style:none;display:flex;flex-direction:column;gap:7px}
.f-col ul li a{font-size:13px;color:rgba(255,255,255,.7);transition:.2s;display:flex;align-items:center;gap:7px;cursor:pointer}
.f-col ul li a::before{content:'›';color:#e67e22;font-size:16px}
.f-col ul li a:hover{color:#fff;padding-left:5px}
.f-socials{display:flex;gap:9px;margin-top:14px}
.f-soc{width:35px;height:35px;background:rgba(255,255,255,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.8);font-size:14px;transition:.25s;cursor:pointer}
.f-soc:hover{background:#e67e22;color:#fff;transform:translateY(-3px)}
.footer-bottom{background:rgba(0,0,0,.2);padding:14px 0;text-align:center;font-size:13px;color:rgba(255,255,255,.5);border-top:1px solid rgba(255,255,255,.07)}
.footer-bottom a{color:#e67e22}

/* PAGE BANNER */
.page-banner{background:linear-gradient(135deg,#1a5276,#154360);padding:44px 0;position:relative;overflow:hidden}
.page-banner::before{content:'';position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=40') center/cover;opacity:.08}
.page-banner .wrap{position:relative;z-index:1}
.page-banner h1{font-size:30px;font-weight:700;color:#fff}
.page-banner .breadcrumb{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:13px;color:rgba(255,255,255,.7)}
.page-banner .breadcrumb .sep{color:#e67e22}
.page-banner .breadcrumb .cur{color:#e67e22}

/* CONTENT PAGE */
.content-box{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);padding:36px 40px;line-height:1.9;color:#5d6d7e;font-size:15px}
.content-box h2{font-size:22px;color:#1a5276;font-weight:700;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #e67e22}
.content-box h3{font-size:17px;color:#1a5276;font-weight:600;margin:20px 0 8px}
.content-box ul{padding-left:20px;margin:10px 0}
.content-box ul li{margin-bottom:7px}
.content-box p{margin-bottom:12px}

/* PEOPLE GRID */
.ppl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.ppl-card{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;text-align:center;border:1px solid #dde3ea;transition:.3s}
.ppl-card:hover{transform:translateY(-5px);box-shadow:0 8px 30px rgba(0,0,0,.14)}
.ppl-card img{width:100%;height:190px;object-fit:cover}
.ppl-info{padding:14px 12px}
.ppl-info h4{font-size:15px;font-weight:600;color:#1a5276}
.ppl-info span{font-size:13px;color:#5d6d7e}
.ppl-info .badge{display:inline-block;margin-top:6px;background:#1a5276;color:#fff;font-size:11px;padding:2px 10px;border-radius:20px}

/* REPORTS */
.report-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.report-card{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);padding:26px;border:1px solid #dde3ea;transition:.3s;cursor:pointer;display:flex;flex-direction:column;gap:12px}
.report-card:hover{transform:translateY(-4px);border-color:#1a5276}
.report-icon{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#1a5276,#2980b9);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff}
.report-card h3{font-size:15px;font-weight:600;color:#1a5276}
.report-card p{font-size:13px;color:#5d6d7e;line-height:1.6}
.report-card .dl-btn{display:inline-flex;align-items:center;gap:7px;background:#e67e22;color:#fff;padding:8px 16px;border-radius:5px;font-size:13px;font-weight:600;margin-top:auto;width:fit-content;transition:.25s}
.report-card .dl-btn:hover{background:#ca6f1e}

/* AWARDS */
.award-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px}
.award-card{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea;display:flex;gap:0;transition:.3s}
.award-card:hover{box-shadow:0 8px 30px rgba(0,0,0,.14)}
.award-img{width:160px;flex-shrink:0;overflow:hidden}
.award-img img{width:100%;height:100%;object-fit:cover}
.award-info{padding:22px 20px}
.award-info h3{font-size:16px;font-weight:600;color:#1a5276;margin-bottom:8px}
.award-info .year{display:inline-block;background:#e67e22;color:#fff;font-size:12px;padding:2px 10px;border-radius:20px;margin-bottom:8px}
.award-info p{font-size:13px;color:#5d6d7e}

/* SUCCESS */
.ss-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px}
.ss-card{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea;display:flex;gap:0;transition:.3s}
.ss-card:hover{box-shadow:0 8px 30px rgba(0,0,0,.14)}
.ss-img{width:140px;flex-shrink:0;overflow:hidden}
.ss-img img{width:100%;height:100%;object-fit:cover}
.ss-info{padding:20px 18px}
.ss-info h3{font-size:15px;font-weight:600;color:#1a5276;margin-bottom:4px}
.ss-info .loc{font-size:12px;color:#8d9ba8;margin-bottom:10px}
.ss-info p{font-size:13px;color:#5d6d7e;line-height:1.7;font-style:italic}
.ss-info .loan-tag{display:inline-block;margin-top:10px;background:#1e8449;color:#fff;font-size:12px;padding:2px 10px;border-radius:20px}

/* CALENDAR */
.cal-wrap{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea}
.cal-hdr{background:#1a5276;color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
.cal-hdr h3{font-size:18px;font-weight:600}
.cal-nav{display:flex;gap:10px}
.cal-nav button{background:rgba(255,255,255,.2);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:.2s}
.cal-nav button:hover{background:#e67e22}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr)}
.cal-day-hdr{text-align:center;padding:10px 4px;font-size:13px;font-weight:600;color:#1a5276;background:#f4f6f8;border:1px solid #dde3ea}
.cal-day{text-align:center;padding:10px 4px;font-size:14px;border:1px solid #dde3ea;min-height:50px;position:relative;cursor:pointer;transition:.2s}
.cal-day:hover{background:#f4f6f8}
.cal-day.today{background:#1a5276;color:#fff;font-weight:700}
.cal-day.event{font-weight:600;color:#e67e22}
.cal-day .event-dot{width:6px;height:6px;background:#e67e22;border-radius:50%;position:absolute;bottom:5px;left:50%;transform:translateX(-50%)}
.cal-day.other{color:#ccc}
.events-list{padding:20px;border-top:1px solid #dde3ea}
.event-item{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #dde3ea}
.event-item:last-child{border-bottom:none}
.event-date{background:#1a5276;color:#fff;padding:6px 12px;border-radius:6px;text-align:center;min-width:60px}
.event-date .eday{font-size:20px;font-weight:700;line-height:1}
.event-date .emon{font-size:11px;opacity:.8}
.event-info h4{font-size:14px;font-weight:600;color:#1a5276}
.event-info p{font-size:13px;color:#5d6d7e}

/* MEMBERSHIP FORM */
.form-wrap{max-width:700px;margin:0 auto}
.form-card{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);padding:36px 40px;border:1px solid #dde3ea}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}
.form-row.full{grid-template-columns:1fr}
.form-group label{display:block;font-size:13px;font-weight:600;color:#1a5276;margin-bottom:6px}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;border:1.5px solid #dde3ea;border-radius:6px;font-size:14px;font-family:inherit;color:#1a1a2e;transition:.2s;outline:none;background:#fff}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#1a5276;box-shadow:0 0 0 3px rgba(26,82,118,.1)}
.form-group textarea{resize:vertical;min-height:90px}
.submit-btn{width:100%;background:#1a5276;color:#fff;border:none;padding:13px;border-radius:7px;font-size:15px;font-weight:600;cursor:pointer;transition:.25s;font-family:inherit;margin-top:8px}
.submit-btn:hover{background:#154360}
.success-msg{background:#d4edda;color:#1e8449;padding:14px 18px;border-radius:7px;font-size:14px;font-weight:500;margin-bottom:20px;border:1px solid #1e8449}

/* BRANCH DETAIL */
.branch-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px}
.branch-detail-card{background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;border:1px solid #dde3ea;transition:.3s}
.branch-detail-card:hover{box-shadow:0 8px 30px rgba(0,0,0,.14)}
.branch-detail-card img{width:100%;height:200px;object-fit:cover}
.bdc-body{padding:20px}
.bdc-body h3{font-size:17px;font-weight:600;color:#1a5276;margin-bottom:12px}
.bdc-body .info-row{display:flex;align-items:center;gap:10px;font-size:13px;color:#5d6d7e;margin-bottom:7px}
.bdc-body .info-row i{color:#e67e22;width:16px}

/* RESPONSIVE */
@media(max-width:900px){
  .nav-toggle{display:block}
  .nav-menu{display:none;flex-direction:column;width:100%;background:#154360;position:absolute;top:100%;left:0;box-shadow:0 8px 20px rgba(0,0,0,.2);z-index:999}
  .nav-menu.open{display:flex}
  .nav-link{padding:11px 18px;border-bottom:1px solid rgba(255,255,255,.07)}
  .dropdown{position:static;box-shadow:none;border-top:none;background:rgba(0,0,0,.15);border-radius:0}
  .nav-item:hover .dropdown{display:none}
  .nav-item.open .dropdown{display:block}
  .dropdown-item{color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.06)}
}
@media(max-width:800px){
  .welcome-grid,.msg-grid,.award-grid,.ss-grid{grid-template-columns:1fr}
  .srv-grid{grid-template-columns:repeat(2,1fr)}
  .news-grid{grid-template-columns:1fr}
  .br-grid{grid-template-columns:repeat(2,1fr)}
  .ppl-grid{grid-template-columns:repeat(2,1fr)}
  .report-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .slide{height:320px}
  .slide-title{font-size:24px}
  .slide-content{padding:40px 28px;max-width:100%}
  .ticker-wrap{display:none}
  .gallery-grid{grid-template-columns:repeat(2,1fr)}
  .branch-detail-grid{grid-template-columns:1fr}
  .form-row{grid-template-columns:1fr}
}
@media(max-width:480px){
  .srv-grid{grid-template-columns:1fr}
  .br-grid{grid-template-columns:repeat(2,1fr)}
  .footer-grid{grid-template-columns:1fr}
  .ppl-grid{grid-template-columns:repeat(2,1fr)}
  .logo-text h1{font-size:16px}
}
`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useHash() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const handler = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return hash.replace("#", "") || "/";
}

function navigate(path) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <div className="topbar-left">
          <span><span className="icon-accent">📍</span> Tilottama-15, Kotihawa, Rupandehi, Nepal</span>
          <span><span className="icon-accent">📞</span> +977 71 514010 | 9857016063 | 9857018141</span>
        </div>
        <div className="social-row">
          <span>Follow Us:</span>
          {["f","twitter","youtube","instagram","viber"].map(s => (
            <span key={s} className="soc-btn">
              {s === "f" ? "f" : s === "twitter" ? "t" : s === "youtube" ? "▶" : s === "instagram" ? "📷" : "V"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="hdr">
      <div className="wrap">
        <div className="logo-area" onClick={() => navigate("/")}>
          <div className="logo-icon">🤝</div>
          <div className="logo-text">
            <h1>सहकारी</h1>
            <p>बचत तथा ऋण सहकारी संस्था लि.</p>
            <em>स्थापना: २०५५</em>
          </div>
        </div>
        <div className="ticker-wrap">
          <span className="ticker-label">सूचना</span>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <span className="ticker-inner">
              ✦ सहकारी सहकारीको बार्षिक साधारण सभा आगामी फाल्गुण १५ गते हुनेछ &nbsp;&nbsp;&nbsp; ✦ नया सदस्यहरुलाई स्वागत ! रू. २,०००/- मात्रमा सदस्य बन्नुहोस् &nbsp;&nbsp;&nbsp; ✦ छात्रवृत्ती आवेदन मंसिर २० गतेसम्म बुझाउनुहोस् &nbsp;&nbsp;&nbsp; ✦ मोबाइल बैंकिङ सेवा अब उपलब्ध छ
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Navbar({ currentPath }) {
  const [open, setOpen] = useState(false);
  const [openItem, setOpenItem] = useState(null);

  return (
    <nav className="navbar">
      <div className="wrap">
        <button className="nav-toggle" onClick={() => setOpen(!open)}>☰</button>
        <ul className={`nav-menu${open ? " open" : ""}`} id="mainNav">
          {NAV_ITEMS.map((item, i) => (
            <li key={i} className={`nav-item${item.children ? (openItem === i ? " open" : "") : ""}`}>
              {item.children ? (
                <>
                  <span
                    className={`nav-link${currentPath.startsWith(item.children[0].path.split("/").slice(0,2).join("/")) ? " active" : ""}`}
                    onClick={() => setOpenItem(openItem === i ? null : i)}
                  >
                    {item.label} ▾
                  </span>
                  <ul className="dropdown">
                    {item.children.map((c, j) => (
                      <li key={j}>
                        <span className="dropdown-item" onClick={() => { navigate(c.path); setOpen(false); }}>
                          {c.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <span
                  className={`nav-link${currentPath === item.path ? " active" : ""}`}
                  onClick={() => { navigate(item.path); setOpen(false); }}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function PageBanner({ title, parent, parentPath }) {
  return (
    <div className="page-banner">
      <div className="wrap">
        <h1>{title}</h1>
        <div className="breadcrumb">
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>गृहपृष्ठ</span>
          {parent && <><span className="sep">›</span><span style={{ cursor: "pointer" }} onClick={() => parentPath && navigate(parentPath)}>{parent}</span></>}
          <span className="sep">›</span><span className="cur">{title}</span>
        </div>
      </div>
    </div>
  );
}

function HeroSlider() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const go = n => setCur((n + SLIDES.length) % SLIDES.length);

  return (
    <div className="slider-wrap">
      <div className="slider-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {SLIDES.map((s, i) => (
          <div key={i} className="slide" style={{ backgroundImage: `url(${s.img})` }}>
            <div className="slide-content">
              <span className="slide-badge">{s.badge}</span>
              <div className="slide-title">{s.title}</div>
              <p className="slide-sub">{s.sub}</p>
              <span className="slide-btn" onClick={() => navigate("/membership")}>थप जानकारी →</span>
            </div>
          </div>
        ))}
      </div>
      <button className="s-arrow prev" onClick={() => go(cur - 1)}>‹</button>
      <button className="s-arrow next" onClick={() => go(cur + 1)}>›</button>
      <div className="s-dots">
        {SLIDES.map((_, i) => (
          <div key={i} className={`s-dot${cur === i ? " on" : ""}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-grid">
        {[["१२,५००+","शेयर सदस्यहरु"],["१०","सेवाकेन्द्रहरु"],["रू ४५ करोड+","कुल बचत"],["२५+ वर्ष","सेवाको अनुभव"]].map(([n,l],i)=>(
          <div key={i} className="stat-item">
            <div className="stat-num">{n}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="wrap">
          <div className="footer-grid">
            <div className="f-brand">
              <h3>सहकारी सहकारी</h3>
              <p>सहकारी बचत तथा ऋण सहकारी संस्था लि. — सन् २०५५ देखि तपाईंको वित्तीय समृद्धिको साथी। हाम्रो लक्ष्य हरेक सदस्यको जीवनस्तर उकास्नु हो।</p>
              <div className="f-contact">
                <span><i>📍</i> Tilottama-15, Kotihawa, Rupandehi</span>
                <span><i>📞</i> +977 71 514010</span>
                <span><i>📱</i> 9857016063 | 9857018141</span>
                <span><i>✉️</i> info@janakallyan.com.np</span>
              </div>
              <div className="f-socials" style={{marginTop:14}}>
                {["f","t","▶","📷"].map((ic,i) => <span key={i} className="f-soc">{ic}</span>)}
              </div>
            </div>
            <div className="f-col">
              <h4>हाम्रा सेवाहरु</h4>
              <ul>
                {[["बचत सेवा","/services/saving"],["ऋण सेवा","/services/loan"],["मोबाइल बैंकिङ","/services/other"],["सदस्य सम्मान","/services/honor"],["सामाजिक सेवा","/services/social"]].map(([l,p]) => (
                  <li key={l}><a onClick={() => navigate(p)}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="f-col">
              <h4>द्रुत लिंकहरु</h4>
              <ul>
                {[["हाम्रो बारेमा","/about/background"],["संचालक समिति","/hr/bod"],["सेवाकेन्द्रहरु","/branches"],["प्रतिवेदन","/reports/perls"],["सफलताका कथा","/success-stories"],["शेयर सदस्यता","/membership"]].map(([l,p]) => (
                  <li key={l}><a onClick={() => navigate(p)}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="f-col">
              <h4>कार्यालय समय</h4>
              <ul>
                {["आइतबार - शुक्रबार","सिजन: बिहान ९ — साँझ ५","अफ सिजन: बिहान १० — ४","शनिबार: बन्द"].map(t => <li key={t}><a>{t}</a></li>)}
              </ul>
              <div style={{marginTop:18}}>
                <span style={{display:"inline-block",background:"#e67e22",color:"#fff",padding:"10px 18px",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer"}} onClick={() => navigate("/membership")}>
                  👤 सदस्य बन्नुहोस्
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrap">
          © २०८२ सहकारी बचत तथा ऋण सहकारी संस्था लि. | सर्वाधिकार सुरक्षित | Site by: <a>Demo Build</a>
        </div>
      </div>
    </footer>
  );
}

function NoticePopup({ onClose }) {
  return (
    <div className="popup-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="popup-box">
        <div className="popup-hdr">
          <h4>२०८२ पौष मसान्त सम्म हामी कहाँ छौं ?</h4>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80" className="popup-img" alt="Notice" />
        <div className="popup-body">
          <h3>मासिक प्रतिवेदन २०८२ पौष</h3>
          <p>सहकारी सहकारीको पौष मसान्त सम्मको प्रगति प्रतिवेदन हेर्नुहोस् । सदस्यहरुको बचत र कर्जा सम्बन्धी विस्तृत विवरण।</p>
          <span className="popup-btn" onClick={() => { navigate("/reports/monthly"); onClose(); }}>थप पढ्नुहोस्...</span>
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage() {
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <>
      <HeroSlider />
      <StatsBar />

      {/* WELCOME */}
      <section className="section">
        <div className="wrap">
          <div className="welcome-grid">
            <div className="welcome-text">
              <h2>स्वागतम् !</h2>
              <p>हाम्रो वेवसाइटमा यहाँहरुलाई हार्दिक स्वागत गर्दछौं । आज सम्म आउदा हामीमा आत्मविश्वास बढाउने र निरन्तर सहयोग गर्नुहुने यहाँहरु जस्तै वेवसाइट भिजिर्टसहरु, विभिन्न संघ संस्था, शुभचिन्तक तथा शेयर सदस्यहरुप्रति हामी आभारी छौं ।</p>
              <p>यहाँहरुको प्रत्यक्ष अप्रत्यक्ष सहयोगहरु हाम्रो इतिहासमा स्वर्ण अक्षरले लेखिनेछन् । आगामी दिनहरुमा पनि यहाँहरुको निरन्तर माया र सहयोग पाइरहने अपेक्षा गरिरहेका छौं ।</p>
              <p>हामी यहाँहरुलाई अझै गुणस्तरीय र प्रभावकारी सेवा प्रदान गर्ने प्रतिवद्धता व्यक्त गर्दछौं ।</p>
              <div className="sig">
                <strong>अर्जुन बहादुर क्षेत्री</strong>
                <span>अध्यक्ष, सहकारी सहकारी</span>
              </div>
              <span className="readmore-btn" onClick={() => navigate("/about/background")}>थप पढ्नुहोस् →</span>
            </div>
            <div className="welcome-img-wrap">
              <img src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80" alt="Chairman" />
              <div className="img-badge">✦ अध्यक्षको सन्देश</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="sec-hdr">
            <h2>हाम्रा सेवाहरु</h2>
            <p>समयको आवश्यकता संगसंगै हामि सेवा सुविधा चुस्त बनाउन सदैव क्रियाशिल छौं</p>
            <span className="view-all-btn" onClick={() => navigate("/services/saving")}>सम्पूर्ण सेवाहरु</span>
          </div>
          <div className="srv-grid">
            {[
              { title: "बचत सेवा", path: "/services/saving", img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80", icon: "🐷", desc: "सुरक्षित र नियमित बचत गर्नुहोस् । विभिन्न किसिमका बचत योजनाहरु उपलब्ध छन् ।" },
              { title: "ऋण सेवा", path: "/services/loan", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80", icon: "💰", desc: "कम ब्याजदरमा सहज ऋण सेवा । विनाधितो र धितो दुवै प्रकारका ऋण उपलब्ध ।" },
              { title: "अन्य सदस्य सेवा", path: "/services/other", img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80", icon: "⭐", desc: "मोबाइल बैंकिङ, रेमिट्यान्स र अन्य थप सुविधाहरु सदस्यहरुका लागि उपलब्ध ।" },
              { title: "सदस्य सम्मान", path: "/services/honor", img: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&q=80", icon: "🏆", desc: "उत्कृष्ट सदस्यहरुलाई विशेष सम्मान, पुरस्कार र तीर्थ यात्राको सुविधा ।" },
            ].map((s,i) => (
              <div key={i} className="srv-card" onClick={() => navigate(s.path)}>
                <div className="srv-img">
                  <img src={s.img} alt={s.title} />
                  <div className="srv-icon">{s.icon}</div>
                </div>
                <div className="srv-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="srv-link">Get Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-hdr">
            <h2>सहकारी समाचार</h2>
            <p>सहकारी सहकारीका गतिविधिहरु हेर्नुहोस्</p>
            <span className="view-all-btn" onClick={() => navigate("/news")}>सबै हेर्नको लागि</span>
          </div>
          <div className="news-grid">
            {NEWS_LIST.slice(0, 3).map(n => (
              <div key={n.id} className="news-card" onClick={() => navigate(`/news/${n.id}`)}>
                <div className="news-card-img"><img src={n.img} alt={n.title} /></div>
                <div className="news-body">
                  <div className="news-meta">
                    <span className="news-cat">{n.category}</span>
                    <span className="news-date">📅 {n.date}</span>
                  </div>
                  <h3>{n.title}</h3>
                  <span className="read-link">थप पढ्नुहोस् →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="sec-hdr">
            <h2>सहकारी सेवाकेन्द्रहरु</h2>
            <br />
            <span className="view-all-btn" onClick={() => navigate("/branches")}>सबै हेर्नुहोस्</span>
          </div>
          <div className="br-grid">
            {BRANCHES.map((b,i) => (
              <div key={i} className="br-card" onClick={() => navigate("/branches")}>
                <img src={b.img} alt={b.name} />
                <div className="br-info">
                  <h4>{b.name}</h4>
                  <span>{b.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap">
          <div className="sec-hdr">
            <h2>बढी सोधिने प्रश्नहरु (FAQ)</h2>
            <p>तपाइको सहयोगको लागि धेरै सोधिने प्रश्न र तीनका उत्तरहरु यहाँ समावेश छन्</p>
          </div>
          <div className="faq-wrap">
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item">
                <button className={`faq-q${faqOpen === i ? " open" : ""}`} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {f.q}
                  <span className="faq-icon">{faqOpen === i ? "✕" : "+"}</span>
                </button>
                {faqOpen === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MESSAGES */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="sec-hdr"><h2>व्यवस्थापनबाट सन्देश</h2></div>
          <div className="msg-grid">
            {[
              { name: "देवेन्द्र बहादुर बस्नेत", role: "व्यवस्थापक", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", msg: "संस्थाको भिजन २०८८ को लक्ष्य पुरा गर्न हाम्रा शेयर सदस्यहरुले गरेको सहयोग सह्रानिय र अतुलनीय छ । यहाहरुको विश्वास र आत्मियताप्रति हामी कर्मचारी परिवार आभारी छौं । हामी संचालक समितिले बनाइ दिएको नीतिहरु भित्र रही यहाहरुलाई गुणस्तरीय र प्रभावकारी सेवा प्रदान गर्न सदैव प्रतिवद्ध छौं ।" },
              { name: "अर्जुन बहादुर क्षेत्री", role: "का.व. अध्यक्ष", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80", msg: "बचत तथा ऋण सहकारीको जन्मदाता जर्मनका एफ डब्लु राइफिसनले एकका लागि सबै र सबैका लागि एक भनेका छन् । समाजको सबै जात धर्म लिंग संस्कृति राजनितिक आस्था भएका मानवबीच कुनै पनि भेदभाव नगरिकन मिलिजुली काम गर्ने क्षेत्र नै सहकारी हो ।" },
            ].map((m,i) => (
              <div key={i} className="msg-card">
                <div className="msg-hdr">
                  <img src={m.img} className="msg-avatar" alt={m.name} />
                  <div className="msg-person"><h3>{m.name}</h3><span>{m.role}</span></div>
                </div>
                <div className="msg-body"><span className="quote-mark">"</span>{m.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="section">
        <div className="wrap">
          <div className="sec-hdr">
            <h2>फोटो फिचर</h2>
            <span className="view-all-btn" onClick={() => navigate("/gallery")}>सबै हेर्नुहोस्</span>
          </div>
          <div className="gallery-strip">
            {GALLERY_IMGS.slice(0,7).map((img,i) => (
              <img key={i} src={img} alt={`Gallery ${i+1}`} onClick={() => navigate("/gallery")} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── ABOUT PAGES ──
function AboutPage({ page }) {
  const content = {
    background: { title: "पृष्ठभुमी", body: `सहकारी बचत तथा ऋण सहकारी संस्था लि. को स्थापना विक्रम संवत् २०५५ सालमा रुपन्देही जिल्लाको तिलोत्तमा नगरपालिका-१५, कोटिहावामा भएको हो। स्थापनाकालमा मात्र केही दर्जन सदस्यहरु र सामान्य पुँजीबाट सुरु भएको यस संस्थाले आज हजारौं सदस्यहरुको आर्थिक जीवनस्तर उकास्ने महत्वपूर्ण भूमिका निर्वाह गर्दै आएको छ।\n\nसहकारी सिद्धान्त र मूल्यमान्यताका आधारमा सञ्चालित यस संस्थाले सदस्यहरुको बचत संकलन गरी उत्पादनशील क्षेत्रमा लगानी गर्दै आर्थिक समृद्धिको मार्गमा अग्रसर हुँदै आएको छ।` },
    vision: { title: "परिकल्पना", body: `सन् २०८८ सम्ममा रुपन्देही जिल्लाको सबैभन्दा विश्वसनीय र समृद्ध सहकारी संस्था बन्ने। प्रत्येक सदस्यको आर्थिक स्वतन्त्रता र सामाजिक सुरक्षा सुनिश्चित गर्ने। डिजिटल प्रविधिको माध्यमबाट सेवा विस्तार गरी सदस्यहरुलाई छिटो, छरितो र सुलभ वित्तीय सेवा प्रदान गर्ने।` },
    mission: { title: "ध्येय", body: `सदस्यहरुको बचत सुरक्षित गरी उनीहरुको आर्थिक जीवनस्तर उकास्न सहायता गर्नु। सहकारी सिद्धान्त र मूल्यमान्यताको आधारमा सञ्चालन गर्नु। समाजका सबै वर्गलाई भेदभावरहित गुणस्तरीय वित्तीय सेवा प्रदान गर्नु। सदस्यहरुको क्षमता विकास र आर्थिक उद्यमशीलता प्रवर्धन गर्नु।` },
    goals: { title: "लक्ष्य", body: `• सन् २०८८ सम्म सदस्य संख्या २०,०००+ पुर्याउने\n• कुल बचत रू ७५ करोड पुर्याउने\n• १५ वटा सेवाकेन्द्र सञ्चालन गर्ने\n• डिजिटल बैंकिङ सेवा पूर्ण रूपमा लागू गर्ने\n• प्रत्येक वर्ष ५०+ विद्यार्थीलाई छात्रवृत्ती प्रदान गर्ने\n• कर्मचारी संख्या ७५+ पुर्याउने` },
    objectives: { title: "उद्देश्य", body: `सदस्यहरुको आर्थिक हित संरक्षण गर्नु, सहकारी सिद्धान्तमा आधारित वित्तीय सेवा प्रदान गर्नु, स्थानीय उद्यमशीलता प्रवर्धन गर्नु, समाजमा वित्तीय साक्षरता अभिवृद्धि गर्नु, र सदस्यहरुको सामाजिक सुरक्षा सुनिश्चित गर्नु यस संस्थाका प्रमुख उद्देश्यहरु हुन्।` },
    joining: { title: "आबद्धता", body: `सहकारी सहकारी निम्न राष्ट्रिय तथा अन्तर्राष्ट्रिय संस्थाहरुसँग आबद्ध छः\n\n• राष्ट्रिय सहकारी महासंघ नेपाल\n• लुम्बिनी प्रदेश सहकारी महासंघ\n• रुपन्देही जिल्ला सहकारी संघ\n• नेपाल सरकार, सहकारी विभाग\n• World Council of Credit Unions (WOCCU)` },
  };
  const c = content[page] || content.background;
  return (
    <>
      <PageBanner title={c.title} parent="हाम्रो बारेमा" />
      <section className="section">
        <div className="wrap">
          <div className="content-box">
            <h2>{c.title}</h2>
            {c.body.split("\n\n").map((para,i) => <p key={i} style={{whiteSpace:"pre-line"}}>{para}</p>)}
          </div>
        </div>
      </section>
    </>
  );
}

// ── HR PAGES ──
function HRPage({ type }) {
  const pages = {
    bod: { title: "संचालक समिति", people: BOD },
    audit: { title: "लेखा सुपरिवेक्षण समिति", people: [
      { name: "माधव प्रसाद दाहाल", role: "अध्यक्ष", img: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=200&q=80" },
      { name: "नरेश कुमार ठाकुर", role: "सदस्य", img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80" },
      { name: "कल्पना देवी श्रेष्ठ", role: "सदस्य", img: "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=200&q=80" },
    ]},
    advisory: { title: "सल्लाहकार मण्डल", people: [
      { name: "डा. शिवराज पन्त", role: "मुख्य सल्लाहकार", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { name: "प्रा. उषा नेपाल", role: "कानुनी सल्लाहकार", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80" },
      { name: "CA बालकृष्ण न्यौपाने", role: "वित्तीय सल्लाहकार", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80" },
    ]},
    "loan-committee": { title: "ऋण उपसमिति", people: [
      { name: "जीवन लाल वैद्य", role: "अध्यक्ष", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
      { name: "सुशीला कुमारी मल्ल", role: "सदस्य", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
      { name: "पुष्प राज रेग्मी", role: "सदस्य", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
    ]},
    "assets-committee": { title: "सम्पति खरिद उपसमिति", people: [
      { name: "केशव प्रसाद तिमिल्सिना", role: "अध्यक्ष", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80" },
      { name: "मञ्जु देवी गौतम", role: "सदस्य", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80" },
    ]},
    management: { title: "प्रशासन व्यवस्थापन समूह", people: [
      { name: "देवेन्द्र बहादुर बस्नेत", role: "व्यवस्थापक", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
      { name: "राधा देवी खतिवडा", role: "सहायक व्यवस्थापक", img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=200&q=80" },
      { name: "नवीन कुमार उपाध्याय", role: "IT अधिकृत", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
      { name: "सावित्री कुमारी राई", role: "लेखा अधिकृत", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
    ]},
  };
  const pg = pages[type] || pages.bod;
  return (
    <>
      <PageBanner title={pg.title} parent="मानवीय श्रोत" />
      <section className="section">
        <div className="wrap">
          <div className="ppl-grid">
            {pg.people.map((p,i) => (
              <div key={i} className="ppl-card">
                <img src={p.img} alt={p.name} />
                <div className="ppl-info">
                  <h4>{p.name}</h4>
                  <span>{p.role}</span>
                  <div><span className="badge">सदस्य</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── SERVICE PAGES ──
function ServicePage({ type }) {
  const services = {
    saving: {
      title: "बचत सेवा", img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      intro: "सहकारी सहकारीमा विभिन्न किसिमका बचत योजनाहरु उपलब्ध छन् जसले सदस्यहरुलाई आफ्नो बचत सुरक्षित राख्न र बढाउन सहायता गर्दछ।",
      items: ["नियमित बचत खाता — न्यूनतम रू ५००", "मुद्दती बचत — ३ महिनादेखि ५ वर्षसम्म", "विशेष बचत योजना — बालबालिकाका लागि", "वृद्ध बचत योजना — ५५ वर्ष माथिका लागि", "घर बचत योजना — घर निर्माणका लागि"],
    },
    loan: {
      title: "ऋण सेवा", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
      intro: "सहकारी सहकारीले सदस्यहरुलाई विभिन्न उद्देश्यका लागि सहज र न्यून ब्याजदरमा ऋण सुविधा प्रदान गर्दछ।",
      items: ["विनाधितो ऋण — अधिकतम रू ५ लाख", "धितो ऋण — अधिकतम रू ५० लाख", "व्यावसायिक ऋण", "शैक्षिक ऋण", "कृषि ऋण", "गृह निर्माण ऋण"],
    },
    other: {
      title: "अन्य सदस्य सेवा", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      intro: "सदस्यहरुको सुविधाका लागि सहकारी सहकारीले थप आधुनिक सेवाहरु उपलब्ध गराउँदछ।",
      items: ["मोबाइल बैंकिङ एप", "रेमिट्यान्स सेवा", "इन्टरनेट बैंकिङ", "ATM सेवा (नजिकको बैंकमार्फत)", "SMS अलर्ट सेवा", "ग्राहक सेवा हेल्पलाइन"],
    },
    honor: {
      title: "सदस्य सम्मान कार्यक्रम", img: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=80",
      intro: "संस्थाप्रति वफादार र उत्कृष्ट सदस्यहरुलाई विभिन्न सम्मान र पुरस्कार प्रदान गरिन्छ।",
      items: ["उत्कृष्ट बचतकर्ता पुरस्कार", "नियमित किस्ता तिर्नेलाई छुट", "तीर्थ यात्रा सुविधा (५०+ उमेरका सदस्यहरु)", "वार्षिक उत्सवमा सम्मान", "विशेष उपहार र प्रमाणपत्र"],
    },
    social: {
      title: "सामाजिक सेवा", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
      intro: "सहकारी सहकारी समाजप्रति आफ्नो उत्तरदायित्व निर्वाह गर्दै विभिन्न सामाजिक कार्यहरुमा संलग्न रहन्छ।",
      items: ["वार्षिक छात्रवृत्ती कार्यक्रम", "निःशुल्क स्वास्थ्य शिविर", "रक्तदान कार्यक्रम", "विपद् राहत सहायता", "वृक्षारोपण अभियान", "वित्तीय साक्षरता तालिम"],
    },
  };
  const s = services[type] || services.saving;
  return (
    <>
      <PageBanner title={s.title} parent="हाम्रा सेवाहरु" />
      <section className="section">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <img src={s.img} alt={s.title} style={{ width: "100%", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,.14)" }} />
            </div>
            <div className="content-box">
              <h2>{s.title}</h2>
              <p>{s.intro}</p>
              <h3>उपलब्ध सेवाहरु</h3>
              <ul>{s.items.map((it,i) => <li key={i}>{it}</li>)}</ul>
              <div style={{ marginTop: 24 }}>
                <span className="readmore-btn" onClick={() => navigate("/membership")}>अहिले नै सदस्य बन्नुहोस् →</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── REPORTS ──
function ReportsPage({ type }) {
  const titles = { perls: "पर्ल्स प्रतिवेदन", monthly: "मासिक प्रतिवेदन", yearly: "वाषिर्क प्रतिवेदन" };
  const title = titles[type] || titles.perls;
  const reports = [
    { name: `${title} - पौष २०८२`, size: "2.4 MB", date: "२०८२/०९/३०" },
    { name: `${title} - मंसिर २०८२`, size: "2.1 MB", date: "२०८२/०८/३०" },
    { name: `${title} - कार्तिक २०८२`, size: "1.9 MB", date: "२०८२/०७/३०" },
    { name: `${title} - असोज २०८२`, size: "2.2 MB", date: "२०८२/०६/३०" },
    { name: `${title} - भाद्र २०८२`, size: "1.8 MB", date: "२०८२/०५/३०" },
    { name: `${title} - साउन २०८२`, size: "2.0 MB", date: "२०८२/०४/३०" },
  ];
  return (
    <>
      <PageBanner title={title} parent="प्रतिवेदन" />
      <section className="section">
        <div className="wrap">
          <div className="report-grid">
            {reports.map((r,i) => (
              <div key={i} className="report-card">
                <div className="report-icon">📄</div>
                <h3>{r.name}</h3>
                <p>प्रकाशित: {r.date} | आकार: {r.size}</p>
                <span className="dl-btn">⬇️ डाउनलोड गर्नुहोस्</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── AWARDS ──
function AwardsPage() {
  return (
    <>
      <PageBanner title="संस्थागत सम्मानहरु" />
      <section className="section">
        <div className="wrap">
          <div className="award-grid">
            {AWARDS.map((a,i) => (
              <div key={i} className="award-card">
                <div className="award-img"><img src={a.img} alt={a.title} /></div>
                <div className="award-info">
                  <span className="year">{a.year}</span>
                  <h3>{a.title}</h3>
                  <p>{a.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── SUCCESS STORIES ──
function SuccessStoriesPage() {
  return (
    <>
      <PageBanner title="सफलताका कथा" />
      <section className="section">
        <div className="wrap">
          <div className="ss-grid">
            {SUCCESS_STORIES.map((s,i) => (
              <div key={i} className="ss-card">
                <div className="ss-img"><img src={s.img} alt={s.name} /></div>
                <div className="ss-info">
                  <h3>{s.name}</h3>
                  <p className="loc">📍 {s.location}</p>
                  <p>"{s.story}"</p>
                  <span className="loan-tag">ऋण: {s.loan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── MEMBERSHIP ──
function MembershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", address: "", phone: "", email: "", occupation: "", branch: "", purpose: "" });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <>
      <PageBanner title="शेयर सदस्यताको लागि आवेदन" />
      <section className="section">
        <div className="wrap">
          <div className="form-wrap">
            {submitted && <div className="success-msg">✅ तपाईंको आवेदन सफलतापूर्वक पठाइयो! हामी छिट्टै तपाईंलाई सम्पर्क गर्नेछौं।</div>}
            <div className="form-card">
              <h2 style={{ fontSize: 20, color: C.primary, marginBottom: 24, paddingBottom: 12, borderBottom: `2px solid ${C.accent}` }}>नया सदस्यता आवेदन फारम</h2>
              <div className="form-row">
                <div className="form-group"><label>पूरा नाम *</label><input name="name" value={form.name} onChange={handle} placeholder="आफ्नो पूरा नाम लेख्नुहोस्" /></div>
                <div className="form-group"><label>जन्ममिति *</label><input type="date" name="dob" value={form.dob} onChange={handle} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>ठेगाना *</label><input name="address" value={form.address} onChange={handle} placeholder="स्थायी ठेगाना" /></div>
                <div className="form-group"><label>फोन नम्बर *</label><input name="phone" value={form.phone} onChange={handle} placeholder="9800000000" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>इमेल</label><input type="email" name="email" value={form.email} onChange={handle} placeholder="email@example.com" /></div>
                <div className="form-group"><label>पेशा</label><input name="occupation" value={form.occupation} onChange={handle} placeholder="तपाईंको पेशा" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>नजिकको सेवाकेन्द्र *</label>
                  <select name="branch" value={form.branch} onChange={handle}>
                    <option value="">छान्नुहोस्</option>
                    {BRANCHES.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>सदस्यताको उद्देश्य</label><input name="purpose" value={form.purpose} onChange={handle} placeholder="बचत / ऋण / दुवै" /></div>
              </div>
              <div className="form-row full">
                <div className="form-group">
                  <label>थप जानकारी</label>
                  <textarea placeholder="कुनै थप जानकारी छ भने लेख्नुहोस्..." rows={3}></textarea>
                </div>
              </div>
              <button className="submit-btn" onClick={() => setSubmitted(true)}>आवेदन पठाउनुहोस् →</button>
            </div>
            <div style={{ marginTop: 24, background: "#fff", borderRadius: 10, padding: "22px 28px", boxShadow: "0 4px 20px rgba(0,0,0,.08)", border: "1px solid #dde3ea" }}>
              <h3 style={{ color: C.primary, marginBottom: 12, fontSize: 16 }}>सदस्यताको लागि आवश्यक कागजातहरु</h3>
              <ul style={{ paddingLeft: 20, color: "#5d6d7e", lineHeight: 1.9, fontSize: 14 }}>
                <li>नागरिकताको प्रतिलिपि (आफ्नो र हकवालाको)</li>
                <li>पासपोर्ट साइजको फोटो (१ प्रति)</li>
                <li>शेयर रू. १,०००/- र बचत रू. १,०००/- (जम्मा रू. २,०००/-)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── CALENDAR ──
function CalendarPage() {
  const months = ["जनवरी","फेब्रुअरी","मार्च","अप्रिल","मे","जुन","जुलाई","अगस्त","सेप्टेम्बर","अक्टोबर","नोभेम्बर","डिसेम्बर"];
  const [month, setMonth] = useState(4);
  const events = [
    { day: 5, month: 4, title: "वार्षिक साधारण सभा", place: "मुख्य कार्यालय" },
    { day: 12, month: 4, title: "छात्रवृत्ती वितरण", place: "सबै सेवाकेन्द्र" },
    { day: 20, month: 4, title: "स्वास्थ्य शिविर", place: "कोटिहावा" },
    { day: 28, month: 4, title: "कर्मचारी तालिम", place: "मुख्य कार्यालय" },
  ];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const eventDays = events.filter(e => e.month === month).map(e => e.day);

  return (
    <>
      <PageBanner title="क्यालेण्डर" />
      <section className="section">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 30 }}>
            <div className="cal-wrap">
              <div className="cal-hdr">
                <h3>{months[month]} २०८२</h3>
                <div className="cal-nav">
                  <button onClick={() => setMonth(m => Math.max(0, m - 1))}>‹</button>
                  <button onClick={() => setMonth(m => Math.min(11, m + 1))}>›</button>
                </div>
              </div>
              <div className="cal-grid">
                {["आइत","सोम","मंगल","बुध","बिही","शुक्र","शनि"].map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
                {[1,2,3].map(d => <div key={`p${d}`} className="cal-day other">{27+d}</div>)}
                {days.map(d => (
                  <div key={d} className={`cal-day${d === 15 ? " today" : ""}${eventDays.includes(d) ? " event" : ""}`}>
                    {d}
                    {eventDays.includes(d) && <div className="event-dot" />}
                  </div>
                ))}
              </div>
              <div className="events-list">
                <h4 style={{ color: C.primary, marginBottom: 14, fontSize: 15 }}>यस महिनाका कार्यक्रमहरु</h4>
                {events.filter(e => e.month === month).map((e,i) => (
                  <div key={i} className="event-item">
                    <div className="event-date"><div className="eday">{e.day}</div><div className="emon">{months[e.month].slice(0,3)}</div></div>
                    <div className="event-info"><h4>{e.title}</h4><p>📍 {e.place}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="content-box">
                <h2>आगामी कार्यक्रमहरु</h2>
                {[
                  { title: "फाल्गुण १५: वार्षिक साधारण सभा", desc: "मुख्य कार्यालय, कोटिहावा" },
                  { title: "चैत ५: छात्रवृत्ती घोषणा", desc: "सबै सेवाकेन्द्र" },
                  { title: "वैशाख १: नया वर्षको स्वागत", desc: "विशेष कार्यक्रम" },
                  { title: "जेठ २०: स्वास्थ्य शिविर", desc: "कोटिहावा, भैरहवा" },
                ].map((ev,i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #dde3ea" }}>
                    <strong style={{ color: C.primary, fontSize: 14 }}>{ev.title}</strong>
                    <p style={{ fontSize: 13, marginTop: 3 }}>{ev.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── GALLERY ──
function GalleryPage() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <PageBanner title="फोटो फिचर" />
      <section className="section">
        <div className="wrap">
          <div className="gallery-grid">
            {GALLERY_IMGS.map((img,i) => (
              <img key={i} src={img} alt={`Gallery ${i+1}`} onClick={() => setSelected(img)} />
            ))}
          </div>
        </div>
      </section>
      {selected && (
        <div className="popup-overlay" onClick={() => setSelected(null)}>
          <div style={{ maxWidth: 900, width: "95%" }}>
            <img src={selected} alt="Gallery" style={{ width: "100%", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,.4)" }} />
            <div style={{ textAlign: "center", marginTop: 14, color: "#fff", fontSize: 14 }}>क्लिक गर्नुहोस् बन्द गर्न</div>
          </div>
        </div>
      )}
    </>
  );
}

// ── NEWS PAGE ──
function NewsPage() {
  return (
    <>
      <PageBanner title="सहकारी समाचार" />
      <section className="section">
        <div className="wrap">
          <div className="news-grid">
            {NEWS_LIST.map(n => (
              <div key={n.id} className="news-card" onClick={() => navigate(`/news/${n.id}`)}>
                <div className="news-card-img"><img src={n.img} alt={n.title} /></div>
                <div className="news-body">
                  <div className="news-meta">
                    <span className="news-cat">{n.category}</span>
                    <span className="news-date">📅 {n.date}</span>
                  </div>
                  <h3>{n.title}</h3>
                  <span className="read-link">थप पढ्नुहोस् →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── NEWS DETAIL ──
function NewsDetailPage({ id }) {
  const news = NEWS_LIST.find(n => n.id === parseInt(id)) || NEWS_LIST[0];
  return (
    <>
      <PageBanner title={news.title} parent="समाचार" parentPath="/news" />
      <section className="section">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
            <div className="content-box">
              <img src={news.img} alt={news.title} style={{ width: "100%", borderRadius: 8, marginBottom: 22 }} />
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <span className="news-cat" style={{ background: C.primary, color: "#fff", fontSize: 12, padding: "3px 12px", borderRadius: 20 }}>{news.category}</span>
                <span style={{ fontSize: 13, color: C.textLight }}>📅 {news.date}</span>
              </div>
              <h2>{news.title}</h2>
              <p style={{ marginTop: 16 }}>{news.body}</p>
              <p>सहकारी बचत तथा ऋण सहकारी संस्थाले यस्ता कार्यक्रमहरु नियमित रूपमा आयोजना गर्दै आएको छ। संस्थाले आफ्ना सदस्यहरुको आर्थिक र सामाजिक उन्नतिका लागि सधैं प्रयासरत रहन्छ।</p>
            </div>
            <div>
              <div className="content-box" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 16 }}>अन्य समाचारहरु</h2>
                {NEWS_LIST.filter(n => n.id !== news.id).slice(0,3).map(n => (
                  <div key={n.id} style={{ padding: "12px 0", borderBottom: "1px solid #dde3ea", cursor: "pointer" }} onClick={() => navigate(`/news/${n.id}`)}>
                    <img src={n.img} alt={n.title} style={{ width: "100%", borderRadius: 6, height: 100, objectFit: "cover", marginBottom: 8 }} />
                    <strong style={{ fontSize: 13, color: C.primary }}>{n.title}</strong>
                    <p style={{ fontSize: 12, color: C.textLight, marginTop: 3 }}>{n.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── BRANCHES PAGE ──
function BranchesPage() {
  return (
    <>
      <PageBanner title="सेवाकेन्द्रहरु" parent="मानवीय श्रोत" />
      <section className="section">
        <div className="wrap">
          <div className="branch-detail-grid">
            {BRANCHES.map((b,i) => (
              <div key={i} className="branch-detail-card">
                <img src={b.img} alt={b.name} />
                <div className="bdc-body">
                  <h3>{b.name}</h3>
                  <div className="info-row"><i>📍</i> <span>{b.location}</span></div>
                  <div className="info-row"><i>📞</i> <span>{b.phone}</span></div>
                  <div className="info-row"><i>👤</i> <span>प्रमुख: {b.head}</span></div>
                  <div className="info-row"><i>🕐</i> <span>आइत–शुक्र: ९:०० — ५:००</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function Router({ path }) {
  if (path === "/") return <HomePage />;
  if (path.startsWith("/about/")) return <AboutPage page={path.split("/")[2]} />;
  if (path.startsWith("/hr/")) return <HRPage type={path.split("/")[2]} />;
  if (path.startsWith("/services/")) return <ServicePage type={path.split("/")[2]} />;
  if (path.startsWith("/reports/")) return <ReportsPage type={path.split("/")[2]} />;
  if (path === "/awards") return <AwardsPage />;
  if (path === "/success-stories") return <SuccessStoriesPage />;
  if (path === "/membership") return <MembershipPage />;
  if (path === "/calendar") return <CalendarPage />;
  if (path === "/gallery") return <GalleryPage />;
  if (path === "/branches") return <BranchesPage />;
  if (path === "/news") return <NewsPage />;
  if (path.startsWith("/news/")) return <NewsDetailPage id={path.split("/")[2]} />;
  return <HomePage />;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const path = useHash();
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: gStyles }} />
      {showPopup && path === "/" && <NoticePopup onClose={() => setShowPopup(false)} />}
      <TopBar />
      <Header />
      <Navbar currentPath={path} />
      <main>
        <Router path={path} />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
