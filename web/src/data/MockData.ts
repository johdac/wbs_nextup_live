export interface Artist {
  id: string;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  musicUrl?: string;
}

export interface EventLocation {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface MusicEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: EventLocation;
  artists: Artist[];
  genre: string;
  coverImage: string;
  isPopular: boolean;
  organizerName: string;
}

export const genres = [
  "Rock",
  "Techno",
  "Jazz",
  "Hip-Hop",
  "Indie",
  "Electronic",
] as const;

export type Genre = (typeof genres)[number];

const locations: EventLocation[] = [
  {
    id: "l1",
    name: "Neon Warehouse",
    address: "42 Electric Ave",
    city: "Los Angeles",
  },
  {
    id: "l2",
    name: "The Grid Club",
    address: "88 Sunset Blvd",
    city: "San Francisco",
  },
  {
    id: "l3",
    name: "Cyber Lounge",
    address: "101 Digital St",
    city: "New York",
  },
  { id: "l4", name: "Synthwave Arena", address: "7 Retro Lane", city: "Miami" },
  { id: "l5", name: "Chrome Stage", address: "55 Future Rd", city: "Chicago" },
];

const artists: Artist[] = [
  {
    id: "a1",
    name: "NEON VORTEX",
    genre: "Electronic",
    description: "Pulsating synths and retro beats",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a2",
    name: "CHROME HEARTS",
    genre: "Indie",
    description: "Dreamy guitars meet digital soundscapes",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a3",
    name: "MIDNIGHT PROTOCOL",
    genre: "Techno",
    description: "Dark, driving techno from the underground",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a4",
    name: "STATIC BLOOM",
    genre: "Rock",
    description: "Heavy riffs with electronic undertones",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a5",
    name: "CYBER JAZZ COLLECTIVE",
    genre: "Jazz",
    description: "Jazz reimagined for the digital age",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a6",
    name: "PIXEL FLOW",
    genre: "Hip-Hop",
    description: "Futuristic beats and sharp lyricism",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a7",
    name: "AURORA SYNTH",
    genre: "Electronic",
    description: "Ambient textures and euphoric drops",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "a8",
    name: "VOLTAGE",
    genre: "Rock",
    description: "Raw energy meets polished production",
    imageUrl: "/placeholder.svg",
  },
];

export const mockEvents: MusicEvent[] = [
  {
    id: "e1",
    title: "Midnight Pulse Festival",
    description:
      "An electrifying night of techno and house featuring international DJs, immersive visuals, and an open-air dance floor experience.",

    startDate: "2026-03-15T21:00:00",
    endDate: "2026-03-16T04:00:00",
    location: locations[0],
    artists: [artists[0], artists[6]],
    genre: "Techno",
    coverImage:
      "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPopular: true,
    organizerName: "Pulse Events",
  },
  {
    id: "e2",
    title: "Summer Beats Live",
    description:
      "A high-energy live concert featuring chart-topping pop and hip-hop artists with stunning stage production.",
    startDate: "2026-03-20T22:00:00",
    endDate: "2026-03-21T05:00:00",
    location: locations[2],
    artists: [artists[2]],
    genre: "Hip-Hop",
    coverImage:
      "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPopular: true,
    organizerName: "Golden Stage Productions",
  },
  {
    id: "e3",
    title: "Summer Beats Live",
    description:
      "A high-energy live concert featuring chart-topping pop and hip-hop artists with stunning stage production.",
    startDate: "2026-03-20T22:00:00",
    endDate: "2026-03-21T05:00:00",
    location: locations[2],
    artists: [artists[2]],
    genre: "Hip-Hop",
    coverImage:
      "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPopular: true,
    organizerName: "Golden Stage Productions",
  },
  {
    id: "e4",
    title: "Summer Beats Live",
    description:
      "A high-energy live concert featuring chart-topping pop and hip-hop artists with stunning stage production.",
    startDate: "2026-03-20T22:00:00",
    endDate: "2026-03-21T05:00:00",
    location: locations[2],
    artists: [artists[2]],
    genre: "Electronic",
    coverImage:
      "https://images.unsplash.com/photo-1670028514318-0ac718c0590d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPopular: true,
    organizerName: "Golden Stage Productions",
  },
  {
    id: "e5",
    title: "Summer Beats Live",
    description:
      "A high-energy live concert featuring chart-topping pop and hip-hop artists with stunning stage production.",
    startDate: "2026-03-20T22:00:00",
    endDate: "2026-03-21T05:00:00",
    location: locations[2],
    artists: [artists[2]],
    genre: "Electronic",
    coverImage:
      "https://images.unsplash.com/photo-1670028514318-0ac718c0590d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isPopular: true,
    organizerName: "Golden Stage Productions",
  },
];
