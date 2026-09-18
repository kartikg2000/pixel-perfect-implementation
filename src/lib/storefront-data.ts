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
  comboPlans?: Record<ComboPlanKey, number> | undefined;
  badges?: string[] | undefined;
};

export type CategoryInfo = {
  id: MenuCategory;
  title: string;
  subtitle: string;
  visual: Product["visual"];
};

export const storefrontConfig = {
  brand: "MY HEALTHY PLATTER",
  phone: "9780053199",
  whatsappNumber: "919780053199",
  upiId: "9780053199@upi",
  instagram: "@myhealthyplatter_",
  website: "myhealthyplatter.com",
  deliveryArea: "Mohali",
  cutoffTime: "9:30 PM",
  cutoffBannerText: "Order before 9:30 PM for next day delivery (8:00 AM – 2:00 PM)",
  offer: {
    enabled: false,
    label: "",
    discountRate: 0,
  },
  deliveryFee: 0 as number | null,
  deliveryLabel: "Free delivery launch offer",
};

export const categories: CategoryInfo[] = [
  {
    id: "cut-fruits",
    title: "Fresh Cuts",
    subtitle: "5 Fresh Fruits bowl (500ml)",
    visual: "fruit",
  },
  {
    id: "detox-juices",
    title: "Cold-Pressed Detox Juices",
    subtitle: "100% natural morning detox blends (300ml)",
    visual: "juice",
  },
  {
    id: "salad-box",
    title: "Signature Salads",
    subtitle: "High-protein & exotic veggie bowls in lemon & pomegranate (500ml)",
    visual: "salad",
  },
  {
    id: "saute-veggies",
    title: "Seasonal Greens",
    subtitle: "PAN tossed fresh paneer & exotic veggies (500ml)",
    visual: "veggies",
  },
  {
    id: "combos",
    title: "Combos",
    subtitle: "The Glow, Balance & Complete Rituals in Daily, Weekly & Monthly plans",
    visual: "combo",
  },
];

