import fs from "fs";
import path from "path";

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL = "black-forest-labs/flux-2-klein-9b";
const OUT_DIR = path.resolve("public/templates");

const style = "modern, high quality, clean composition, professional, sharp detail";

const templates = [
  { slug: "create-an-ai-influencer", prompt: `Stylish young woman in trendy streetwear, soft natural light, blurred city background, shallow depth of field, ${style}, 16:9` },
  { slug: "product-in-lifestyle-scene", prompt: `Premium skincare bottle on a marble counter beside a green plant, bright soft daylight, airy feel, ${style}, 16:9` },
  { slug: "mock-up-branded-packaging", prompt: `Minimalist white and kraft paper packaging on a light grey surface, crisp studio lighting, ${style}, 16:9` },
  { slug: "change-your-background", prompt: `Fashion portrait of a woman against a soft lavender studio backdrop, clean lighting, contemporary look, ${style}, 16:9` },
  { slug: "change-your-product", prompt: `Clean white sneaker floating on a soft blue gradient background, sharp studio lighting, ${style}, 16:9` },
  { slug: "create-a-close-up-confession", prompt: `Intimate close-up portrait, soft directional light, genuine emotion, blurred background, ${style}, 16:9` },
  { slug: "capture-an-epic-wide-shot", prompt: `Vast dramatic landscape, turquoise alpine lake surrounded by mountains, golden hour sky, epic scale, ${style}, 16:9` },
  { slug: "capture-a-vhs-pov-moment", prompt: `Friends at a beach bonfire at dusk, VHS film grain aesthetic, nostalgic retro tones, candid moment, ${style}, 16:9` },
  { slug: "create-cinematic-portrait", prompt: `Cinematic portrait with cool blue rim light and warm key light, moody dark background, ${style}, 16:9` },
  { slug: "generate-product-mockup", prompt: `Sleek silver laptop on a clean white desk, soft natural light, minimal setup, ${style}, 16:9` },
  { slug: "design-a-poster-layout", prompt: `Modern graphic poster with bold black typography, red accent, clean white background, Swiss grid, ${style}, 16:9` },
  { slug: "build-a-mood-board", prompt: `Mood board flat lay with fabric swatches, photos, dried flowers, and color chips on white paper, ${style}, 16:9` },
  { slug: "create-fashion-lookbook", prompt: `Fashion editorial, model in a chic black outfit against a white wall, bright even lighting, ${style}, 16:9` },
  { slug: "render-3d-product-view", prompt: `Photorealistic 3D render of matte black wireless headphones on a soft grey gradient, ${style}, 16:9` },
  { slug: "generate-stock-photo", prompt: `Person working at a bright airy desk with laptop and coffee, large window, natural daylight, ${style}, 16:9` },
  { slug: "create-a-hero-shot", prompt: `Luxury watch on a dark reflective surface, dramatic side light with cool tones, premium feel, ${style}, 16:9` },
  { slug: "create-flat-lay-composition", prompt: `Organized flat lay of everyday carry items on a light grey surface, notebook pen phone sunglasses, ${style}, 16:9` },
  { slug: "generate-social-ad", prompt: `Minimal product ad layout, white sneaker centered on clean background, modern sans-serif text, ${style}, 16:9` },
  { slug: "create-video-thumbnail", prompt: `Person looking at camera with a neutral expression, soft grey background, clean studio lighting, ${style}, 16:9` },
  { slug: "design-event-flyer", prompt: `Modern event invitation, elegant serif typography on a deep navy background, gold accents, ${style}, 16:9` },
  { slug: "make-a-logo-concept", prompt: `Simple geometric logo mark in black on a white background, modern and memorable brand design, ${style}, 16:9` },
  { slug: "create-brand-identity", prompt: `Brand stationery mockup on a light grey surface, business cards envelope and letterhead, cohesive, ${style}, 16:9` },
  { slug: "generate-travel-content", prompt: `Stunning Santorini view, white buildings with blue domes, deep blue Aegean sea, clear sky, ${style}, 16:9` },
  { slug: "create-editorial-portrait", prompt: `Magazine editorial portrait, dramatic split lighting, strong jawline, fashion styling, ${style}, 16:9` },
  { slug: "generate-food-photography", prompt: `Overhead shot of a colorful fresh poke bowl on a white plate, bright natural light, ${style}, 16:9` },
  { slug: "make-before-and-after", prompt: `Split comparison of a living room renovation, left side dated, right side modern minimal, ${style}, 16:9` },
  { slug: "generate-lifestyle-scene", prompt: `Group of friends laughing at an outdoor brunch, dappled sunlight, authentic candid moment, ${style}, 16:9` },
  { slug: "create-product-unboxing", prompt: `Hands opening a premium matte black box revealing a sleek device, tissue paper, clean surface, ${style}, 16:9` },
  { slug: "change-scene-and-mood", prompt: `Moody fog rolling through a Pacific Northwest forest, cool blue-green tones, atmospheric, ${style}, 16:9` },
  { slug: "create-fitness-post", prompt: `Athlete doing a dynamic workout move in a modern gym, bright overhead lighting, energy, ${style}, 16:9` },
  { slug: "create-3d-icon-of-an-object", prompt: `Clean 3D rendered camera icon in matte white on a soft blue gradient background, rounded, ${style}, 16:9` },
  { slug: "translate-visual-design", prompt: `Poster design and its mobile app adaptation shown side by side on a neutral background, ${style}, 16:9` },
  { slug: "design-typographic-poster", prompt: `Bold typographic poster with oversized black serif letters, single orange accent, modern layout, ${style}, 16:9` },
  { slug: "transfer-color-palette-to-your-image", prompt: `Dramatic sunset landscape with rich orange sky reflecting on calm water, color graded, ${style}, 16:9` },
  { slug: "create-brand-guidelines", prompt: `Brand guidelines document spread showing logo usage, color palette, and typography on white, ${style}, 16:9` },
  { slug: "design-business-card", prompt: `Minimal white business card with black text on a dark charcoal surface, subtle shadow, ${style}, 16:9` },
  { slug: "generate-logo-variations", prompt: `Grid of six logo variations in different styles on a clean white background, black ink, ${style}, 16:9` },
  { slug: "create-packaging-design", prompt: `Row of premium cosmetic bottles with clean labels on a soft pink marble surface, ${style}, 16:9` },
  { slug: "design-letterhead", prompt: `Professional stationery set on a white desk, clean minimal branding, blue accent details, ${style}, 16:9` },
  { slug: "build-brand-mood-board", prompt: `Curated brand mood board with textures, architecture photos, and color chips on white, ${style}, 16:9` },
  { slug: "create-social-media-kit", prompt: `Grid of cohesive social media post designs with consistent blue and white palette, ${style}, 16:9` },
  { slug: "design-merchandise", prompt: `Black t-shirt with a clean minimal white graphic, laid flat on a concrete surface, ${style}, 16:9` },
  { slug: "build-style-guide", prompt: `Typography specimen and color palette guide, clean grid layout, black and accent blue, ${style}, 16:9` },
  { slug: "create-billboard-mockup", prompt: `Billboard on a modern glass building against a blue sky, clean ad design, urban daytime, ${style}, 16:9` },
  { slug: "design-storefront-signage", prompt: `Modern boutique storefront with elegant black signage, evening blue hour lighting, ${style}, 16:9` },
  { slug: "get-a-new-haircut", prompt: `Portrait of a person with a fresh modern haircut, clean studio backdrop, confident look, ${style}, 16:9` },
  { slug: "try-on-new-outfits", prompt: `Person in a sleek tailored outfit, neutral grey background, fashion editorial pose, ${style}, 16:9` },
  { slug: "create-restaurant-tabletop-scene", prompt: `Top-down view of beautifully plated dishes on a dark restaurant table, moody lighting, ${style}, 16:9` },
  { slug: "design-quote-card", prompt: `Quote card with elegant serif text on a soft sage green gradient, minimal and refined, ${style}, 16:9` },
  { slug: "make-carousel-post", prompt: `Three-panel social carousel with consistent design, neutral palette with teal accents, ${style}, 16:9` },
  { slug: "create-story-template", prompt: `Instagram story template mockup with photo placeholder on a soft peach background, ${style}, 16:9` },
  { slug: "generate-reel-cover", prompt: `Bold reel cover with a person centered, clean blurred background, confident look, ${style}, 16:9` },
  { slug: "design-profile-banner", prompt: `Modern profile banner with subtle abstract gradient in blues and purples, clean type, ${style}, 16:9` },
  { slug: "create-event-promotion", prompt: `Stylish event promo with venue photo, elegant text overlay, evening atmosphere, ${style}, 16:9` },
  { slug: "design-email-template", prompt: `Clean email newsletter with hero image, organized sections, modern minimal layout, ${style}, 16:9` },
  { slug: "generate-icon-set", prompt: `Grid of consistent line icons in dark grey on white, clean modern style, uniform weight, ${style}, 16:9` },
  { slug: "create-presentation-deck", prompt: `Modern presentation slide, large photo with clean dark sidebar, minimal white text, ${style}, 16:9` },
  { slug: "design-infographic", prompt: `Clean modern infographic with teal and coral accents, clear data charts, white background, ${style}, 16:9` },
];

