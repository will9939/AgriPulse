import React, { useState, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   DONNÉES — Prix d'achat industrie agroalimentaire · Avril 2026
   Sources vérifiées :
   Sucres     → Observatoire UE Région 2 / Saint Louis Sucre / CGB France / ICE
   Agave      → CRT/IWSR/Hegamex (prix agave brut Mexique) — px négocié confidentiel
   Beurre     → Cotation Atla standard industriel 82% MG (Agri-Mutuel / Réussir)
   Lait bio   → FranceAgriMer / CNIEL / Biolait / enquête mensuelle laitière
   Miels      → UNAF / FranceAgriMer / ITSAP / Eurostat import
   Saumon     → Fishpool Oslo / Réussir Les Marchés / ETF Adepale
   Œufs       → CNPO / Réussir Les Marchés (coulée d'œufs bio code 0)
   ========================================================= */

const MATIERES = [
  // ══════════════════════════ SUCRES ══════════════════════════
  {
    id: "sucre-blanc",
    cat: "Sucre",
    nom: "Sucre blanc",
    type: "Conventionnel — UE",
    emoji: "🍬",
    image:
      "https://images.unsplash.com/photo-1581600140682-d4e68c8e3d00?w=800&q=80",
    unite: "€/kg",
    prixActuel: 0.57,
    variation: -3.9,
    accent: "from-amber-200/70 via-rose-100/60 to-orange-100/70",
    accentDark: "from-amber-300 to-rose-300",
    // Prix achat industrie UE franco livré — source : Observatoire UE Région 2 / Saint Louis Sucre / CGB
    historique: [
      { annee: "2020", prix: 0.36 },
      { annee: "2021", prix: 0.42 },
      { annee: "2022", prix: 0.58 },
      { annee: "2023", prix: 0.75 },
      { annee: "2024 S1", prix: 0.77 },
      { annee: "2025 S2", prix: 0.59 },
      { annee: "2026", prix: 0.57, actuel: true },
      { annee: "2027*", prix: 0.54, projection: true },
    ],
    raisons: [
      {
        titre: "Surplus mondial record 2025/26",
        detail:
          "Production mondiale ~185 Mt (+5,5 % vs 2024/25). FAO anticipe un excédent de 2,8 à 3 Mt. Brésil +4 %, Inde +9 % oct-mars. Pression structurelle durable sur les cours.",
        impact: "baisse",
      },
      {
        titre: "Arbitrage éthanol Brésil 2026/27",
        detail:
          "La part éthanol pourrait atteindre 54 % de la canne (vs 51 % en 2025/26). Chaque +1 pt = −800 000 t de sucre disponible. Signal fort de réduction d'offre.",
        impact: "hausse",
      },
      {
        titre: "Baisse des semis betterave UE",
        detail:
          "Semis betterave en baisse de 7,5-8 % en Europe. Fermetures : Nordzucker (Slovaquie, Finlande), Coprob (Italie). Production européenne structurellement en recul.",
        impact: "hausse",
      },
      {
        titre: "Suspension régime PA-S",
        detail:
          "La Commission européenne suspend le perfectionnement actif sucre : −500 000 t importées sans droits en moins. Réduction de l'offre disponible pour les raffineurs UE.",
        impact: "hausse",
      },
    ],
    risques: [
      "Conflit Moyen-Orient / pétrole → arbitrage canne→éthanol Brésil (cours bond à 463 $/t le 25/03/26)",
      "Conditions climatiques en Inde (Maharashtra, Karnataka) et Thaïlande",
      "Évolution de la parité EUR/USD",
      "Hausse coûts production UE (énergie, taxe carbone +1er jan. 2026, azote)",
    ],
  },
  // ══════════════════════════ SUCRE CANNE BIO ══════════════════════════
  {
    id: "sucre-canne-bio",
    cat: "Sucre",
    nom: "Sucre de canne complet",
    type: "Bio (Rapadura / Mascobado)",
    emoji: "🟤",
    image:
      "https://images.unsplash.com/photo-1610137764606-30a3d4a43dab?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 1.47,
    variation: 5.0,
    accent: "from-orange-200/60 via-amber-100/60 to-yellow-100/60",
    accentDark: "from-orange-300 to-amber-300",
    // Prix réf. négocié 2026 : 1,47 €/kg
    // Graphique = variations % annuelles cours sucre brut ICE No.11
    // proxy public officiel — prime bio structurelle ~+158% vs conv., stable
    // Sources : ICE / Trading Economics / Saint Louis Sucre
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 47 },
      { annee: "2022", prix: 55 },
      { annee: "2023", prix: 68 },
      { annee: "2024", prix: -20 },
      { annee: "2025", prix: -26 },
      { annee: "2026", prix: 5, actuel: true },
      { annee: "2027*", prix: 12, projection: true },
    ],
    raisons: [
      {
        titre: "Prime bio structurelle ~+158 %",
        detail:
          "Le sucre de canne complet bio (rapadura/muscovado) se négocie à ~1,47 €/kg vs 0,57 €/kg pour le blanc conventionnel. Produit non raffiné, sourcing Amér. latine & Île Maurice. Cible acheteur 2027 : 1,60-1,75 €/kg.",
        impact: "hausse",
      },
      {
        titre: "Conflit Moyen-Orient — exposition prix",
        detail:
          "Les prix des sucres bio et conventionnel sont exposés au conflit du Moyen-Orient (mars 2026). L'envolée des prix du pétrole favorise l'arbitrage canne→éthanol au Brésil.",
        impact: "hausse",
      },
      {
        titre: "Demande industrie +24 %/an",
        detail:
          "Croissance forte de la demande bio en Europe et Amér. du Nord (FAO/Commission UE 2024). Les industriels reformulent avec des ingrédients clean label. Tension côté demande.",
        impact: "hausse",
      },
      {
        titre: "Offre structurellement contrainte",
        detail:
          "Conversion bio = 3 ans minimum. Sourcing concentré (Costa Rica, Brésil, Île Maurice, Philippines). Faible élasticité de l'offre face à la demande croissante.",
        impact: "hausse",
      },
    ],
    risques: [
      "Aléas climatiques en Amérique latine (sécheresses, El Niño)",
      "Volatilité parité EUR/USD et EUR/BRL",
      "Double certification bio + équitable (Fairtrade/Bio Suisse) = surcoût répercuté",
      "Recommandation : contrats annuels fermes à signer dès T3 2026",
    ],
  },
  // ══════════════════════════ AGAVE ══════════════════════════
  {
    id: "agave",
    cat: "Édulcorant",
    nom: "Sirop d'agave",
    type: "Bio — Mexique",
    emoji: "🌵",
    image:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 1.98,
    variation: -7.9,
    accent: "from-emerald-100/60 via-teal-100/60 to-cyan-100/60",
    accentDark: "from-emerald-300 to-teal-300",
    // Prix réel négocié 2026 : 1,98 €/kg (tender -8% vs an dernier)
    // Graphique = variations % annuelles agave brut Mexique (CRT/IWSR)
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 7 },
      { annee: "2022", prix: 21 },
      { annee: "2023", prix: -51 },
      { annee: "2024", prix: -85 },
      { annee: "2025", prix: -91 },
      { annee: "2026", prix: -7.9, actuel: true },
      { annee: "2027*", prix: 60, projection: true },
    ],
    raisons: [
      {
        titre: "Crash agave brut −91 % depuis 2022",
        detail:
          "Prix agave brut à ~2,5 MXP/kg fin 2024 vs 34 MXP en nov. 2022 (IWSR / Hegamex). Surproduction liée à l'engouement tequila : +167 % de surfaces plantées entre 2014 et 2023. Répercussion sur le prix sirop avec 6-18 mois de délai. Résultat : négociation tender 2026 en baisse de ~8% vs l'an dernier.",
        impact: "baisse",
      },
      {
        titre: "Stocks massifs 2021-22 en écoulement",
        detail:
          "IWSR (2024) : l'inventaire très important de plants arrivant à maturité peut maintenir les prix bas jusqu'en 2026. Les producteurs amateurs vendent en panique, amplifiant la pression baissière.",
        impact: "baisse",
      },
      {
        titre: "Cycle naturel de pénurie (horizon 2027-28)",
        detail:
          "L'agave bleu prend 6-8 ans à mûrir. L'effondrement des prix décourage de nouvelles plantations. La prochaine pénurie structurelle est prévisible vers 2028-2030. Le sirop devrait rebondir dès 2027.",
        impact: "hausse",
      },
      {
        titre: "Demande mondiale en forte croissance",
        detail:
          "TCAC marché sirop agave bio : +5,4 %/an 2025-2032 (Data Bridge). 49 % des nouvelles boissons fonctionnelles 2024 intègrent l'agave (Persistence MR). Pression haussière sur l'offre de sirop fini.",
        impact: "hausse",
      },
    ],
    risques: [
      "Prix achat vrac sur devis confidentiel — aucune cotation publique (négociation gré à gré)",
      "Sécheresse et aléas climatiques Jalisco / Michoacán (El Niño)",
      "Risque d'adultération HFCS non déclaré — exiger Ecocert EU ou USDA Organic",
      "Recommandation : négocier contrats pluriannuels fermes dès T3 2026, au bas du cycle",
    ],
  },
  // ══════════════════════════ BEURRES ══════════════════════════
  {
    id: "beurre-conv",
    cat: "Produits laitiers",
    nom: "Beurre",
    type: "Conventionnel — France",
    emoji: "🧈",
    image:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80",
    unite: "€/kg",
    prixActuel: 4.82,
    variation: -39.3,
    accent: "from-yellow-100/70 via-amber-50/70 to-orange-100/60",
    accentDark: "from-yellow-300 to-amber-300",
    // Cotation Atla beurre standard industriel 82% MG — source : Agri-Mutuel / Réussir Les Marchés
    // Pic juil. 2025 : 7,64 €/kg — Plancher fév. 2026 : 3,80 €/kg — Rebond avril 2026 : 4,82 €/kg
    historique: [
      { annee: "2020", prix: 3.25 },
      { annee: "2021", prix: 3.85 },
      { annee: "2022", prix: 7.05 },
      { annee: "2023", prix: 4.95 },
      { annee: "2024", prix: 5.50 },
      { annee: "2025", prix: 7.64 },
      { annee: "2026", prix: 4.82, actuel: true },
      { annee: "2027*", prix: 5.20, projection: true },
    ],
    raisons: [
      {
        titre: "Chute spectaculaire puis rebond — −39 % vs budget",
        detail:
          "De 7,64 €/kg (juil. 2025) à 3,80 €/kg (fév. 2026) puis rebond à 4,82 €/kg (avr. 2026). Baisse de plus de -40 % vs l'an dernier selon le tableau de suivi acheteur. Négociations biscuitiers : 3,80 €/kg en jan. → 3,50 €/kg prévu pour mars.",
        impact: "baisse",
      },
      {
        titre: "Reprise de la collecte laitière UE",
        detail:
          "+1,3 % sur 2025 dans l'UE, fabrications de beurre +6 % selon Eurostat. En France : +4,7 % de fabrications de beurre/MGLA. Production dynamique en Nouvelle-Zélande et aux États-Unis.",
        impact: "baisse",
      },
      {
        titre: "Droits de douane Chine sur produits laitiers UE",
        detail:
          "La Chine impose jusqu'à 11,7 % de droits sur les produits laitiers UE depuis le 21 février 2026, réorientant l'offre européenne vers le marché intérieur et accentuant la pression baissière.",
        impact: "baisse",
      },
      {
        titre: "Rebond en cours depuis mars 2026",
        detail:
          "Après le plancher de 3,80 €/kg en semaine 5, la cotation Atla remonte à 4,82 €/kg en semaine 14. La demande se réveille avec la baisse des prix en rayon en Allemagne et les enchères GDT positives.",
        impact: "hausse",
      },
    ],
    risques: [
      "Retour d'épisodes sanitaires (FCO, H5N1) réduisant la collecte",
      "Canicules estivales — impact sur la production laitière estivale",
      "Apiculteur (fournisseur) : Apifor a acheté son beurre bio 2026 à 18,3 €/kg — signal de tension bio",
      "Nouvelles tensions géopolitiques impactant les échanges mondiaux de commodités laitières",
    ],
  },
  {
    id: "beurre-bio",
    cat: "Produits laitiers",
    nom: "Beurre",
    type: "Bio — France",
    emoji: "🧈",
    image:
      "https://images.unsplash.com/photo-1604935018461-52165bd63ad9?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 9.00,
    variation: -17.4,
    accent: "from-lime-100/70 via-yellow-100/60 to-green-100/60",
    accentDark: "from-lime-300 to-green-300",
    // Prix réf. négocié 2026 : 9,00 €/kg — aucune cotation publique beurre bio
    // Graphique = variations % annuelles cotation Atla beurre conv. (même dynamique, prime bio stable ~+85%)
    // Sources : Atla / Agri-Mutuel / Réussir Les Marchés / CNIEL
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 18 },
      { annee: "2022", prix: 83 },
      { annee: "2023", prix: -30 },
      { annee: "2024", prix: 11 },
      { annee: "2025", prix: 39 },
      { annee: "2026", prix: -17.4, actuel: true },
      { annee: "2027*", prix: 8, projection: true },
    ],
    raisons: [
      {
        titre: "Toujours au-dessus du prix de base 7 €/kg",
        detail:
          "Le beurre bio 2025 a été acheté au-dessus du prix de base de 7 €/kg de 2023/24 (+40 % sur cette base). En 2026, on observe un léger repli (-17,4 % vs budget) mais les prix restent structurellement élevés. Apifor a acheté son beurre bio 2026 à 18,3 €/kg.",
        impact: "hausse",
      },
      {
        titre: "Prime bio soutenue malgré la baisse du conv.",
        detail:
          "L'écart bio/conventionnel reste important (~4-5 €/kg). La filière lait bio française est fragile : collecte en baisse de -7 % en 2025, limitation de l'offre de matière grasse bio.",
        impact: "hausse",
      },
      {
        titre: "Collecte lait bio en recul structurel",
        detail:
          "6 % de points de collecte bio en moins en janv. 2025 vs janv. 2024. Biolait maintient 510 €/1000L en 2025. Les déconversions se poursuivent malgré la timide reprise de la consommation bio.",
        impact: "hausse",
      },
      {
        titre: "Reprise de la consommation bio fin 2025",
        detail:
          "Stabilisation des achats de produits laitiers bio depuis juillet 2024. +4,1 % au 1S 2025 toutes catégories bio. Peut freiner la baisse des prix en 2026-2027.",
        impact: "neutre",
      },
    ],
    risques: [
      "Poursuite des déconversions bio — réduction de l'offre de lait bio",
      "Écart bio/conventionnel sous pression si le conv. rebondit fortement",
      "Hausse du coût de l'alimentation animale bio (céréales bio)",
      "Concurrence beurre bio irlandais et allemand moins onéreux",
    ],
  },
  // ══════════════════════════ MIELS ══════════════════════════
  {
    id: "miel-chine",
    cat: "Miel",
    nom: "Miel bio — Origine Chine",
    type: "Bio — Chine (HoneyCN)",
    emoji: "🍯",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 3.30,
    variation: 0.0,
    accent: "from-yellow-200/70 via-amber-100/60 to-orange-100/60",
    accentDark: "from-yellow-300 to-orange-300",
    // Prix réf. négocié 2026 : 3,30 €/kg — aucune cotation publique miel
    // Graphique = variations % annuelles prix import miel Chine (Eurostat / Douanes FR)
    // Miel chinois UE : 1,36 (2020) → 1,45 (2021) → 1,58 (2022 pic) → 1,39 (2023) → ~1,35 (2024)
    // Sources : ITSAP / Eurostat / Douanes françaises / ADANA
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 7 },
      { annee: "2022", prix: 16 },
      { annee: "2023", prix: -12 },
      { annee: "2024", prix: -3 },
      { annee: "2025", prix: 4 },
      { annee: "2026", prix: 0, actuel: true },
      { annee: "2027*", prix: 6, projection: true },
    ],
    raisons: [
      {
        titre: "Marché stable — prix inchangé",
        detail:
          "Le miel bio d'origine Chine se négocie à 3,30 €/kg, stable. Les volumes exportés par la Chine vers la France ont chuté de -64 % en 2023 (2 495 t) suite aux contrôles qualité renforcés, stabilisant les prix d'import.",
        impact: "neutre",
      },
      {
        titre: "Nouvelle réglementation UE étiquetage 2025",
        detail:
          "La réforme du règlement 'Miel' impose désormais que le pays d'origine figure obligatoirement sur l'étiquette. Les miels d'origine Chine sont identifiables et font l'objet d'une vigilance accrue des acheteurs.",
        impact: "hausse",
      },
      {
        titre: "Risque de falsification persistant",
        detail:
          "Le miel chinois importé est sous surveillance : ajout de sucre, eau ou HFCS non déclaré. Les contrôles douaniers européens se renforcent depuis 2023, ce qui peut créer des tensions d'approvisionnement.",
        impact: "hausse",
      },
      {
        titre: "Concurrence intra-européenne en hausse",
        detail:
          "L'Ukraine (1er fournisseur de la France en 2023), l'Espagne et la Hongrie proposent des miels vrac à des prix comparables. La dépendance à l'origine Chine diminue progressivement.",
        impact: "baisse",
      },
    ],
    risques: [
      "Falsification (HFCS, eau) — exiger analyses labo systématiques",
      "Risque réglementaire : durcissement possible des normes import UE",
      "Pression hausse si les tonnages chinois continuent de baisser",
      "Haut risque de hausse sur montagne & pollen selon tableau de suivi acheteur",
    ],
  },
  {
    id: "miel-non-chine",
    cat: "Miel",
    nom: "Miel bio — Autre origine",
    type: "Bio — Non-Chine (polyflora, montagne…)",
    emoji: "🌸",
    image:
      "https://images.unsplash.com/photo-1568263810504-94921988e3bc?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 5.20,
    variation: 0.0,
    accent: "from-purple-100/60 via-violet-100/60 to-pink-100/60",
    accentDark: "from-purple-300 to-pink-300",
    // Prix réf. négocié 2026 : 5,20 €/kg — aucune cotation publique miel
    // Graphique = variations % annuelles indice prix import miel global France (Douanes/ITSAP)
    // Indice import total France : pic en 2022 (+8%), baisse 2023 (-10% à -15%), stabilisation 2024-2025
    // "High risk of increase for mountain honey & pollen" — suivi acheteur interne
    // Sources : ITSAP / UNAF / FranceAgriMer / Douanes françaises / ADANA
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 7 },
      { annee: "2022", prix: 8 },
      { annee: "2023", prix: -12 },
      { annee: "2024", prix: -8 },
      { annee: "2025", prix: 0 },
      { annee: "2026", prix: 0, actuel: true },
      { annee: "2027*", prix: 12, projection: true },
    ],
    raisons: [
      {
        titre: "Stable mais risque de hausse élevé",
        detail:
          "Prix stable à 5,20 €/kg en 2026 mais le tableau de suivi acheteur identifie un 'high risk of increase for mountain honey & pollen'. La récolte 2025 en Europe du Sud a été difficile.",
        impact: "hausse",
      },
      {
        titre: "Récolte 2025 contrastée en Europe",
        detail:
          "Bonne récolte en France (nord) et en Europe centrale, mais récolte catastrophique en Provence (lavande IGP) et mauvaise dans le Sud-Est. Les miels de montagne et de pollen subissent une tension d'offre.",
        impact: "hausse",
      },
      {
        titre: "Hausse programmée chez les leaders",
        detail:
          "Famille Michaud Apiculteurs a annoncé une hausse des prix en 2026 suite aux mauvaises récoltes d'été 2025. Le pollen et le miel de montagne sont explicitement cités.",
        impact: "hausse",
      },
      {
        titre: "Prime non-Chine : +57 % vs origine Chine",
        detail:
          "La prime qualité/traçabilité entre miel bio Chine (3,30 €/kg) et miel bio non-Chine (5,20 €/kg) reste stable. Elle reflète la meilleure traçabilité, la certification plus robuste et des origines UE valorisées.",
        impact: "neutre",
      },
    ],
    risques: [
      "Récoltes imprévisibles selon météo (gel tardif, canicule, pluies)",
      "Mortalité des ruches en hausse (frelon asiatique, varroa, pesticides)",
      "Disponibilités limitées sur montagne et pollen bio certifié",
      "Nouvelle réglementation UE miel 2025 — coûts de traçabilité répercutés",
    ],
  },
  // ══════════════════════════ SAUMONS ══════════════════════════
  {
    id: "saumon-conv",
    cat: "Poisson",
    nom: "Saumon",
    type: "Conventionnel — Norvège / Écosse",
    emoji: "🐟",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    unite: "€/kg",
    prixActuel: 6.40,
    variation: -21,
    accent: "from-pink-100/60 via-rose-100/60 to-red-100/60",
    accentDark: "from-pink-300 to-rose-300",
    // Prix achat franco transformateur/fumeur France — source : Réussir / ETF Adepale
    // Spot Fishpool Oslo : 68,58 NOK/kg en fév. 2026 — répercuté avec 4-6 sem. de délai
    historique: [
      { annee: "2020", prix: 5.10 },
      { annee: "2021", prix: 5.60 },
      { annee: "2022", prix: 7.00 },
      { annee: "2023", prix: 8.50 },
      { annee: "2024", prix: 7.80 },
      { annee: "2025", prix: 8.10 },
      { annee: "2026", prix: 6.40, actuel: true },
      { annee: "2027*", prix: 6.80, projection: true },
    ],
    raisons: [
      {
        titre: "Correction majeure −21 % vs an dernier",
        detail:
          "Prix achat transformateur FR à ~6,40 €/kg en 2026, vs 8,10 €/kg en 2025. Le spot Fishpool Oslo (68,58 NOK/kg en fév. 2026, soit ~-21,14 % sur un an) se répercute avec 4-6 semaines de délai sur les prix franco France.",
        impact: "baisse",
      },
      {
        titre: "Hausse de la production norvégienne",
        detail:
          "Retour à la croissance de la biomasse après la taxe controversée. La Norvège représente ~50 % de la production mondiale. Augmentation des disponibilités qui tire les prix vers le bas.",
        impact: "baisse",
      },
      {
        titre: "Demande asiatique soutenue",
        detail:
          "Les exportations norvégiennes vers la Chine ont progressé de +25 % depuis la Covid. Ce pilier de la demande mondiale limite l'effondrement des prix spot.",
        impact: "hausse",
      },
      {
        titre: "Marché mondial en croissance structurelle",
        detail:
          "Le marché mondial du saumon devrait passer de 33,5 Md$ (2024) à 49,4 Md$ en 2029 (TCAC +8 %). La demande croissante en protéines marines soutient les prix à moyen terme.",
        impact: "hausse",
      },
    ],
    risques: [
      "Pou du saumon — parasitose majeure en Norvège et Écosse",
      "Canicules marines (Écosse : -75 % de production été 2022)",
      "Nouvelle taxe norvégienne sur les producteurs de saumon",
      "Crises sanitaires en Amérique latine (Chili, 2e producteur mondial)",
    ],
  },
  {
    id: "saumon-bio",
    cat: "Poisson",
    nom: "Saumon",
    type: "Bio — Irlande / Écosse",
    emoji: "🐟",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 9.50,
    variation: -12,
    accent: "from-emerald-100/60 via-green-100/60 to-teal-100/60",
    accentDark: "from-emerald-300 to-green-300",
    // Prix réf. négocié 2026 : 9,50 €/kg — aucune cotation publique saumon bio
    // Graphique = variations % annuelles Fishpool Oslo (saumon Atlantique conv.) — même dynamique
    // Prime bio ~+40-50% vs conventionnel, stable dans le temps
    // Sources : Fishpool Oslo / Trading Economics / Réussir Les Marchés / ETF Adepale
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 10 },
      { annee: "2022", prix: 25 },
      { annee: "2023", prix: 21 },
      { annee: "2024", prix: -8 },
      { annee: "2025", prix: 4 },
      { annee: "2026", prix: -12, actuel: true },
      { annee: "2027*", prix: 6, projection: true },
    ],
    raisons: [
      {
        titre: "Sillage de la baisse du conventionnel",
        detail:
          "La chute du saumon Norvège Atlantique (-21 % vs l'an dernier) tire mécaniquement les prix bio vers le bas avec un décalage de quelques semaines. La prime bio reste à ~+40-50 % vs conventionnel.",
        impact: "baisse",
      },
      {
        titre: "Offre bio structurellement limitée",
        detail:
          "Production bio minoritaire : densité < 20 kg/m³, croissance lente (14 mois min.), certifications strictes Écosse/Irlande. L'Écosse prévoit +47-96 % de production d'ici 2030, focus durabilité.",
        impact: "hausse",
      },
      {
        titre: "Débat qualité bio vs conventionnel",
        detail:
          "Enquête 60 M de consommateurs : saumons bio parfois plus contaminés en métaux lourds et polluants organiques que le conventionnel. Fragilise la prime bio aux yeux des acheteurs.",
        impact: "baisse",
      },
      {
        titre: "Croissance de la production écossaise",
        detail:
          "L'Écosse planifie une augmentation massive de sa capacité d'élevage bio d'ici 2030. À terme, l'offre accrue pourrait peser sur les prix.",
        impact: "baisse",
      },
    ],
    risques: [
      "Contamination aux polluants organiques — surveillance sanitaire",
      "Coûts de certification bio en hausse",
      "Volatilité du saumon conventionnel qui entraîne le bio",
      "Concurrence du saumon sauvage Alaska (Label MSC) sur les marchés premium",
    ],
  },
  // ══════════════════════════ ŒUFS ══════════════════════════
  {
    id: "oeufs-bio",
    cat: "Œufs",
    nom: "Coulée d'œufs",
    type: "Bio — Code 0 (ovoproduit liquide)",
    emoji: "🥚",
    image:
      "https://images.unsplash.com/photo-1569288063643-5d29ad6ea7d3?w=800&q=80",
    unite: "€/kg",
    estVariation: true,
    prixActuel: 2.01,
    variation: -6.9,
    accent: "from-amber-50/70 via-orange-50/70 to-yellow-50/70",
    accentDark: "from-amber-300 to-yellow-300",
    // Prix réf. négocié 2026 : 2,01 €/kg (moyenne fév.-mars 2026, tableau suivi acheteur)
    // Graphique = variations % annuelles cotation TNO œuf industrie (CNPO/Réussir Les Marchés)
    // Ovoproduit bio suit la même dynamique que l'œuf code 0 industrie
    // Sources : CNPO / Réussir Les Marchés / FranceAgriMer / Agreste
    historique: [
      { annee: "2020", prix: 0 },
      { annee: "2021", prix: 6 },
      { annee: "2022", prix: 18 },
      { annee: "2023", prix: 18 },
      { annee: "2024", prix: -7 },
      { annee: "2025", prix: 0 },
      { annee: "2026", prix: -6.9, actuel: true },
      { annee: "2027*", prix: 4, projection: true },
    ],
    raisons: [
      {
        titre: "Demande en hausse — tension sur l'offre",
        detail:
          "La demande en France continue de croître (inflation = les œufs restent la protéine animale la moins chère). Marché casserie bio peu offert en France — concurrence des citernes d'œufs liquides espagnoles et polonaises.",
        impact: "hausse",
      },
      {
        titre: "Prix en légère baisse −6,9 %",
        detail:
          "Le prix de la coulée d'œufs bio s'établit à 2,01 €/kg en moyenne sur fév.-mars 2026 (source : tableau de suivi acheteur). La baisse s'explique par des importations d'ovoproduits liquides UE compétitifs.",
        impact: "baisse",
      },
      {
        titre: "Production française en hausse +4,2 %",
        detail:
          "+51,3 millions de poulettes de ponte en 2025 (+10,3 % vs 2024). Production février 2026 : +4,2 % vs 2025. Les capacités augmentent mais le délai d'entrée en production des poulettes maintient la tension.",
        impact: "baisse",
      },
      {
        titre: "Transition vers l'alternatif structurelle",
        detail:
          "Metro France s'engage à sortir des œufs cage d'ici mars 2028. La demande en code 0 (bio) et code 1 (plein air) croît mécaniquement. L'offre peine à suivre, surtout en bio.",
        impact: "hausse",
      },
    ],
    risques: [
      "Grippe aviaire H5N1 — risque majeur de fermetures de sites en France",
      "Hausse du coût des céréales bio (alimentation des poules pondeuses)",
      "Concurrence des ovoproduits liquides UE (Espagne, Pologne) à prix compétitifs",
      "Production shortfall quand la demande est à son pic selon suivi acheteur",
    ],
  },
  // ══════════════════════════ LAIT ══════════════════════════
  {
    id: "lait-bio",
    cat: "Produits laitiers",
    nom: "Lait de vache",
    type: "Bio — France",
    emoji: "🥛",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    unite: "€/L",
    prixActuel: 0.54,
    variation: 7.8,
    accent: "from-sky-100/70 via-blue-100/60 to-indigo-100/60",
    accentDark: "from-sky-300 to-indigo-300",
    // Prix payé aux producteurs de lait bio France — source : FranceAgriMer / CNIEL / Biolait
    // Biolait : 510 €/1000L en 2025. Coopératives : 540-570 €/1000L en 2026.
    historique: [
      { annee: "2020", prix: 0.39 },
      { annee: "2021", prix: 0.43 },
      { annee: "2022", prix: 0.49 },
      { annee: "2023", prix: 0.46 },
      { annee: "2024", prix: 0.517 },
      { annee: "2025", prix: 0.510 },
      { annee: "2026", prix: 0.54, actuel: true },
      { annee: "2027*", prix: 0.55, projection: true },
    ],
    raisons: [
      {
        titre: "Hausse +7,8 % vs période précédente",
        detail:
          "Le prix du lait bio progresse à 0,54 €/L en 2026. Biolait a maintenu 510 €/1000L en 2025 avec des perspectives 2026 favorables. Cant'Avey'Lot maintient 570 €/1000L pour ses 30 éleveurs.",
        impact: "hausse",
      },
      {
        titre: "Collecte bio en recul structurel",
        detail:
          "La collecte de lait bio baisse de -7 % en 2025. 6 % de points de collecte en moins en janv. 2025 vs janv. 2024. Les déconversions limitent l'offre et soutiennent les prix.",
        impact: "hausse",
      },
      {
        titre: "Écart bio/conventionnel qui se reconstitue",
        detail:
          "En 2024, le lait bio s'est échangé à 517 €/1000L, soit +45 €/1000L vs le conventionnel. Cet écart tend à se reconstituer après être tombé à +30 €/1000L début 2024.",
        impact: "hausse",
      },
      {
        titre: "Reprise de la consommation bio",
        detail:
          "Stabilisation des achats de produits laitiers bio depuis juillet 2024. +4,1 % au 1S 2025 toutes catégories bio. Réduit la pression sur le déclassement en conventionnel.",
        impact: "hausse",
      },
    ],
    risques: [
      "Arrêt des conversions bio — renouvellement des générations d'éleveurs",
      "FCO et crises sanitaires (impact sur la fertilité et la production)",
      "Coût de l'alimentation animale bio (céréales, protéines bio)",
      "Pouvoir d'achat des ménages — sensibilité prix sur les produits laitiers bio",
    ],
  },
];

