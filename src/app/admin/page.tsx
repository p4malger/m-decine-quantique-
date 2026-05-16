"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Users,
  Calendar,
  TrendingUp,
  Download,
  Send,
  Trash2,
  Search,
  Eye,
  X,
  LogOut,
  Shield,
  ChevronDown,
  ChevronUp,
  Bell,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Save,
  Image,
  Video,
  FileText,
  Phone,
  MessageSquare,
  Camera,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { ConfigProvider, useSiteConfig, toEmbedUrl } from "@/lib/site-config";
import type { SiteConfig } from "@/lib/site-config";
import { ThemeProvider, useTheme } from "@/lib/theme-context";

/* ─── Field definitions grouped by category ─── */
const CATEGORIES: {
  icon: typeof Image;
  title: string;
  titleAr: string;
  fields: { key: keyof SiteConfig; label: string; hint: string; multiline?: boolean }[];
}[] = [
  {
    icon: Video,
    title: "Vidéos",
    titleAr: "الفيديوهات",
    fields: [
      {
        key: "VIDEO_PRESENTATION_URL",
        label: "Vidéo de présentation",
        hint: "Collez le lien YouTube complet (ex: https://youtube.com/watch?v=...)",
      },
      {
        key: "VIDEO_TESTIMONIAL_URL",
        label: "Vidéo témoignage",
        hint: "Collez le lien YouTube complet (ex: https://youtube.com/watch?v=...)",
      },
    ],
  },
  {
    icon: Image,
    title: "Images",
    titleAr: "الصور",
    fields: [
      {
        key: "SPEAKER_IMG",
        label: "Photo du conférencier",
        hint: "Chemin dans /public/ (ex: /speaker.jpg) ou URL externe",
      },
      {
        key: "LOGO_IMG",
        label: "Logo",
        hint: "Chemin dans /public/ (ex: /logo.png) ou URL externe",
      },
    ],
  },
  {
    icon: Camera,
    title: "Galerie Photos",
    titleAr: "معرض الصور",
    fields: [
      { key: "GALLERY_IMG_1", label: "Photo galerie 1", hint: "Chemin /public/ ou URL externe" },
      { key: "GALLERY_IMG_2", label: "Photo galerie 2", hint: "Chemin /public/ ou URL externe" },
      { key: "GALLERY_IMG_3", label: "Photo galerie 3", hint: "Chemin /public/ ou URL externe" },
      { key: "GALLERY_IMG_4", label: "Photo galerie 4", hint: "Chemin /public/ ou URL externe" },
      { key: "GALLERY_IMG_5", label: "Photo galerie 5", hint: "Chemin /public/ ou URL externe" },
      { key: "GALLERY_IMG_6", label: "Photo galerie 6", hint: "Chemin /public/ ou URL externe" },
    ],
  },
  {
    icon: FileText,
    title: "Textes & Événement",
    titleAr: "النصوص والحدث",
    fields: [
      { key: "ORG_NAME", label: "Nom de l'organisation", hint: "" },
      { key: "ORG_TAGLINE", label: "Sous-titre", hint: "" },
      { key: "SPEAKER_NAME", label: "Nom du conférencier", hint: "" },
      { key: "SPEAKER_TITLE", label: "Titre du conférencier", hint: "" },
      { key: "SPEAKER_BIO", label: "Biographie courte", hint: "", multiline: true },
      { key: "SPEAKER_BIO_EXTENDED", label: "Biographie étendue", hint: "", multiline: true },
      { key: "EVENT_DATES_TEXT", label: "Dates affichées", hint: "ex: 4, 5 & 6 Juin 2026" },
      { key: "EVENT_DAYS_TEXT", label: "Nombre de jours", hint: "ex: 3 Jours" },
      { key: "EVENT_START_DATE", label: "Date de début (pour le compte à rebours)", hint: "Format: 2026-06-04T09:00:00" },
      { key: "EVENT_VENUE", label: "Lieu", hint: "" },
    ],
  },
  {
    icon: Phone,
    title: "WhatsApp",
    titleAr: "واتساب",
    fields: [
      {
        key: "WHATSAPP_NUMBER",
        label: "Numéro WhatsApp",
        hint: "Sans + (ex: 213657867444)",
      },
      {
        key: "WHATSAPP_MESSAGE",
        label: "Message WhatsApp par défaut",
        hint: "",
        multiline: true,
      },
    ],
  },
  {
    icon: MessageSquare,
    title: "Témoignages",
    titleAr: "الآراء والشهادات",
    fields: [
      {
        key: "TESTIMONIAL_1_QUOTE",
        label: "Témoignage 1 — Citation",
        hint: "Le texte entre guillemets",
        multiline: true,
      },
      { key: "TESTIMONIAL_1_NAME", label: "Témoignage 1 — Nom", hint: "ex: Dr Amine B." },
      { key: "TESTIMONIAL_1_ROLE", label: "Témoignage 1 — Profession & Ville", hint: "ex: Cardiologue — Paris" },
      { key: "TESTIMONIAL_1_RATING", label: "Témoignage 1 — Note (1-5)", hint: "Nombre d'étoiles de 1 à 5" },
      {
        key: "TESTIMONIAL_2_QUOTE",
        label: "Témoignage 2 — Citation",
        hint: "Le texte entre guillemets",
        multiline: true,
      },
      { key: "TESTIMONIAL_2_NAME", label: "Témoignage 2 — Nom", hint: "ex: Dr Sarah M." },
      { key: "TESTIMONIAL_2_ROLE", label: "Témoignage 2 — Profession & Ville", hint: "ex: Médecin — Casablanca" },
      { key: "TESTIMONIAL_2_RATING", label: "Témoignage 2 — Note (1-5)", hint: "Nombre d'étoiles de 1 à 5" },
      {
        key: "TESTIMONIAL_3_QUOTE",
        label: "Témoignage 3 — Citation",
        hint: "Le texte entre guillemets",
        multiline: true,
      },
      { key: "TESTIMONIAL_3_NAME", label: "Témoignage 3 — Nom", hint: "ex: Dr Karim L." },
      { key: "TESTIMONIAL_3_ROLE", label: "Témoignage 3 — Profession & Ville", hint: "ex: Neurologue — Tunis" },
      { key: "TESTIMONIAL_3_RATING", label: "Témoignage 3 — Note (1-5)", hint: "Nombre d'étoiles de 1 à 5" },
    ],
  },
];