async function createPrediction(prompt) {
  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: "16:9",
        num_outputs: 1,
        output_quality: 80,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create prediction failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function pollPrediction(id) {
  while (true) {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === "succeeded") return data.output;
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(`Prediction ${id} ${data.status}: ${data.error || ""}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function downloadImage(url, filepath) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
}

async function processTemplate(t, index, total) {
  const filepath = path.join(OUT_DIR, `${t.slug}.webp`);
  if (fs.existsSync(filepath)) {
    console.log(`[${index + 1}/${total}] SKIP ${t.slug} (exists)`);
    return;
  }
  console.log(`[${index + 1}/${total}] Generating ${t.slug}...`);
  try {
    const prediction = await createPrediction(t.prompt);
    const output = await pollPrediction(prediction.id);
    const imageUrl = Array.isArray(output) ? output[0] : output;
    await downloadImage(imageUrl, filepath);
    console.log(`[${index + 1}/${total}] DONE ${t.slug}`);
  } catch (err) {
    console.error(`[${index + 1}/${total}] FAIL ${t.slug}: ${err.message}`);
  }
}

const CONCURRENCY = 5;

async function main() {
  console.log(`Generating ${templates.length} images (concurrency: ${CONCURRENCY})...`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < templates.length; i += CONCURRENCY) {
    const batch = templates.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((t, j) => processTemplate(t, i + j, templates.length)));
  }
  console.log("All done!");
}

main();
