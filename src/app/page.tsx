"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  BookOpen,
  Star,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Microscope,
  HeartPulse,
  Brain,
  Stethoscope,
  Sparkles,
  Phone,
  Mail,
  Send,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { ConfigProvider, useSiteConfig, toEmbedUrl } from "@/lib/site-config";
import { ThemeProvider, useTheme } from "@/lib/theme-context";


/* ─── Static data (not configurable) ─── */
const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "Programme", href: "#programme" },
  { label: "Conférencier", href: "#speaker" },
  { label: "Témoignages", href: "#testimonials" },
  { label: "Galerie", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Inscription", href: "#reservation" },
];

const PROGRAMME_DAYS = [
  {
    day: "Jour 1",
    date: "4 Juin 2026",
    label: "Fondements & Découverte",
    items: [
      { time: "08:30", title: "Accueil & Enregistrement", desc: "Café de bienvenue, remise des badges et kits participants dans le hall principal.", icon: Users },
      { time: "09:00", title: "Introduction à la médecine quantique et nano médecine", desc: "Présentation des fondements théoriques et des principes clés de la médecine quantique et de la nano médecine appliquées à la pratique clinique.", icon: Brain },
      { time: "10:30", title: "Pause café & Networking", desc: "Échange entre professionnels, visite des stands partenaires et découverte des outils innovants.", icon: Sparkles },
      { time: "11:00", title: "Médecine quantique en pratique clinique", desc: "Démonstration en direct des techniques de médecine quantique et nano médecine appliquées au diagnostic et au traitement.", icon: Stethoscope },
      { time: "12:30", title: "Déjeuner", desc: "Repas gastronomique avec vue panoramique, opportunité de discussions approfondies avec le conférencier.", icon: HeartPulse },
      { time: "14:00", title: "Ateliers pratiques interactifs", desc: "Sessions pratiques en petits groupes pour appliquer les méthodes présentées sur des cas cliniques réels.", icon: Microscope },
      { time: "16:00", title: "Table ronde & Questions-Réponses", desc: "Discussion ouverte avec le conférencier, partage d'expériences et perspectives d'avenir pour la médecine quantique et la nano médecine.", icon: BookOpen },
      { time: "18:30", title: "Fin de la journée 1", desc: "Clôture de la première journée, récapitulatif des points clés abordés et programme du lendemain.", icon: Award },
    ],
  },
  {
    day: "Jour 2",
    date: "5 Juin 2026",
    label: "Approfondissement & Pratique",
    items: [
      { time: "08:30", title: "Accueil & Café matinal", desc: "Café de bienvenue et échanges informels sur les enseignements de la première journée.", icon: Users },
      { time: "09:00", title: "Médecine quantique et nano médecine avancées", desc: "Exploration approfondie des mécanismes quantiques et nanotechnologiques et de leurs applications thérapeutiques avancées.", icon: Brain },
      { time: "10:30", title: "Pause café & Networking", desc: "Pause échanges, discussions ciblées avec les partenaires et découverte de nouvelles technologies médicales.", icon: Sparkles },
      { time: "11:00", title: "Études de cas cliniques", desc: "Analyse détaillée de cas réels, mise en application des concepts de médecine quantique et nano médecine dans des situations cliniques complexes.", icon: Stethoscope },
      { time: "12:30", title: "Déjeuner", desc: "Déjeuner thématique avec tables rondes spontanées autour des sujets abordés le matin.", icon: HeartPulse },
      { time: "14:00", title: "Ateliers de simulation clinique", desc: "Mises en situation réelles encadrées par le conférencier, exercices pratiques sur des cas multidisciplinaires.", icon: Microscope },
      { time: "16:30", title: "Session Questions-Réponses", desc: "Espace de dialogue ouvert pour approfondir les points techniques et lever les zones d'ombre.", icon: BookOpen },
      { time: "18:30", title: "Fin de la journée 2", desc: "Bilan intermédiaire, synthèse des acquis et préparation de la journée de clôture.", icon: Award },
    ],
  },
  {
    day: "Jour 3",
    date: "6 Juin 2026",
    label: "Synthèse & Certification",
    items: [
      { time: "08:30", title: "Accueil & Café matinal", desc: "Café de bienvenue et derniers échanges informels avant la journée de synthèse.", icon: Users },
      { time: "09:00", title: "Synthèse de la médecine quantique et nano médecine", desc: "Vue d'ensemble intégrative de l'ensemble des concepts, méthodes et outils présentés lors des deux premiers jours.", icon: Brain },
      { time: "10:30", title: "Pause café & Networking", desc: "Dernier temps d'échange entre participants et partenaires, consolidation du réseau professionnel.", icon: Sparkles },
      { time: "11:00", title: "Plan d'action personnalisé", desc: "Élaboration d'un plan de mise en pratique adapté au contexte professionnel de chaque participant.", icon: Stethoscope },
      { time: "12:30", title: "Déjeuner", desc: "Dernier repas convivial, échanges sur les perspectives de collaboration et de suivi post-formation.", icon: HeartPulse },
      { time: "14:00", title: "Forum d'échange & Retours d'expérience", desc: "Partage collectif des apprentissages, retours des participants et discussion sur les perspectives d'intégration.", icon: Microscope },
      { time: "16:00", title: "Conférence de clôture", desc: "Mot de synthèse du conférencier, perspectives d'avenir et annonce des prochaines éditions.", icon: BookOpen },
      { time: "18:00", title: "Clôture & Remise des certificats", desc: "Cérémonie solennelle de remise des attestations de participation, photos officielles et cocktail de clôture.", icon: Award },
    ],
  },
];