/* ─── Types ─── */
interface Submission {
  id: string;
  name: string;
  profession: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
}

interface DashboardData {
  submissions: Submission[];
  stats: Stats;
}

type TabId = "dashboard" | "settings";

/* ─── Admin Content (needs ConfigProvider + ThemeProvider) ─── */
function AdminContent() {
  const { config, setConfigValue, resetConfig } = useSiteConfig();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [showReminderConfirm, setShowReminderConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Settings tab state
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(["Vidéos"]));
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.status === 401) {
        setAuthenticated(false);
        setData(null);
      } else if (res.ok) {
        const json = await res.json();
        setData(json);
        setAuthenticated(true);
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        setPassword("");
        await fetchData();
      } else {
        const json = await res.json();
        setLoginError(json.error || "Invalid password");
      }
    } catch {
      setLoginError("Connection error");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setData(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) =>
          prev
            ? {
                submissions: prev.submissions.filter((s) => s.id !== id),
                stats: { ...prev.stats, total: prev.stats.total - 1 },
              }
            : null
        );
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
        showToast("Inscription supprimée", "success");
      }
    } catch {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/export");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GHA_Inscriptions_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Export Excel téléchargé", "success");
      } else {
        showToast("Erreur lors de l'export", "error");
      }
    } catch {
      showToast("Erreur de connexion", "error");
    }
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    setShowReminderConfirm(false);
    try {
      const res = await fetch("/api/admin/send-reminder", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        showToast(
          json.method === "console_log"
            ? `${json.total} rappels loggés (SMTP non configuré)`
            : `${json.sent} emails de rappel envoyés sur ${json.total}`,
          "success"
        );
      } else {
        showToast("Erreur lors de l'envoi des rappels", "error");
      }
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setSendingReminder(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const toggleCat = (title: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const handleSave = () => {
    // Force persist current config to localStorage
    try {
      localStorage.setItem("gha_site_config", JSON.stringify(config));
    } catch {
      // ignore storage errors
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    showToast("Paramètres sauvegardés avec succès ✓", "success");
  };

  const handleReset = () => {
    resetConfig();
    setShowResetConfirm(false);
    showToast("Paramètres réinitialisés aux valeurs par défaut", "success");
  };

  // Filter submissions by search
  const filteredSubmissions = data?.submissions.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.profession.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q)
    );
  }) || [];

  /* ─── LOGIN SCREEN ─── */
  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 relative overflow-hidden ${isLight ? "bg-white" : "bg-[#02120D]"}`}>
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-amber-400/8 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.04] border border-white/[0.06]"} backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h1 className={`text-2xl font-light ${isLight ? "text-slate-900" : "text-white"} mb-1`}>
                Go Healthy Academy
              </h1>
              <p className={`${isLight ? "text-slate-400" : "text-slate-500"} text-sm`}>
                Accès administrateur
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={`block text-sm ${isLight ? "text-slate-600" : "text-slate-400"} mb-2`}>
                  Mot de passe administrateur
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                    className={`w-full pl-11 pr-4 py-3.5 ${isLight ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600"} rounded-xl text-sm focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all outline-none`}
                    placeholder="Entrez le mot de passe"
                    autoFocus
                  />
                </div>
                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {loginError}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={loggingIn || !password}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-medium text-sm shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {loggingIn ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className={`text-center ${isLight ? "text-slate-400" : "text-slate-600"} text-xs mt-6`}>
              Accès réservé aux administrateurs
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── ADMIN DASHBOARD ─── */
  return (
    <div className={`min-h-screen relative overflow-hidden ${isLight ? "bg-white" : "bg-[#02120D]"}`}>
      {/* Background effects */}
      <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-amber-400/5 blur-[100px]" />

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`${isLight ? "bg-white border border-slate-200" : "bg-[#0A1F1A] border border-white/[0.06]"} rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg">
                    {selectedSubmission.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`${isLight ? "text-slate-900" : "text-white"} font-medium text-lg`}>
                      {selectedSubmission.name}
                    </h3>
                    <p className={`${isLight ? "text-amber-600/70" : "text-amber-300/70"} text-sm`}>
                      {selectedSubmission.profession}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className={`p-2 rounded-xl ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-white/10 text-slate-400"} transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedSubmission.email && (
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${isLight ? "bg-slate-50 border border-slate-200" : "bg-white/[0.03] border border-white/[0.06]"}`}>
                    <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-sm w-24`}>Email</span>
                    <span className={`${isLight ? "text-slate-700" : "text-slate-200"} text-sm`}>{selectedSubmission.email}</span>
                  </div>
                )}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isLight ? "bg-slate-50 border border-slate-200" : "bg-white/[0.03] border border-white/[0.06]"}`}>
                  <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-sm w-24`}>Téléphone</span>
                  <span className={`${isLight ? "text-slate-700" : "text-slate-200"} text-sm`}>{selectedSubmission.phone}</span>
                </div>
                {selectedSubmission.message && (
                  <div className={`p-3 rounded-xl ${isLight ? "bg-slate-50 border border-slate-200" : "bg-white/[0.03] border border-white/[0.06]"}`}>
                    <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-sm block mb-1`}>Message</span>
                    <p className={`${isLight ? "text-slate-700" : "text-slate-300"} text-sm leading-relaxed`}>
                      {selectedSubmission.message}
                    </p>
                  </div>
                )}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isLight ? "bg-slate-50 border border-slate-200" : "bg-white/[0.03] border border-white/[0.06]"}`}>
                  <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-sm w-24`}>Inscrit le</span>
                  <span className={`${isLight ? "text-slate-700" : "text-slate-200"} text-sm`}>
                    {formatDate(selectedSubmission.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder confirmation dialog */}
      <AnimatePresence>
        {showReminderConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowReminderConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`${isLight ? "bg-white border border-slate-200" : "bg-[#0A1F1A] border border-white/[0.06]"} rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Bell className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className={`${isLight ? "text-slate-900" : "text-white"} font-medium text-lg mb-2`}>
                  Envoyer un rappel ?
                </h3>
                <p className={`${isLight ? "text-slate-500" : "text-slate-400"} text-sm mb-6 leading-relaxed`}>
                  Un email de rappel sera envoyé à tous les participants ayant
                  renseigné leur adresse email ({data?.submissions.filter((s) => s.email).length || 0} participants).
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReminderConfirm(false)}
                    className={`flex-1 px-4 py-3 rounded-xl border ${isLight ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-white/10 text-slate-400 hover:bg-white/5"} text-sm transition-colors`}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSendReminder}
                    disabled={sendingReminder}
                    className="flex-1 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sendingReminder ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sendingReminder ? "Envoi..." : "Confirmer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset confirmation dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`${isLight ? "bg-white border border-slate-200" : "bg-[#0A1F1A] border border-white/[0.06]"} rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className={`${isLight ? "text-slate-900" : "text-white"} font-medium text-lg mb-2`}>
                  Réinitialiser les paramètres ?
                </h3>
                <p className={`${isLight ? "text-slate-500" : "text-slate-400"} text-sm mb-6 leading-relaxed`}>
                  Tous les paramètres du site seront restaurés à leurs valeurs par défaut. Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className={`flex-1 px-4 py-3 rounded-xl border ${isLight ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-white/10 text-slate-400 hover:bg-white/5"} text-sm transition-colors`}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Réinitialiser
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-40 ${isLight ? "bg-white/80 border-b border-slate-200" : "bg-[#02120D]/80 border-b border-white/[0.04]"} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className={`${isLight ? "text-slate-900" : "text-white"} font-medium text-lg`}>
                GHA Admin
              </h1>
              <p className={`${isLight ? "text-slate-400" : "text-slate-500"} text-xs`}>
                Panneau d&apos;administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl ${isLight ? "hover:bg-amber-50 text-amber-600" : "hover:bg-white/10 text-amber-300"} transition-colors`}
              title={isLight ? "Mode sombre" : "Mode clair"}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={handleExport}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl ${isLight ? "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200" : "bg-white/[0.04] border border-white/[0.06] text-slate-300 hover:bg-white/[0.08]"} text-sm transition-colors`}
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={() => setShowReminderConfirm(true)}
              disabled={sendingReminder}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm hover:bg-amber-500/20 transition-colors disabled:opacity-50`}
            >
              <Bell className="w-4 h-4" />
              Rappel
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isLight ? "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-red-500" : "border-white/[0.06] text-slate-400 hover:bg-white/5 hover:text-red-400"} text-sm transition-colors`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? `${isLight ? "text-amber-600" : "text-amber-300"}`
                  : `${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
              <span className="sm:hidden">Dashboard</span>
              {activeTab === "dashboard" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? `${isLight ? "text-amber-600" : "text-amber-300"}`
                  : `${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres du site</span>
              <span className="sm:hidden">Paramètres</span>
              {activeTab === "settings" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.04] border border-white/[0.06]"} rounded-2xl p-6 ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.06]"} transition-colors`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-xs`}>Total</span>
                  </div>
                  <div className={`text-3xl font-light ${isLight ? "text-amber-600" : "text-amber-300"} mb-1`}>
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    ) : (
                      data?.stats.total || 0
                    )}
                  </div>
                  <p className={`${isLight ? "text-slate-500" : "text-slate-500"} text-sm`}>Inscriptions totales</p>
                </div>

                <div className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.04] border border-white/[0.06]"} rounded-2xl p-6 ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.06]"} transition-colors`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-xs`}>Aujourd&apos;hui</span>
                  </div>
                  <div className={`text-3xl font-light ${isLight ? "text-emerald-600" : "text-emerald-300"} mb-1`}>
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                    ) : (
                      data?.stats.today || 0
                    )}
                  </div>
                  <p className={`${isLight ? "text-slate-500" : "text-slate-500"} text-sm`}>Inscriptions aujourd&apos;hui</p>
                </div>

                <div className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.04] border border-white/[0.06]"} rounded-2xl p-6 ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.06]"} transition-colors`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-xs`}>Semaine</span>
                  </div>
                  <div className={`text-3xl font-light ${isLight ? "text-sky-600" : "text-sky-300"} mb-1`}>
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                    ) : (
                      data?.stats.thisWeek || 0
                    )}
                  </div>
                  <p className={`${isLight ? "text-slate-500" : "text-slate-500"} text-sm`}>Cette semaine</p>
                </div>
              </div>

              {/* Mobile action buttons */}
              <div className="flex sm:hidden gap-3 mb-6">
                <button
                  onClick={handleExport}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${isLight ? "bg-slate-100 border border-slate-200 text-slate-700" : "bg-white/[0.04] border border-white/[0.06] text-slate-300"} text-sm ${isLight ? "hover:bg-slate-200" : "hover:bg-white/[0.08]"} transition-colors`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setShowReminderConfirm(true)}
                  disabled={sendingReminder}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Rappel
                </button>
              </div>

              {/* Search & Table */}
              <div className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.04] border border-white/[0.06]"} rounded-2xl overflow-hidden`}>
                <div className={`p-4 sm:p-6 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 ${isLight ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600"} rounded-xl text-sm focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all outline-none`}
                        placeholder="Rechercher par nom, profession, email..."
                      />
                    </div>
                    <span className={`${isLight ? "text-slate-400" : "text-slate-500"} text-sm whitespace-nowrap`}>
                      {filteredSubmissions.length} résultat{filteredSubmissions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isLight ? "border-slate-100" : "border-white/[0.04]"}`}>
                        <th className={`text-left px-6 py-3.5 text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-500"} uppercase tracking-wider`}>Nom</th>
                        <th className={`text-left px-6 py-3.5 text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-500"} uppercase tracking-wider`}>Profession</th>
                        <th className={`text-left px-6 py-3.5 text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-500"} uppercase tracking-wider`}>Email</th>
                        <th className={`text-left px-6 py-3.5 text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-500"} uppercase tracking-wider`}>Téléphone</th>
                        <th className={`text-left px-6 py-3.5 text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-500"} uppercase tracking-wider`}>Date</th>
                        <th className={`text-right px-6 py-3.5 text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-500"} uppercase tracking-wider`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <Users className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-slate-300" : "text-slate-700"}`} />
                            <p className={`${isLight ? "text-slate-400" : "text-slate-500"}`}>Aucune inscription trouvée</p>
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((sub) => (
                          <tr
                            key={sub.id}
                            className={`border-b ${isLight ? "border-slate-100 hover:bg-slate-50" : "border-white/[0.03] hover:bg-white/[0.02]"} transition-colors`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-xs shrink-0">
                                  {sub.name.charAt(0)}
                                </div>
                                <span className={`${isLight ? "text-slate-900" : "text-white"} text-sm font-medium`}>
                                  {sub.name}
                                </span>
                              </div>
                            </td>
                            <td className={`px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"} text-sm`}>
                              {sub.profession}
                            </td>
                            <td className={`px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"} text-sm`}>
                              {sub.email || "—"}
                            </td>
                            <td className={`px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"} text-sm`}>
                              {sub.phone}
                            </td>
                            <td className={`px-6 py-4 ${isLight ? "text-slate-400" : "text-slate-500"} text-xs`}>
                              {formatDate(sub.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedSubmission(sub)}
                                  className={`p-2 rounded-lg ${isLight ? "hover:bg-slate-100 text-slate-400 hover:text-amber-600" : "hover:bg-white/[0.06] text-slate-400 hover:text-amber-300"} transition-colors`}
                                  title="Voir les détails"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(sub.id)}
                                  className={`p-2 rounded-lg ${isLight ? "hover:bg-red-50 text-slate-400 hover:text-red-500" : "hover:bg-red-500/10 text-slate-500 hover:text-red-400"} transition-colors`}
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <div className="md:hidden max-h-[60vh] overflow-y-auto">
                  {filteredSubmissions.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Users className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-slate-300" : "text-slate-700"}`} />
                      <p className={`${isLight ? "text-slate-400" : "text-slate-500"}`}>Aucune inscription trouvée</p>
                    </div>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className={`px-4 py-4 border-b ${isLight ? "border-slate-100" : "border-white/[0.04]"} last:border-b-0`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-xs shrink-0">
                              {sub.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className={`${isLight ? "text-slate-900" : "text-white"} text-sm font-medium truncate`}>
                                {sub.name}
                              </p>
                              <p className={`${isLight ? "text-slate-400" : "text-slate-500"} text-xs truncate`}>
                                {sub.profession}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className={`p-2 rounded-lg ${isLight ? "hover:bg-slate-100 text-slate-400 hover:text-amber-600" : "hover:bg-white/[0.06] text-slate-400 hover:text-amber-300"} transition-colors`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className={`p-2 rounded-lg ${isLight ? "hover:bg-red-50 text-slate-400 hover:text-red-500" : "hover:bg-red-500/10 text-slate-500 hover:text-red-400"} transition-colors`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 ml-12 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          {sub.email && (
                            <span className={`${isLight ? "text-slate-500" : "text-slate-400"}`}>{sub.email}</span>
                          )}
                          <span className={`${isLight ? "text-slate-400" : "text-slate-500"}`}>{sub.phone}</span>
                        </div>
                        <div className={`mt-1 ml-12 text-[10px] ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                          {formatDate(sub.createdAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── SETTINGS TAB ─── */
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Settings header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className={`text-xl font-medium ${isLight ? "text-slate-900" : "text-white"} flex items-center gap-2`}>
                    <Settings className="w-5 h-5 text-amber-500" />
                    Paramètres du site
                  </h2>
                  <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"} mt-1`}>
                    غيّر الفيديوهات والصور والنصوص بسهولة — Les changements sont sauvegardés automatiquement dans le navigateur
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isLight ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-white/10 text-slate-400 hover:bg-white/5"} text-sm transition-colors`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Réinitialiser
                  </button>
                  <button
                    onClick={handleSave}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      saved
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 hover:bg-amber-400 text-black"
                    }`}
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Sauvegardé ✓
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preview thumbnails */}
              <div className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.03] border border-white/[0.06]"} rounded-2xl p-5 mb-6`}>
                <p className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider mb-3`}>
                  Aperçu rapide — فيديوهات
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl overflow-hidden border ${isLight ? "border-slate-200" : "border-white/10"} aspect-video bg-black/40`}>
                    <iframe
                      src={toEmbedUrl(config.VIDEO_PRESENTATION_URL)}
                      className="w-full h-full pointer-events-none"
                      title="Aperçu vidéo 1"
                    />
                  </div>
                  <div className={`rounded-xl overflow-hidden border ${isLight ? "border-slate-200" : "border-white/10"} aspect-video bg-black/40`}>
                    <iframe
                      src={toEmbedUrl(config.VIDEO_TESTIMONIAL_URL)}
                      className="w-full h-full pointer-events-none"
                      title="Aperçu vidéo 2"
                    />
                  </div>
                </div>
                <p className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider mb-3 mt-5`}>
                  صورة المحاضر — Photo du conférencier
                </p>
                <div className={`w-24 h-24 rounded-xl overflow-hidden border ${isLight ? "border-slate-200" : "border-white/10"} bg-black/40`}>
                  <img
                    src={config.SPEAKER_IMG}
                    alt="Aperçu conférencier"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Category sections */}
              <div className="space-y-4">
                {CATEGORIES.map((cat) => {
                  const isExpanded = expandedCats.has(cat.title);
                  return (
                    <div
                      key={cat.title}
                      className={`${isLight ? "bg-white border border-slate-200" : "bg-white/[0.03] border border-white/[0.06]"} rounded-2xl overflow-hidden`}
                    >
                      <button
                        onClick={() => toggleCat(cat.title)}
                        className={`w-full flex items-center justify-between px-5 py-4 ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"} transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${isLight ? "bg-amber-50" : "bg-amber-500/10"} flex items-center justify-center`}>
                            <cat.icon className={`w-4 h-4 ${isLight ? "text-amber-600" : "text-amber-500"}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isLight ? "text-slate-900" : "text-white"}`}>{cat.title}</span>
                            <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-600"}`}>({cat.titleAr})</span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} />
                        ) : (
                          <ChevronDown className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className={`px-5 pb-5 pt-2 space-y-4 border-t ${isLight ? "border-slate-100" : "border-white/[0.04]"}`}>
                              {cat.fields.map((field) => (
                                <div key={field.key}>
                                  <label className={`block text-xs ${isLight ? "text-slate-600" : "text-slate-400"} mb-1.5`}>
                                    {field.label}
                                  </label>
                                  {field.multiline ? (
                                    <textarea
                                      value={config[field.key]}
                                      onChange={(e) => setConfigValue(field.key, e.target.value)}
                                      rows={3}
                                      className={`w-full p-3 rounded-lg ${isLight ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600"} text-sm focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none`}
                                      placeholder={field.hint || field.label}
                                    />
                                  ) : (
                                    <input
                                      value={config[field.key]}
                                      onChange={(e) => setConfigValue(field.key, e.target.value)}
                                      className={`w-full p-3 rounded-lg ${isLight ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400" : "bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-slate-600"} text-sm focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all`}
                                      placeholder={field.hint || field.label}
                                    />
                                  )}
                                  {field.hint && (
                                    <p className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-600"} mt-1`}>{field.hint}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className={`${isLight ? "text-slate-400" : "text-slate-600"} text-xs`}>
            Go Healthy Academy — Panneau d&apos;administration &middot; {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}

/* ─── Admin Page (wraps with providers) ─── */
export default function AdminPage() {
  return (
    <ThemeProvider>
      <ConfigProvider>
        <AdminContent />
      </ConfigProvider>
    </ThemeProvider>
  );
}
