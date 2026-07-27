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
    id: "ff_diamond",
    name: "FF Diamond",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
    category: "topup",
    description: "Instant In-Game Direct Free Fire Diamond Top-Up via Player UID",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "100 Diamonds", p: 110 },
      { n: "210 Diamonds", p: 220 },
      { n: "530 Diamonds", p: 530 },
      { n: "1080 Diamonds", p: 1050 },
      { n: "2200 Diamonds", p: 2100 }
    ]
  },
  {
    id: "ff_levelup_pass",
    name: "Level Up Pass",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200",
    category: "topup",
    description: "Claim up to 800 Diamonds as you level up your Free Fire account",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "Level Up Pass (1x)", p: 250 }
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
  },
  {
    id: "ff_membership",
    name: "Weekly & Monthly Membership",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1200",
    category: "subscriptions",
    description: "Get daily diamond rewards and exclusive VIP perks",
    fields: [
      { label: "Player UID", placeholder: "e.g. 5839218392", type: "text", key: "playerUid" }
    ],
    packages: [
      { n: "Weekly Membership", p: 210 },
      { n: "Monthly Membership", p: 1050 }
    ]
  },
  {
    id: "ff_voucher_code",
    name: "Free Fire Voucher Code",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1200",
    category: "voucher",
    description: "Instant digital redeem codes delivered directly to your wallet history",
    fields: [
      { label: "Account Email / WhatsApp", placeholder: "e.g. 9800000000", type: "text", key: "contactInfo" }
    ],
    packages: [
      { n: "100 Diamonds Voucher Code", p: 115 },
      { n: "210 Diamonds Voucher Code", p: 230 }
    ]
  }
];

export const exchangeRates = {
  NPR: 1.0,
  AED: 36.5, // 1 AED = 36.5 NPR
  USD: 134.0 // 1 USD = 134 NPR
};