const FAQ_ITEMS = [
  { q: "Qui peut participer à cette conférence ?", a: "La conférence est ouverte à tous les professionnels de santé : médecins, chirurgiens, pharmaciens, kinésithérapeutes, infirmiers spécialisés, ainsi que les étudiants en fin de cycle en sciences médicales. Toute personne intéressée par les approches innovantes en médecine est la bienvenue." },
  { q: "Comment s'inscrire et quels sont les modes de paiement ?", a: "L'inscription se fait via le formulaire sur cette page ou directement par WhatsApp. Les modes de paiement acceptés sont le virement bancaire, CCP, et le paiement sur place (sous réserve de places disponibles). Un acompte de 30% est requis pour confirmer votre réservation." },
  { q: "Y a-t-il un certificat de participation ?", a: "Oui, chaque participant recevra un certificat officiel de participation attestant des heures de formation continue, reconnu par les instances médicales compétentes. Ce certificat peut être utilisé pour la validation de crédits de formation continue." },
  { q: "La conférence est-elle en français ?", a: "Oui, la conférence se déroule entièrement en français. Le support visuel et les documents fournis sont également en français. Des traducteurs seront disponibles si nécessaire pour les participants anglophones." },
  { q: "Qu'est-ce qui est inclus dans l'inscription ?", a: "L'inscription inclut l'accès à toutes les sessions de la conférence sur les 3 jours, le kit participant, les déjeuners premium, les pauses café, le certificat de participation, et l'accès aux enregistrements vidéo des sessions pendant 6 mois après l'événement." },
];

const STATS = [
  { value: 25, suffix: "", label: "Participants attendus", icon: Users },
  { value: 30, suffix: "", label: "Méthodes présentées", icon: Microscope },
  { value: 25, suffix: "+", label: "Expérience", icon: Award },
  { value: 3, suffix: " jours", label: "De formation", icon: Clock },
];

/* ─── helpers ─── */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
  };
  // Start with zeros to avoid SSR/client hydration mismatch
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const isFirst = useRef(true);
  useEffect(() => {
    // Update immediately on client, then every second
    const tick = () => { setCd(calc()); };
    if (isFirst.current) { isFirst.current = false; tick(); }
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return cd;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0; const step = Math.max(1, Math.floor(target / 60));
    const id = setInterval(() => { start += step; if (start >= target) { setCount(target); clearInterval(id); } else setCount(start); }, 25);
    return () => clearInterval(id);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══════════════════════════════════════
   PAGE CONTENT (reads from ConfigProvider)
   ═══════════════════════════════════════ */

function PageContent() {
  const { config } = useSiteConfig();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`${isLight ? "light-mode" : ""} ${isLight ? "bg-white text-slate-900" : "bg-[#02120D] text-slate-100"} font-sans overflow-x-hidden transition-colors duration-500`}>
      <Navbar config={config} />
      <HeroSection config={config} />
      <StatsSection />
      <ProgrammeSection config={config} />
      <SpeakerSection config={config} />
      <VideoSection config={config} />
      <TestimonialsSection config={config} />
      <GallerySection />
      <FAQSection />
      <ReservationSection config={config} />
      <Footer config={config} />
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? `nav-blur ${isLight ? "bg-white/90 border-b border-slate-200 shadow-2xl" : "bg-[#02120D]/80 border-b border-white/5 shadow-2xl"}` : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <img src={config.LOGO_IMG} alt={`${config.ORG_NAME} Logo`} className="h-10 w-auto rounded-lg group-hover:shadow-amber-500/20 transition-shadow" />
          <div className="hidden sm:block">
            <div className={`${isLight ? "text-amber-600" : "text-amber-300"} font-semibold text-sm tracking-wider uppercase transition-colors duration-500`}>{config.ORG_NAME}</div>
            <div className={`${isLight ? "text-slate-400" : "text-slate-500"} text-[11px] transition-colors duration-500`}>{config.ORG_TAGLINE}</div>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (<a key={l.href} href={l.href} className={`px-4 py-2 rounded-xl text-sm ${isLight ? "text-slate-600 hover:text-amber-600 hover:bg-amber-50" : "text-slate-300 hover:text-amber-300 hover:bg-white/5"} transition-all duration-300`}>{l.label}</a>))}
          <button onClick={toggleTheme} className={`ml-2 p-2.5 rounded-xl ${isLight ? "hover:bg-amber-50 text-amber-600" : "hover:bg-white/10 text-amber-300"} transition-all duration-300`} aria-label="Toggle theme">
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggleTheme} className={`p-2.5 rounded-xl ${isLight ? "hover:bg-amber-50 text-amber-600" : "hover:bg-white/10 text-amber-300"} transition-all duration-300`} aria-label="Toggle theme">
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <a href="#reservation" className={`hidden sm:inline-flex px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 transition-all duration-300 hover:-translate-y-0.5`}>Réserver</a>
          <button onClick={() => setOpen(!open)} className={`p-2 rounded-xl ${isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-white/10 text-white"} transition-colors`} aria-label="Menu">{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
        <a href="#reservation" className="hidden lg:inline-flex px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 transition-all duration-300 hover:-translate-y-0.5">Réserver</a>
      </div>
      <AnimatePresence>{open && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`lg:hidden ${isLight ? "bg-white/95" : "bg-[#02120D]/95"} nav-blur border-t ${isLight ? "border-slate-200" : "border-white/5"} overflow-hidden`}><div className="px-6 py-4 space-y-1">{NAV_LINKS.map((l) => (<a key={l.href} href={l.href} onClick={() => setOpen(false)} className={`block px-4 py-3 rounded-xl ${isLight ? "text-slate-600 hover:text-amber-600 hover:bg-amber-50" : "text-slate-300 hover:text-amber-300 hover:bg-white/5"} transition-all`}>{l.label}</a>))}<a href="#reservation" onClick={() => setOpen(false)} className="block mt-3 text-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-medium transition-all">Réserver ma place</a></div></motion.div>)}</AnimatePresence>
    </nav>
  );
}

