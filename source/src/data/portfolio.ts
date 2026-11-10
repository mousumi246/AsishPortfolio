import { asset } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Person                                                              */
/* ------------------------------------------------------------------ */

export const person = {
  name: "Asish Kumar Sahoo",
  firstName: "Asish",
  role: "Presentation design consultant",
  location: "Bengaluru, India",
  email: "asish.sahoo711997@gmail.com",
  phone: "+91 95560 08404",
  phoneHref: "tel:+919556008404",
  linkedin: "https://www.linkedin.com/in/asish-sahoo-824549129/",
  resume: asset("Asish_Sahoo_Resume.pdf"),
  resumeFileName: "Asish_Kumar_Sahoo_Resume.pdf",
  // Portrait supplied for the site (Unsplash). Swap for a real photo by
  // dropping a file in /public and pointing this at asset("your-photo.jpg").
  portrait:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  summary:
    "Presentation design consultant with 3+ years across consulting and B2B, including two years as a Visual Analyst at McKinsey & Company and a Consultant role at Deloitte. I turn business research, quantitative analysis and stakeholder input into executive-ready presentations, data visualizations, proposals and pitch decks for global consulting teams.",
  typewriter: ["business research", "raw quarterly data", "stakeholder input", "a messy brief", "a 40-minute deadline"],
}

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

export type Slide = {
  src: string
  thumb: string
  title: string
  /** "Final" slides lead; "Source" marks the raw input he was given. */
  kind?: "Final" | "Source" | "Option"
}

export type Project = {
  id: string
  folder: string
  title: string
  context: string
  year: string
  summary: string
  brief: string
  did: string[]
  tools: string[]
  driveUrl: string
  slides: Slide[]
  /** For decks that are only viewable on Drive: the slide titles, in order. */
  outline?: string[]
  highlights?: { value: string; label: string }[]
  art: "aurora" | "ember" | "dusk" | "glacier" | "verdant"
  seed: number
}

const s = (deck: string, n: number, title: string, kind?: Slide["kind"]): Slide => {
  const id = String(n).padStart(2, "0")
  return { src: asset(`works/${deck}/${id}.webp`), thumb: asset(`works/${deck}/${id}-sm.webp`), title, kind }
}

