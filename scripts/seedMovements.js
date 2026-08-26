import * as dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import connectDB from "../config/database.js";
import Movement from "../models/Movement.js";

const movements = [
  {
    name: "Medieval",
    slug: "medieval",
    period: "500–1400",
    description: "Art produced in Europe during the Middle Ages, characterized by religious iconography, flat perspective, and gold leaf.",
    originCountry: "Europe",
    yearStart: 500,
    yearEnd: 1400,
    regions: [],
  },
  {
    name: "Early Renaissance",
    slug: "early-renaissance",
    period: "1400–1495",
    description: "The beginning of the Renaissance in Italy, marked by renewed interest in classical antiquity, humanism, and naturalistic representation.",
    originCountry: "Italy",
    yearStart: 1400,
    yearEnd: 1495,
    regions: ["Italian"],
  },
  {
    name: "High Renaissance",
    slug: "high-renaissance",
    period: "1490–1530",
    description: "The culmination of Renaissance ideals in Italy, exemplified by Leonardo da Vinci, Michelangelo, and Raphael.",
    originCountry: "Italy",
    yearStart: 1490,
    yearEnd: 1530,
    regions: ["Italian"],
  },
  {
    name: "Northern Renaissance",
    slug: "northern-renaissance",
    period: "1430–1580",
    description: "The Renaissance as it developed in Northern Europe, with emphasis on detailed realism, oil painting technique, and secular subjects.",
    originCountry: "Netherlands",
    yearStart: 1430,
    yearEnd: 1580,
    regions: ["Dutch", "Flemish", "German", "Netherlandish"],
  },
  {
    name: "Mannerism",
    slug: "mannerism",
    period: "1520–1600",
    description: "A style following the High Renaissance, characterized by elongated figures, complex compositions, and emotional intensity.",
    originCountry: "Italy",
    yearStart: 1520,
    yearEnd: 1600,
    regions: ["Italian", "French"],
  },
  {
    name: "Dutch Golden Age",
    slug: "dutch-golden-age",
    period: "1580–1680",
    description: "A flourishing of Dutch art and culture, known for intimate domestic scenes, still lifes, portraiture, and landscapes.",
    originCountry: "Netherlands",
    yearStart: 1580,
    yearEnd: 1680,
    regions: ["Dutch", "Netherlandish"],
  },
  {
    name: "Baroque",
    slug: "baroque",
    period: "1590–1720",
    description: "An exuberant style marked by dramatic use of light and shadow, emotional intensity, and grandeur.",
    originCountry: "Italy",
    yearStart: 1590,
    yearEnd: 1720,
    regions: ["Italian", "Spanish", "Flemish", "French"],
  },
  {
    name: "Rococo",
    slug: "rococo",
    period: "1715–1780",
    description: "An ornate and light-hearted style originating in France, characterized by pastel colors, playful themes, and decorative elegance.",
    originCountry: "France",
    yearStart: 1715,
    yearEnd: 1780,
    regions: ["French"],
  },
  {
    name: "Neoclassicism",
    slug: "neoclassicism",
    period: "1750–1830",
    description: "A revival of classical Greek and Roman aesthetics, emphasizing order, clarity, and moral seriousness.",
    originCountry: "France",
    yearStart: 1750,
    yearEnd: 1830,
    regions: [],
  },
  {
    name: "Romanticism",
    slug: "romanticism",
    period: "1800–1860",
    description: "A movement emphasizing emotion, imagination, and the sublime in nature, as a reaction against Enlightenment rationalism.",
    originCountry: "France",
    yearStart: 1800,
    yearEnd: 1860,
    regions: [],
  },
  {
    name: "American Realism",
    slug: "american-realism",
    period: "1865–1940",
    description: "An American movement depicting everyday life with honest, unglamourized accuracy.",
    originCountry: "United States",
    yearStart: 1865,
    yearEnd: 1940,
    regions: ["American"],
  },
  {
    name: "Realism",
    slug: "realism",
    period: "1840–1880",
    description: "A reaction against Romanticism, depicting ordinary subjects and working-class life with unflinching accuracy.",
    originCountry: "France",
    yearStart: 1840,
    yearEnd: 1880,
    regions: [],
  },
  {
    name: "Impressionism",
    slug: "impressionism",
    period: "1860–1900",
    description: "A French movement capturing fleeting light and atmosphere through loose brushwork and vivid color rather than precise detail.",
    originCountry: "France",
    yearStart: 1860,
    yearEnd: 1900,
    regions: ["French"],
  },
  {
    name: "Post-Impressionism",
    slug: "post-impressionism",
    period: "1880–1910",
    description: "A broad term for artists who built on Impressionism but pushed toward more expressive or structured approaches.",
    originCountry: "France",
    yearStart: 1880,
    yearEnd: 1910,
    regions: [],
  },
  {
    name: "Symbolism",
    slug: "symbolism",
    period: "1880–1910",
    description: "A late 19th-century movement using mythological and dream-like imagery to express emotional and spiritual ideas.",
    originCountry: "France",
    yearStart: 1880,
    yearEnd: 1910,
    regions: [],
  },
  {
    name: "Expressionism",
    slug: "expressionism",
    period: "1900–1935",
    description: "A movement distorting reality for emotional effect, originating in Germany and Austria.",
    originCountry: "Germany",
    yearStart: 1900,
    yearEnd: 1935,
    regions: ["German", "Austrian"],
  },
  {
    name: "Modernism",
    slug: "modernism",
    period: "1900–1960",
    description: "A broad movement rejecting traditional forms in favor of experimentation, abstraction, and new ways of seeing.",
    originCountry: "France",
    yearStart: 1900,
    yearEnd: 1960,
    regions: [],
  },
];

async function seedMovements() {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const m of movements) {
    const exists = await Movement.findOne({ slug: m.slug });
    if (exists) {
      console.log(`Skipped (exists): ${m.name}`);
      skipped++;
      continue;
    }
    await Movement.create(m);
    console.log(`Created: ${m.name}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seedMovements().catch((err) => {
  console.error(err);
  process.exit(1);
});