/* ─── Hero ─── */
function HeroSection({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const cd = useCountdown(new Date(config.EVENT_START_DATE));
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${isLight ? "from-[#faf9f6] via-[#f0ebe3] to-[#faf9f6]" : "from-[#02120D] via-[#052E26] to-[#02120D]"} transition-colors duration-500`} />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_#D4A017_1px,_transparent_1px)] bg-[length:28px_28px]" />
        <div className={`absolute -top-40 right-0 w-[700px] h-[700px] rounded-full ${isLight ? "bg-emerald-300/10" : "bg-emerald-500/15"} blur-[120px] animate-float transition-colors duration-500`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full ${isLight ? "bg-amber-300/8" : "bg-amber-400/8"} blur-[100px] animate-float-delayed transition-colors duration-500`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full ${isLight ? "bg-emerald-300/8" : "bg-emerald-700/10"} blur-[80px] transition-colors duration-500`} />
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[88vh]">
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full ${isLight ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-white/[0.06] border border-white/10 backdrop-blur-xl text-amber-300"} text-xs sm:text-sm tracking-[0.25em] uppercase shadow-xl mb-8 transition-colors duration-500`}><Sparkles className="w-4 h-4" />Première fois en Algérie</div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-7xl font-extralight leading-[1.05] ${isLight ? "text-slate-900" : "text-white"} mb-8 transition-colors duration-500`}>
              Application pratique de la <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent">médecine quantique</span> et nano médecine
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className={`text-lg sm:text-xl leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300/90"} mb-10 max-w-2xl transition-colors duration-500`}>
              Une expérience médicale internationale premium organisée par <span className={`${isLight ? "text-amber-600" : "text-amber-300"} font-medium transition-colors duration-500`}>{config.ORG_NAME}</span>, destinée aux professionnels de santé souhaitant découvrir des approches innovantes appliquées à la pratique clinique moderne.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="flex flex-wrap gap-3 mb-10">
              {[{ icon: Calendar, text: config.EVENT_DATES_TEXT }, { icon: Clock, text: config.EVENT_DAYS_TEXT + " — 08:30 / 18:30" }, { icon: MapPin, text: config.EVENT_VENUE }].map((item) => (
                <div key={item.text} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${isLight ? "bg-slate-100 border border-slate-200 text-slate-700" : "bg-white/[0.05] border border-white/[0.08] text-slate-300"} text-sm transition-colors duration-500`}><item.icon className="w-4 h-4 text-amber-400" />{item.text}</div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="grid grid-cols-4 gap-3 mb-10 max-w-md">
              {[{ v: cd.d, l: "Jours" }, { v: cd.h, l: "Heures" }, { v: cd.m, l: "Minutes" }, { v: cd.s, l: "Secondes" }].map((c) => (
                <div key={c.l} className={`rounded-2xl ${isLight ? "bg-white border border-slate-200" : "bg-white/[0.05] border border-white/[0.08]"} p-3 text-center backdrop-blur-lg transition-colors duration-500`}><div className={`text-2xl sm:text-3xl font-light ${isLight ? "text-amber-600" : "text-amber-300"} tabular-nums transition-colors duration-500`}>{String(c.v).padStart(2, "0")}</div><div className={`text-[11px] sm:text-xs ${isLight ? "text-slate-500" : "text-slate-500"} mt-0.5`}>{c.l}</div></div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="flex flex-wrap gap-4 items-center">
              <a href="#reservation" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-lg shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-400/40 font-medium">Réserver ma place<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></a>
              <a href="#programme" className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl border ${isLight ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400" : "border-white/15 bg-white/[0.04] backdrop-blur-lg text-white hover:bg-white/[0.08] hover:border-white/25"} text-lg shadow-lg transition-all duration-300`}>Voir le programme</a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }} className="relative flex justify-center">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border ${isLight ? "border-amber-300/20" : "border-amber-400/10"} animate-rotate-slow transition-colors duration-500`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border ${isLight ? "border-emerald-300/15" : "border-emerald-400/5"} animate-rotate-slow transition-colors duration-500`} style={{ animationDirection: "reverse", animationDuration: "30s" }} />
            <div className={`relative ${isLight ? "bg-white border-slate-200 shadow-xl" : "glass-strong"} rounded-[40px] p-8 sm:p-10 max-w-lg shimmer-effect pulse-glow transition-colors duration-500`}>
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto rounded-[32px] overflow-hidden border border-amber-300/15 shadow-2xl mb-8 bg-black">
                <img src={config.SPEAKER_IMG} alt={`${config.SPEAKER_NAME} — Conférencier international`} className="w-full h-full object-cover object-top" />
                <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? "from-slate-900/40" : "from-black/80"} via-black/10 to-transparent transition-colors duration-500`} />
                <div className="absolute bottom-4 left-4 right-4"><div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isLight ? "bg-amber-100/80 border border-amber-300/30 text-amber-700" : "bg-black/60 backdrop-blur-xl border border-amber-400/20 text-amber-300"} text-xs tracking-[0.2em] uppercase transition-colors duration-500`}><Star className="w-3 h-3" />Conférencier international</div></div>
              </div>
              <div className="text-center">
                <h2 className={`text-3xl sm:text-4xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-1.5 transition-colors duration-500`}>{config.SPEAKER_NAME}</h2>
                <p className={`text-lg ${isLight ? "text-amber-600/80" : "text-amber-300/80"} mb-6 transition-colors duration-500`}>{config.SPEAKER_TITLE}</p>
                <div className={`rounded-2xl ${isLight ? "bg-gradient-to-r from-amber-50 to-white border border-slate-200" : "bg-gradient-to-r from-[#064E3B] to-[#02120D] border border-white/[0.06]"} p-5 shadow-xl transition-colors duration-500`}><p className={`leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"} transition-colors duration-500`}>{config.SPEAKER_BIO}</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${isLight ? "text-slate-400" : "text-slate-500"} z-10 transition-colors duration-500`}><span className="text-xs tracking-widest uppercase">Défiler</span><ChevronDown className="w-5 h-5 animate-bounce" /></motion.div>
    </section>
  );
}

/* ─── Stats ─── */
function StatsSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <section className={`relative py-16 px-6 ${isLight ? "bg-slate-50 border-y border-slate-200" : "bg-[#02120D] border-y border-white/[0.04]"} transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{STATS.map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.1 }} className="text-center p-6 rounded-2xl glass hover:bg-white/[0.06] transition-colors duration-300"><s.icon className="w-6 h-6 text-amber-400 mx-auto mb-3" /><div className={`text-3xl sm:text-4xl font-light ${isLight ? "text-amber-600" : "text-amber-300"} mb-1 transition-colors duration-500`}><AnimatedCounter target={s.value} suffix={s.suffix} /></div><div className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"} transition-colors duration-500`}>{s.label}</div></motion.div>))}</div></div>
    </section>
  );
}

