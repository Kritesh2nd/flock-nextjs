import { GenerationType } from "@/types";

const generationKeys: Record<GenerationType, string[]> = {
  BROILER: ["day", "weight", "cumulativeMortalityRate"],
  LAYER: [
    "week",
    "eggProductionRate",
    "damagedEggRate",
    "cumulativeMortalityRate",
  ],
  PARENT: [
    "week",
    "hatchableEggRate",
    "hatchingEggRate",
    "cumulativeMortalityRate",
    "generation",
  ],
  GRANDPARENT: [
    "week",
    "hatchableEggRate",
    "hatchingEggRate",
    "cumulativeMortalityRate",
    "generation",
  ],
};

// Keywords for each internal field (customise if your CSV uses different terms)
const keywordMap: Record<string, string[]> = {
  week: ["week"],
  hatchableEggRate: ["hatchability", "hatch"], // for "Hatchability % (Weekly)"
  hatchingEggRate: ["hatching", "hw", "eggs"], // for "Hatching Eggs (%HW)"
  cumulativeMortalityRate: ["mortality", "cum", "mort"], // for "Mortality Cum. (%)"
  damagedEggRate: ["damaged", "egg", "rate"], // for "Mortality Cum. (%)"
  eggProductionRate: ["egg", "production", "rate"], // for "Mortality Cum. (%)"
};

const normalize = (str: string): string =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

export const mapRowToInternal = (
  row: Record<string, any>,
  generation: GenerationType,
) => {
  const mapped: Record<string, any> = {};

  // Normalise all CSV headers once
  const headers = Object.keys(row).map((header) => ({
    original: header,
    normalized: normalize(header),
  }));

  generationKeys[generation].forEach((key) => {
    const keywords = keywordMap[key] || [normalize(key)];

    let bestHeader: string | null = null;
    let bestScore = 0;

    for (const { original, normalized } of headers) {
      let score = 0;
      for (const kw of keywords) {
        if (normalized.includes(normalize(kw))) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestHeader = original;
      }
    }

    mapped[key] = bestHeader ? row[bestHeader] : null;
  });

  return mapped;
};
