// ============================================
// CreatorToolbox - Application Constants
// ============================================

export const APP_NAME = "CreatorToolbox";
export const APP_DESCRIPTION = "Suite IA Premium pour Créateurs YouTube";

// Pricing Tiers
export const PRICING_TIERS = [
  {
    id: "essential",
    name: "Essential",
    price: 9.90,
    credits: 500,
    description: "Parfait pour débuter",
    features: [
      "500 crédits",
      "Générateur de miniatures",
      "Idées virales (limité)",
      "Support email",
    ],
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: 37.90,
    credits: 2500,
    description: "Pour les créateurs réguliers",
    features: [
      "2500 crédits",
      "Tous les outils inclus",
      "Créateur de Shorts",
      "Priorité de génération",
      "Support prioritaire",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 97.00,
    credits: 8000,
    description: "Pour les professionnels",
    features: [
      "8000 crédits",
      "Accès illimité aux outils",
      "API access",
      "Génération en lot",
      "Support dédié 24/7",
      "Fonctionnalités beta",
    ],
    popular: false,
  },
] as const;

// Tools Configuration
export const TOOLS = [
  {
    id: "thumbnail-generator",
    name: "Générateur de Miniatures",
    description: "Créez des miniatures captivantes qui boostent votre CTR",
    icon: "Image",
    creditsPerUse: 10,
    route: "/dashboard/thumbnails",
  },
  {
    id: "viral-ideas",
    name: "Idées Virales",
    description: "Découvrez des idées de vidéos qui cartonnent",
    icon: "Lightbulb",
    creditsPerUse: 10,
    route: "/dashboard/ideas",
  },
  {
    id: "shorts-creator",
    name: "Créateur de Shorts",
    description: "Transformez vos longues vidéos en Shorts percutants",
    icon: "Scissors",
    creditsPerUse: 30,
    route: "/dashboard/shorts",
  },
] as const;

// Navigation Links
export const NAV_LINKS = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#tools", label: "Outils" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
] as const;

// Social Links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/creatortoolbox",
  youtube: "https://youtube.com/@creatortoolbox",
  discord: "https://discord.gg/creatortoolbox",
} as const;
