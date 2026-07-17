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
