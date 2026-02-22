
import { AppConfig, PricingProduct } from './types';

export const PRODUCTS = ["Melonity", "Umbrella Dota 2", "Divine", "Hake", "Umbrella Deadlock", "DotaAccount", "FoxHole"];

export const PRODUCT_DURATIONS: Record<string, string[]> = {
  "Melonity": ["1 Day", "7 Days", "30 Days", "90 Days", "180 Days", "Lifetime"],
  "Umbrella Dota 2": ["1 Day", "7 Days", "14 Days", "30 Days", "90 Days", "180 Days", "Lifetime"],
  "Divine": ["7 Days", "14 Days", "30 Days"],
  "Hake": ["1 Day", "7 Days", "30 Days", "90 Days", "180 Days"],
  "Umbrella Deadlock": ["1 Day", "7 Days", "14 Days", "30 Days", "90 Days", "180 Days", "Lifetime"],
  "DotaAccount": ["Ranked Ready", "TBD Rank Open"],
  "FoxHole": ["1 Day", "3 Days", "7 Days", "30 Days"],
  "default": ["1 Day", "7 Days", "30 Days"]
};

export const PRODUCT_PRICES: Record<string, Record<string, string>> = {
  "Melonity": {
    "1 Day": "1.93$",
    "7 Days": "5.7$",
    "30 Days": "11$",
    "90 Days": "33$",
    "180 Days": "60$"
  },
  "Umbrella Dota 2": {
    "1 Day": "0.95$",
    "7 Days": "4.25$",
    "14 Days": "7$",
    "30 Days": "10$",
    "90 Days": "29$",
    "180 Days": "55$",
    "Lifetime": "360$"
  },
  "Divine": {
    "7 Days": "2.75$",
    "14 Days": "5$",
    "30 Days": "9.5$",
    "90 Days": "25$",
    "180 Days": "49$"
  },
  "Hake": {
    "1 Day": "1.75$",
    "7 Days": "4.25$",
    "30 Days": "11.5$",
    "90 Days": "30.5$",
    "180 Days": "57.75$"
  },
  "Umbrella Deadlock": {
    "1 Day": "1.8$",
    "7 Days": "6$",
    "14 Days": "9.5$",
    "30 Days": "12.8$",
    "90 Days": "38$",
    "180 Days": "68$",
    "Lifetime": "535$"
  },
  "FoxHole": {
    "1 Day": "2.8$",
    "3 Days": "7.5$",
    "7 Days": "14$",
    "30 Days": "32$"
  }
};

export const PAYMENT_METHODS_LIST = {
  "Credit & Debit Card": [
    "Visa", "Mastercard", "JCB", "American Express"
  ],
  "E-Wallet": [
    "Apple Pay", "Google Pay", "PayPal Wallet", "PayPal Pay Later", "Neteller", 
    "Skrill Wallet", "Payoneer Wallet", "Paysafecard", "CVS Pharmacy", "Dollar General", 
    "GrabPay", "Grab PayLater", "ShopeePay", "DANA", "Jenius Pay", "GCash", 
    "Samsung Pay", "SSG Pay", "Toss", "TrueMoney", "LINE Pay", "WeChat Pay"
  ],
  "Cryptocurrency": [
    "Binance Pay", "Bitcoin", "Ethereum", "Tether USDT (ETH)", 
    "Tether USDT (Polygon)", "USDC", "USDC (Polygon)"
  ],
  "Online Banking": [
    "Rapid Transfer", "Multibanco", "MyBank", "PayNow", "DuitNow QR", 
    "PromptPay QR", "PIX", "BLIK", "Bankok Bank", "Bank of Ayudhya (Krungsri)", 
    "Kasikornbank PAYPLUS", "Siam Commercial Bank", "BPI Online", "Unionbank Online"
  ],
  "Bank Transfer / ATM / CDM": [
    "BDO Internet Fund Transfer", "Chinabank OTC / ATM", "Landbank Online ATM Payment", 
    "Bank Transfer", "Virtual Bank Transfer"
  ],
  "Bill Payment Online / ATM": [
    "Asia United Bank", "BDO ATM Bill Payment", "BPI OTC Bill Payment", 
    "Chinabank Online", "EastWest Bank OTC Bill Payment", "Metrobank Direct", 
    "Metrobank OTC Bills Payment", "PayMaya Bills Pay", "PNB Online Bill Payment", 
    "PNB OTC Bill Payment", "PS Bank Online Bill Payment", "RCBC OTC Bill Payment", 
    "Robinsons Bank Online Bill Payment", "Robinsons Bank OTC Bill Payment", 
    "Unionbank OTC Bill Payment"
  ],
  "Over the Counter (Non Bank)": [
    "7-Eleven", "Alfamart", "Indomaret", "Cebuana Lhuillier", "EC Pay", 
    "M. Lhuillier", "Palawan Pawnshop", "RD Pawnshop", "Robinsons Dept Store", 
    "RuralNet", "SM Dept Counter"
  ]
};