/* ─── Programme ─── */
function ProgrammeSection({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const [activeDay, setActiveDay] = useState(0);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const currentDay = PROGRAMME_DAYS[activeDay];

  const dayColors = [
    { accent: "from-amber-500 to-amber-400", glow: "shadow-amber-500/25", bg: "bg-amber-500", text: "text-amber-300", border: "border-amber-500/20", lightBg: "bg-amber-500/10", iconBg: "bg-amber-500/10", iconColor: "text-amber-400", dotBg: "bg-amber-500", dotShadow: "shadow-amber-500/30", line: "from-amber-500/30", gradient: "from-amber-500/5" },
    { accent: "from-emerald-500 to-emerald-400", glow: "shadow-emerald-500/25", bg: "bg-emerald-500", text: "text-emerald-300", border: "border-emerald-500/20", lightBg: "bg-emerald-500/10", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", dotBg: "bg-emerald-500", dotShadow: "shadow-emerald-500/30", line: "from-emerald-500/30", gradient: "from-emerald-500/5" },
    { accent: "from-rose-500 to-rose-400", glow: "shadow-rose-500/25", bg: "bg-rose-500", text: "text-rose-300", border: "border-rose-500/20", lightBg: "bg-rose-500/10", iconBg: "bg-rose-500/10", iconColor: "text-rose-400", dotBg: "bg-rose-500", dotShadow: "shadow-rose-500/30", line: "from-rose-500/30", gradient: "from-rose-500/5" },
  ];

  const c = dayColors[activeDay];

  return (
    <section id="programme" className={`py-24 px-6 bg-gradient-to-b ${isLight ? "from-white via-slate-50 to-white" : "from-[#02120D] via-black to-[#02120D]"} relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Programme de formation — {config.EVENT_DATES_TEXT}</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>{config.EVENT_DAYS_TEXT} d&apos;immersion</h2>
          <div className="gold-line max-w-xs mx-auto mb-6" />
          <p className={`text-lg ${isLight ? "text-slate-500" : "text-slate-400"} max-w-3xl mx-auto transition-colors duration-500`}>Un programme soigneusement conçu sur {config.EVENT_DAYS_TEXT.toLowerCase()} pour offrir une expérience d&apos;apprentissage complète, alliant théorie, pratique et échanges professionnels.</p>
        </motion.div>

        {/* ─── Premium Day Cards ─── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-14 max-w-3xl mx-auto">
          {PROGRAMME_DAYS.map((day, i) => {
            const dc = dayColors[i];
            const isActive = activeDay === i;
            return (
              <motion.button
                key={day.day}
                onClick={() => setActiveDay(i)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-left transition-all duration-500 overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-br ${dc.accent} text-black shadow-2xl ${dc.glow}`
                    : isLight ? "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50" : "glass text-white hover:bg-white/[0.06]"
                }`}
              >
                {/* Background glow for active */}
                {isActive && (
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${dc.bg} opacity-20 blur-[40px]`} />
                )}

                {/* Day number - large watermark */}
                <div className={`absolute -bottom-3 -right-2 text-7xl sm:text-8xl font-black leading-none ${
                  isActive ? "text-black/10" : isLight ? "text-slate-900/[0.04]" : "text-white/[0.03]"
                }`}>
                  {i + 1}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className={`text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold mb-1 sm:mb-2 ${
                    isActive ? "text-black/60" : `text-slate-500`
                  }`}>
                    {day.day}
                  </div>
                  <div className={`text-sm sm:text-base font-semibold mb-1 ${
                    isActive ? "text-black" : isLight ? "text-slate-900" : "text-white"
                  }`}>
                    {day.label.split(" & ")[0]}
                  </div>
                  <div className={`text-xs sm:text-sm ${
                    isActive ? "text-black/70" : isLight ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {day.label.includes("&") ? day.label.split(" & ")[1] : ""}
                  </div>
                  <div className={`mt-2 sm:mt-3 text-[10px] sm:text-xs flex items-center gap-1.5 ${
                    isActive ? "text-black/50" : isLight ? "text-slate-400" : "text-slate-600"
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {day.date}
                  </div>

                  {/* Session count */}
                  <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium ${
                    isActive ? "bg-black/15 text-black/70" : isLight ? "bg-slate-100 text-slate-500" : "bg-white/[0.05] text-slate-500"
                  }`}>
                    <Clock className="w-2.5 h-2.5" />
                    {day.items.length} sessions
                  </div>
                </div>

                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeDayIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-t-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Day content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${c.lightBg} border ${c.border} ${c.text} text-sm tracking-wider font-medium`}>
                <Calendar className="w-4 h-4" />
                {currentDay.day} — {currentDay.label}
              </div>
            </div>

            <div className="relative">
              <div className={`absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b ${c.line} via-transparent to-transparent`} />
              <div className="space-y-8">{currentDay.items.map((item, i) => (<motion.div key={item.time + activeDay} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${c.dotBg} ${isLight ? "border-white" : "border-[#02120D]"} border-4 z-10 shadow-lg ${c.dotShadow} transition-colors duration-500`} />
                <div className="w-12 shrink-0 md:hidden" />
                <div className={`flex-1 ml-4 md:ml-0 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}><div className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-colors duration-300 shimmer-effect"><div className="flex items-center gap-3 mb-3"><div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center`}><item.icon className={`w-4 h-4 ${c.iconColor}`} /></div><span className={`${c.text} font-medium text-sm tracking-wide`}>{item.time}</span></div><h3 className={`text-lg font-medium ${isLight ? "text-slate-900" : "text-white"} mb-2 transition-colors duration-500`}>{item.title}</h3><p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"} leading-relaxed transition-colors duration-500`}>{item.desc}</p></div></div>
                <div className="hidden md:block flex-1" />
              </motion.div>))}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Speaker ─── */
function SpeakerSection({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <section id="speaker" className={`py-24 px-6 ${isLight ? "bg-slate-50" : "bg-black"} relative overflow-hidden transition-colors duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${isLight ? "from-white/50 via-slate-50 to-white/50" : "from-[#02120D]/50 via-black to-[#02120D]/50"} transition-colors duration-500`} />
      <div className="absolute top-20 left-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[80px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Le Conférencier</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>{config.SPEAKER_NAME}</h2>
          <div className="gold-line max-w-xs mx-auto" />
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative rounded-[32px] overflow-hidden border border-amber-300/10 shadow-2xl aspect-[4/5] max-w-md mx-auto">
              <img src={config.SPEAKER_IMG} alt={config.SPEAKER_NAME} className="w-full h-full object-cover object-top" />
              <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? "from-slate-900/40" : "from-black/70"} via-transparent to-transparent transition-colors duration-500`} />
            </div>
            <div className="absolute -inset-3 rounded-[40px] border border-amber-400/10 pointer-events-none" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            <h3 className={`text-2xl sm:text-3xl font-extralight ${isLight ? "text-slate-900" : "text-white"} transition-colors duration-500`}>{config.SPEAKER_TITLE}</h3>
            <p className={`text-lg ${isLight ? "text-slate-600" : "text-slate-300"} leading-relaxed transition-colors duration-500`}>{config.SPEAKER_NAME} est un chercheur et conférencier international de renom, spécialisé dans la médecine quantique et la nano médecine appliquées à la santé. Auteur du livre « Le Déclin du Cancer — Au carrefour des connaissances », vendu à plus de 25 000 exemplaires. Avec plus de 25 ans d&apos;expérience, il a donné plus de 500 conférences à travers le monde et formé plus de 19 000 personnes.</p>
            <p className={`${isLight ? "text-slate-500" : "text-slate-400"} leading-relaxed transition-colors duration-500`}>{config.SPEAKER_BIO_EXTENDED}</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[{ icon: Award, label: "25+ ans d'expertise" }, { icon: BookOpen, label: "Auteur: Le Déclin du Cancer" }, { icon: Users, label: "19 000+ personnes formées" }, { icon: MapPin, label: "500+ conférences mondiales" }].map((item) => (
                <div key={item.label} className={`flex items-center gap-3 p-4 rounded-xl ${isLight ? "bg-white border border-slate-200" : "bg-white/[0.04] border border-white/[0.06]"} transition-colors duration-500`}><item.icon className="w-5 h-5 text-amber-400 shrink-0" /><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-300"} transition-colors duration-500`}>{item.label}</span></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Video ─── */
function VideoSection({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <section className={`py-24 px-6 bg-gradient-to-b ${isLight ? "from-white to-slate-50" : "from-[#02120D] to-black"} relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Expérience Internationale</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>Découvrez l&apos;univers de la formation</h2>
          <div className="gold-line max-w-xs mx-auto mb-6" />
          <p className={`text-lg ${isLight ? "text-slate-500" : "text-slate-400"} max-w-3xl mx-auto transition-colors duration-500`}>Un aperçu immersif de conférences précédentes, méthodes présentées et témoignages de professionnels ayant participé aux éditions internationales de {config.ORG_NAME}.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className={`rounded-[32px] overflow-hidden ${isLight ? "bg-white border border-slate-200" : "border border-white/[0.08] glass"} shadow-2xl p-2 sm:p-3 transition-colors duration-500`}>
          <div className="relative aspect-video rounded-[24px] overflow-hidden">
            <iframe className="w-full h-full" src={toEmbedUrl(config.VIDEO_PRESENTATION_URL)} title="Présentation vidéo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function TestimonialsSection({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const testimonials = [
    { quote: config.TESTIMONIAL_1_QUOTE, name: config.TESTIMONIAL_1_NAME, role: config.TESTIMONIAL_1_ROLE, rating: Math.min(5, Math.max(1, parseInt(config.TESTIMONIAL_1_RATING) || 5)) },
    { quote: config.TESTIMONIAL_2_QUOTE, name: config.TESTIMONIAL_2_NAME, role: config.TESTIMONIAL_2_ROLE, rating: Math.min(5, Math.max(1, parseInt(config.TESTIMONIAL_2_RATING) || 5)) },
    { quote: config.TESTIMONIAL_3_QUOTE, name: config.TESTIMONIAL_3_NAME, role: config.TESTIMONIAL_3_ROLE, rating: Math.min(5, Math.max(1, parseInt(config.TESTIMONIAL_3_RATING) || 5)) },
  ];
  return (
    <section id="testimonials" className={`py-24 px-6 ${isLight ? "bg-slate-50" : "bg-black"} relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[100px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Témoignages</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>Ils ont vécu l&apos;expérience</h2>
          <div className="gold-line max-w-xs mx-auto mb-6" />
          <p className={`text-lg ${isLight ? "text-slate-500" : "text-slate-400"} max-w-3xl mx-auto transition-colors duration-500`}>Retours de professionnels ayant participé aux précédentes éditions internationales.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => (<motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: i * 0.15 }} className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/[0.06] transition-all duration-500 group shimmer-effect">
            <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />))}</div>
            <p className={`${isLight ? "text-slate-600" : "text-slate-300"} leading-relaxed mb-6 text-sm sm:text-base transition-colors duration-500`}>&ldquo;{t.quote}&rdquo;</p>
            <div className={`flex items-center gap-3 pt-4 border-t ${isLight ? "border-slate-200" : "border-white/[0.06]"} transition-colors duration-500`}><div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm">{t.name.charAt(0)}</div><div><div className={`${isLight ? "text-slate-900" : "text-white"} font-medium text-sm transition-colors duration-500`}>{t.name}</div><div className={`${isLight ? "text-slate-400" : "text-slate-500"} text-xs transition-colors duration-500`}>{t.role}</div></div></div>
          </motion.div>))}
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className={`max-w-4xl mx-auto ${isLight ? "bg-white border border-slate-200" : "glass"} rounded-[28px] p-2 sm:p-3 shadow-2xl transition-colors duration-500`}>
          <div className="relative aspect-video rounded-[22px] overflow-hidden">
            <iframe className="w-full h-full" src={toEmbedUrl(config.VIDEO_TESTIMONIAL_URL)} title="Témoignage vidéo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Gallery ─── */
const GALLERY_ALTS = [
  "Conférence Go Healthy Academy — Session plénière",
  "Atelier pratique en petits groupes",
  "Networking entre professionnels de santé",
  "Présentation de la médecine quantique et nano médecine",
  "Cérémonie de remise des certificats",
  "Moments d'échange et de partage",
];

function GallerySection() {
  const { config } = useSiteConfig();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const galleryImages = [
    { src: config.GALLERY_IMG_1, alt: GALLERY_ALTS[0] },
    { src: config.GALLERY_IMG_2, alt: GALLERY_ALTS[1] },
    { src: config.GALLERY_IMG_3, alt: GALLERY_ALTS[2] },
    { src: config.GALLERY_IMG_4, alt: GALLERY_ALTS[3] },
    { src: config.GALLERY_IMG_5, alt: GALLERY_ALTS[4] },
    { src: config.GALLERY_IMG_6, alt: GALLERY_ALTS[5] },
  ];

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const goPrev = () => setLightboxIdx((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
  const goNext = () => setLightboxIdx((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx]);

  return (
    <section id="gallery" className={`py-24 px-6 bg-gradient-to-b ${isLight ? "from-slate-50 to-white" : "from-black to-[#02120D]"} relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[80px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Galerie</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>Galerie Photos</h2>
          <div className="gold-line max-w-xs mx-auto mb-6" />
          <p className={`text-lg ${isLight ? "text-slate-500" : "text-slate-400"} max-w-3xl mx-auto transition-colors duration-500`}>Moments de nos éditions précédentes</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <div className={`relative overflow-hidden rounded-2xl aspect-[4/3] ${isLight ? "border border-slate-200 shadow-lg" : "glass border border-white/[0.06]"} transition-all duration-500`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <ImageIcon className="w-4 h-4" />
                    Voir l'image
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
                aria-label="Fermer"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
                <img
                  src={galleryImages[lightboxIdx].src}
                  alt={galleryImages[lightboxIdx].alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white text-sm sm:text-base">{galleryImages[lightboxIdx].alt}</p>
                  <p className="text-white/60 text-xs mt-1">{lightboxIdx + 1} / {galleryImages.length}</p>
                </div>
              </div>

              {/* Prev button */}
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-14 p-3 rounded-full ${isLight ? "bg-white/90 text-slate-900 hover:bg-white" : "bg-white/10 text-white hover:bg-white/20"} backdrop-blur-lg transition-all duration-300 shadow-xl`}
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next button */}
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-14 p-3 rounded-full ${isLight ? "bg-white/90 text-slate-900 hover:bg-white" : "bg-white/10 text-white hover:bg-white/20"} backdrop-blur-lg transition-all duration-300 shadow-xl`}
                aria-label="Image suivante"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <section id="faq" className={`py-24 px-6 bg-gradient-to-b ${isLight ? "from-white to-slate-50" : "from-[#02120D] to-black"} relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute top-20 left-1/3 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Questions fréquentes</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>FAQ</h2>
          <div className="gold-line max-w-xs mx-auto" />
        </motion.div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.08 }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full text-left glass rounded-2xl p-5 sm:p-6 hover:bg-white/[0.06] transition-all duration-300 group">
              <div className="flex items-center justify-between gap-4"><h3 className={`${isLight ? "text-slate-900" : "text-white"} font-medium text-sm sm:text-base transition-colors duration-500`}>{item.q}</h3><ChevronDown className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`} /></div>
              <AnimatePresence>{openIdx === i && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><p className={`pt-4 ${isLight ? "text-slate-500" : "text-slate-400"} leading-relaxed text-sm sm:text-base transition-colors duration-500`}>{item.a}</p></motion.div>)}</AnimatePresence>
            </button>
          </motion.div>))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reservation ─── */
export const SUBMISSIONS_KEY = "gha_submissions";

function ReservationSection({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [form, setForm] = useState({ name: "", profession: "", email: "", phone: "", message: "" });
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); }, []);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Save to database via API
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* still proceed even if API fails */ }
    // Send confirmation email if email is provided
    if (form.email) {
      try {
        await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            profession: form.profession,
          }),
        });
      } catch { /* email failure should not block the flow */ }
    }
    setSubmitted(true);
    // Build WhatsApp message with actual form data
    const waText = `📋 *Nouvelle inscription — ${config.ORG_NAME}*\n\n👤 *Nom:* ${form.name}\n💼 *Profession:* ${form.profession}\n📧 *Email:* ${form.email || "—"}\n📱 *WhatsApp:* ${form.phone}\n💬 *Message:* ${form.message || "—"}`;
    const waUrl = `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
    setTimeout(() => { window.location.href = waUrl; }, 1500);
  }, [config, form]);

  return (
    <section id="reservation" className={`py-24 px-6 ${isLight ? "bg-slate-50" : "bg-black"} relative overflow-hidden transition-colors duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${isLight ? "from-white/30 via-slate-50 to-white" : "from-[#02120D]/30 via-black to-[#02120D]"} transition-colors duration-500`} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className={`text-sm tracking-[0.35em] uppercase ${isLight ? "text-amber-600" : "text-amber-300"} mb-4 transition-colors duration-500`}>Inscription premium</div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight ${isLight ? "text-slate-900" : "text-white"} mb-6 transition-colors duration-500`}>Réservez votre place</h2>
          <div className="gold-line max-w-xs mx-auto mb-6" />
          <p className={`text-lg ${isLight ? "text-slate-500" : "text-slate-400"} max-w-2xl mx-auto transition-colors duration-500`}>Remplissez le formulaire ci-dessous pour réserver votre place. Vous serez ensuite redirigé vers WhatsApp pour finaliser votre inscription.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          {submitted ? (<div className="glass rounded-[28px] p-10 sm:p-14 text-center"><div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-8 h-8 text-emerald-400" /></div><h3 className={`text-2xl font-light ${isLight ? "text-slate-900" : "text-white"} mb-3 transition-colors duration-500`}>Demande envoyée !</h3><p className={`${isLight ? "text-slate-600" : "text-slate-400"} transition-colors duration-500`}>Vous allez être redirigé vers WhatsApp pour finaliser votre inscription...</p></div>) : (
            <form onSubmit={handleSubmit} className="glass rounded-[28px] p-8 sm:p-10 space-y-5">
              <div className="grid md:grid-cols-2 gap-5"><div><label className={`block text-sm ${isLight ? "text-slate-600" : "text-slate-400"} mb-2 transition-colors duration-500`}>Nom complet *</label><input name="name" required value={form.name} onChange={handleChange} placeholder="Votre nom complet" className={`w-full p-4 rounded-xl ${isLight ? "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-slate-600"} transition-all duration-300`} /></div><div><label className={`block text-sm ${isLight ? "text-slate-600" : "text-slate-400"} mb-2 transition-colors duration-500`}>Profession *</label><input name="profession" required value={form.profession} onChange={handleChange} placeholder="Votre profession" className={`w-full p-4 rounded-xl ${isLight ? "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-slate-600"} transition-all duration-300`} /></div></div>
              <div className="grid md:grid-cols-2 gap-5"><div><label className={`block text-sm ${isLight ? "text-slate-600" : "text-slate-400"} mb-2 transition-colors duration-500`}>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" className={`w-full p-4 rounded-xl ${isLight ? "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-slate-600"} transition-all duration-300`} /></div><div><label className={`block text-sm ${isLight ? "text-slate-600" : "text-slate-400"} mb-2 transition-colors duration-500`}>Numéro WhatsApp *</label><input name="phone" required value={form.phone} onChange={handleChange} placeholder="+213 ..." className={`w-full p-4 rounded-xl ${isLight ? "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-slate-600"} transition-all duration-300`} /></div></div>
              <div><label className={`block text-sm ${isLight ? "text-slate-600" : "text-slate-400"} mb-2 transition-colors duration-500`}>Message ou question</label><textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Votre message (optionnel)" className={`w-full p-4 rounded-xl ${isLight ? "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-slate-600"} transition-all duration-300 resize-none`} /></div>
              <button type="submit" disabled={submitting} className="group w-full py-4 sm:py-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-lg sm:text-xl font-medium shadow-2xl shadow-amber-500/20 hover:shadow-amber-400/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"><Send className={`w-5 h-5 ${submitting ? "animate-pulse" : ""}`} />{submitting ? "Envoi en cours..." : "Envoyer ma demande"}</button>
              <p className={`text-center ${isLight ? "text-slate-400" : "text-slate-600"} text-xs transition-colors duration-500`}>En soumettant ce formulaire, vous serez redirigé vers WhatsApp pour confirmer votre réservation.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer({ config }: { config: ReturnType<typeof useSiteConfig>["config"] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <footer className={`${isLight ? "bg-white border-t border-slate-200" : "bg-[#02120D] border-t border-white/[0.04]"} py-12 px-6 transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4"><img src={config.LOGO_IMG} alt={`${config.ORG_NAME} Logo`} className="h-10 w-auto rounded-lg" /><div><div className={`${isLight ? "text-amber-600" : "text-amber-300"} font-semibold text-sm tracking-wider uppercase transition-colors duration-500`}>{config.ORG_NAME}</div><div className={`${isLight ? "text-slate-400" : "text-slate-600"} text-[11px] transition-colors duration-500`}>{config.ORG_TAGLINE}</div></div></div>
            <p className={`${isLight ? "text-slate-500" : "text-slate-500"} text-sm leading-relaxed transition-colors duration-500`}>Application pratique de la médecine quantique et nano médecine. Première édition en Algérie — {config.EVENT_DATES_TEXT}.</p>
          </div>
          <div><h4 className={`${isLight ? "text-slate-900" : "text-white"} font-medium mb-4 text-sm transition-colors duration-500`}>Liens rapides</h4><div className="space-y-2">{NAV_LINKS.map((l) => (<a key={l.href} href={l.href} className={`block ${isLight ? "text-slate-400 hover:text-amber-600" : "text-slate-500 hover:text-amber-300"} text-sm transition-colors`}>{l.label}</a>))}</div></div>
          <div>
            <h4 className={`${isLight ? "text-slate-900" : "text-white"} font-medium mb-4 text-sm transition-colors duration-500`}>Contact</h4>
            <div className="space-y-3">
              <a href={`https://wa.me/${config.WHATSAPP_NUMBER}`} className={`flex items-center gap-3 ${isLight ? "text-slate-400 hover:text-amber-600" : "text-slate-500 hover:text-amber-300"} text-sm transition-colors`}><Phone className="w-4 h-4" />+{config.WHATSAPP_NUMBER.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4")}</a>
              <a href="mailto:contact@gohealthyacademy.com" className={`flex items-center gap-3 ${isLight ? "text-slate-400 hover:text-amber-600" : "text-slate-500 hover:text-amber-300"} text-sm transition-colors`}><Mail className="w-4 h-4" />contact@gohealthyacademy.com</a>
              <div className={`flex items-center gap-3 ${isLight ? "text-slate-400" : "text-slate-500"} text-sm transition-colors duration-500`}><MapPin className="w-4 h-4" />{config.EVENT_VENUE}</div>
              <div className={`flex items-center gap-3 ${isLight ? "text-slate-400" : "text-slate-500"} text-sm transition-colors duration-500`}><Calendar className="w-4 h-4" />{config.EVENT_DATES_TEXT}</div>
            </div>
          </div>
        </div>
        <div className="gold-line mb-6" />
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? "text-slate-400" : "text-slate-600"} text-xs transition-colors duration-500`}><div>&copy; {new Date().getFullYear()} {config.ORG_NAME}. Tous droits réservés.</div><div className="flex items-center gap-3"><span>Conçu avec excellence pour une expérience premium</span><a href="/admin" className={`opacity-30 hover:opacity-80 transition-opacity duration-300 ${isLight ? "text-slate-300" : "text-slate-700"} text-[10px]`} title="Administration">●</a></div></div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT — wrapped with ThemeProvider + ConfigProvider
   ═══════════════════════════════════════ */
export default function LuxuryQuantumLandingPage() {
  return (
    <ThemeProvider>
      <ConfigProvider>
        <PageContent />
      </ConfigProvider>
    </ThemeProvider>
  );
}