export const projects: Project[] = [
  {
    id: "ahead",
    folder: "AHEAD exercise",
    title: "Three board slides from raw input",
    context: "Design exercise for AHEAD, Design & Visual Communication CoE",
    year: "2026",
    summary:
      "A cloud migration pitch for a skeptical CFO, a year of sales data against a competitor, and a dense Q3 review, each turned into one slide a leadership audience can read at a glance.",
    brief:
      "Three timed exercises (45 to 60 minutes each): turn an oral brief about a $4.2M legacy-infrastructure client into one slide that gets the CFO to stop blocking a hybrid-cloud move; turn four quarters of win-rate and deal-size data into a board slide on the year's trajectory; redesign a text-heavy Q3 business review into a single, more pictorial slide without inventing facts.",
    did: [
      "Led with the decision: “Lower cost. Lower risk. Faster growth.”, then backed it with the $2.3M one-time cost, $1.1M annual savings and a payback under 24 months.",
      "Answered the CFO's real objection (past cloud overruns) with a cost-governance panel instead of more benefits.",
      "Charted the year so the story is the gap: win rate up from 38% to 53% while the competitor slid from 45% to 40%.",
      "Rebuilt the Q3 review as a scannable grid of KPIs, risks and Q4 priorities.",
    ],
    tools: ["PowerPoint", "Excel charts", "Icon systems"],
    driveUrl: "https://drive.google.com/file/d/1aiYQFOP-temftrxuCJwNhErSKOK0uBV1/view",
    slides: [
      s("ahead", 7, "Lower cost. Lower risk. Faster growth.", "Final"),
      s("ahead", 8, "Strong momentum. Higher wins. Bigger deals.", "Final"),
      s("ahead", 9, "Managed Services: Q3 business review summary", "Final"),
      s("ahead", 6, "Managed Services: building a stronger, smarter business", "Final"),
      s("ahead", 10, "Thank you", "Final"),
      s("ahead", 1, "Cloud migration business case for CFO approval", "Source"),
      s("ahead", 2, "Cloud migration persuasive story", "Source"),
      s("ahead", 3, "A controlled cloud migration that pays for itself", "Source"),
      s("ahead", 4, "Yearly sales performance and competitive trajectory", "Source"),
      s("ahead", 5, "Market momentum and win-rate leadership shift", "Source"),
    ],
    art: "aurora",
    seed: 3,
  },
  {
    id: "deloitte",
    folder: "Deloitte exercise",
    title: "Overview of AI, as a one-page brief",
    context: "Design assignment for Deloitte",
    year: "2026",
    summary:
      "A wall of copy about artificial intelligence, given 30 to 40 minutes, became a one-page explainer for people leaders, delivered in four colourways.",
    brief:
      "Create a visually appealing layout that is easy to consume from the content provided: what AI is, its types (machine learning, deep learning, generative AI), why it matters, how to implement it, and a five-point people-leader checklist. Time: 30 to 40 minutes.",
    did: [
      "Split the copy into three reading zones: understand, why it matters, act.",
      "Turned the people-leader checklist into a numbered, high-contrast panel so it reads as the call to action.",
      "Delivered an illustrated light version plus dark and gradient options for different decks.",
      "Built a cover and closing slide in the same system.",
    ],
    tools: ["PowerPoint", "Iconography", "Colour systems"],
    driveUrl: "https://drive.google.com/file/d/1TPetl4tPD1ECpAEAsI3i_iZS-13ZLw4m/view",
    slides: [
      s("deloitte", 2, "Overview of AI: cover", "Final"),
      s("deloitte", 3, "Overview of AI", "Final"),
      s("deloitte", 4, "Overview of AI, illustrated", "Option"),
      s("deloitte", 5, "Overview of AI, dark", "Option"),
      s("deloitte", 6, "Overview of AI, gradient", "Option"),
      s("deloitte", 7, "Thank you", "Final"),
      s("deloitte", 1, "The ask and the raw copy", "Source"),
    ],
    art: "verdant",
    seed: 7,
  },
  {
    id: "fractal",
    folder: "Fractal exercise",
    title: "Redefining the AI-powered enterprise",
    context: "Design assignment for Fractal Analytics",
    year: "2026",
    summary:
      "Six paragraph-only source slides about Fractal became a six-slide company narrative: who they are, the footprint in numbers, the shift to AI, the delivery model and the engagement journey.",
    brief:
      "Redesign six text-only source slides into a presentation that tells Fractal's story clearly, keeping every fact from the source.",
    did: [
      "Wrote an action title for each slide, so the deck reads as a story from its titles alone.",
      "Broke every paragraph into short, scannable statements while keeping all of the source's facts.",
      "Gave the footprint its own slide: founded in 2000, 15+ locations, 100+ Fortune 500 clients, 4,500+ people, 2,000+ projects.",
      "Laid out the delivery model from data engineering up to business impact, and the engagement journey as five stages.",
    ],
    tools: ["PowerPoint", "Infographics", "Process flows"],
    driveUrl: "https://drive.google.com/file/d/1RVjyaZCH8aqPJzTBzU0qf4lI4S58JLhM/view",
    slides: [],
    outline: [
      "Redefining the AI-powered enterprise",
      "Our footprint by the numbers",
      "Transitioning to the AI-powered enterprise",
      "How we deliver measurable business impact",
      "Where strategy meets human-centered design",
      "From discovery to sustained value",
    ],
    highlights: [
      { value: "100+", label: "Fortune 500 clients" },
      { value: "4,500+", label: "professionals" },
      { value: "2,000+", label: "AI and analytics projects" },
    ],
    art: "glacier",
    seed: 5,
  },
  {
    id: "odessa",
    folder: "Odessa exercise",
    title: "FinAxis Cloud pitch deck",
    context: "Design assignment for Odessa",
    year: "2026",
    summary:
      "A five-slide pitch for an imaginary asset-finance SaaS platform, aimed at lenders, banks and investors, with the impact data turned into charts.",
    brief:
      "Design a 4 to 5 slide pitch deck for FinAxis Cloud that explains the product, the problem it solves and its impact. Slide 4 must turn adoption by region, assets managed (2021 to 2024) and before-and-after operating metrics into clear business visualizations, and the design choices must be defended in interview.",
    did: [
      "Charted assets managed growing from $35B to $120B (2021 to 2024), about 3.4 times.",
      "Compared adoption across North America, Europe, Asia-Pacific and the Middle East.",
      "Showed the before and after: loan setup from 12 days to 3, manual error rate from 14% to 3%.",
      "Closed on why FinAxis Cloud: built for asset finance, faster to implement, configurable without heavy customization.",
    ],
    tools: ["PowerPoint", "Data visualization", "Pitch decks"],
    driveUrl: "https://drive.google.com/file/d/1bCmh2Sdg2dzo6GrxcuytACXxyfay3eAO/view",
    slides: [],
    outline: [
      "Modern SaaS platform for asset finance operations",
      "The challenge and our solution",
      "Platform overview",
      "Platform impact and insights",
      "Why FinAxis Cloud",
    ],
    highlights: [
      { value: "3.4×", label: "growth in assets managed" },
      { value: "12 → 3", label: "days to set up a loan" },
      { value: "14% → 3%", label: "manual error rate" },
    ],
    art: "dusk",
    seed: 11,
  },
  {
    id: "porsche",
    folder: "Porsche 911",
    title: "Porsche 911 Turbo S, as an editorial",
    context: "Personal design study",
    year: "2026",
    summary:
      "A five-slide product story in a magazine register: crest, open road, the Turbo S in detail, the numbers, and a personal sign-off.",
    brief:
      "A self-set study in restraint: let photography and a few large numbers carry a premium product, with copy kept to what earns its place.",
    did: [
      "Opened on the crest alone, then the car on an open road, before any text.",
      "Set the spec slide as three numbers: 0 to 100 km/h in 2.5 s, 523 kW / 711 PS, 305 km/h.",
      "Ended on a line of its own: “Porsche 911. Not a dream. A plan by 2031.”",
    ],
    tools: ["PowerPoint", "Editorial layout"],
    driveUrl: "https://drive.google.com/file/d/1hU8rU0c0-S21Ip0on1sxs0PEV2-woHs7/view",
    slides: [
      s("porsche", 1, "Crest"),
      s("porsche", 2, "Porsche 911 Turbo S"),
      s("porsche", 3, "Turbo S"),
      s("porsche", 4, "By the numbers"),
      s("porsche", 5, "Not a dream. A plan by 2031."),
    ],
    art: "ember",
    seed: 9,
  },
  {
    id: "goku",
    folder: "Shape drawing",
    title: "A character drawn only with PowerPoint shapes",
    context: "Creative exercise",
    year: "2026",
    summary:
      "The brief: create a human character using nothing but PowerPoint's tools and objects. The reference sits on the left, the shape-built version on the right.",
    brief: "Bring your creativity: create a human character, using PowerPoint tools and objects only.",
    did: [
      "Rebuilt the character from 68 hand-drawn freeform shapes. The only picture on the slide is the reference.",
      "Matched the reference's line weight and flat colour so the two read as a pair.",
    ],
    tools: ["PowerPoint", "Freeform shapes"],
    driveUrl: "https://drive.google.com/file/d/1Fs4DOtWEeo199Q3WYJtrNNLPeec0qsn-/view",
    slides: [s("goku", 1, "Reference and shape-built character")],
    art: "glacier",
    seed: 2,
  },
]

