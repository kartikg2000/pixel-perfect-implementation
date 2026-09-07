export type MenuCategory =
  | "cut-fruits"
  | "detox-juices"
  | "salad-box"
  | "saute-veggies"
  | "combos";

export type ComboPlanKey = "daily" | "weekly" | "monthly";

export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: MenuCategory;
  description: string;
  ingredients: string;
  portion: string;
  visual: "fruit" | "salad" | "juice" | "veggies" | "combo";
  price: number;
  comboPlans?: Record<ComboPlanKey, number>;
};

export type CategoryInfo = {
  id: MenuCategory;
  title: string;
  subtitle: string;
  visual: Product["visual"];
};

export const storefrontConfig = {
  brand: "MY HEALTHY PLATTER",
  phone: "9780035199",
  whatsappNumber: "919780035199",
  instagram: "@myhealthyplatter_",
  website: "myhealthyplatter.com",
  deliveryArea: "Mohali",
  offer: {
    enabled: true,
    label: "10% OFF TILL 30 SEPTEMBER",
    discountRate: 0.1,
  },
  deliveryFee: 0 as number | null,
  deliveryLabel: "Free delivery launch offer",
};

export const categories: CategoryInfo[] = [
  {
    id: "cut-fruits",
    title: "Cut Fruits",
    subtitle: "Fresh, seasonal fruit bowls",
    visual: "fruit",
  },
  {
    id: "detox-juices",
    title: "Detox Juices",
    subtitle: "Cold-pressed morning juices",
    visual: "juice",
  },
  {
    id: "salad-box",
    title: "Salad Box",
    subtitle: "Wholesome salads & protein add-ons",
    visual: "salad",
  },
  {
    id: "saute-veggies",
    title: "Sauté Veggies",
    subtitle: "Lightly sautéed seasonal vegetables",
    visual: "veggies",
  },
  {
    id: "combos",
    title: "Combos",
    subtitle: "Favourite pairings, better value",
    visual: "combo",
  },
];

