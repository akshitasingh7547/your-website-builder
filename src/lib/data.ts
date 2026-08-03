import algebra from "@/assets/Arihant_Skills_in_Mathematics_for_JEE_Algebra.pdf.asset.json";
import coordinate from "@/assets/Arihant_Skills_in_Mathematics_for_JEE_Coordinate_Geometry.pdf.asset.json";
import differential from "@/assets/Arihant_Skills_in_Mathematics_for_JEE_Differential_Calculus.pdf.asset.json";
import integral from "@/assets/Arihant_Skills_in_Mathematics_for_JEE_Integral_Calculus.pdf.asset.json";
import graphs from "@/assets/Arihant_Skills_in_Mathematics_for_JEE_Play_with_Graphs.pdf.asset.json";
import trigonometry from "@/assets/Arihant_Trigonometry.pdf.asset.json";
import vectors from "@/assets/Arihant_Vectors_and_3D_Geometry.pdf.asset.json";

export type TrackId = "jee" | "code" | "english" | "market" | "personal";

export type Track = {
  id: TrackId;
  name: string;
  blurb: string;
  /** Daily target in minutes */
  target: number;
  dot: string;
  text: string;
  bar: string;
  soft: string;
};

export const TRACKS: Track[] = [
  {
    id: "jee",
    name: "JEE Mathematics",
    blurb: "Arihant Skills in Mathematics series",
    target: 180,
    dot: "bg-track-jee",
    text: "text-track-jee",
    bar: "bg-track-jee",
    soft: "bg-track-jee/12",
  },
  {
    id: "code",
    name: "Coding",
    blurb: "DSA, projects, daily problems",
    target: 60,
    dot: "bg-track-code",
    text: "text-track-code",
    bar: "bg-track-code",
    soft: "bg-track-code/12",
  },
  {
    id: "english",
    name: "Fluent English",
    blurb: "Speaking, reading, vocabulary",
    target: 30,
    dot: "bg-track-english",
    text: "text-track-english",
    bar: "bg-track-english",
    soft: "bg-track-english/12",
  },
  {
    id: "market",
    name: "Share Market",
    blurb: "Charts, fundamentals, journal",
    target: 30,
    dot: "bg-track-market",
    text: "text-track-market",
    bar: "bg-track-market",
    soft: "bg-track-market/12",
  },
  {
    id: "personal",
    name: "Personal & Competitions",
    blurb: "YouTube, olympiads, downtime",
    target: 45,
    dot: "bg-track-personal",
    text: "text-track-personal",
    bar: "bg-track-personal",
    soft: "bg-track-personal/12",
  },
];

export const trackById = (id: TrackId): Track =>
  TRACKS.find((t) => t.id === id) ?? (TRACKS[0] as Track);

export type Book = {
  slug: string;
  title: string;
  subject: string;
  pages: number;
  url: string;
  topics: string[];
};

export const BOOKS: Book[] = [
  {
    slug: "algebra",
    title: "Algebra",
    subject: "Skills in Mathematics",
    pages: 846,
    url: algebra.url,
    topics: ["Quadratics", "Sequences", "Binomial", "Matrices", "Probability"],
  },
  {
    slug: "differential-calculus",
    title: "Differential Calculus",
    subject: "Skills in Mathematics",
    pages: 561,
    url: differential.url,
    topics: ["Limits", "Continuity", "Differentiation", "Tangents", "Monotonicity"],
  },
  {
    slug: "integral-calculus",
    title: "Integral Calculus",
    subject: "Skills in Mathematics",
    pages: 319,
    url: integral.url,
    topics: ["Indefinite", "Definite", "Areas", "Differential equations"],
  },
  {
    slug: "coordinate-geometry",
    title: "Coordinate Geometry",
    subject: "Skills in Mathematics",
    pages: 653,
    url: coordinate.url,
    topics: ["Straight lines", "Circles", "Parabola", "Ellipse", "Hyperbola"],
  },
  {
    slug: "trigonometry",
    title: "Trigonometry",
    subject: "Skills in Mathematics",
    pages: 399,
    url: trigonometry.url,
    topics: ["Ratios", "Identities", "Equations", "Inverse functions", "Solutions of triangles"],
  },
  {
    slug: "vectors-3d",
    title: "Vectors & 3D Geometry",
    subject: "Skills in Mathematics",
    pages: 289,
    url: vectors.url,
    topics: ["Vector algebra", "Products", "Lines", "Planes", "Spheres"],
  },
  {
    slug: "play-with-graphs",
    title: "Play with Graphs",
    subject: "Skills in Mathematics",
    pages: 189,
    url: graphs.url,
    topics: ["Curve sketching", "Transformations", "Graph based problems"],
  },
];

export const bookBySlug = (slug: string) => BOOKS.find((b) => b.slug === slug);

/** Default weekly rhythm — index 0 = Sunday, matching Date#getDay(). */
export const WEEK_PLAN: { track: TrackId; label: string; minutes: number }[][] = [
  [
    { track: "jee", label: "Full-length mock test", minutes: 180 },
    { track: "jee", label: "Mock analysis + error log", minutes: 60 },
    { track: "personal", label: "YouTube / rest block", minutes: 60 },
  ],
  [
    { track: "jee", label: "Algebra problem set", minutes: 120 },
    { track: "jee", label: "Trigonometry revision", minutes: 60 },
    { track: "code", label: "DSA: arrays & strings", minutes: 60 },
    { track: "english", label: "Read aloud 15 min + 10 new words", minutes: 30 },
  ],
  [
    { track: "jee", label: "Differential Calculus theory", minutes: 120 },
    { track: "jee", label: "Play with Graphs practice", minutes: 60 },
    { track: "market", label: "Chart study + journal entry", minutes: 30 },
    { track: "english", label: "Shadowing practice", minutes: 30 },
  ],
  [
    { track: "jee", label: "Integral Calculus problems", minutes: 120 },
    { track: "jee", label: "Coordinate Geometry drill", minutes: 60 },
    { track: "code", label: "Build: project work", minutes: 60 },
    { track: "personal", label: "Competition prep", minutes: 45 },
  ],
  [
    { track: "jee", label: "Vectors & 3D Geometry", minutes: 120 },
    { track: "jee", label: "Previous year questions", minutes: 60 },
    { track: "english", label: "Speaking session", minutes: 30 },
    { track: "market", label: "Read market news", minutes: 30 },
  ],
  [
    { track: "jee", label: "Weak-topic deep work", minutes: 150 },
    { track: "code", label: "Contest problems", minutes: 60 },
    { track: "personal", label: "YouTube / creative time", minutes: 45 },
  ],
  [
    { track: "jee", label: "Timed sectional test", minutes: 120 },
    { track: "jee", label: "Formula sheet revision", minutes: 45 },
    { track: "market", label: "Weekly portfolio review", minutes: 30 },
    { track: "personal", label: "Free block", minutes: 60 },
  ],
];
