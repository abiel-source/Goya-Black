const mongoose = require("mongoose");

const TARGET_COUNT = 50;
const RATE_LIMIT_MS = 500;
const MET_SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search";
const MET_OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

const ArtistSchema = new mongoose.Schema(
  {
    metArtistId: { type: String, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    bio: String,
    nationality: String,
    birthYear: Number,
    deathYear: Number,
    movement: { type: mongoose.Schema.Types.ObjectId, ref: "Movement" },
    notableWorks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Painting" }],
    portraitImage: { url: String, width: Number, height: Number },
    starCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
ArtistSchema.index({ slug: 1 });

const PaintingSchema = new mongoose.Schema(
  {
    metObjectId: { type: Number, unique: true, index: true },
    title: { type: String, required: true },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", index: true },
    movementId: { type: mongoose.Schema.Types.ObjectId, ref: "Movement", index: true },
    year: String,
    medium: String,
    dimensions: String,
    department: String,
    museum: { type: String, default: "The Metropolitan Museum of Art" },
    image: { url: String, width: Number, height: Number },
    tags: [String],
    description: String,
    isFeatured: { type: Boolean, default: false, index: true },
    isHighlight: { type: Boolean, default: false },
    isPublicDomain: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    sourceUrl: String,
  },
  { timestamps: true }
);
PaintingSchema.index({ createdAt: -1, _id: -1 });
PaintingSchema.index({ title: "text", tags: "text" });

const MovementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    period: String,
    description: String,
    originCountry: String,
    yearStart: Number,
    yearEnd: Number,
    regions: { type: [String], default: [] },
    keyArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
    coverPainting: { type: mongoose.Schema.Types.ObjectId, ref: "Painting" },
  },
  { timestamps: true }
);

const Artist = mongoose.models.Artist || mongoose.model("Artist", ArtistSchema);
const Painting = mongoose.models.Painting || mongoose.model("Painting", PaintingSchema);
const Movement = mongoose.models.Movement || mongoose.model("Movement", MovementSchema);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

async function fetchJSON(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.ok) return res.json();
    if (res.status === 403 || res.status === 429) {
      const wait = attempt * 3000;
      console.warn(`  [WARN] HTTP ${res.status} (attempt ${attempt}/${retries}), waiting ${wait}ms...`);
      await sleep(wait);
      continue;
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseYear(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

function nationalityToRegion(nationality) {
  if (!nationality) return [];
  const n = nationality.toLowerCase();
  if (n.includes("dutch") || n.includes("netherlands")) return ["Dutch", "Netherlandish"];
  if (n.includes("flemish") || n.includes("belgian")) return ["Flemish"];
  if (n.includes("german") || n.includes("austrian")) return ["German", "Austrian"];
  if (n.includes("french")) return ["French"];
  if (n.includes("italian")) return ["Italian"];
  if (n.includes("spanish")) return ["Spanish"];
  if (n.includes("american")) return ["American"];
  return [];
}

function assignMovement(year, nationality, movements) {
  if (!year) return null;

  const regions = nationalityToRegion(nationality);

  const candidates = movements.filter(
    (m) => m.yearStart != null && m.yearEnd != null && year >= m.yearStart && year <= m.yearEnd
  );

  if (!candidates.length) return null;

  const regionMatches = candidates.filter(
    (m) => m.regions.length > 0 && regions.some((r) => m.regions.includes(r))
  );

  const pool = regionMatches.length ? regionMatches : candidates;

  pool.sort((a, b) => (a.yearEnd - a.yearStart) - (b.yearEnd - b.yearStart));
  return pool[0];
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const allMovements = await Movement.find({}).lean();
  console.log(`Loaded ${allMovements.length} movements`);

  console.log(`\nSearching Met API for paintings...`);
  const searchData = await fetchJSON(
    `${MET_SEARCH_URL}?hasImages=true&isPublicDomain=true&medium=Paintings&q=painting`
  );
  const allIds = searchData.objectIDs || [];
  console.log(`Met returned ${allIds.length} painting IDs. Targeting ${TARGET_COUNT}.`);

  const shuffled = allIds.sort(() => Math.random() - 0.5);

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  let idx = 0;

  while (imported < TARGET_COUNT && idx < shuffled.length) {
    const metId = shuffled[idx++];

    const exists = await Painting.findOne({ metObjectId: metId });
    if (exists) {
      skipped++;
      continue;
    }

    let obj;
    try {
      obj = await fetchJSON(`${MET_OBJECT_URL}/${metId}`);
      await sleep(RATE_LIMIT_MS);
    } catch (err) {
      console.warn(`  [WARN] Failed to fetch object ${metId}: ${err.message}`);
      failed++;
      continue;
    }

    if (!obj.primaryImage) {
      skipped++;
      continue;
    }

    if (obj.objectName && !obj.objectName.toLowerCase().includes("paint")) {
      const dept = (obj.department || "").toLowerCase();
      if (!dept.includes("paint") && !dept.includes("european") && !dept.includes("american")) {
        skipped++;
        continue;
      }
    }

    const year = parseYear(obj.objectDate);
    const artistName = obj.artistDisplayName || "Unknown";
    const nationality = obj.artistNationality || "";

    let artist = null;
    if (artistName && artistName !== "Unknown") {
      const artistSlug = slugify(artistName);
      artist = await Artist.findOne({ slug: artistSlug });

      if (!artist) {
        const movement = assignMovement(
          obj.artistBeginDate ? parseInt(obj.artistBeginDate) + 30 : year,
          nationality,
          allMovements
        );
        artist = await Artist.create({
          name: artistName,
          slug: artistSlug,
          nationality: nationality || undefined,
          birthYear: obj.artistBeginDate ? parseInt(obj.artistBeginDate) : undefined,
          deathYear: obj.artistEndDate ? parseInt(obj.artistEndDate) : undefined,
          movement: movement ? movement._id : undefined,
        });
        console.log(`  [Artist] Created: ${artistName}`);
      }
    }

    const movement = assignMovement(year, nationality, allMovements);

    const tags = [];
    if (obj.classification) tags.push(obj.classification);
    if (obj.medium) tags.push(...obj.medium.split(",").map((s) => s.trim()).filter(Boolean));
    if (Array.isArray(obj.tags)) {
      tags.push(...obj.tags.map((t) => (typeof t === "string" ? t : t.term)).filter(Boolean));
    }

    const painting = await Painting.create({
      metObjectId: metId,
      title: obj.title || "Untitled",
      artistId: artist ? artist._id : undefined,
      movementId: movement ? movement._id : undefined,
      year: obj.objectDate || undefined,
      medium: obj.medium || undefined,
      dimensions: obj.dimensions || undefined,
      department: obj.department || undefined,
      image: { url: obj.primaryImage },
      tags: [...new Set(tags)],
      isHighlight: obj.isHighlight || false,
      isPublicDomain: obj.isPublicDomain !== false,
      sourceUrl: obj.objectURL || undefined,
    });

    if (artist && artist.notableWorks.length < 6) {
      await Artist.updateOne(
        { _id: artist._id },
        { $addToSet: { notableWorks: painting._id } }
      );
    }

    imported++;
    console.log(`[${imported}/${TARGET_COUNT}] Imported: "${painting.title}" (${obj.objectDate || "n/d"})`);
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
