import makeupImg from "@/assets/service-makeup.jpg";
import lashesImg from "@/assets/service-lashes.jpg";
import massageImg from "@/assets/service-massage.jpg";
import hairImg from "@/assets/service-hair.jpg";
import nailsImg from "@/assets/service-nails.jpg";

export type Service = {
  id: string;
  name: string;
  category: "Makeup" | "Lashes" | "Massages" | "Hair Extensions" | "Nails";
  tagline: string;
  description: string;
  durationMin: number;
  price: number;
  image: string;
  prep: string[];
};

export const services: Service[] = [
  {
    id: "signature-glam",
    name: "Signature Glam Makeup",
    category: "Makeup",
    tagline: "Luminous, camera-ready artistry",
    description:
      "A bespoke full-face application built around your skin tone and occasion, finished with long-wear setting for all-day radiance.",
    durationMin: 75,
    price: 950,
    image: makeupImg,
    prep: [
      "Arrive with a clean, moisturised face",
      "Bring reference photos if you have a look in mind",
      "Allow 15 minutes extra for lash strip application",
    ],
  },
  {
    id: "bridal-atelier",
    name: "Bridal Atelier Makeup",
    category: "Makeup",
    tagline: "Trial, touch-ups and on-the-day artistry",
    description:
      "Our most detailed service: a pre-wedding trial, a curated look sheet and on-the-day application with a touch-up kit.",
    durationMin: 150,
    price: 2400,
    image: makeupImg,
    prep: [
      "Book a trial 4–6 weeks before the wedding",
      "Schedule facials at least 10 days prior",
      "Share your dress and bouquet palette",
    ],
  },
  {
    id: "volume-lashes",
    name: "Russian Volume Lashes",
    category: "Lashes",
    tagline: "Feathered density, weightless feel",
    description:
      "Hand-fanned ultra-fine extensions mapped to your eye shape for lush volume that still looks soft and natural.",
    durationMin: 120,
    price: 780,
    image: lashesImg,
    prep: [
      "Come with clean, mascara-free lashes",
      "Avoid caffeine right before your appointment",
      "Keep lashes dry for 24 hours afterwards",
    ],
  },
  {
    id: "classic-lashes",
    name: "Classic Lash Extensions",
    category: "Lashes",
    tagline: "One-to-one definition",
    description:
      "A single extension applied to each natural lash for effortless definition — ideal for first-time lash clients.",
    durationMin: 90,
    price: 560,
    image: lashesImg,
    prep: ["No eye makeup on the day", "Refills recommended every 2–3 weeks"],
  },
  {
    id: "aroma-ritual",
    name: "Aromatherapy Ritual Massage",
    category: "Massages",
    tagline: "Slow, restorative and deeply calming",
    description:
      "A full-body relaxation massage with a bespoke essential oil blend, warm compresses and a scalp finish.",
    durationMin: 90,
    price: 890,
    image: massageImg,
    prep: [
      "Arrive 10 minutes early to settle in",
      "Avoid heavy meals an hour before",
      "Let your therapist know of any allergies",
    ],
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Release",
    category: "Massages",
    tagline: "Focused pressure for tension relief",
    description:
      "Targeted work through the back, shoulders and neck to release everyday tension. Pressure is adjusted throughout.",
    durationMin: 60,
    price: 720,
    image: massageImg,
    prep: ["Hydrate well before and after", "Tell your therapist your pressure preference"],
  },
  {
    id: "tape-extensions",
    name: "Luxe Tape-In Extensions",
    category: "Hair Extensions",
    tagline: "Seamless length in a single sitting",
    description:
      "Ethically sourced remy hair colour-matched to your base, applied with invisible tape wefts and blended with a soft cut.",
    durationMin: 180,
    price: 3200,
    image: hairImg,
    prep: [
      "Wash hair the day before with clarifying shampoo",
      "Skip conditioner on the roots",
      "Book a colour match consultation first",
    ],
  },
  {
    id: "keratin-bonds",
    name: "Keratin Bond Extensions",
    category: "Hair Extensions",
    tagline: "Long-wear strands, feather-light",
    description:
      "Individual keratin-bonded strands for the most natural movement and up to four months of wear.",
    durationMin: 240,
    price: 4600,
    image: hairImg,
    prep: ["Consultation required", "Plan a maintenance visit at 10 weeks"],
  },
  {
    id: "gel-luxe",
    name: "Luxe Gel Manicure",
    category: "Nails",
    tagline: "Glass-smooth shine, two-week wear",
    description:
      "Cuticle care, precision shaping and a high-shine gel finish in our curated mauve and champagne palette.",
    durationMin: 60,
    price: 420,
    image: nailsImg,
    prep: ["Remove previous polish or book a soak-off", "Avoid cutting cuticles at home"],
  },
  {
    id: "sculpted-set",
    name: "Sculpted Extension Set",
    category: "Nails",
    tagline: "Architectural shape, hand-painted art",
    description:
      "Builder-gel extensions sculpted to your chosen length with optional hand-painted detailing and chrome finishes.",
    durationMin: 120,
    price: 690,
    image: nailsImg,
    prep: ["Allow extra 20 minutes for nail art", "Infills every 3 weeks keep the set pristine"],
  },
];

