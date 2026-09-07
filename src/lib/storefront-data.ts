export type PlanId = "one-time" | "six-day" | "twenty-six-day";

export type Product = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  ingredients: string;
  portion: string;
  visual: "fruit" | "sprouts" | "juice" | "veggies";
  price: number | null;
};

export type Plan = {
  id: PlanId;
  eyebrow: string;
  name: string;
  description: string;
  bestFor: string;
  deliveries: number;
  price: number | null;
  badge?: string;
  cta: string;
};

export const storefrontConfig = {
  brand: "MY HEALTHY PLATTER",
  phone: "9780035199",
  whatsappNumber: "919780035199",
  offer: {
    enabled: true,
    label: "10% OFF YOUR FIRST ORDER",
    discountRate: 0.1,
  },
  deliveryFee: null as number | null,
};

export const products: Product[] = [
  {
    id: "cut-fruit-bowl",
    name: "Cut Fruit Bowl",
    shortName: "Fruit bowl",
    description: "Fresh seasonal fruits, cut and packed ready to eat.",
    ingredients: "Seasonal fruit selection",
    portion: "Single serving",
    visual: "fruit",
    price: null,
  },
  {
    id: "sprout-bowl",
    name: "Sprout Bowl",
    shortName: "Sprout bowl",
    description: "Fresh sprouts and colourful vegetables for a satisfying start.",
    ingredients: "Fresh sprouts · vegetables",
    portion: "Single serving",
    visual: "sprouts",
    price: null,
  },
  {
    id: "detox-juice",
    name: "Detox Juice",
    shortName: "Detox juice",
    description: "A freshly prepared green juice for your morning routine.",
    ingredients: "Fresh greens · seasonal produce",
    portion: "250 ml",
    visual: "juice",
    price: null,
  },
  {
    id: "saute-veggies",
    name: "Sauté Veggies",
    shortName: "Sauté veggies",
    description: "Fresh vegetables lightly sautéed for a warm, wholesome breakfast.",
    ingredients: "Seasonal vegetables",
    portion: "Single serving",
    visual: "veggies",
    price: null,
  },
];

export const plans: Plan[] = [
  {
    id: "one-time",
    eyebrow: "JUST TRYING US?",
    name: "One-time",
    description: "One breakfast, no commitment.",
    bestFor: "First time here?",
    deliveries: 1,
    price: null,
    cta: "Try it once",
  },
  {
    id: "six-day",
    eyebrow: "WANT BREAKFAST SORTED FOR THE WEEK?",
    name: "6-day plan",
    description: "Fresh breakfast for 6 delivery days.",
    bestFor: "An easy way to make healthy breakfast part of your week.",
    deliveries: 6,
    price: null,
    badge: "Most popular",
    cta: "Start my 6-day plan",
  },
  {
    id: "twenty-six-day",
    eyebrow: "READY TO MAKE IT A HABIT?",
    name: "26-day plan",
    description: "Fresh breakfast for 26 delivery days.",
    bestFor: "For customers who want breakfast taken care of all month.",
    deliveries: 26,
    price: null,
    badge: "Best value",
    cta: "Start my 26-day plan",
  },
];

export function getPlan(planId: PlanId) {
  return plans.find((plan) => plan.id === planId) ?? plans[1];
}

export function formatPrice(value: number | null) {
  if (value === null) return "Price pending";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getPlanPerDelivery(plan: Plan) {
  if (plan.price === null || plan.deliveries === 0) return null;
  return plan.price / plan.deliveries;
}

export function getSavings(plan: Plan) {
  const oneTime = getPlan("one-time");
  if (plan.price === null || oneTime.price === null || plan.id === "one-time") return null;

  const equivalentOneTime = oneTime.price * plan.deliveries;
  return {
    amount: Math.max(equivalentOneTime - plan.price, 0),
    percentage: equivalentOneTime > 0 ? Math.round(((equivalentOneTime - plan.price) / equivalentOneTime) * 100) : 0,
  };
}