export const products: Product[] = [
  // Fresh Cuts
  {
    id: "exotic-fruit-bowl",
    name: "Exotic Fruit Bowl",
    shortName: "Exotic fruit bowl",
    category: "cut-fruits",
    description: "5 fresh fruits, freshly cut and packed ready to eat.",
    ingredients: "5 Fresh Fruits",
    portion: "500 ml (approx. 250 g)",
    visual: "fruit",
    price: 129,
    badges: ["5 Seasonal Fruits", "Immunity Booster"],
  },
  // Cold-Pressed Detox Juices
  {
    id: "verdant-vitality",
    name: "Verdant Vitality",
    shortName: "Verdant vitality",
    category: "detox-juices",
    description: "Cold-pressed detox juice to refresh and purify your morning.",
    ingredients: "Green Apple, Cucumber, Spinach, Lettuce, Mint, Lemon",
    portion: "300 ml",
    visual: "juice",
    price: 149,
    badges: ["100% Raw", "No Added Sugar", "Cold-Pressed"],
  },
  {
    id: "ruby-radiance",
    name: "Ruby Radiance",
    shortName: "Ruby radiance",
    category: "detox-juices",
    description: "Antioxidant-rich cold-pressed juice for natural glow and vitality.",
    ingredients: "Red Apple, Beetroot, Carrot, Cucumber, Mint, Lemon",
    portion: "300 ml",
    visual: "juice",
    price: 149,
    badges: ["100% Raw", "No Added Sugar", "Cold-Pressed"],
  },
  {
    id: "citrus-vital",
    name: "Citrus Vital",
    shortName: "Citrus vital",
    category: "detox-juices",
    description: "Invigorating citrus blend packed with natural vitamins.",
    ingredients: "Orange, Sweet Lime, Carrot, Mint",
    portion: "300 ml",
    visual: "juice",
    price: 149,
    badges: ["100% Raw", "No Added Sugar", "Cold-Pressed"],
  },
  // Signature Salads
  {
    id: "chickpea-harvest",
    name: "Chickpea Harvest",
    shortName: "Chickpea harvest",
    category: "salad-box",
    description: "Protein-rich chickpeas tossed with exotic veggies, fresh lemon, and pomegranate.",
    ingredients: "Chickpea with Exotic Veggies in Lemon, Pomegranate",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  {
    id: "rajma-garden",
    name: "Rajma Garden",
    shortName: "Rajma garden",
    category: "salad-box",
    description: "Kidney beans combined with exotic veggies tossed in zesty lemon and pomegranate.",
    ingredients: "Rajma with Exotic Veggies in Lemon, Pomegranate",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  {
    id: "moong-sprout-crunch",
    name: "Moong Sprout Crunch",
    shortName: "Moong sprout crunch",
    category: "salad-box",
    description: "Crisp sprouted moong and peanuts tossed with exotic veggies, lemon, and pomegranate.",
    ingredients: "Sprouts, Peanut, Exotic Veggies in Lemon, Pomegranate",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  {
    id: "soya-protein-bowl",
    name: "Soya Protein Bowl",
    shortName: "Soya protein bowl",
    category: "salad-box",
    description: "High-protein soya beans and peanuts with exotic veggies tossed in olive oil and lemon.",
    ingredients: "Soya bean, Peanuts, Exotic Veggies in Lemon, Olive Oil",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  {
    id: "black-chickpea-harvest",
    name: "Black Chickpea Harvest",
    shortName: "Black chickpea harvest",
    category: "salad-box",
    description: "Nutritious black chickpeas with exotic veggies in refreshing lemon and pomegranate.",
    ingredients: "Black Chickpea with Exotic Veggies in Lemon, Pomegranate",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  {
    id: "golden-harvest",
    name: "Golden Harvest",
    shortName: "Golden harvest",
    category: "salad-box",
    description: "Sweet corn kernels and vibrant exotic veggies tossed in fresh lemon dressing.",
    ingredients: "Sweet Corn, Exotic Veggies in Lemon",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  {
    id: "mixed-salad-bowl",
    name: "Mixed Salad Bowl",
    shortName: "Mixed salad bowl",
    category: "salad-box",
    description: "Hearty mix of rajma, white chickpea, and black chickpea with exotic veggies in lemon.",
    ingredients: "Rajma, Chickpea, Black Chickpea, Exotic Veggies in Lemon",
    portion: "500 ml (approx. 250 g)",
    visual: "salad",
    price: 129,
    badges: ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"],
  },
  // Seasonal Greens
  {
    id: "garden-saute-bowl",
    name: "Garden Saute Bowl",
    shortName: "Garden saute bowl",
    category: "saute-veggies",
    description: "PAN tossed fresh paneer with exotic vegetables for a nourishing warm bowl.",
    ingredients: "PAN Tossed Fresh Paneer Exotic veggies",
    portion: "500 ml (approx. 250 g)",
    visual: "veggies",
    price: 149,
    badges: ["Fresh Paneer", "Low Carb"],
  },
  // Combos
  {
    id: "the-glow-ritual",
    name: "The Glow Ritual",
    shortName: "The Glow Ritual",
    category: "combos",
    description: "Exotic Fruit Bowl (500ml) + Cold-Pressed Detox Juice (300ml).",
    ingredients: "Exotic Fruit Bowl + Cold-Pressed Detox Juice",
    portion: "500 ml (approx. 250 g) + 300 ml",
    visual: "combo",
    price: 229,
    badges: ["Fruit Bowl + Detox Juice", "Daily Radiance"],
    comboPlans: {
      daily: 229,
      weekly: 1299,
      monthly: 4799,
    },
  },
  {
    id: "the-balance-ritual",
    name: "The Balance Ritual",
    shortName: "The Balance Ritual",
    category: "combos",
    description: "Exotic Fruit Bowl (500ml) + Signature Salads (500ml).",
    ingredients: "Exotic Fruit Bowl + Signature Salads",
    portion: "500 ml (approx. 250 g) + 500 ml (approx. 250 g)",
    visual: "combo",
    price: 219,
    badges: ["High Protein Salad + Fruit", "Clean Fuel"],
    comboPlans: {
      daily: 219,
      weekly: 1199,
      monthly: 4499,
    },
  },
  {
    id: "the-complete-ritual",
    name: "The Complete Ritual",
    shortName: "The Complete Ritual",
    category: "combos",
    description: "Exotic Fruit Bowl (500ml) + Signature Salads (500ml) + Cold-Pressed Detox Juice (300ml).",
    ingredients: "Exotic Fruit Bowl + Signature Salads + Cold-Pressed Detox Juice",
    portion: "500 ml (approx. 250 g) + 500 ml (approx. 250 g) + 300 ml",
    visual: "combo",
    price: 319,
    badges: ["Fruit + Salad + Juice", "Complete Nutrition"],
    comboPlans: {
      daily: 319,
      weekly: 1799,
      monthly: 6999,
    },
  },
];

export function getProductBadges(product: Product): string[] {
  if (product.badges && product.badges.length > 0) {
    return product.badges;
  }
  switch (product.category) {
    case "detox-juices":
      return ["100% Raw", "No Added Sugar", "Cold-Pressed"];
    case "salad-box":
      return ["High Protein (15g+)", "Rich in Fiber", "100% Vegan"];
    case "saute-veggies":
      return ["Fresh Paneer", "Low Carb"];
    case "cut-fruits":
      return ["5 Seasonal Fruits", "Immunity Booster"];
    case "combos":
      return ["Balanced Nutrition", "Clean Fuel"];
    default:
      return [];
  }
}

export type Testimonial = {
  id: string;
  name: string;
  initials: string;
  role: string;
  quote: string;
  highlight: string;
  rating: number;
  plan: string;
  verified: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Amanpreet Singh",
    initials: "AS",
    role: "Software Architect",
    quote:
      "Saves me 45 minutes of chopping and cooking every morning. The cold-pressed juice is 100% raw with zero added sugar, and the fruit bowl arrives crisp and chilled right on schedule.",
    highlight: "Saves 45 mins every morning",
    rating: 5,
    plan: "Weekly Glow Ritual",
    verified: true,
  },
  {
    id: "testimonial-2",
    name: "Dr. Simran Kaur",
    initials: "SK",
    role: "Dental Surgeon & Fitness Enthusiast",
    quote:
      "Hygiene and food safety are non-negotiable for me. The tamper-evident packaging and sheer freshness of paneer and sprouts blew me away. No oily dressings—just crisp, zesty, clean nutrition.",
    highlight: "Tamper-evident, sealed hygiene",
    rating: 5,
    plan: "Daily High-Protein Salads",
    verified: true,
  },
  {
    id: "testimonial-3",
    name: "Vikramjit Sandhu",
    initials: "VS",
    role: "Tech Lead, Bestech Business Towers",
    quote:
      "Delivery is sharp at 7:30 AM before I leave for the office. Eco-friendly spill-proof packaging keeps everything pristine. Having healthy breakfast sorted makes workdays dramatically smoother.",
    highlight: "Prompt 7:30 AM delivery",
    rating: 5,
    plan: "Monthly Complete Ritual",
    verified: true,
  },
  {
    id: "testimonial-4",
    name: "Ruchika Sharma",
    initials: "RS",
    role: "Chartered Accountant",
    quote:
      "The Garden Saute Bowl is loaded with fresh paneer and real low-carb greens. This city has been missing a genuine clean-eating service like this. It keeps my energy steady throughout the day.",
    highlight: "Fresh paneer & low-carb fuel",
    rating: 5,
    plan: "Saute Bowl & Detox Juices",
    verified: true,
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

export type WhatsAppOrderPayload = {
  id: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    comboPlan?: ComboPlanKey | undefined;
  }>;
  customer: {
    name: string;
    mobile: string;
    address: string;
    pin: string;
    landmark?: string | undefined;
    window?: string | undefined;
    notes?: string | undefined;
  };
  deliveryDate: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

export function buildWhatsAppOrderUrl(order: WhatsAppOrderPayload, dateLabel?: string): string {
  const itemsText = order.items
    .map((item) => {
      const planText = item.comboPlan ? ` (${getComboPlanLabel(item.comboPlan)})` : "";
      return `• ${item.productName} × ${item.quantity}${planText} — ₹${item.unitPrice * item.quantity}`;
    })
    .join("\n");

  const formattedDate =
    dateLabel ||
    new Date(order.deliveryDate).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const lines = [
    `🥗 *NEW ORDER - MY HEALTHY PLATTER* 🥗`,
    `*Order ID:* #${order.id}`,
    ``,
    `👤 *Customer Details:*`,
    `• Name: ${order.customer.name}`,
    `• Phone: ${order.customer.mobile}`,
    `• Address: ${order.customer.address}, PIN ${order.customer.pin}`,
    order.customer.landmark ? `• Landmark: ${order.customer.landmark}` : null,
    order.customer.window ? `• Delivery Window: ${order.customer.window}` : null,
    order.customer.notes ? `• Dietary / Notes: ${order.customer.notes}` : null,
    ``,
    `📅 *First Delivery Date:* ${formattedDate}`,
    ``,
    `📦 *Order Items:*`,
    itemsText,
    ``,
    `💰 *Bill Details:*`,
    `• Subtotal: ₹${order.subtotal}`,
    order.discount > 0 ? `• Discount: -₹${order.discount}` : null,
    `• Delivery Fee: ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}`,
    `*Total Amount:* ₹${order.total}`,
    ``,
    `Please confirm my order and share payment instructions. Thank you!`,
  ].filter((line): line is string => line !== null);

  const message = lines.join("\n");
  return `https://wa.me/${storefrontConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const DELIVERY_TIME_SLOTS = [
  "8:00 AM - 8:30 AM",
  "8:30 AM - 9:00 AM",
  "9:00 AM - 9:30 AM",
  "9:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 1:00 PM",
  "1:00 PM - 1:30 PM",
  "1:30 PM - 2:00 PM",
] as const;

export type DeliveryTimeSlot = (typeof DELIVERY_TIME_SLOTS)[number];

export function isPastDailyCutoff(now = new Date()): boolean {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 21 || (hours === 21 && minutes >= 30);
}

export function getEarliestDeliveryDate(now = new Date()): Date {
  const earliest = new Date(now);
  const addDays = isPastDailyCutoff(now) ? 2 : 1;
  earliest.setDate(now.getDate() + addDays);
  earliest.setHours(0, 0, 0, 0);
  return earliest;
}

export type CustomerDetailsInput = {
  name: string;
  mobile: string;
  address: string;
  pin: string;
  landmark?: string | undefined;
  window?: string | undefined;
  notes?: string | undefined;
};

export type CustomerValidationErrors = {
  name?: string;
  mobile?: string;
  address?: string;
  pin?: string;
  landmark?: string;
  window?: string;
  notes?: string;
};

export type CustomerTouchedFields = {
  name?: boolean;
  mobile?: boolean;
  address?: boolean;
  pin?: boolean;
  landmark?: boolean;
  window?: boolean;
  notes?: boolean;
};

export function validateCustomerDetails(customer: CustomerDetailsInput): CustomerValidationErrors {
  const errors: CustomerValidationErrors = {};

  // Name validation: required, at least 2 chars, letters and spaces only
  const trimmedName = customer.name.trim();
  if (!trimmedName) {
    errors.name = "Full name is required";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (!/^[a-zA-Z\s'.]+$/.test(trimmedName)) {
    errors.name = "Name should contain letters only";
  }

  // Mobile validation: 10-digit Indian phone number starting with 6-9
  const cleanMobile = customer.mobile.replace(/[\s\-\+]/g, "").replace(/^91/, "").replace(/^0/, "");
  if (!cleanMobile) {
    errors.mobile = "Mobile number is required";
  } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number (starts with 6-9)";
  } else if (/^(\d)\1{9}$/.test(cleanMobile)) {
    errors.mobile = "Please enter a valid mobile number";
  }

  // Address validation: minimum 10 chars, meaningful content
  const trimmedAddress = customer.address.trim();
  if (!trimmedAddress) {
    errors.address = "Complete delivery address is required";
  } else if (trimmedAddress.length < 10) {
    errors.address = "Please provide house/flat no., building and street (min 10 characters)";
  } else if (!/[a-zA-Z0-9]/.test(trimmedAddress)) {
    errors.address = "Please enter a valid street address";
  }

  // PIN validation: 6-digit Indian PIN code
  const cleanPin = customer.pin.trim();
  if (!cleanPin) {
    errors.pin = "PIN code is required";
  } else if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    errors.pin = "Enter a valid 6-digit postal PIN code";
  }

  // Preferred Delivery Window validation: must be one of the specified slots
  const selectedWindow = customer.window?.trim();
  if (!selectedWindow) {
    errors.window = "Please select a preferred morning delivery slot (7:00 AM - 11:00 AM)";
  } else if (!DELIVERY_TIME_SLOTS.includes(selectedWindow as DeliveryTimeSlot)) {
    errors.window = "Please choose an available slot between 7:00 AM and 11:00 AM";
  }

  return errors;
}
