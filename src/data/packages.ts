export interface GamePackage {
  n: string; // package name / quantity
  p: number; // base price in NPR (Rs.)
}

export interface ServiceItem {
  id: string;
  name: string;
  image: string;
  category: "ffbots" | "topup" | "voucher" | "subscriptions";
  description: string;
  fields: {
    label: string;
    placeholder: string;
    type: "text" | "number" | "email" | "password" | "select";
    key: string;
    options?: string[];
  }[];
  packages: GamePackage[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "freefire_topup",
    name: "Freefire",
    image: "https://i.ibb.co/My1kJfTy/IMG-20260302-211532.jpg",
    category: "topup",
    description: "Instant in-game Freefire Diamonds top-up directly to your Player UID",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "25 Diamonds", p: 30 },
      { n: "50 Diamonds", p: 55 },
      { n: "115 Diamonds", p: 99 },
      { n: "240 Diamonds", p: 200 },
      { n: "480 Diamonds", p: 395 },
      { n: "505 Diamonds", p: 420 },
      { n: "610 Diamonds", p: 500 },
      { n: "850 Diamonds", p: 690 },
      { n: "1090 Diamonds", p: 875 },
      { n: "1240 Diamonds", p: 970 }
    ]
  },
  {
    id: "levelup_pass",
    name: "Level up Pass",
    image: "https://i.ibb.co/My1kJfTy/IMG-20260302-211532.jpg",
    category: "topup",
    description: "Get Level up Pass diamonds sent instantly to your player UID",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "All Levels (1270 Diamonds)", p: 570 },
      { n: "Level 10 Premium", p: 150 }
    ]
  },
  {
    id: "membership",
    name: "Membership",
    image: "https://i.ibb.co/My1kJfTy/IMG-20260302-211532.jpg",
    category: "topup",
    description: "Weekly & Monthly premium Freefire memberships loaded via Player UID",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "Weekly Membership", p: 195 },
      { n: "Monthly Membership", p: 960 }
    ]
  },
  {
    id: "canva_pro",
    name: "Canva pro",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop",
    category: "subscriptions",
    description: "Upgrade your Canva account to Premium Pro instantly via invitation link",
    fields: [
      { label: "Email Address", placeholder: "e.g. user@example.com", type: "email", key: "email" }
    ],
    packages: [
      { n: "Canva Pro 1 Month", p: 99 },
      { n: "Canva Pro 1 Year", p: 499 }
    ]
  },
  {
    id: "netflix",
    name: "Netflix",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?q=80&w=600&auto=format&fit=crop",
    category: "subscriptions",
    description: "Premium Netflix Ultra HD screens and full private accounts",
    fields: [
      { label: "Contact Number / Email", placeholder: "e.g. 98XXXXXXXX or email", type: "text", key: "contact" }
    ],
    packages: [
      { n: "Netflix Premium 1 Month (1 Screen Shared)", p: 250 },
      { n: "Netflix Premium 1 Month (Private 4 Screens)", p: 1200 }
    ]
  },
  {
    id: "spotify",
    name: "Spotify",
    image: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=600&auto=format&fit=crop",
    category: "subscriptions",
    description: "Get premium high-fidelity ad-free music subscription for your own Spotify account",
    fields: [
      { label: "Spotify Account Email", placeholder: "e.g. music@example.com", type: "email", key: "email" }
    ],
    packages: [
      { n: "Spotify Premium 1 Month (Family Shared)", p: 99 },
      { n: "Spotify Premium 3 Months (Individual)", p: 299 },
      { n: "Spotify Premium 1 Year (Family Shared)", p: 499 }
    ]
  },
  {
    id: "unipin_voucher",
    name: "Unipin voucher",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    category: "voucher",
    description: "Instant digital UniPin gift vouchers and load pins",
    fields: [
      { label: "Email for Receipt", placeholder: "e.g. delivery@example.com", type: "email", key: "email" }
    ],
    packages: [
      { n: "UniPin Rs. 100 Voucher", p: 110 },
      { n: "UniPin Rs. 500 Voucher", p: 530 },
      { n: "UniPin Rs. 1000 Voucher", p: 1050 }
    ]
  },
  {
    id: "ff_likebot",
    name: "Free Fire Like Bot",
    image: "https://i.ibb.co/My1kJfTy/IMG-20260302-211532.jpg",
    category: "ffbots",
    description: "Boost your Free Fire profile likes instantly and safely",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "30 Days — 6000 Likes", p: 649 },
      { n: "60 Days — 12000 Likes", p: 1298 }
    ]
  },
  {
    id: "ff_glorybot",
    name: "Free Fire Glory Bot",
    image: "https://i.ibb.co/My1kJfTy/IMG-20260302-211532.jpg",
    category: "ffbots",
    description: "Level up your Guild Glory with our dedicated Squad Glory Bots",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "1 Squad", p: 375 },
      { n: "2 Squad", p: 725 }
    ]
  }
];

export const exchangeRates = {
  NPR: 1.0,
  AED: 36.5, // 1 AED = 36.5 NPR
  USD: 134.0 // 1 USD = 134 NPR
};