export const categories = [
  "Makeup",
  "Lashes",
  "Massages",
  "Hair Extensions",
  "Nails",
] as const;

export const categoryImages: Record<string, string> = {
  Makeup: makeupImg,
  Lashes: lashesImg,
  Massages: massageImg,
  "Hair Extensions": hairImg,
  Nails: nailsImg,
};

export const staff = [
  { id: "thandi", name: "Thandi M.", role: "Lead Makeup Artist" },
  { id: "sasha", name: "Sasha R.", role: "Lash Technician" },
  { id: "noluthando", name: "Noluthando K.", role: "Massage Therapist" },
  { id: "elani", name: "Elani P.", role: "Hair Extension Specialist" },
  { id: "zia", name: "Zia B.", role: "Nail Artist" },
];

export const faqs = [
  {
    q: "How early should I arrive?",
    a: "Please arrive 10 minutes before your appointment so we can seat you with a drink and run through your consultation card.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Reschedules are free up to 24 hours before. Inside 24 hours we hold 50% of the service value against your next visit.",
  },
  {
    q: "Do you offer bridal parties?",
    a: "Yes — we host groups of up to six in the atelier suite, with an on-site coordinator and a dedicated timeline.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Card, EFT and all major mobile wallets. A 20% deposit secures appointments over two hours.",
  },
  {
    q: "Can I bring a guest?",
    a: "Of course. The lounge seats two guests per client, and we ask that children are accompanied at all times.",
  },
];

export const demoAppointments = [
  { time: "09:00", client: "Lerato N.", service: "Bridal Atelier Makeup", staff: "Thandi M." },
  { time: "10:30", client: "Amira S.", service: "Russian Volume Lashes", staff: "Sasha R." },
  { time: "12:00", client: "Kate D.", service: "Luxe Gel Manicure", staff: "Zia B." },
  { time: "13:30", client: "Pumla Z.", service: "Aromatherapy Ritual Massage", staff: "Noluthando K." },
  { time: "15:00", client: "Yasmin A.", service: "Luxe Tape-In Extensions", staff: "Elani P." },
];

export const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const salon = {
  name: "Maison Élan",
  tagline: "Luxury beauty studio, intelligently run.",
  phone: "+27 21 555 0184",
  email: "hello@maisonelan.co.za",
  address: "42 Loop Street, Cape Town, 8001",
  hours: [
    { day: "Monday – Thursday", time: "09:00 – 18:00" },
    { day: "Friday", time: "09:00 – 20:00" },
    { day: "Saturday", time: "08:00 – 17:00" },
    { day: "Sunday", time: "Closed" },
  ],
};