export const products: Product[] = [
  // Cut Fruits
  {
    id: "fresh-cut-fruit-box",
    name: "Fresh Cut Fruit Box",
    shortName: "Fruit box",
    category: "cut-fruits",
    description: "Seasonal fruits, freshly cut and packed ready to eat.",
    ingredients: "Seasonal fruit selection",
    portion: "500 ml bowl",
    visual: "fruit",
    price: 129,
  },
  // Detox Juices
  {
    id: "green-energy-juice",
    name: "Green Energy Juice",
    shortName: "Green energy",
    category: "detox-juices",
    description: "A refreshing green juice to start the morning.",
    ingredients: "Fresh greens · cucumber · citrus",
    portion: "300 ml",
    visual: "juice",
    price: 149,
  },
  {
    id: "skin-glow-juice",
    name: "Skin Glow Juice",
    shortName: "Skin glow",
    category: "detox-juices",
    description: "A bright, antioxidant-rich juice for the morning.",
    ingredients: "Beetroot · carrot · citrus",
    portion: "300 ml",
    visual: "juice",
    price: 149,
  },
  {
    id: "immunity-boost-juice",
    name: "Immunity Boost Juice",
    shortName: "Immunity boost",
    category: "detox-juices",
    description: "A citrus and root-vegetable blend for an active start.",
    ingredients: "Carrot · orange · ginger · turmeric",
    portion: "300 ml",
    visual: "juice",
    price: 149,
  },
  // Salad Box
  {
    id: "chickpea-salad",
    name: "Chickpea Salad",
    shortName: "Chickpea salad",
    category: "salad-box",
    description: "Protein-rich chickpeas with fresh vegetables.",
    ingredients: "Chickpeas · cucumber · tomato · onion",
    portion: "375 ml bowl",
    visual: "salad",
    price: 129,
  },
  {
    id: "rajma-salad",
    name: "Rajma Salad",
    shortName: "Rajma salad",
    category: "salad-box",
    description: "Kidney beans tossed with crunchy salad vegetables.",
    ingredients: "Rajma · onion · tomato · capsicum",
    portion: "375 ml bowl",
    visual: "salad",
    price: 129,
  },
  {
    id: "moong-dal-sprouts",
    name: "Moong Dal Sprouts",
    shortName: "Moong sprouts",
    category: "salad-box",
    description: "Light, sprouted moong dal with fresh salad trimmings.",
    ingredients: "Sprouted moong · vegetables · lemon",
    portion: "375 ml bowl",
    visual: "salad",
    price: 129,
  },
  {
    id: "soya-chunks-salad",
    name: "Soya Chunks Salad",
    shortName: "Soya chunks salad",
    category: "salad-box",
    description: "High-protein soya chunks with fresh salad vegetables.",
    ingredients: "Soya chunks · cucumber · tomato · onion",
    portion: "375 ml bowl",
    visual: "salad",
    price: 129,
  },
  {
    id: "carrot-cucumber-salad",
    name: "Carrot Cucumber Salad",
    shortName: "Carrot cucumber salad",
    category: "salad-box",
    description: "A simple, crunchy salad of carrots and cucumber.",
    ingredients: "Carrot · cucumber · lemon · herbs",
    portion: "375 ml bowl",
    visual: "salad",
    price: 129,
  },
  // Sauté Veggies
  {
    id: "saute-veggies",
    name: "Sauté Veggies",
    shortName: "Sauté veggies",
    category: "saute-veggies",
    description: "Fresh vegetables lightly sautéed for a warm breakfast.",
    ingredients: "Seasonal vegetables · herbs",
    portion: "375 ml bowl",
    visual: "veggies",
    price: 149,
  },
  // Combos
  {
    id: "combo-fruit-juice",
    name: "Fresh Cut Fruit Box + Detox Juice",
    shortName: "Fruit + juice",
    category: "combos",
    description: "A fruit bowl paired with a fresh detox juice.",
    ingredients: "Fresh cut fruit + detox juice of choice",
    portion: "500 ml bowl + 300 ml juice",
    visual: "combo",
    price: 229,
    comboPlans: {
      daily: 229,
      weekly: 1299,
      monthly: 4799,
    },
  },
  {
    id: "combo-fruit-salad",
    name: "Fresh Cut Fruit Box + Salad Box",
    shortName: "Fruit + salad",
    category: "combos",
    description: "A fruit bowl paired with a wholesome salad box.",
    ingredients: "Fresh cut fruit + salad of choice",
    portion: "500 ml bowl + 375 ml salad",
    visual: "combo",
    price: 219,
    comboPlans: {
      daily: 219,
      weekly: 1199,
      monthly: 4499,
    },
  },
  {
    id: "combo-fruit-salad-juice",
    name: "Fresh Cut Fruit Box + Salad Box + Detox Juice",
    shortName: "Fruit + salad + juice",
    category: "combos",
    description: "The full breakfast: fruit, salad and a detox juice.",
    ingredients: "Fresh cut fruit + salad + detox juice of choice",
    portion: "500 ml bowl + 375 ml salad + 300 ml juice",
    visual: "combo",
    price: 319,
    comboPlans: {
      daily: 319,
      weekly: 1799,
      monthly: 6999,
    },
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getComboPlanLabel(plan: ComboPlanKey) {
  switch (plan) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly (6 Days)";
    case "monthly":
      return "Monthly (24 Days)";
  }
}

export function getComboPlanDeliveries(plan: ComboPlanKey) {
  switch (plan) {
    case "daily":
      return 1;
    case "weekly":
      return 6;
    case "monthly":
      return 24;
  }
}

export function getProductPrice(product: Product, comboPlan?: ComboPlanKey) {
  if (product.comboPlans && comboPlan) {
    return product.comboPlans[comboPlan];
  }
  return product.price;
}

export function formatPrice(value: number | null) {
  if (value === null) return "Price pending";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getOfferDiscount(subtotal: number) {
  if (!storefrontConfig.offer.enabled) return 0;
  return Math.round(subtotal * storefrontConfig.offer.discountRate);
}