export const driveFolderUrl = "https://drive.google.com/drive/folders/1_tELAttvQYUEpA75hww1s7yOm0Yu0B32"

/** Slides that fly through the tunnel, each pointing at its deck. */
export const tunnelSlides: { project: string; slide: number }[] = [
  { project: "ahead", slide: 0 },
  { project: "porsche", slide: 1 },
  { project: "deloitte", slide: 1 },
  { project: "ahead", slide: 1 },
  { project: "porsche", slide: 3 },
  { project: "deloitte", slide: 3 },
  { project: "ahead", slide: 2 },
  { project: "porsche", slide: 2 },
  { project: "deloitte", slide: 0 },
  { project: "ahead", slide: 3 },
  { project: "porsche", slide: 4 },
  { project: "deloitte", slide: 4 },
]

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export const experience = [
  {
    role: "Consultant",
    org: "Deloitte",
    place: "Bengaluru",
    dates: "May 2026 – Oct 2026",
    points: [
      "Designed executive presentations, proposals, pursuit documents and pitch decks for global stakeholders and business development.",
      "Built brand-compliant PowerPoint templates, design systems and reusable slide assets that kept client deliverables consistent.",
      "Redesigned existing decks for readability and impact, and used Adobe Firefly for custom visuals within client branding.",
    ],
  },
  {
    role: "Visual Analyst",
    org: "McKinsey & Company",
    place: "Bengaluru",
    dates: "Feb 2024 – Apr 2026",
    points: [
      "Designed decks for global consulting projects, used in client reviews, workshops and strategy presentations.",
      "Built complex think-cell charts at speed, plus dashboards and data visualizations in PowerPoint and Excel.",
      "Maintained branded templates, slide libraries and design systems to McKinsey's brand standards.",
      "Received the internal “Sleek Operator” and “Quality Crusader” awards for operational excellence and attention to detail.",
    ],
  },
  {
    role: "Graduate Engineer Trainee",
    org: "Halonix",
    place: "Bengaluru",
    dates: "Jan 2022 – Jan 2023",
    points: [
      "Created sales presentations, pitch decks and proposals for B2B conversations, tailored by client, industry and use case.",
      "Developed product brochures and sales collateral, and ran product training for customers and partners.",
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Capabilities                                                        */
/* ------------------------------------------------------------------ */

export const capabilities = [
  {
    area: "Presentation design",
    items: [
      "Executive presentations",
      "Proposal and pitch decks",
      "Pursuit documents",
      "Slide templates and libraries",
      "Design systems",
      "Brand compliance",
      "Typography and visual hierarchy",
      "Information design",
    ],
  },
  {
    area: "Consulting communication",
    items: ["Visual storytelling", "Storyboarding", "Narrative structure", "Message hierarchy", "Slide sequencing", "Executive summaries"],
  },
  {
    area: "Data visualization",
    items: ["think-cell charts", "Excel charts", "Dashboards", "Infographics", "Process flows", "Timelines"],
  },
  {
    area: "Tools",
    items: ["PowerPoint", "think-cell", "Excel", "Word", "SharePoint", "Adobe Creative Suite", "Adobe Firefly", "Figma", "Canva"],
  },
  {
    area: "AI tools",
    items: ["Prompt engineering", "ChatGPT", "Gemini", "Nano Banana", "Perplexity", "Chronicle HQ", "Sora", "Veo"],
  },
]

export const ticker = [
  "Executive presentations",
  "think-cell charts",
  "Pitch decks",
  "Slide libraries",
  "Brand templates",
  "Infographics",
  "Process flows",
  "Proposals",
  "Dashboards",
  "Storyboards",
]

/* ------------------------------------------------------------------ */
/* Recognition and education                                           */
/* ------------------------------------------------------------------ */

export const recognition = [
  { title: "Sleek Operator", detail: "Internal award at McKinsey & Company for operational excellence." },
  { title: "Quality Crusader", detail: "Internal award at McKinsey & Company for attention to detail." },
  {
    title: "Research paper, GTSCSS 2020",
    detail: "Presented at the International Conference on Green Technology for Smart City and Society.",
  },
  { title: "District-level art competitions", detail: "Won three years in a row." },
]

export const education = {
  degree: "B.Tech, Electrical and Electronics Engineering",
  school: "Institute of Technical Education and Research, SOA University",
  years: "2015 – 2019",
  extra: [
    "Final-year project: fuzzy-logic and evolutionary MPPT algorithm for solar PV",
    "Coordinated “Paint Your Imagination”, an inter-college art event (2018)",
    "Training in digital marketing, Auroin",
  ],
  languages: ["English", "Hindi", "Odia"],
}
