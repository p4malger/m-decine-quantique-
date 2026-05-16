"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   🔧  VALEURS PAR DÉFAUT
   Ces valeurs sont utilisées si rien n'est sauvegardé dans le panneau.
   ═══════════════════════════════════════════════════════════════ */
export const DEFAULTS = {
  LOGO_IMG: "https://i.imgur.com/bcLCWPB.png",
  SPEAKER_IMG: "https://i.imgur.com/0i91Eir.png",

  /** Collez ici le lien YouTube complet de la vidéo de présentation */
  VIDEO_PRESENTATION_URL: "https://www.youtube.com/watch?v=RQ6ZcrL7vHk",

  /** Collez ici le lien YouTube complet de la vidéo témoignage */
  VIDEO_TESTIMONIAL_URL: "https://youtu.be/uaXrVECbjOg",

  /** Date de début (premier jour) */
  EVENT_START_DATE: "2026-06-04T09:00:00",

  /** Texte affiché pour les dates */
  EVENT_DATES_TEXT: "4, 5 & 6 Juin 2026",
  EVENT_DAYS_TEXT: "3 Jours",

  /** Lieu */
  EVENT_VENUE: "Hôtel Le Lido, Alger",

  /** WhatsApp */
  WHATSAPP_NUMBER: "213657867444",
  WHATSAPP_MESSAGE:
    "Bonjour, Je souhaite réserver ma place pour la formation Go Healthy Academy.",

  /** Organisation */
  ORG_NAME: "Go Healthy Academy",
  ORG_TAGLINE: "Formation Internationale 2026",

  /** Témoignage 1 */
  TESTIMONIAL_1_QUOTE:
    "Une expérience scientifique et humaine remarquable. L'organisation était premium et le contenu véritablement inédit. J'ai pu appliquer les méthodes dès mon retour au cabinet.",
  TESTIMONIAL_1_NAME: "Dr Amine B.",
  TESTIMONIAL_1_ROLE: "Cardiologue — Paris",
  TESTIMONIAL_1_RATING: "5",

  /** Témoignage 2 */
  TESTIMONIAL_2_QUOTE:
    "Des concepts novateurs, applicables en pratique clinique avec une approche très moderne. Le format interactif permet une véritable immersion dans les techniques présentées.",
  TESTIMONIAL_2_NAME: "Dr Sarah M.",
  TESTIMONIAL_2_ROLE: "Médecin généraliste — Casablanca",
  TESTIMONIAL_2_RATING: "5",

  /** Témoignage 3 */
  TESTIMONIAL_3_QUOTE:
    "L'un des séminaires les plus inspirants auxquels j'ai assisté ces dernières années. La qualité des échanges et la pertinence des cas pratiques sont exceptionnelles.",
  TESTIMONIAL_3_NAME: "Dr Karim L.",
  TESTIMONIAL_3_ROLE: "Neurologue — Tunis",
  TESTIMONIAL_3_RATING: "5",

  /** Galerie photos (6 images — chemin /public/ ou URL externe) */
  GALLERY_IMG_1: "https://i.imgur.com/melcFL4.jpeg",
  GALLERY_IMG_2: "https://i.imgur.com/dPEDaw6.jpeg",
  GALLERY_IMG_3: "https://i.imgur.com/2DTSfbZ.jpeg",
  GALLERY_IMG_4: "https://i.imgur.com/mODmX4a.jpeg",
  GALLERY_IMG_5: "https://i.imgur.com/JkzYxIi.png",
  GALLERY_IMG_6: "https://i.imgur.com/zlOZGDe.png",

  /** Conférencier */
  SPEAKER_NAME: "Dr Haddad Mohamed",
  SPEAKER_TITLE: "Docteur en Sciences Médicales",
  SPEAKER_BIO:
    "Chercheur et conférencier international spécialisé dans la médecine quantique et la nano médecine appliquées à la santé. Auteur du livre « Le Déclin du Cancer — Au carrefour des connaissances », vendu à plus de 25 000 exemplaires depuis sa première édition en 2000. Plus de 25 ans d'expertise, plus de 500 conférences données à travers le monde et plus de 19 000 personnes formées.",
  SPEAKER_BIO_EXTENDED:
    "Sa démarche unique combine les dernières avancées en médecine quantique et nano médecine avec des approches holistiques éprouvées, offrant ainsi aux professionnels de santé des outils concrets et innovants pour leur pratique quotidienne.",
};

/* ─── Types ─── */
export type SiteConfig = typeof DEFAULTS;
type ConfigKey = keyof SiteConfig;

interface ConfigContextType {
  config: SiteConfig;
  setConfigValue: (key: ConfigKey, value: string) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

const STORAGE_KEY = "gha_site_config";

/* ─── Helper: convert any YouTube URL to embed format ─── */
export function toEmbedUrl(url: string): string {
  if (!url) return "";
  // Already embed format
  if (url.includes("/embed/")) return url;
  // Standard watch URL: youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Short URL: youtu.be/ID (handle ?si= and other params)
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Try extracting any 11-char YouTube video ID from the URL
  const anyIdMatch = url.match(/([a-zA-Z0-9_-]{11})/);
  if (anyIdMatch) return `https://www.youtube.com/embed/${anyIdMatch[1]}`;
  // Fallback: return as-is
  return url;
}

/* ─── Provider ─── */
export function ConfigProvider({ children }: { children: ReactNode }) {
  // Always start with DEFAULTS to avoid SSR/client hydration mismatch
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS);
  const loaded = useRef(false);

  // Load from localStorage after mount (client only)
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Use microtask to avoid synchronous setState in effect
        queueMicrotask(() => {
          setConfig((prev) => ({ ...prev, ...parsed }));
        });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const setConfigValue = (key: ConfigKey, value: string) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetConfig = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(DEFAULTS);
  };

  return (
    <ConfigContext.Provider value={{ config, setConfigValue, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

/* ─── Hook ─── */
export function useSiteConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useSiteConfig must be used within ConfigProvider");
  return ctx;
}