export const DEFAULT_LINKS: Record<string, string> = {};

export const DEFAULT_CONFIG: AppConfig = {
  whatsappNumber: "62",
  discordLink: "https://discord.gg/CvetNYu5Gp",
  youtubeLink: "https://www.youtube.com/@MiuAILaughs",
  facebookLink: "https://www.facebook.com/greenhode",
  reviews: [
    {
      "id": 1,
      "name": "amloufe",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "+rep very good seller, instant purchase and perfect prices",
      "createdAt": "2025-02-10T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "rob.concha",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "Very good service and legit!",
      "createdAt": "2025-02-10T10:05:00.000Z"
    },
    {
      "id": 3,
      "name": "jeissi2",
      "product": "Melonity",
      "rating": 5,
      "comment": "10/10 my man",
      "createdAt": "2025-02-10T10:10:00.000Z"
    },
    {
      "id": 4,
      "name": "2010yamatokurosawa",
      "product": "Umbrella Deadlock",
      "rating": 5,
      "comment": "great cheap prices and accessible",
      "createdAt": "2025-02-10T10:15:00.000Z"
    },
    {
      "id": 5,
      "name": "Adrian.onica197",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "Thanks a lot for the work Best Regards!",
      "createdAt": "2025-02-10T10:20:00.000Z"
    },
    {
      "id": 6,
      "name": "lonlon11",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "been his or her client for almost 4 year! and still rocking!!! now its even safer and faster! thank you!",
      "createdAt": "2025-02-10T10:25:00.000Z"
    },
    {
      "id": 7,
      "name": "devmerchor",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "I've been buying from MiuWMiuW for 2 years, and they are a very responsible and polite person. I 100% recommend them.",
      "createdAt": "2025-02-15T12:00:00.000Z"
    },
    {
      "id": 8,
      "name": "batman",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "+rep @Miuw_Miuw got lifetime Umbrella. Thanks for sharing giveaway code to the community on my behalf.",
      "createdAt": "2025-02-16T14:30:00.000Z"
    },
    {
      "id": 9,
      "name": "moth",
      "product": "Melonity",
      "rating": 5,
      "comment": "+rep quickly review, bought lifetime.",
      "createdAt": "2025-02-17T09:15:00.000Z"
    },
    {
      "id": 10,
      "name": "pume",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "+rep, best seller",
      "createdAt": "2025-02-18T11:20:00.000Z"
    },
    {
      "id": 11,
      "name": "bmw",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "another dota week +rep miuw miuw",
      "createdAt": "2025-02-19T16:45:00.000Z"
    },
    {
      "id": 12,
      "name": "mashkook",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "+rep miuw miuw best for ever",
      "createdAt": "2025-02-20T08:10:00.000Z"
    },
    {
      "id": 13,
      "name": "metal0-1",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "+Rep, Miuw Miuw at your service all the time!! the best one i found so far :)) Super Recommended!!",
      "createdAt": "2025-02-21T10:00:00.000Z"
    },
    {
      "id": 14,
      "name": "aquakunn",
      "product": "Umbrella Dota 2",
      "rating": 5,
      "comment": "great and fast service, everything done in like 25-30 mins:neko_cute:",
      "createdAt": "2025-02-21T15:20:00.000Z"
    }
  ],
  requests: [],
  productStyles: {
    "Melonity": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/290efd6d-9e2c-4e79-b234-bd45bc6cc943/anim=false,width=450,optimized=true/00419-409819207.jpeg",
      "bgSize": "cover",
      "bgPosition": "top"
    },
    "Umbrella Dota 2": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a7401f2d-51d1-42de-86ec-891a893d6bf8/anim=false,width=450,optimized=true/photo_2025-01-22_14-42-30.jpeg",
      "bgSize": "cover",
      "bgPosition": "top"
    },
    "Divine": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f7d7492d-bf8a-4559-f9b6-f9925d308800/anim=false,width=450,optimized=true/287691.jpeg",
      "bgSize": "cover",
      "bgPosition": "top"
    },
    "Hake": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d1f14597-dfe2-49b3-92df-871b2af3cc16/anim=false,width=450,optimized=true/0JD25Y4C3SZGDNMYWN3RK95AS0.jpeg",
      "bgSize": "cover",
      "bgPosition": "top"
    },
    "Umbrella Deadlock": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f1ae7585-1328-48b3-a488-96c548a131c1/anim=false,width=450,optimized=true/00004-3342214399.jpeg",
      "bgSize": "cover",
      "bgPosition": "top"
    },
    "DotaAccount": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1b35fde4-bc43-4a6f-9974-ff45986e8392/anim=false,width=450,optimized=true/00074-2475620417-0000.jpeg",
      "bgSize": "cover",
      "bgPosition": "top"
    },
    "FoxHole": {
      "bgUrl": "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a3e8c98b-ac8a-4a8b-8ed6-036e9eec3325/anim=false,width=450,optimized=true/00495-887514395.jpeg",
      "bgSize": "cover",
      "bgPosition": "center"
    }
  },
  overrides: {
    "Melonity_1 Day": {
      "crypto": "https://miuwmiaw.selly.store/product/d644f53e",
      "fiatWorld": "https://www.g2g.com/id/categories/googleplay-gift-cards/offer/G1698968074496BQ",
      "fiatRegion": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742351230820HS"
    },
    "Melonity_7 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/76fede99",
      "fiatWorld": "https://www.g2g.com/id/categories/googleplay-gift-cards/offer/G1699109587459FC",
      "fiatRegion": "https://www.g2g.com/id/categories/apple-gift-cards/offer/G1717723368372DM"
    },
    "Melonity_30 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/6f9eac19",
      "fiatWorld": "https://www.g2g.com/id/categories/googleplay-gift-cards/offer/G1700141375815IA",
      "fiatRegion": "https://www.g2g.com/id/categories/apple-gift-cards/offer/G1717723498651DJ"
    },
    "Melonity_90 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/b91bf4c0",
      "fiatWorld": "https://www.g2g.com/id/categories/googleplay-gift-cards/offer/G1713535193447VM",
      "fiatRegion": "https://www.g2g.com/id/categories/apple-gift-cards/offer/G1717723587036MZ"
    },
    "Melonity_180 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/d4534267",
      "fiatWorld": "https://www.g2g.com/id/categories/googleplay-gift-cards/offer/G1698969341766RS",
      "fiatRegion": "https://www.g2g.com/id/categories/apple-gift-cards/offer/G1717723658755UV"
    },
    "Melonity_Lifetime": {
      "crypto": "https://miuwmiaw.selly.store/product/a1ec55d7",
      "fiatWorld": "",
      "fiatRegion": ""
    },
    "Umbrella Dota 2_1 Day": {
      "crypto": "https://miuwmiaw.selly.store/product/2234bbc8",
      "fiat": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742351148823NQ"
    },
    "Umbrella Dota 2_7 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/b467998d",
      "fiat": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742352243538IM"
    },
    "Umbrella Dota 2_14 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/98a0067e",
      "fiat": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742352284244IK"
    },
    "Umbrella Dota 2_30 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/41241060",
      "fiat": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742352453710CO"
    },
    "Umbrella Dota 2_90 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/1fbde5b9",
      "fiat": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742352500701ZP"
    },
    "Umbrella Dota 2_180 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/31639c3d",
      "fiat": "https://www.g2g.com/id/categories/steam-wallet-gift-cards/offer/G1742352538771DA"
    },
    "Umbrella Dota 2_Lifetime": {
      "crypto": "https://miuwmiaw.selly.store/product/f65a6299",
      "fiat": "https://miuwmiaw.selly.store/product/f65a6299"
    },
    "Divine_7 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/9311233a",
      "fiat": ""
    },
    "Divine_14 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/da249fd1",
      "fiat": ""
    },
    "Divine_30 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/b083a428",
      "fiat": ""
    },
    "Hake_1 Day": {
      "crypto": "https://miuwmiaw.selly.store/product/8eda7015",
      "fiat": ""
    },
    "Hake_7 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/07bae9de",
      "fiat": ""
    },
    "Hake_30 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/1a29221d",
      "fiat": ""
    },
    "Hake_90 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/6a365511",
      "fiat": ""
    },
    "Hake_180 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/c66fdd54",
      "fiat": ""
    },
    "Umbrella Deadlock_1 Day": {
      "crypto": "https://miuwmiaw.selly.store/product/259b8111",
      "fiat": "https://www.g2g.com/id/categories/razer-gold-gift-cards/offer/G1757596810504MR"
    },
    "Umbrella Deadlock_7 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/4ec23486",
      "fiat": "https://www.g2g.com/id/categories/razer-gold-gift-cards/offer/G1757596885512IK"
    },
    "Umbrella Deadlock_14 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/f7ab11f4",
      "fiat": ""
    },
    "Umbrella Deadlock_30 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/5e617c49",
      "fiat": "https://www.g2g.com/id/categories/razer-gold-gift-cards/offer/G1757596285259BU"
    },
    "Umbrella Deadlock_90 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/a6c4976d",
      "fiat": ""
    },
    "Umbrella Deadlock_180 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/ecfdbc7f",
      "fiat": ""
    },
    "Umbrella Deadlock_Lifetime": {
      "crypto": "https://miuwmiaw.selly.store/product/ec551378",
      "fiat": ""
    },
    "DotaAccount_Ranked Ready": {
      "crypto": "https://miuwmiaw.selly.store/product/7864c0a9",
      "fiat": ""
    },
    "DotaAccount_TBD Rank Open": {
      "crypto": "https://miuwmiaw.selly.store/product/21419568",
      "fiat": ""
    },
    "FoxHole_1 Day": {
      "crypto": "https://miuwmiaw.selly.store/product/1ec2208f",
      "fiat": ""
    },
    "FoxHole_3 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/bd6f6cf9",
      "fiat": ""
    },
    "FoxHole_7 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/ab9a1f19",
      "fiat": ""
    },
    "FoxHole_30 Days": {
      "crypto": "https://miuwmiaw.selly.store/product/7f7ceca8",
      "fiat": ""
    }
  },
  adminAuth: {
    username: "admin",
    password: "92668751" 
  }
};

