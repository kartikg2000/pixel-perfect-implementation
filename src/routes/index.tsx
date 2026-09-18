import { useCallback, useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { createOrder } from "@/lib/orders.functions";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  formatPrice,
  getComboPlanDeliveries,
  getComboPlanLabel,
  getOfferDiscount,
  getProductById,
  getProductPrice,
  getProductBadges,
  categories,
  products,
  testimonials,
  storefrontConfig,
  buildWhatsAppOrderUrl,
  DELIVERY_TIME_SLOTS,
  validateCustomerDetails,
  isPastDailyCutoff,
  getEarliestDeliveryDate,
  type CustomerValidationErrors,
  type CustomerTouchedFields,
  type ComboPlanKey,
  type Product,
} from "@/lib/storefront-data";
import {
  generateOrderId,
  type Order,
  type OrderItem,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/mhp-logo.png";
import { useIsMobile } from "@/hooks/use-mobile";
import freshCutFruitBoxImg from "@/assets/products/fresh-cut-fruit-box.jpg";
import greenEnergyJuiceImg from "@/assets/products/green-energy-juice.jpg";
import skinGlowJuiceImg from "@/assets/products/skin-glow-juice.jpg";
import immunityBoostJuiceImg from "@/assets/products/immunity-boost-juice.jpg";
import chickpeaSaladImg from "@/assets/products/chickpea-salad.jpg";
import rajmaSaladImg from "@/assets/products/rajma-salad.jpg";
import moongDalSproutsImg from "@/assets/products/moong-dal-sprouts.jpg";
import soyaChunksSaladImg from "@/assets/products/soya-chunks-salad.jpg";
import carrotCucumberSaladImg from "@/assets/products/carrot-cucumber-salad.jpg";
import sauteVeggiesImg from "@/assets/products/saute-veggies.jpg";
import comboFruitJuiceImg from "@/assets/products/combo-fruit-juice.jpg";
import comboFruitSaladImg from "@/assets/products/combo-fruit-salad.jpg";
import comboFruitSaladJuiceImg from "@/assets/products/combo-fruit-salad-juice.jpg";
import blackChickpeaHarvestImg from "@/assets/products/black-chickpea-harvest.jpg";
import goldenHarvestImg from "@/assets/products/golden-harvest.jpg";
import mixedSaladBowlImg from "@/assets/products/mixed-salad-bowl.jpg";

const productImages: Record<string, string> = {
  // Fresh Cuts
  "exotic-fruit-bowl": freshCutFruitBoxImg,
  "fresh-cut-fruit-box": freshCutFruitBoxImg,

  // Detox Juices
  "verdant-vitality": greenEnergyJuiceImg,
  "ruby-radiance": skinGlowJuiceImg,
  "citrus-vital": immunityBoostJuiceImg,
  "green-energy-juice": greenEnergyJuiceImg,
  "skin-glow-juice": skinGlowJuiceImg,
  "immunity-boost-juice": immunityBoostJuiceImg,

  // Signature Salads
  "chickpea-harvest": chickpeaSaladImg,
  "rajma-garden": rajmaSaladImg,
  "moong-sprout-crunch": moongDalSproutsImg,
  "soya-protein-bowl": soyaChunksSaladImg,
  "black-chickpea-harvest": blackChickpeaHarvestImg,
  "golden-harvest": goldenHarvestImg,
  "mixed-salad-bowl": mixedSaladBowlImg,
  "chickpea-salad": chickpeaSaladImg,
  "rajma-salad": rajmaSaladImg,
  "moong-dal-sprouts": moongDalSproutsImg,
  "soya-chunks-salad": soyaChunksSaladImg,
  "carrot-cucumber-salad": carrotCucumberSaladImg,

  // Seasonal Greens
  "garden-saute-bowl": sauteVeggiesImg,
  "saute-veggies": sauteVeggiesImg,

  // Combos
  "the-glow-ritual": comboFruitJuiceImg,
  "the-balance-ritual": comboFruitSaladImg,
  "the-complete-ritual": comboFruitSaladJuiceImg,
  "combo-fruit-juice": comboFruitJuiceImg,
  "combo-fruit-salad": comboFruitSaladImg,
  "combo-fruit-salad-juice": comboFruitSaladJuiceImg,
};

function getProductImage(product: Product) {
  return productImages[product.id] ?? freshCutFruitBoxImg;
}

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "My Healthy Platter | Fresh breakfast, sorted" },
      {
        name: "description",
        content: "Fresh, healthy breakfast prepared for you and delivered to your doorstep.",
      },
      { property: "og:title", content: "My Healthy Platter | Fresh breakfast, sorted" },
      {
        property: "og:description",
        content: "Fresh, healthy breakfast prepared for you and delivered to your doorstep.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://myhealthyplatter.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://myhealthyplatter.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FoodEstablishment",
              "@id": "https://myhealthyplatter.lovable.app/#business",
              name: storefrontConfig.brand,
              description:
                "Fresh, healthy breakfast prepared for you and delivered to your doorstep.",
              url: "https://myhealthyplatter.lovable.app/",
              telephone: `+91${storefrontConfig.phone}`,
              servesCuisine: "Healthy breakfast",
              priceRange: "₹₹",
              areaServed: storefrontConfig.deliveryArea,
              address: {
                "@type": "PostalAddress",
                addressLocality: storefrontConfig.deliveryArea,
                addressCountry: "IN",
              },
            },
            ...products.map((product) => ({
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: `https://myhealthyplatter.lovable.app${getProductImage(product)}`,
              brand: { "@type": "Brand", name: storefrontConfig.brand },
              offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: "https://myhealthyplatter.lovable.app/",
              },
            })),
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});


type CheckoutStep = 1 | 2 | 3 | 4;
type CartItem = { quantity: number; comboPlan?: ComboPlanKey | undefined };
type Cart = Record<string, CartItem>;

