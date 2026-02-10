import { AppConfig } from './types';

export const PRODUCTS = ["Melonity", "Umbrella Dota 2", "Divine", "Hake", "Umbrella Deadlock", "DotaAccount"];

export const PRODUCT_DURATIONS: Record<string, string[]> = {
  "Melonity": ["1 Day", "7 Days", "30 Days", "90 Days", "180 Days", "Lifetime"],
  "Umbrella Dota 2": ["1 Day", "7 Days", "14 Days", "30 Days", "90 Days", "180 Days", "Lifetime"],
  "Divine": ["7 Days", "14 Days", "30 Days"],
  "Hake": ["1 Day", "7 Days", "30 Days", "90 Days", "180 Days"],
  "Umbrella Deadlock": ["1 Day", "7 Days", "14 Days", "30 Days", "90 Days", "180 Days", "Lifetime"],
  "DotaAccount": ["Ranked Ready", "TBD Rank Open"],
  "default": ["1 Day", "7 Days", "30 Days"]
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
    "PromptPay QR", "PIX", "BLIK", "Bangkok Bank", "Bank of Ayudhya (Krungsri)", 
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

// Fallback links (now mostly handled by overrides in DEFAULT_CONFIG)
export const DEFAULT_LINKS: Record<string, string> = {};

export const DEFAULT_CONFIG: AppConfig = {
  whatsappNumber: "62",
  discordLink: "https://discord.gg/example",
  youtubeLink: "#",
  facebookLink: "#",
  reviews: [
    {
      "id": 1700000000001,
      "name": "Alex",
      "product": "Melonity",
      "rating": 5,
      "comment": "Best script ever, very safe and easy to use!",
      "createdAt": "2026-02-09T07:45:00.000Z"
    },
    {
      "id": 1700000000002,
      "name": "DendiFromPudge",
      "product": "Umbrella Dota 2",
      "rating": 4,
      "comment": "Good functionality but needs better documentation. Support is helpful though.",
      "createdAt": "2026-02-09T07:46:00.000Z"
    }
  ],
  requests: [
    {
      "id": 1700000000003,
      "product": "Umbrella Dota 2",
      "discord": "dda",
      "orderId": "dafasfasf",
      "status": "pending"
    }
  ],
  productStyles: {},
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
    "DotaAccount_Ranked Ready": {
      "crypto": "https://miuwmiaw.selly.store/product/7864c0a9",
      "fiat": ""
    },
    "DotaAccount_TBD Rank Open": {
      "crypto": "https://miuwmiaw.selly.store/product/21419568",
      "fiat": ""
    }
  },
  adminAuth: {
    username: "admin",
    // This is the hash for "admin". Do not store plain text passwords.
    // Generated using the simpleHash function.
    password: "92668751" 
  }
};

export const CATEGORY_ICONS: Record<string, string> = {
  "Credit & Debit Card": "fa-credit-card",
  "E-Wallet": "fa-wallet",
  "Cryptocurrency": "fa-bitcoin",
  "Online Banking": "fa-building-columns",
  "Bank Transfer / ATM / CDM": "fa-money-bill-transfer",
  "Bill Payment Online / ATM": "fa-receipt",
  "Over the Counter (Non Bank)": "fa-store"
};