export const PRICING_DATA: PricingProduct[] = [
  {
    name: "Melonity",
    icon: "fa-droplet", // Water
    subCategories: [
      {
        name: "Worldwide",
        prices: [
          { duration: "1 day", price: "1.93 USD" },
          { duration: "7 days", price: "5.7 USD" },
          { duration: "30 days", price: "11 USD" },
          { duration: "90 days", price: "33 USD" },
          { duration: "180 days", price: "60 USD" }
        ]
      },
      {
        name: "Region",
        prices: [
          { duration: "1 day", price: "1.2 USD" },
          { duration: "7 days", price: "5.1 USD" },
          { duration: "30 days", price: "11 USD" },
          { duration: "90 days", price: "30 USD" },
          { duration: "180 days", price: "54 USD" }
        ]
      }
    ]
  },
  {
    name: "Hake.me",
    icon: "fa-fire", // Fire
    prices: [
      { duration: "1 Day", price: "1.75$" },
      { duration: "7 Days", price: "4.25$" },
      { duration: "30 Days", price: "11.5$" },
      { duration: "90 Days", price: "30.5$" },
      { duration: "180 Days", price: "57.75$" }
    ]
  },
  {
    name: "Divine",
    icon: "fa-wind", // Air
    prices: [
      { duration: "7 Days", price: "2.75$" },
      { duration: "14 Days", price: "5$" },
      { duration: "30 Days", price: "9.5$" },
      { duration: "90 Days", price: "25$" },
      { duration: "180 Days", price: "49$" }
    ]
  },
  {
    name: "Umbrella Dota",
    icon: "fa-mountain", // Earth
    prices: [
      { duration: "1 DAY", price: "0.95$" },
      { duration: "7 DAYS", price: "4.25$" },
      { duration: "14 DAYS", price: "7$" },
      { duration: "30 DAYS", price: "10$" },
      { duration: "90 DAYS", price: "29$" },
      { duration: "180 DAYS", price: "55$" },
      { duration: "lifetime", price: "360$" }
    ]
  },
  {
    name: "Umbrella Deadlock",
    icon: "fa-bolt", // Lightning
    prices: [
      { duration: "1 DAY", price: "1.8$" },
      { duration: "7 DAYS", price: "6$" },
      { duration: "14 DAYS", price: "9.5$" },
      { duration: "30 DAYS", price: "12.8$" },
      { duration: "90 DAYS", price: "38$" },
      { duration: "180 DAYS", price: "68$" },
      { duration: "lifetime", price: "535$" }
    ]
  },
  {
    name: "Dota 2 Accounts",
    icon: "fa-gem", // Crystal/Earth
    prices: [
      { duration: "Ranked Ready", price: "Varies" },
      { duration: "TBD Rank Open", price: "Varies" }
    ]
  },
  {
    name: "FoxHole",
    icon: "fa-helmet-safety",
    prices: [
      { duration: "1 Day", price: "2.8$" },
      { duration: "3 Days", price: "7.5$" },
      { duration: "7 Days", price: "14$" },
      { duration: "30 Days", price: "32$" }
    ]
  }
];

export const CATEGORY_ICONS: Record<string, string> = {
  "Credit & Debit Card": "fa-credit-card",
  "E-Wallet": "fa-wallet",
  "Cryptocurrency": "fa-bitcoin",
  "Online Banking": "fa-building-columns",
  "Bank Transfer / ATM / CDM": "fa-money-bill-transfer",
  "Bill Payment Online / ATM": "fa-receipt",
  "Over the Counter (Non Bank)": "fa-store"
};