const whatsappMessage = (message: string) =>
  `https://wa.me/${storefrontConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

const operationalBenefits: Array<[LucideIcon, string, string]> = [
  [Clock3, "Freshly prepared", "Prepared for the morning, not pulled from a shelf."],
  [ShieldCheck, "Hygienically packed", "Packed with care so it arrives ready to enjoy."],
  [ShoppingBag, "Doorstep delivery", "A calmer start, delivered where you need it."],
  [MessageCircle, "WhatsApp support", `Need help? Reach us at ${storefrontConfig.phone}.`],
];

const comboPlanOrder: ComboPlanKey[] = ["daily", "weekly", "monthly"];

function getCartQuantity(cart: Cart, productId: string) {
  return cart[productId]?.quantity ?? 0;
}

function getCartComboPlan(cart: Cart, productId: string): ComboPlanKey | undefined {
  return cart[productId]?.comboPlan;
}

function HomePage() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(1);
  const [cart, setCart] = useState<Cart>({});
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    pin: "",
    landmark: "",
    window: "",
    notes: "",
  });
  const [customerErrors, setCustomerErrors] = useState<CustomerValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<CustomerTouchedFields>({});
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [confirmedDateLabel, setConfirmedDateLabel] = useState("");
  const [confirmedWhatsAppUrl, setConfirmedWhatsAppUrl] = useState("");
  const [upiCopied, setUpiCopied] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const createOrderFn = useServerFn(createOrder);

  const selectedProductIds = useMemo(
    () => Object.keys(cart).filter((id) => (cart[id]?.quantity ?? 0) > 0),
    [cart],
  );
  const selectedProducts = useMemo(
    () => products.filter((product) => selectedProductIds.includes(product.id)),
    [selectedProductIds],
  );
  const cartCount = useMemo(
    () => Object.values(cart).reduce((total, item) => total + item.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () =>
      selectedProducts.reduce(
        (total, product) =>
          total + getProductPrice(product, cart[product.id]?.comboPlan) * (cart[product.id]?.quantity ?? 0),
        0,
      ),
    [cart, selectedProducts],
  );
  const dateLabel = deliveryDate
    ? deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Choose a date";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openCheckout = (productId?: string, comboPlan?: ComboPlanKey) => {
    if (productId) {
      setCart((current) => {
        const existing = current[productId];
        const product = getProductById(productId);
        const nextPlan =
          comboPlan ?? (product?.comboPlans ? "daily" : existing?.comboPlan);
        return {
          ...current,
          [productId]: {
            quantity: (existing?.quantity ?? 0) + 1,
            comboPlan: nextPlan,
          },
        };
      });
    }
    setCheckoutStep(1);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const addProduct = (productId: string, comboPlan?: ComboPlanKey) => {
    const product = getProductById(productId);
    const nextPlan = comboPlan ?? (product?.comboPlans ? "daily" : undefined);
    setCart((current) => ({
      ...current,
      [productId]: {
        quantity: (current[productId]?.quantity ?? 0) + 1,
        comboPlan: nextPlan,
      },
    }));
    if (!isMobile) setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      const existing = current[productId];
      const product = getProductById(productId);
      const nextPlan =
        existing?.comboPlan ?? (product?.comboPlans ? "daily" : undefined);
      return {
        ...current,
        [productId]: { quantity, comboPlan: nextPlan },
      };
    });
  };

  const updateComboPlan = (productId: string, comboPlan: ComboPlanKey) => {
    setCart((current) => {
      const item = current[productId];
      if (!item) return current;
      return { ...current, [productId]: { ...item, comboPlan } };
    });
  };

  const updateCustomer = (key: keyof typeof customer, value: string) => {
    setCustomer((details) => {
      const next = { ...details, [key]: value };
      if (touchedFields[key]) {
        const errors = validateCustomerDetails(next);
        setCustomerErrors((prev) => ({
          ...prev,
          [key]: errors[key],
        }));
      }
      return next;
    });
  };

  const handleBlur = (key: keyof typeof customer) => {
    setTouchedFields((prev) => ({ ...prev, [key]: true }));
    const errors = validateCustomerDetails(customer);
    setCustomerErrors((prev) => ({
      ...prev,
      [key]: errors[key],
    }));
  };

  const nextStep = () => {
    if (checkoutStep === 1 && cartCount === 0) {
      toast.error("Choose at least one breakfast to continue.");
      return;
    }
    if (checkoutStep === 2 && !deliveryDate) {
      toast.error("Choose your first delivery date to continue.");
      return;
    }
    if (checkoutStep === 3) {
      const validationErrors = validateCustomerDetails(customer);
      setCustomerErrors(validationErrors);
      setTouchedFields({
        name: true,
        mobile: true,
        address: true,
        pin: true,
        window: true,
      });

      const errorValues = Object.values(validationErrors).filter(Boolean);
      if (errorValues.length > 0) {
        toast.error(errorValues[0] || "Please check the delivery form for errors.");
        return;
      }
    }
    if (checkoutStep === 4) {
      if (isPlacingOrder) return;
      const offerDiscount = getOfferDiscount(cartSubtotal);
      const total = Math.max(cartSubtotal - offerDiscount + (storefrontConfig.deliveryFee ?? 0), 0);
      const orderItems: OrderItem[] = selectedProducts.map((product) => ({
        productId: product.id,
        productName: product.name,
        quantity: cart[product.id]?.quantity ?? 1,
        unitPrice: getProductPrice(product, cart[product.id]?.comboPlan),
        comboPlan: cart[product.id]?.comboPlan,
      }));
      const order: Order = {
        id: generateOrderId(),
        items: orderItems,
        customer: { ...customer },
        deliveryDate: deliveryDate ? deliveryDate.toISOString() : new Date().toISOString(),
        subtotal: cartSubtotal,
        discount: offerDiscount,
        deliveryFee: storefrontConfig.deliveryFee ?? 0,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Save the order in the database before confirming anything
      setIsPlacingOrder(true);
      void (async () => {
        try {
          await createOrderFn({
            data: {
              id: order.id,
              items: orderItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                ...(item.comboPlan ? { comboPlan: item.comboPlan } : {}),
              })),
              customer: {
                name: customer.name,
                mobile: customer.mobile,
                address: customer.address,
                pin: customer.pin,
                landmark: customer.landmark,
                window: customer.window,
                ...(customer.notes ? { notes: customer.notes } : {}),
              },
              deliveryDate: order.deliveryDate,
            },
          });
        } catch {
          setIsPlacingOrder(false);
          toast.error(
            "We couldn't save your order. Please try again, or send it to us on WhatsApp.",
          );
          return;
        }
        setIsPlacingOrder(false);
        finishOrder(order);
      })();
      return;
    }
    setCheckoutStep((step) => (step < 4 ? ((step + 1) as CheckoutStep) : step));
  };

  const finishOrder = (order: Order) => {
      // Build WhatsApp URL with all order details
      const whatsappUrl = buildWhatsAppOrderUrl(order, dateLabel);

      // Save confirmed order state for the confirmation dialog
      setConfirmedOrder(order);
      setConfirmedDateLabel(dateLabel);
      setConfirmedWhatsAppUrl(whatsappUrl);

      // Close checkout, reset cart
      setCheckoutOpen(false);
      setCart({});
      setCheckoutStep(1);
      setDeliveryDate(undefined);
      setCustomer({ name: "", mobile: "", address: "", pin: "", landmark: "", window: "", notes: "" });
      setCustomerErrors({});
      setTouchedFields({});
      setUpiCopied(false);

      // Show confirmation dialog and open WhatsApp
      setOrderSuccessOpen(true);
      window.open(whatsappUrl, "_blank");
  };

  const previousStep = () => {
    setCheckoutStep((step) => (step > 1 ? ((step - 1) as CheckoutStep) : step));
  };

  const handleCopyUpi = useCallback(() => {
    navigator.clipboard.writeText(storefrontConfig.upiId).then(() => {
      setUpiCopied(true);
      toast.success("UPI ID copied!");
      setTimeout(() => setUpiCopied(false), 2500);
    });
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-cream text-brand-ink pb-20 md:pb-0">
      {/* Cut-off time announcement banner */}
      <div className="relative z-40 bg-gradient-to-r from-brand-deep via-brand-green to-brand-deep px-4 py-2.5 text-center text-xs font-semibold text-white sm:text-sm">
        <span className="mr-1.5">⏰</span>
        {storefrontConfig.cutoffBannerText}
      </div>
      <header className="sticky inset-x-0 top-0 z-30 border-b border-brand-deep/10 bg-brand-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="My Healthy Platter home">
            <img
              src={logoImg}
              alt="My Healthy Platter"
              className="h-12 w-auto max-w-[176px] object-contain object-left sm:h-14 sm:max-w-[210px]"
            />
          </a>

          <nav
            className="hidden items-center gap-8 text-sm font-semibold text-brand-deep lg:flex"
            aria-label="Main navigation"
          >
            <a href="#menu" className="transition-colors hover:text-brand-green">
              Menu
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-brand-green">
              How It Works
            </a>
            <a href="#reviews" className="transition-colors hover:text-brand-green">
              Reviews
            </a>
            <a href="#faq" className="transition-colors hover:text-brand-green">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Button
              variant="outline"
              className="h-10 gap-2 border-brand-deep/20 bg-transparent px-3 text-brand-deep hover:bg-brand-sage"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart with ${cartCount} items`}
            >
              <ShoppingBag className="size-4" /> <span>Cart</span>
              <span className="min-w-5 rounded-full bg-brand-green px-1.5 py-0.5 text-center text-[10px] text-primary-foreground">
                {cartCount}
              </span>
            </Button>
            <a
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3.5 text-xs font-semibold text-brand-deep shadow-xs transition-all hover:border-[#25D366] hover:bg-[#25D366]/20"
              href={whatsappMessage("Hi My Healthy Platter, I need help with my order.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => toast.success("Opening WhatsApp support")}
              title="Chat with us on WhatsApp"
            >
              <WhatsAppIcon className="size-4" />
              <span>WhatsApp</span>
            </a>
            <Button
              className="bg-brand-deep px-5 text-primary-foreground hover:bg-brand-green"
              onClick={() => openCheckout()}
            >
              Order now <ArrowRight />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-brand-deep sm:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-brand-deep/10 bg-brand-cream px-5 py-5 sm:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-4 text-sm font-semibold text-brand-deep">
              <button className="text-left" onClick={() => scrollTo("menu")}>
                Menu
              </button>
              <button className="text-left" onClick={() => scrollTo("how-it-works")}>
                How It Works
              </button>
              <button className="text-left" onClick={() => scrollTo("reviews")}>
                Reviews
              </button>
              <button className="text-left" onClick={() => scrollTo("faq")}>
                FAQ
              </button>
              <a
                href={whatsappMessage("Hi My Healthy Platter, I need help with my order.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-brand-deep hover:text-brand-green"
              >
                <WhatsAppIcon className="size-4" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-5 pb-14 pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-20 lg:pt-32">
          <div className="relative z-10 max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-brand-green/30 bg-brand-sage/55 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-deep">
              <Sparkles className="size-3.5" /> Fresh breakfast, made simple
            </div>
            <h1 className="font-display text-6xl leading-[0.94] tracking-[-0.02em] text-brand-deep sm:text-7xl lg:text-8xl">
              Breakfast,
              <br />
              <span className="text-brand-green">Sorted.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-brand-ink/75">
              Fresh, healthy breakfast prepared for you and delivered to your doorstep.
            </p>
            <p className="mt-3 text-sm font-semibold tracking-wide text-brand-deep">
              No shopping. No chopping. No morning rush.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 justify-between bg-brand-deep px-5 text-primary-foreground hover:bg-brand-green"
                onClick={() => scrollTo("menu")}
              >
                Choose my breakfast <ArrowRight />
              </Button>
              <Button
                variant="outline"
                className="h-12 border-brand-deep/25 bg-transparent px-5 text-brand-deep hover:bg-brand-sage"
                onClick={() => scrollTo("menu")}
              >
                See today&apos;s menu
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-brand-deep/80">
              {["Freshly prepared", "Hygienically packed", "Doorstep delivery"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="size-4 text-brand-green" />
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 inline-flex items-center gap-2 border border-brand-green/25 bg-brand-sage/55 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-deep">
              <Sparkles className="size-3.5 text-brand-green" /> {storefrontConfig.deliveryLabel}
            </p>
          </div>
          <FoodStillLife />
        </section>

        <section className="border-y border-brand-deep/10 bg-brand-deep px-5 py-5 text-primary-foreground lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-bold">Not ready for a routine?</p>
              <p className="mt-1 text-sm text-primary-foreground/70">
                Try breakfast once. If you love the routine, make it a habit with a combo plan.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-brand-deep"
              onClick={() => scrollTo("combos")}
            >
              See combos <ArrowRight />
            </Button>
          </div>
        </section>

        <section id="menu" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 lg:px-10 lg:py-28">
          <SectionIntro
            eyebrow="THE MORNING MENU"
            title="What's coming to your door?"
            description="Freshly prepared breakfast options made for busy mornings."
          />
          <div className="mt-12 space-y-16">
            {categories.map((category) => {
              const categoryProducts = products.filter((product) => product.category === category.id);
              if (categoryProducts.length === 0) return null;
              return (
                <div key={category.id} id={category.id}>
                  <div className="mb-6 flex items-center gap-3 border-b border-brand-deep/10 pb-4">
                    <div className="flex size-10 items-center justify-center bg-brand-green text-primary-foreground">
                      <CategoryIcon category={category.id} />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-brand-deep">{category.title}</h3>
                      <p className="text-sm text-brand-ink/60">{category.subtitle}</p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={(comboPlan) => {
                          addProduct(product.id, comboPlan);
                          toast.success(`${product.name} added to your order`);
                        }}
                        quantity={getCartQuantity(cart, product.id)}
                        comboPlan={getCartComboPlan(cart, product.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="plans" className="scroll-mt-20 bg-brand-sage/45 px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="YOUR ROUTINE"
              title="How do you want breakfast taken care of?"
              description="Combos are available daily, weekly or monthly. Single items are perfect for a one-time order."
            />
            <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
              {[
                {
                  name: "Daily",
                  deliveries: 1,
                  description: "One day at a time. Great for trying us out.",
                  badge: "Try first",
                },
                {
                  name: "Weekly (6 Days)",
                  deliveries: 6,
                  description: "Fresh breakfast for 6 delivery days.",
                  badge: "Most popular",
                },
                {
                  name: "Monthly (24 Days)",
                  deliveries: 24,
                  description: "Fresh breakfast for 24 delivery days.",
                  badge: "Best value",
                },
              ].map((option) => (
                <article
                  key={option.name}
                  className="relative flex flex-col border border-brand-deep/15 bg-brand-cream p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-green">
                        {option.badge}
                      </p>
                      <h3 className="mt-3 font-display text-3xl text-brand-deep">{option.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-brand-ink/75">{option.description}</p>
                  <div className="mt-7 border-t border-brand-deep/10 pt-5">
                    <p className="text-sm text-brand-ink/60">
                      {option.deliveries} {option.deliveries === 1 ? "delivery" : "deliveries"}
                    </p>
                  </div>
                  <Button
                    className="relative mt-7 w-full bg-brand-deep text-primary-foreground hover:bg-brand-green"
                    onClick={() => scrollTo("menu")}
                  >
                    Choose from menu <ArrowRight />
                  </Button>
                </article>
              ))}
            </div>
            <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-brand-deep/65">
              <ShieldCheck className="size-4" /> No account needed before purchase. Choose what
              feels right.
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <SectionIntro
            eyebrow="WHY MAKE IT A ROUTINE?"
            title="Healthy mornings are easier when they're already planned."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-brand-deep/15 bg-brand-deep/15 md:grid-cols-3">
            {[
              [
                "01",
                "Less thinking",
                "You don&apos;t have to decide what breakfast will be every morning.",
              ],
              ["02", "Less preparation", "No shopping, cutting or preparing."],
              ["03", "More consistency", "Your breakfast routine arrives at your doorstep."],
            ].map(([number, title, text]) => (
              <div className="bg-brand-cream p-7 lg:p-10" key={number}>
                <p className="text-sm font-bold text-brand-green">{number}</p>
                <h3 className="mt-8 font-display text-3xl text-brand-deep">{title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-brand-ink/65">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 bg-brand-deep px-5 py-20 text-primary-foreground lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              dark
              eyebrow="THE EASY PART"
              title="Choose your breakfast. We'll handle the rest."
              description="A simple start to a better morning."
            />
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                ["01", "Choose your breakfast", "Pick what you want delivered from the menu."],
                ["02", "Choose your routine", "Single items for one-time, or pick a combo plan."],
                ["03", "We deliver", "Fresh breakfast arrives at your doorstep."],
              ].map(([number, title, text]) => (
                <div className="border-t border-primary-foreground/20 pt-5" key={number}>
                  <p className="text-sm font-bold text-brand-sage">{number}</p>
                  <h3 className="mt-8 font-display text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-primary-foreground/65">{text}</p>
                </div>
              ))}
            </div>
            <Button
              className="mt-12 bg-brand-sage text-brand-deep hover:bg-primary-foreground"
              onClick={() => openCheckout()}
            >
              Start my breakfast <ArrowRight />
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <SectionIntro
              eyebrow="DELIVERY, WITHOUT THE DRAMA"
              title="Fresh breakfast without the morning work."
              description="Every order is prepared fresh, packed carefully, and sent to your doorstep."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {operationalBenefits.map(([Icon, title, text]) => (
              <div className="border-l-2 border-brand-green px-5 py-1" key={title}>
                <Icon className="size-5 text-brand-green" />
                <h3 className="mt-5 font-semibold text-brand-deep">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-ink/65">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <TestimonialsSection onAction={() => scrollTo("menu")} />

        <section
          id="faq"
          className="scroll-mt-20 border-t border-brand-deep/10 bg-white/45 px-5 py-20 lg:px-10 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <SectionIntro
              eyebrow="GOOD TO KNOW"
              title="Questions, answered."
              description="Still deciding? Here are the things customers usually want to know first."
            />
            <div className="divide-y divide-brand-deep/15 border-y border-brand-deep/15">
              {[
                [
                  "Do I need to create an account?",
                  "No. You can check out as a guest. We only ask for the details needed to deliver your breakfast.",
                ],
                [
                  "Can I try it just once?",
                  "Yes. Any single item is perfect for a one-time order. Combos also have a Daily option.",
                ],
                [
                  "How do combo plans work?",
                  "Choose Daily, Weekly (6 days) or Monthly (24 days) for any combo. The price is fixed for the plan you pick.",
                ],
                [
                  "Need help with an order?",
                  `WhatsApp us at ${storefrontConfig.phone}. We'll help you with the next step.`,
                ],
              ].map(([question, answer]) => (
                <details className="group py-5" key={question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-deep [&::-webkit-details-marker]:hidden">
                    <span>{question}</span>
                    <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-xl pt-4 text-sm leading-6 text-brand-ink/65">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-green px-5 py-20 text-primary-foreground lg:px-10 lg:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground/70">
                A better morning starts here
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[1] sm:text-6xl">
                Tomorrow morning starts today.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">
                Choose your breakfast. Choose your routine. We&apos;ll take care of the rest.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="bg-brand-deep text-primary-foreground hover:bg-brand-deep/85"
                onClick={() => openCheckout()}
              >
                Get my breakfast <ArrowRight />
              </Button>
              <a
                className="inline-flex h-10 items-center justify-center gap-2 px-4 text-sm font-semibold text-primary-foreground hover:underline"
                href={whatsappMessage(
                  "Hi My Healthy Platter, I am interested in ordering breakfast.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" /> WhatsApp us
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-cream px-5 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs text-brand-ink/60 sm:flex-row">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-bold tracking-[0.13em] text-brand-deep">MY HEALTHY PLATTER</p>
            <p>Fresh breakfast without the morning work.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${storefrontConfig.phone}`}
              className="inline-flex items-center gap-1.5 font-semibold text-brand-deep"
            >
              <MessageCircle className="size-3.5" /> {storefrontConfig.phone}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <Instagram className="size-3.5" /> {storefrontConfig.instagram}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {storefrontConfig.deliveryArea}
            </span>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-brand-deep/15 bg-brand-cream/95 p-3 shadow-soft backdrop-blur-md sm:hidden">
        <a
          href={whatsappMessage("Hi My Healthy Platter, I need help with my order.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 w-12 shrink-0 items-center justify-center border border-brand-deep/20 text-brand-deep"
          aria-label="WhatsApp support"
        >
          <WhatsAppIcon className="size-5" />
        </a>
        <Button
          className="h-11 flex-1 bg-brand-deep text-primary-foreground hover:bg-brand-green"
          onClick={() => {
            if (cartCount > 0) {
              setCartOpen(true);
              return;
            }
            document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {cartCount > 0 ? `View my order · ${formatPrice(cartSubtotal)}` : "See the menu"}{" "}
          <ShoppingBag />
        </Button>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        updateQuantity={updateQuantity}
        updateComboPlan={updateComboPlan}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutStep(1);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        step={checkoutStep}
        cart={cart}
        selectedProducts={selectedProducts}
        selectedProductIds={selectedProductIds}
        updateQuantity={updateQuantity}
        updateComboPlan={updateComboPlan}
        cartSubtotal={cartSubtotal}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        dateLabel={dateLabel}
        customer={customer}
        updateCustomer={updateCustomer}
        customerErrors={customerErrors}
        touchedFields={touchedFields}
        handleBlur={handleBlur}
        nextStep={nextStep}
        isPlacingOrder={isPlacingOrder}
        previousStep={previousStep}
      />
      <OrderConfirmationDialog
        open={orderSuccessOpen}
        onOpenChange={setOrderSuccessOpen}
        order={confirmedOrder}
        dateLabel={confirmedDateLabel}
        whatsAppUrl={confirmedWhatsAppUrl}
        upiCopied={upiCopied}
        onCopyUpi={handleCopyUpi}
      />
    </div>
  );
}

function CategoryIcon({ category }: { category: Product["category"] }) {
  const icons: Record<Product["category"], ReactNode> = {
    "cut-fruits": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6Z" opacity="0.4" />
      </svg>
    ),
    "detox-juices": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M7 2h10v4H7zM9 6h6v2H9z" />
        <path d="M8 8h8l1 14H7z" opacity="0.6" />
      </svg>
    ),
    "salad-box": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7l1 4h8l1-4c2.5-1.5 4-4 4-7 0-5-4-9-9-9Z" />
      </svg>
    ),
    "saute-veggies": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M4 8h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" opacity="0.6" />
        <path d="M2 6h20v4H2z" />
      </svg>
    ),
    combos: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" />
      </svg>
    ),
  };
  return icons[category] ?? null;
}

function FoodStillLife() {
  return (
    <div className="relative mx-auto aspect-[0.96] w-full max-w-[560px] overflow-hidden border border-brand-deep/10 bg-brand-sage/55 p-5 sm:p-8">
      <div className="absolute right-6 top-6 z-10 border border-brand-deep/15 bg-brand-cream/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-deep">
        Fresh from the kitchen
      </div>
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute bottom-0 left-1/2 h-[14%] w-[85%] -translate-x-1/2 rounded-[50%] bg-brand-deep/10 blur-xl" />
        <div className="relative mt-8 grid w-[92%] grid-cols-2 gap-3 sm:gap-5">
          <FoodImage src={freshCutFruitBoxImg} alt="Fresh cut fruit box" />
          <FoodImage src={chickpeaSaladImg} alt="Chickpea salad box" />
          <FoodImage src={greenEnergyJuiceImg} alt="Green energy detox juice" />
          <FoodImage src={sauteVeggiesImg} alt="Sautéed seasonal vegetables" />
        </div>
      </div>
      <p className="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep/60 sm:bottom-8 sm:left-8">
        Breakfast, prepared for you
      </p>
    </div>
  );
}

function FoodImage({ src, alt }: { src: string; alt: string }) {
  const image = src;
  return (
    <div className="relative aspect-square overflow-hidden border border-brand-deep/10 bg-brand-cream shadow-soft">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        d="M17.507 14.37c-.286-.143-1.693-.836-1.956-.931-.262-.095-.453-.143-.644.143-.19.286-.74.931-.908 1.122-.167.19-.334.215-.62.072-.286-.143-1.21-.446-2.304-1.421-.852-.76-1.428-1.7-1.595-1.986-.167-.286-.018-.44.126-.583.13-.129.286-.334.429-.5.143-.167.19-.286.286-.477.095-.19.048-.358-.024-.5-.072-.143-.644-1.552-.882-2.125-.233-.558-.469-.482-.644-.491l-.549-.01c-.19 0-.5.072-.763.358-.262.286-1.002.979-1.002 2.387 0 1.408 1.026 2.769 1.169 2.96.143.19 2.02 3.085 4.894 4.327.684.296 1.218.472 1.635.605.688.219 1.314.188 1.808.114.551-.083 1.693-.692 1.932-1.36.239-.668.239-1.241.167-1.36-.072-.12-.262-.191-.548-.334z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", dark ? "text-primary-foreground" : "text-brand-deep")}>
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-[0.18em]",
          dark ? "text-brand-sage" : "text-brand-green",
        )}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-lg text-base leading-7",
            dark ? "text-primary-foreground/65" : "text-brand-ink/65",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function TestimonialsSection({ onAction }: { onAction: () => void }) {
  return (
    <section
      id="reviews"
      className="scroll-mt-20 border-t border-brand-deep/10 bg-brand-sage/35 px-5 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="EARLY SUBSCRIBERS · MOHALI"
            title="Loved by Mohali's morning risers."
            description="Real feedback from early testers and routine subscribers."
          />
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 border border-brand-deep/15 bg-brand-cream px-3.5 py-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-deep">4.9 / 5.0</span>
              <span className="text-[11px] text-brand-ink/60">· Early Reviews</span>
            </div>
            <div className="inline-flex items-center gap-1.5 border border-brand-green/30 bg-brand-green/10 px-3.5 py-2 text-xs font-semibold text-brand-deep">
              <ShieldCheck className="size-4 text-brand-green" />
              100% Sealed Food Hygiene
            </div>
          </div>
        </div>

        {/* Highlight trust stats row */}
        <div className="mt-10 grid grid-cols-2 gap-3 border border-brand-deep/10 bg-brand-cream/80 p-4 sm:grid-cols-4 sm:p-6">
          <div>
            <p className="font-display text-2xl text-brand-deep sm:text-3xl">45 mins</p>
            <p className="mt-1 text-xs text-brand-ink/65">Saved every morning (zero prep)</p>
          </div>
          <div>
            <p className="font-display text-2xl text-brand-deep sm:text-3xl">100% Raw</p>
            <p className="mt-1 text-xs text-brand-ink/65">Cold-pressed · No added sugar</p>
          </div>
          <div>
            <p className="font-display text-2xl text-brand-deep sm:text-3xl">8 AM – 2 PM</p>
            <p className="mt-1 text-xs text-brand-ink/65">Guaranteed on-time slots</p>
          </div>
          <div>
            <p className="font-display text-2xl text-brand-deep sm:text-3xl">Mohali</p>
            <p className="mt-1 text-xs text-brand-ink/65">Mohali and nearby areas</p>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {testimonials.map((review) => (
            <article
              key={review.id}
              className="relative flex flex-col justify-between border border-brand-deep/15 bg-brand-cream p-6 shadow-xs transition-all hover:border-brand-green/40 hover:shadow-md sm:p-8"
            >
              <Quote className="pointer-events-none absolute right-5 top-5 size-12 -rotate-12 text-brand-deep/5" />
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center rounded-full border border-brand-green/25 bg-brand-sage/60 px-2.5 py-0.5 text-[11px] font-semibold text-brand-deep">
                    {review.highlight}
                  </span>
                </div>

                <blockquote className="mt-5 text-base font-medium leading-7 text-brand-deep">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-brand-deep/10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-deep font-display text-xs font-bold text-primary-foreground">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-deep">{review.name}</h4>
                    <p className="text-xs text-brand-ink/60">{review.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green">
                    <Check className="size-3.5" /> Verified
                  </span>
                  <p className="text-[10px] text-brand-ink/50">{review.plan}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Social Proof CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border border-brand-deep/15 bg-brand-deep p-6 text-primary-foreground sm:flex-row sm:p-8">
          <div>
            <h3 className="font-display text-2xl text-white">
              Ready to reclaim 45 minutes every morning in Mohali?
            </h3>
            <p className="mt-1 text-sm text-primary-foreground/75">
              Freshly prepped fruits, high-protein salads, and cold-pressed juices delivered right on schedule.
            </p>
          </div>
          <Button
            className="shrink-0 bg-brand-sage text-brand-deep hover:bg-white"
            onClick={onAction}
          >
            Start my morning routine <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
  quantity,
  comboPlan,
}: {
  product: Product;
  onAdd: (comboPlan?: ComboPlanKey) => void;
  quantity: number;
  comboPlan?: ComboPlanKey | undefined;
}) {
  const [localPlan, setLocalPlan] = useState<ComboPlanKey>(comboPlan ?? "daily");
  const isCombo = !!product.comboPlans;
  const displayPrice = getProductPrice(product, isCombo ? localPlan : undefined);
  const badges = getProductBadges(product);

  return (
    <article
      className={cn(
        "group border bg-brand-cream transition-colors",
        quantity > 0 ? "border-brand-green" : "border-brand-deep/15",
      )}
    >
      <FoodImage src={getProductImage(product)} alt={`${product.name} breakfast`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl text-brand-deep">{product.name}</h3>
          {quantity > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand-green">
              <Check className="size-4" /> {quantity}
            </span>
          )}
        </div>
        {badges.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-brand-green/25 bg-brand-sage/65 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-brand-deep"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <p className="mt-3 min-h-[48px] text-sm leading-6 text-brand-ink/65">
          {product.description}
        </p>
        <div className="space-y-2 border-t border-brand-deep/10 pt-4 text-xs text-brand-ink/60">
          <p>
            <span className="font-bold text-brand-deep">Ingredients</span> {product.ingredients}
          </p>
          <p>
            <span className="font-bold text-brand-deep">Portion</span> {product.portion}
          </p>
        </div>

        {isCombo && (
          <div className="mt-4 inline-flex w-full border border-brand-deep/15 p-1">
            {comboPlanOrder.map((key) => (
              <button
                key={key}
                onClick={() => setLocalPlan(key)}
                className={cn(
                  "flex-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide",
                  localPlan === key
                    ? "bg-brand-deep text-primary-foreground"
                    : "text-brand-deep hover:bg-brand-sage",
                )}
              >
                {key === "daily" ? "Daily" : key === "weekly" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm font-bold text-brand-deep">
          {formatPrice(displayPrice)}
          {isCombo && localPlan !== "daily" && (
            <span className="ml-2 text-xs font-normal text-brand-ink/55">
              {getComboPlanDeliveries(localPlan)} deliveries
            </span>
          )}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            className="w-full bg-brand-deep text-primary-foreground hover:bg-brand-green"
            onClick={() => onAdd(isCombo ? localPlan : undefined)}
          >
            {quantity > 0 ? `Add another · ${quantity}` : "Add to order"} <Plus />
          </Button>
        </div>
      </div>
    </article>
  );
}

function CartDrawer({
  open,
  onClose,
  cart,
  cartCount,
  cartSubtotal,
  updateQuantity,
  updateComboPlan,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  cart: Cart;
  cartCount: number;
  cartSubtotal: number;
  updateQuantity: (id: string, quantity: number) => void;
  updateComboPlan: (id: string, plan: ComboPlanKey) => void;
  onCheckout: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <button
        className="absolute inset-0 bg-brand-deep/35"
        onClick={onClose}
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-brand-deep/10 bg-brand-cream text-brand-ink shadow-soft">
        <div className="flex items-start justify-between border-b border-brand-deep/10 px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green">
              Your order
            </p>
            <h2 className="mt-1 font-display text-3xl text-brand-deep">
              Cart{" "}
              <span className="font-sans text-sm font-semibold text-brand-ink/55">
                ({cartCount} items)
              </span>
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-brand-deep"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cartCount === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="size-9 text-brand-green" />
              <h3 className="mt-4 font-display text-2xl text-brand-deep">Your cart is empty</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-brand-ink/60">
                Add a breakfast from the menu and it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {products
                .filter((product) => (cart[product.id]?.quantity ?? 0) > 0)
                .map((product) => (
                  <CartLine
                    key={product.id}
                    product={product}
                    item={cart[product.id]!}
                    updateQuantity={updateQuantity}
                    updateComboPlan={updateComboPlan}
                  />
                ))}
            </div>
          )}
        </div>
        <div className="border-t border-brand-deep/10 px-5 py-5">
          <div className="flex items-center justify-between text-base font-bold text-brand-deep">
            <span>Menu subtotal</span>
            <span>{formatPrice(cartSubtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-brand-ink/55">
            Offer and delivery details are confirmed next.
          </p>
          <Button
            className="mt-5 h-12 w-full bg-brand-deep text-primary-foreground hover:bg-brand-green"
            disabled={cartCount === 0}
            onClick={onCheckout}
          >
            Complete your order <ArrowRight />
          </Button>
        </div>
      </aside>
    </div>
  );
}

function CartLine({
  product,
  item,
  updateQuantity,
  updateComboPlan,
}: {
  product: Product;
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  updateComboPlan: (id: string, plan: ComboPlanKey) => void;
}) {
  const lineTotal = getProductPrice(product, item.comboPlan) * item.quantity;
  return (
    <div className="flex gap-3 border-b border-brand-deep/10 pb-4">
      <div className="size-16 shrink-0 overflow-hidden border border-brand-deep/10">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-brand-deep">{product.name}</p>
            {product.comboPlans && item.comboPlan && (
              <div className="mt-1 inline-flex items-center gap-1">
                {comboPlanOrder.map((key) => (
                  <button
                    key={key}
                    onClick={() => updateComboPlan(product.id, key)}
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      item.comboPlan === key
                        ? "bg-brand-green text-primary-foreground"
                        : "bg-brand-sage text-brand-deep hover:bg-brand-green/20",
                    )}
                  >
                    {key === "daily" ? "D" : key === "weekly" ? "W" : "M"}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-brand-ink/55">
              {formatPrice(getProductPrice(product, item.comboPlan))} each
            </p>
          </div>
          <button
            className="text-xs font-semibold text-brand-ink/55 underline-offset-2 hover:text-brand-green hover:underline"
            onClick={() => updateQuantity(product.id, 0)}
          >
            Remove
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center border border-brand-deep/15">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none text-brand-deep"
              onClick={() => updateQuantity(product.id, item.quantity - 1)}
              aria-label={`Decrease ${product.name}`}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold text-brand-deep">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none text-brand-deep"
              onClick={() => updateQuantity(product.id, item.quantity + 1)}
              aria-label={`Increase ${product.name}`}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <span className="font-semibold text-brand-deep">{formatPrice(lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function CheckoutDialog({
  open,
  onOpenChange,
  step,
  cart,
  selectedProducts,
  selectedProductIds,
  updateQuantity,
  updateComboPlan,
  cartSubtotal,
  deliveryDate,
  setDeliveryDate,
  dateLabel,
  customer,
  updateCustomer,
  customerErrors,
  touchedFields,
  handleBlur,
  nextStep,
  isPlacingOrder,
  previousStep,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: CheckoutStep;
  cart: Cart;
  selectedProducts: Product[];
  selectedProductIds: string[];
  updateQuantity: (id: string, quantity: number) => void;
  updateComboPlan: (id: string, plan: ComboPlanKey) => void;
  cartSubtotal: number;
  deliveryDate: Date | undefined;
  setDeliveryDate: (date: Date | undefined) => void;
  dateLabel: string;
  customer: {
    name: string;
    mobile: string;
    address: string;
    pin: string;
    landmark: string;
    window: string;
    notes: string;
  };
  updateCustomer: (key: keyof typeof customer, value: string) => void;
  customerErrors: CustomerValidationErrors;
  touchedFields: CustomerTouchedFields;
  handleBlur: (key: keyof typeof customer) => void;
  nextStep: () => void;
  isPlacingOrder: boolean;
  previousStep: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-brand-deep/15 bg-brand-cream p-0 text-brand-ink">
        <div className="border-b border-brand-deep/10 px-5 pb-5 pt-6 sm:px-8">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-3xl text-brand-deep">
              Complete your order
            </DialogTitle>
            <DialogDescription className="text-brand-ink/60">
              Your cart stays updated as you choose delivery details.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              [1, "Breakfast"],
              [2, "Delivery"],
              [3, "Details"],
              [4, "Review"],
            ].map(([value, label]) => (
              <div key={label as string} className="flex items-center gap-2 text-xs font-bold">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border",
                    step >= (value as number)
                      ? "border-brand-green bg-brand-green text-primary-foreground"
                      : "border-brand-deep/20 text-brand-ink/40",
                  )}
                >
                  {step > (value as number) ? <Check className="size-3" /> : value}
                </span>
                <span
                  className={cn(
                    "hidden sm:inline",
                    step >= (value as number) ? "text-brand-deep" : "text-brand-ink/40",
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-6 sm:px-8">
          {step === 1 && (
            <CheckoutProducts
              cart={cart}
              selectedProductIds={selectedProductIds}
              updateQuantity={updateQuantity}
              updateComboPlan={updateComboPlan}
            />
          )}
          {step === 2 && (
            <CheckoutDate
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              dateLabel={dateLabel}
            />
          )}
          {step === 3 && (
            <CheckoutDetails
              customer={customer}
              updateCustomer={updateCustomer}
              errors={customerErrors}
              touched={touchedFields}
              onBlur={handleBlur}
            />
          )}
          {step === 4 && (
            <CheckoutReview
              selectedProducts={selectedProducts}
              cart={cart}
              cartSubtotal={cartSubtotal}
              dateLabel={dateLabel}
              customer={customer}
            />
          )}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-brand-deep/10 px-5 py-4 sm:flex-row sm:justify-between sm:px-8">
          <Button
            variant="outline"
            className="border-brand-deep/30 text-brand-deep hover:border-brand-deep hover:bg-brand-deep/5 hover:text-brand-deep"
            onClick={step === 1 ? () => onOpenChange(false) : previousStep}
          >
            {step === 1 ? "Keep browsing" : "Back"}
          </Button>
          <Button
            className={cn(
              "text-primary-foreground transition-colors",
              step === 4
                ? "bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold shadow-md"
                : "bg-brand-deep hover:bg-brand-green",
            )}
            onClick={nextStep}
            disabled={isPlacingOrder}
          >
            {step === 4 ? (
              <span className="flex items-center gap-2">
                <WhatsAppIcon className="size-4" />{" "}
                {isPlacingOrder ? "Saving your order…" : "Place Order on WhatsApp"}
              </span>
            ) : step === 3 ? (
              "Review my order"
            ) : (
              "Continue"
            )}
            {step < 4 && <ArrowRight />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckoutProducts({
  cart,
  selectedProductIds,
  updateQuantity,
  updateComboPlan,
}: {
  cart: Cart;
  selectedProductIds: string[];
  updateQuantity: (id: string, quantity: number) => void;
  updateComboPlan: (id: string, plan: ComboPlanKey) => void;
}) {
  return (
    <div>
      <CheckoutHeading
        step="01"
        title="What would you like?"
        description="Choose breakfasts, combos and adjust quantities before continuing."
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {products.map((product) => {
          const item = cart[product.id];
          const quantity = item?.quantity ?? 0;
          return (
            <div
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (quantity === 0) updateQuantity(product.id, 1);
              }}
              onKeyDown={(event) => {
                if (quantity === 0 && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  updateQuantity(product.id, 1);
                }
              }}
              className={cn(
                "flex items-start gap-3 border p-3 transition-colors",
                quantity === 0 && "cursor-pointer",
                selectedProductIds.includes(product.id)
                  ? "border-brand-green bg-brand-sage/55"
                  : "border-brand-deep/15 hover:border-brand-green/50",
              )}
            >
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  updateQuantity(product.id, quantity > 0 ? 0 : 1);
                }}
                className="size-16 shrink-0 overflow-hidden border border-brand-deep/10"
                aria-label={`${quantity > 0 ? "Remove" : "Add"} ${product.name}`}
              >
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-deep">{product.name}</p>
                {getProductBadges(product).length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {getProductBadges(product).map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center rounded bg-brand-green/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-green"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-xs text-brand-ink/55">
                  {formatPrice(getProductPrice(product, item?.comboPlan))}
                </p>
                {product.comboPlans && quantity > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1">
                    {comboPlanOrder.map((key) => (
                      <button
                        key={key}
                        onClick={() => updateComboPlan(product.id, key)}
                        className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                          item?.comboPlan === key
                            ? "bg-brand-deep text-primary-foreground"
                            : "bg-brand-sage text-brand-deep hover:bg-brand-green/20",
                        )}
                      >
                        {key === "daily" ? "Daily" : key === "weekly" ? "Weekly" : "Monthly"}
                      </button>
                    ))}
                  </div>
                )}
                {quantity > 0 && (
                  <div className="mt-2 inline-flex items-center border border-brand-deep/15">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none text-brand-deep"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label={`Decrease ${product.name}`}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-7 text-center text-xs font-semibold text-brand-deep">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-none text-brand-deep"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label={`Increase ${product.name}`}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
              {quantity > 0 ? (
                <Check className="size-4 shrink-0 text-brand-green" />
              ) : (
                <Plus className="size-4 shrink-0 text-brand-ink/45" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckoutDate({
  deliveryDate,
  setDeliveryDate,
  dateLabel,
}: {
  deliveryDate: Date | undefined;
  setDeliveryDate: (date: Date | undefined) => void;
  dateLabel: string;
}) {
  const earliestDate = getEarliestDeliveryDate();
  const pastCutoff = isPastDailyCutoff();
  return (
    <div>
      <CheckoutHeading
        step="02"
        title="Choose your first delivery date"
        description="Pick the morning you want your breakfast routine to begin."
      />
      {/* Cutoff alert */}
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-50 p-3.5 text-sm text-amber-900">
        <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold">Fresh Morning Prep Cut-off: {storefrontConfig.cutoffTime}</p>
          <p className="mt-0.5 text-xs text-amber-700">
            {pastCutoff
              ? "It's past 9:30 PM — orders placed now will be prepared for the day after tomorrow."
              : "Place your order before 9:30 PM tonight for next-morning delivery."}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Label className="text-brand-deep">First delivery</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="mt-2 h-12 w-full justify-start border-brand-deep/20 bg-transparent text-left font-normal text-brand-deep"
            >
              <CalendarDays className="mr-2 size-4" />
              {dateLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deliveryDate}
              onSelect={setDeliveryDate}
              disabled={(date) => date < earliestDate}
              initialFocus
              className="pointer-events-auto p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function CheckoutDetails({
  customer,
  updateCustomer,
  errors,
  touched,
  onBlur,
}: {
  customer: {
    name: string;
    mobile: string;
    address: string;
    pin: string;
    landmark: string;
    window: string;
    notes: string;
  };
  updateCustomer: (key: keyof typeof customer, value: string) => void;
  errors: CustomerValidationErrors;
  touched: CustomerTouchedFields;
  onBlur: (key: keyof typeof customer) => void;
}) {
  return (
    <div>
      <CheckoutHeading
        step="03"
        title="Delivery details"
        description="Please provide accurate delivery details so our kitchen and delivery team can reach you on time."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <Label htmlFor="name" className="font-semibold text-brand-deep">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={customer.name}
            onChange={(event) => updateCustomer("name", event.target.value)}
            onBlur={() => onBlur("name")}
            placeholder="e.g. Rahul Sharma"
            className={cn(
              "mt-2 border-brand-deep/20 bg-transparent transition-colors",
              touched.name && errors.name && "border-destructive focus-visible:ring-destructive/30",
            )}
          />
          {touched.name && errors.name && (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <Label htmlFor="mobile" className="font-semibold text-brand-deep">
            Mobile / WhatsApp <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            type="tel"
            maxLength={10}
            value={customer.mobile}
            onChange={(event) => {
              const clean = event.target.value.replace(/\D/g, "");
              updateCustomer("mobile", clean);
            }}
            onBlur={() => onBlur("mobile")}
            placeholder="10-digit mobile number"
            className={cn(
              "mt-2 border-brand-deep/20 bg-transparent transition-colors",
              touched.mobile && errors.mobile && "border-destructive focus-visible:ring-destructive/30",
            )}
          />
          {touched.mobile && errors.mobile && (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.mobile}</p>
          )}
        </div>

        {/* Complete Address */}
        <div className="sm:col-span-2">
          <Label htmlFor="address" className="font-semibold text-brand-deep">
            Complete Delivery Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            rows={2}
            value={customer.address}
            onChange={(event) => updateCustomer("address", event.target.value)}
            onBlur={() => onBlur("address")}
            placeholder="House/flat no., building/society name, street/sector (Mohali)"
            className={cn(
              "mt-2 border-brand-deep/20 bg-transparent transition-colors",
              touched.address && errors.address && "border-destructive focus-visible:ring-destructive/30",
            )}
          />
          {touched.address && errors.address && (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.address}</p>
          )}
        </div>

        {/* Area / PIN */}
        <div>
          <Label htmlFor="pin" className="font-semibold text-brand-deep">
            PIN Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pin"
            type="text"
            maxLength={6}
            value={customer.pin}
            onChange={(event) => {
              const clean = event.target.value.replace(/\D/g, "");
              updateCustomer("pin", clean);
            }}
            onBlur={() => onBlur("pin")}
            placeholder="6-digit PIN (e.g. 160071)"
            className={cn(
              "mt-2 border-brand-deep/20 bg-transparent transition-colors",
              touched.pin && errors.pin && "border-destructive focus-visible:ring-destructive/30",
            )}
          />
          {touched.pin && errors.pin && (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.pin}</p>
          )}
        </div>

        {/* Landmark */}
        <div>
          <Label htmlFor="landmark" className="font-semibold text-brand-deep">
            Landmark <span className="text-xs font-normal text-brand-ink/50">(Optional)</span>
          </Label>
          <Input
            id="landmark"
            type="text"
            value={customer.landmark}
            onChange={(event) => updateCustomer("landmark", event.target.value)}
            placeholder="e.g. Near Fortis Hospital / Market"
            className="mt-2 border-brand-deep/20 bg-transparent"
          />
        </div>

        {/* Preferred Delivery Window: 8am to 2pm, 30 min each */}
        <div className="mt-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-brand-deep">
              Preferred Delivery Slot <span className="text-destructive">*</span>
            </Label>
            {customer.window && (
              <span className="text-xs font-bold text-brand-green">
                ✓ {customer.window}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-brand-ink/60">
            Delivery between 8:00 AM and 2:00 PM (30-min windows)
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DELIVERY_TIME_SLOTS.map((slot) => {
              const isSelected = customer.window === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    updateCustomer("window", slot);
                    onBlur("window");
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2.5 text-center text-xs font-semibold transition-all",
                    isSelected
                      ? "border-brand-green bg-brand-green text-primary-foreground shadow-sm ring-2 ring-brand-green/20"
                      : "border-brand-deep/15 bg-brand-cream text-brand-deep hover:border-brand-deep/35 hover:bg-brand-sage/40",
                  )}
                >
                  <Clock3 className="size-3.5 shrink-0" />
                  <span>{slot}</span>
                </button>
              );
            })}
          </div>
          {touched.window && errors.window && (
            <p className="mt-2 text-xs font-medium text-destructive">{errors.window}</p>
          )}
        </div>

        {/* Dietary & Delivery Notes */}
        <div className="mt-2 sm:col-span-2">
          <Label htmlFor="notes" className="font-semibold text-brand-deep">
            Dietary & Delivery Notes{" "}
            <span className="text-xs font-normal text-brand-ink/50">(Optional)</span>
          </Label>
          <Textarea
            id="notes"
            rows={2}
            value={customer.notes}
            onChange={(event) => updateCustomer("notes", event.target.value)}
            placeholder="e.g. No onion/garlic, allergic to nuts, ring doorbell on arrival…"
            className="mt-2 border-brand-deep/20 bg-transparent"
          />
          <p className="mt-1 text-[11px] text-brand-ink/40">
            Mention any dietary restrictions, allergies, or special delivery instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckoutReview({
  selectedProducts,
  cart,
  cartSubtotal,
  dateLabel,
  customer,
}: {
  selectedProducts: Product[];
  cart: Cart;
  cartSubtotal: number;
  dateLabel: string;
  customer: {
    name: string;
    mobile: string;
    address: string;
    pin: string;
    landmark: string;
    window: string;
    notes: string;
  };
}) {
  const offerDiscount = getOfferDiscount(cartSubtotal);
  const total = Math.max(cartSubtotal - offerDiscount + (storefrontConfig.deliveryFee ?? 0), 0);
  return (
    <div>
      <CheckoutHeading
        step="04"
        title="Review your order"
        description="Check your breakfast selection and address before placing your order via WhatsApp."
      />
      <div className="mt-6 space-y-3 border-y border-brand-deep/15 py-5 text-sm">
        <div>
          <p className="font-semibold text-brand-deep">Chosen breakfasts</p>
          <div className="mt-2 space-y-2 text-brand-ink/60">
            {selectedProducts.map((product) => {
              const item = cart[product.id]!;
              const lineTotal = getProductPrice(product, item.comboPlan) * item.quantity;
              return (
                <div className="flex justify-between gap-4" key={product.id}>
                  <span>
                    {product.name} × {item.quantity}
                    {item.comboPlan && (
                      <span className="ml-1 text-brand-ink/45">
                        ({getComboPlanLabel(item.comboPlan)})
                      </span>
                    )}
                  </span>
                  <span>{formatPrice(lineTotal)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between gap-4 border-t border-brand-deep/10 pt-3">
          <span>Menu subtotal</span>
          <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{storefrontConfig.deliveryLabel}</span>
          <span>
            {storefrontConfig.deliveryFee === null
              ? "To be confirmed"
              : formatPrice(storefrontConfig.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between gap-4 border-t border-brand-deep/15 pt-4 text-base font-bold text-brand-deep">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <div className="grid gap-3 bg-brand-sage/45 p-4 text-xs text-brand-ink/70">
        <p>
          <span className="font-bold text-brand-deep">First delivery:</span> {dateLabel}
        </p>
        <p>
          <span className="font-bold text-brand-deep">Deliver to:</span> {customer.name},{" "}
          {customer.address}, {customer.pin}
        </p>
        {customer.landmark && (
          <p>
            <span className="font-bold text-brand-deep">Landmark:</span> {customer.landmark}
          </p>
        )}
        {customer.window && (
          <p>
            <span className="font-bold text-brand-deep">Preferred time:</span> {customer.window}
          </p>
        )}
        {customer.notes && (
          <p>
            <span className="font-bold text-brand-deep">Dietary / Notes:</span> {customer.notes}
          </p>
        )}
      </div>
      <div className="mt-5 flex gap-3 border border-[#25D366]/30 bg-[#25D366]/10 p-4 text-sm text-brand-deep">
        <WhatsAppIcon className="mt-0.5 size-5 shrink-0" />
        <p>
          <strong>No payment required right now.</strong> Your order will be registered in our system and you will be redirected to WhatsApp with all order details filled in to confirm delivery with our kitchen.
        </p>
      </div>
    </div>
  );
}

function CheckoutHeading({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] text-brand-green">{step}</p>
      <h3 className="mt-2 font-display text-3xl text-brand-deep">{title}</h3>
      <p className="mt-2 text-sm text-brand-ink/60">{description}</p>
    </div>
  );
}

function OrderConfirmationDialog({
  open,
  onOpenChange,
  order,
  dateLabel,
  whatsAppUrl,
  upiCopied,
  onCopyUpi,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  dateLabel: string;
  whatsAppUrl: string;
  upiCopied: boolean;
  onCopyUpi: () => void;
}) {
  if (!order) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto border-brand-deep/15 bg-brand-cream p-0 text-brand-ink">
        {/* Success header */}
        <div className="flex flex-col items-center border-b border-brand-deep/10 px-6 pb-6 pt-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-green/15">
            <Check className="size-8 text-brand-green" />
          </div>
          <DialogHeader className="mt-5">
            <DialogTitle className="font-display text-2xl text-brand-deep sm:text-3xl">
              Order Placed!
            </DialogTitle>
            <DialogDescription className="mt-1 text-brand-ink/60">
              Your order has been registered & sent to our kitchen.
            </DialogDescription>
          </DialogHeader>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-sage/60 px-3.5 py-1.5 text-xs font-bold tracking-wide text-brand-deep">
            #{order.id}
          </span>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Order Summary */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-brand-deep">Order Summary</p>
            <div className="space-y-1.5 text-brand-ink/60">
              {order.items.map((item, idx) => (
                <div className="flex justify-between gap-4" key={idx}>
                  <span>{item.productName} × {item.quantity}</span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between gap-4 border-t border-brand-deep/10 pt-2 font-bold text-brand-deep">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="mt-1 text-xs text-brand-ink/50">
              <p>📅 Delivery: {dateLabel} · 🕐 {order.customer.window}</p>
            </div>
          </div>

          {/* WhatsApp confirmation */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#20bd5a]"
          >
            <WhatsAppIcon className="size-5" />
            Confirm on WhatsApp
          </a>

          {/* UPI Payment card */}
          <div className="rounded-xl border border-brand-deep/12 bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-ink/40">Payment via UPI</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-bold tracking-tight text-brand-deep">{storefrontConfig.upiId}</p>
                <p className="mt-0.5 text-xs text-brand-ink/50">Amount: {formatPrice(order.total)}</p>
              </div>
              <button
                onClick={onCopyUpi}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
                  upiCopied
                    ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
                    : "border-brand-deep/20 bg-brand-cream text-brand-deep hover:border-brand-deep/40 hover:bg-brand-sage/50",
                )}
              >
                {upiCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {upiCopied ? "Copied!" : "Copy UPI ID"}
              </button>
            </div>
            <div className="mt-3 rounded-md bg-brand-sage/40 p-2.5 text-[11px] leading-relaxed text-brand-ink/55">
              <p><strong>How to pay:</strong> Open any UPI app (GPay, PhonePe, Paytm) → Send money → Paste the UPI ID → Enter amount → Pay.</p>
              <p className="mt-1">Share the payment screenshot on WhatsApp for faster confirmation.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-brand-deep/10 px-6 py-4">
          <Button
            variant="outline"
            className="w-full border-brand-deep/20 text-brand-deep hover:bg-brand-sage"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