const CATEGORIES = [...new Set(MATIERES.map((m) => m.cat))];

/* =========================================================
   STYLES UTILITAIRES
   ========================================================= */

const fmtPrice = (n, unite) => {
  if (unite === "€/L") {
    return `${n.toFixed(3)} €/L`;
  }
  if (n >= 10) return `${n.toFixed(2)} €/kg`;
  if (n >= 1) return `${n.toFixed(2)} €/kg`;
  return `${n.toFixed(3)} €/kg`;
};

const VariationBadge = ({ value, label }) => {
  const up = value > 0;
  const flat = value === 0;
  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
        flat
          ? "bg-stone-200/70 text-stone-700"
          : up
          ? "bg-rose-200/70 text-rose-800"
          : "bg-emerald-200/70 text-emerald-800"
      }`}
    >
      {flat ? (
        <Minus className="w-3 h-3" />
      ) : up ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      <span>
        {up ? "+" : ""}
        {value.toFixed(1)}%{label ? ` ${label}` : ""}
      </span>
    </div>
  );
};

/* =========================================================
   ÉCRAN D'ACCUEIL
   ========================================================= */

function HomeScreen({ onSelect }) {
  const [filtre, setFiltre] = useState("Toutes");

  const filtered = useMemo(
    () =>
      filtre === "Toutes"
        ? MATIERES
        : MATIERES.filter((m) => m.cat === filtre),
    [filtre]
  );

  return (
    <div className="min-h-screen pb-24">
      {/* ==== Header hero ==== */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, #fce7f3 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, #dbeafe 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, #fef3c7 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />

        <div className="relative px-6 pt-14 pb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-stone-500" />
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
              Matières Premières · Avril 2026
            </span>
          </div>
          <h1
            className="text-5xl font-light text-stone-800 leading-tight mb-2"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Le marché,
            <br />
            <span className="italic font-normal bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
              en un regard
            </span>
          </h1>
          <p className="text-stone-600 text-sm mt-3 leading-relaxed max-w-md">
            Suivi temps réel des prix d'achat, historique multi-annuel et
            projections pour vos approvisionnements.
          </p>
        </div>
      </div>

      {/* ==== Filtres catégories ==== */}
      <div className="px-6 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          <button
            onClick={() => setFiltre("Toutes")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filtre === "Toutes"
                ? "bg-stone-800 text-stone-50 shadow-lg shadow-stone-800/20"
                : "bg-white/60 text-stone-600 backdrop-blur border border-stone-200/70"
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFiltre(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filtre === c
                  ? "bg-stone-800 text-stone-50 shadow-lg shadow-stone-800/20"
                  : "bg-white/60 text-stone-600 backdrop-blur border border-stone-200/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ==== Cartes matières ==== */}
      <div className="px-6 space-y-3">
        {filtered.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className="group w-full text-left relative overflow-hidden rounded-3xl p-5 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5"
            style={{
              animation: `fadeSlide 0.5s ease-out ${idx * 0.05}s backwards`,
            }}
          >
            {/* dégradé de fond pastel */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-80`}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

            <div className="relative flex items-center gap-4">
              {/* Emoji pastille */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center text-3xl shadow-sm">
                {m.emoji}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                    {m.cat}
                  </span>
                </div>
                <h3
                  className="text-lg text-stone-800 font-medium leading-tight truncate"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {m.nom}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 truncate">
                  {m.type}
                </p>
              </div>

              {/* Prix */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-semibold text-stone-800 tabular-nums">
                  {fmtPrice(m.prixActuel, m.unite)}
                </div>
                <div className="text-[10px] text-stone-500 mb-1.5">
                  {m.estVariation ? "€/kg · réf. négociée" : m.unite}
                </div>
                <VariationBadge value={m.variation} label={m.labelVariation} />
              </div>

              <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ÉCRAN DÉTAIL
   ========================================================= */

function DetailScreen({ matiere, onBack }) {
  const [tab, setTab] = useState("evolution"); // evolution | raisons

  return (
    <div className="min-h-screen pb-24">
      {/* ==== Hero header ==== */}
      <div className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${matiere.accent} opacity-90`}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8), transparent 40%)`,
          }}
        />

        <div className="relative px-6 pt-6 pb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 backdrop-blur text-sm text-stone-700 hover:bg-white/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur flex items-center justify-center text-5xl shadow-sm flex-shrink-0">
              {matiere.emoji}
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                {matiere.cat}
              </div>
              <h1
                className="text-3xl font-normal text-stone-800 leading-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {matiere.nom}
              </h1>
              <p className="text-sm text-stone-600 italic mt-1">
                {matiere.type}
              </p>
            </div>
          </div>

          {/* Prix principal */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {matiere.estVariation ? "Prix négocié · réf. 2026" : "Prix d'achat · avril 2026"}
                </div>
                <div
                  className="text-4xl font-light text-stone-800 tabular-nums"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {fmtPrice(matiere.prixActuel, matiere.unite)}
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  {matiere.estVariation
                    ? "€/kg · tender négocié — aucune cotation publique"
                    : `${matiere.unite} · prix achat industrie`}
                </div>
              </div>
              <VariationBadge value={matiere.variation} label={matiere.labelVariation} />
            </div>
            {matiere.estVariation && (
              <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
                ⚠️ Prix vrac négocié sur devis — pas de cotation publique disponible. Le graphique ci-dessous montre les <strong>variations % annuelles</strong> du prix de l'agave brut Mexique (CRT/IWSR), proxy officiel de l'évolution des coûts matière.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==== Tabs ==== */}
      <div className="px-6 mt-6 mb-4">
        <div className="flex gap-2 p-1 bg-stone-100/70 rounded-2xl backdrop-blur">
          <button
            onClick={() => setTab("evolution")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "evolution"
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500"
            }`}
          >
            Évolution
          </button>
          <button
            onClick={() => setTab("raisons")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "raisons"
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500"
            }`}
          >
            Facteurs & risques
          </button>
        </div>
      </div>

      {tab === "evolution" && <EvolutionTab matiere={matiere} />}
      {tab === "raisons" && <RaisonsTab matiere={matiere} />}
    </div>
  );
}

/* =========================================================
   TAB : ÉVOLUTION
   ========================================================= */

function EvolutionTab({ matiere }) {
  const data = matiere.historique;
  const anneeActuelleIdx = data.findIndex((d) => d.actuel);
  const projIdx = data.findIndex((d) => d.projection);

  const prixMin = Math.min(...data.map((d) => d.prix));
  const prixMax = Math.max(...data.map((d) => d.prix));
  const prixMoyen =
    data.reduce((sum, d) => sum + d.prix, 0) / data.length;

  // calcul variation totale
  const evolTotal = ((data[data.length - 2].prix - data[0].prix) / data[0].prix) * 100;

  return (
    <div className="px-6 space-y-5 animate-fade-in">
      {/* Graphique */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-medium text-stone-800"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Historique & projection
          </h2>
          <div className="text-[10px] uppercase tracking-wider text-stone-400">
            {matiere.estVariation ? "Variation % vs année précédente" : matiere.unite}
          </div>
        </div>

        <div className="h-64 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${matiere.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={
                      matiere.accentDark.includes("rose")
                        ? "#f9a8d4"
                        : matiere.accentDark.includes("amber")
                        ? "#fcd34d"
                        : matiere.accentDark.includes("emerald")
                        ? "#6ee7b7"
                        : matiere.accentDark.includes("purple")
                        ? "#c4b5fd"
                        : matiere.accentDark.includes("sky")
                        ? "#7dd3fc"
                        : matiere.accentDark.includes("yellow")
                        ? "#fde68a"
                        : matiere.accentDark.includes("pink")
                        ? "#f9a8d4"
                        : matiere.accentDark.includes("slate")
                        ? "#cbd5e1"
                        : matiere.accentDark.includes("lime")
                        ? "#bef264"
                        : matiere.accentDark.includes("orange")
                        ? "#fdba74"
                        : "#fcd34d"
                    }
                    stopOpacity={0.4}
                  />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="annee"
                tick={{ fill: "#78716c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#78716c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10%', 'dataMax + 10%']}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
                }
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid #f3f4f6",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [
                  matiere.estVariation
                    ? `${value > 0 ? "+" : ""}${value} %`
                    : fmtPrice(value, matiere.unite),
                  matiere.estVariation ? "Variation agave brut" : "Prix achat",
                ]}
                labelStyle={{ color: "#57534e", fontWeight: 600 }}
              />
              {projIdx >= 0 && (
                <ReferenceLine
                  x={data[anneeActuelleIdx].annee}
                  stroke="#d6d3d1"
                  strokeDasharray="4 4"
                  label={{
                    value: "aujourd'hui",
                    position: "top",
                    fill: "#a8a29e",
                    fontSize: 10,
                  }}
                />
              )}
              {matiere.estVariation && (
                <ReferenceLine
                  y={0}
                  stroke="#d6d3d1"
                  strokeWidth={1.5}
                />
              )}
              <Area
                type="monotone"
                dataKey="prix"
                stroke="#57534e"
                strokeWidth={2.5}
                fill={`url(#grad-${matiere.id})`}
                dot={{ r: 4, fill: "#fff", stroke: "#57534e", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#57534e", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-3 mt-3 text-[11px] text-stone-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-stone-600"></span>
            <span>Données réelles</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t border-dashed border-stone-400"></span>
            <span>* Projection 2027</span>
          </div>
        </div>
      </div>

      {/* Stats clés */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={matiere.estVariation ? "Pire année" : "Minimum 5 ans"}
          value={matiere.estVariation ? `${prixMin} %` : fmtPrice(prixMin, matiere.unite)}
          color="emerald"
        />
        <StatCard
          label={matiere.estVariation ? "Meilleure année" : "Maximum 5 ans"}
          value={matiere.estVariation ? `+${prixMax} %` : fmtPrice(prixMax, matiere.unite)}
          color="rose"
        />
        <StatCard
          label={matiere.estVariation ? "Prix réf. négocié" : "Moyenne"}
          value={matiere.estVariation ? fmtPrice(matiere.prixActuel, matiere.unite) : fmtPrice(prixMoyen, matiere.unite)}
          color="sky"
        />
        <StatCard
          label={matiere.estVariation ? "Variation 2026" : "Évolution 2020 → 2026"}
          value={`${matiere.estVariation ? (matiere.variation > 0 ? "+" : "") + matiere.variation + " %" : (evolTotal > 0 ? "+" : "") + evolTotal.toFixed(0) + "%"}`}
          color={matiere.estVariation ? (matiere.variation > 0 ? "amber" : "lime") : (evolTotal > 0 ? "amber" : "lime")}
        />
      </div>

      {/* Projection box */}
      {projIdx >= 0 && (
        <div className="relative overflow-hidden rounded-3xl p-5 border border-white/60">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 via-purple-100/40 to-pink-100/60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs uppercase tracking-wider text-indigo-700 font-semibold">
                Projection 2027
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <div
                className="text-3xl font-light text-stone-800"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {matiere.estVariation
                  ? `+${data[projIdx].prix} %`
                  : fmtPrice(data[projIdx].prix, matiere.unite)}
              </div>
              <div
                className={`text-sm font-semibold ${
                  data[projIdx].prix > data[anneeActuelleIdx].prix
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                {matiere.estVariation
                  ? "rebond estimé vs 2025"
                  : `${data[projIdx].prix > data[anneeActuelleIdx].prix ? "↗" : "↘"} ${((( data[projIdx].prix - data[anneeActuelleIdx].prix) / data[anneeActuelleIdx].prix) * 100).toFixed(1)} % vs 2026`}
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {matiere.estVariation
                ? "Rebond de cycle estimé : l'épuisement des stocks 2021-22 et l'arrêt des nouvelles plantations devraient créer une pénurie structurelle vers 2027-2028. Recommandation : négocier des contrats pluriannuels fermes dès T3 2026 au bas du cycle. Sources : IWSR, Hegamex, Data Bridge."
                : "Estimation basée sur les tendances de marché, les facteurs structurels et les projections d'analystes du secteur (S&P Global, GlobalData, USDA)."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    emerald: "from-emerald-50 to-emerald-100/50 text-emerald-800",
    rose: "from-rose-50 to-rose-100/50 text-rose-800",
    sky: "from-sky-50 to-sky-100/50 text-sky-800",
    amber: "from-amber-50 to-amber-100/50 text-amber-800",
    lime: "from-lime-50 to-lime-100/50 text-lime-800",
  };
  return (
    <div
      className={`relative rounded-2xl p-4 bg-gradient-to-br ${colors[color]} border border-white/60`}
    >
      <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70 mb-1">
        {label}
      </div>
      <div
        className="text-xl font-medium tabular-nums"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   TAB : RAISONS
   ========================================================= */

function RaisonsTab({ matiere }) {
  const impactStyle = {
    hausse: {
      bg: "from-rose-100/70 to-rose-50/50",
      icon: TrendingUp,
      iconColor: "text-rose-600",
      label: "Facteur haussier",
      labelBg: "bg-rose-200/70 text-rose-800",
    },
    baisse: {
      bg: "from-emerald-100/70 to-emerald-50/50",
      icon: TrendingDown,
      iconColor: "text-emerald-600",
      label: "Facteur baissier",
      labelBg: "bg-emerald-200/70 text-emerald-800",
    },
    neutre: {
      bg: "from-stone-100/70 to-stone-50/50",
      icon: Minus,
      iconColor: "text-stone-600",
      label: "Facteur structurel",
      labelBg: "bg-stone-200/70 text-stone-800",
    },
  };

  return (
    <div className="px-6 space-y-5 animate-fade-in">
      {/* Facteurs */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Info className="w-4 h-4 text-stone-500" />
          <h2
            className="text-lg font-medium text-stone-800"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Raisons des fluctuations
          </h2>
        </div>

        <div className="space-y-3">
          {matiere.raisons.map((r, i) => {
            const st = impactStyle[r.impact];
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl p-4 border border-white/70"
                style={{
                  animation: `fadeSlide 0.4s ease-out ${i * 0.08}s backwards`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${st.bg}`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className="font-medium text-stone-800 leading-tight"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {r.titre}
                    </h3>
                    <div className={`flex-shrink-0 ${st.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-2">
                    {r.detail}
                  </p>
                  <span
                    className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${st.labelBg}`}
                  >
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risques */}
      <div className="relative overflow-hidden rounded-3xl p-5 border border-amber-100">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/60" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h2
              className="text-lg font-medium text-amber-900"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Risques à surveiller
            </h2>
          </div>
          <ul className="space-y-2">
            {matiere.risques.map((risque, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{risque}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sources */}
      <div className="text-[11px] text-stone-400 leading-relaxed text-center px-4 py-6">
        Sources : Observatoire UE Région 2 · Saint Louis Sucre / CGB France · ICE / Trading Economics · IWSR · Hegamex · CRT/SIAP Jalisco · UNAF / FranceAgriMer · Réussir Les Marchés · CNIEL · Famille Michaud Apiculteurs · ETF Adepale · FAO-OCDE · Data Bridge MR. Données vérifiées — avril 2026.
      </div>
    </div>
  );
}

/* =========================================================
   APP ROOT
   ========================================================= */

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fefaf5 0%, #fdf2f8 35%, #f0f9ff 100%)",
        fontFamily:
          "'Inter Tight', 'SF Pro Text', -apple-system, sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter+Tight:wght@300;400;500;600;700&display=swap');

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Container max width pour un rendu mobile-first agréable */}
      <div className="max-w-md mx-auto relative">
        {selected ? (
          <DetailScreen
            matiere={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <HomeScreen onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
