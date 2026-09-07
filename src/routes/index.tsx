import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  getPlan,
  getPlanPerDelivery,
  getSavings,
  getOfferDiscount,
  plans,
  products,
  storefrontConfig,
  type PlanId,
  type Product,
} from "@/lib/storefront-data";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/mhp-logo.png.asset.json";
import fruitAsset from "@/assets/cut-fruit-bowl.jpg.asset.json";
import sproutsAsset from "@/assets/sprout-bowl.jpg.asset.json";
import juiceAsset from "@/assets/detox-juice.jpg.asset.json";
import veggiesAsset from "@/assets/saute-veggies.jpg.asset.json";

export const Route = createFileRoute("/")({
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type CheckoutStep = 1 | 2 | 3 | 4 | 5;
type Cart = Record<string, number>;

const whatsappMessage = (message: string) =>
  `https://wa.me/${storefrontConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

const operationalBenefits: Array<[LucideIcon, string, string]> = [
  [Clock3, "Freshly prepared", "Prepared for the morning, not pulled from a shelf."],
  [ShieldCheck, "Hygienically packed", "Packed with care so it arrives ready to enjoy."],
  [ShoppingBag, "Doorstep delivery", "A calmer start, delivered where you need it."],
  [MessageCircle, "WhatsApp support", "Need help? Reach us at 9780035199."],
];

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("six-day");
  const [cart, setCart] = useState<Cart>({});
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    pin: "",
    landmark: "",
    window: "",
  });

  const selectedProductIds = useMemo(() => Object.keys(cart).filter((id) => (cart[id] ?? 0) > 0), [cart]);
  const selectedProducts = useMemo(() => products.filter((product) => selectedProductIds.includes(product.id)), [selectedProductIds]);
  const cartCount = useMemo(() => Object.values(cart).reduce((total, quantity) => total + quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => selectedProducts.reduce((total, product) => total + (product.price ?? 0) * (cart[product.id] ?? 0), 0),
    [cart, selectedProducts],
  );
  const currentPlan = getPlan(selectedPlan);
  const planSavings = getSavings(currentPlan);
  const dateLabel = deliveryDate
    ? deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Choose a date";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openCheckout = (planId: PlanId = selectedPlan, productId?: string) => {
    setSelectedPlan(planId);
    if (productId) {
      setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    }
    setCheckoutStep(1);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const toggleProduct = (productId: string) => {
    setCart((current) => {
      if (!current[productId]) return { ...current, [productId]: 1 };
      const next = { ...current };
      delete next[productId];
      return next;
    });
  };

  const addProduct = (productId: string) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  };

  const updateCustomer = (key: keyof typeof customer, value: string) => {
    setCustomer((details) => ({ ...details, [key]: value }));
  };

  const nextStep = () => {
    if (checkoutStep === 1 && cartCount === 0) {
      toast.error("Choose at least one breakfast to continue.");
      return;
    }
    if (checkoutStep === 3 && !deliveryDate) {
      toast.error("Choose your first delivery date to continue.");
      return;
    }
    if (checkoutStep === 4 && (!customer.name || !customer.mobile || !customer.address || !customer.pin)) {
      toast.error("Please add your name, mobile, address and PIN code.");
      return;
    }
    setCheckoutStep((step) => (step < 5 ? (step + 1) as CheckoutStep : step));
  };

  const previousStep = () => {
    setCheckoutStep((step) => (step > 1 ? (step - 1) as CheckoutStep : step));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-cream text-brand-ink pb-20 md:pb-0">
      <header className="absolute inset-x-0 top-0 z-30 border-b border-brand-deep/10 bg-brand-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="My Healthy Platter home">
            <img src={logoAsset.url} alt="My Healthy Platter" className="h-12 w-auto max-w-[176px] object-contain object-left sm:h-14 sm:max-w-[210px]" />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-brand-deep lg:flex" aria-label="Main navigation">
            <a href="#menu" className="transition-colors hover:text-brand-green">Menu</a>
            <a href="#how-it-works" className="transition-colors hover:text-brand-green">How It Works</a>
            <a href="#faq" className="transition-colors hover:text-brand-green">FAQ</a>
          </nav>

           <div className="hidden items-center gap-3 sm:flex">
             <Button variant="outline" className="h-10 gap-2 border-brand-deep/20 bg-transparent px-3 text-brand-deep hover:bg-brand-sage" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
               <ShoppingBag className="size-4" /> <span>Cart</span><span className="min-w-5 rounded-full bg-brand-green px-1.5 py-0.5 text-center text-[10px] text-primary-foreground">{cartCount}</span>
             </Button>
            <a
              className="inline-flex h-10 items-center gap-2 px-2 text-sm font-semibold text-brand-deep transition-colors hover:text-brand-green"
              href={whatsappMessage("Hi My Healthy Platter, I need help with my order.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => toast.success("Opening WhatsApp support")}
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <Button className="bg-brand-deep px-5 text-primary-foreground hover:bg-brand-green" onClick={() => openCheckout()}>
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
          <nav className="border-t border-brand-deep/10 bg-brand-cream px-5 py-5 sm:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-4 text-sm font-semibold text-brand-deep">
              <button className="text-left" onClick={() => scrollTo("menu")}>Menu</button>
              <button className="text-left" onClick={() => scrollTo("how-it-works")}>How It Works</button>
              <button className="text-left" onClick={() => scrollTo("faq")}>FAQ</button>
              <a href={whatsappMessage("Hi My Healthy Platter, I need help with my order.")} target="_blank" rel="noreferrer">WhatsApp support</a>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-5 pb-14 pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-20 lg:pt-40">
          <div className="relative z-10 max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-brand-green/30 bg-brand-sage/55 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-deep">
              <Sparkles className="size-3.5" /> Fresh breakfast, made simple
            </div>
            <h1 className="font-display text-6xl leading-[0.94] tracking-[-0.02em] text-brand-deep sm:text-7xl lg:text-8xl">
              Breakfast,<br /><span className="text-brand-green">Sorted.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-brand-ink/75">
              Fresh, healthy breakfast prepared for you and delivered to your doorstep.
            </p>
            <p className="mt-3 text-sm font-semibold tracking-wide text-brand-deep">No shopping. No chopping. No morning rush.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="h-12 justify-between bg-brand-deep px-5 text-primary-foreground hover:bg-brand-green" onClick={() => scrollTo("menu")}>
                Choose my breakfast <ArrowRight />
              </Button>
              <Button variant="outline" className="h-12 border-brand-deep/25 bg-transparent px-5 text-brand-deep hover:bg-brand-sage" onClick={() => scrollTo("menu")}>
                See today&apos;s menu
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-brand-deep/80">
              {[
                "Freshly prepared",
                "Hygienically packed",
                "Doorstep delivery",
              ].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check className="size-4 text-brand-green" />{item}</span>)}
            </div>
            <p className="mt-6 inline-flex items-center gap-2 border border-brand-green/25 bg-brand-sage/55 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-deep"><Sparkles className="size-3.5 text-brand-green" /> {storefrontConfig.offer.label} · {storefrontConfig.deliveryLabel}</p>
          </div>
          <FoodStillLife />
        </section>

        <section className="border-y border-brand-deep/10 bg-brand-deep px-5 py-5 text-primary-foreground lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-bold">Not ready for a plan?</p>
              <p className="mt-1 text-sm text-primary-foreground/70">Try breakfast once. If you love the routine, make it a habit.</p>
            </div>
            <Button variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-brand-deep" onClick={() => openCheckout("one-time")}>
              Order once <ArrowRight />
            </Button>
          </div>
        </section>

        <section id="menu" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 lg:px-10 lg:py-28">
          <SectionIntro eyebrow="THE MORNING MENU" title="What&apos;s coming to your door?" description="Freshly prepared breakfast options made for busy mornings." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => {
                addProduct(product.id);
                toast.success(`${product.name} added to your order`);
              }} onPlan={() => openCheckout("six-day", product.id)} quantity={cart[product.id] ?? 0} />
            ))}
          </div>
        </section>

        <section id="plans" className="scroll-mt-20 bg-brand-sage/45 px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionIntro eyebrow="YOUR ROUTINE" title="How do you want breakfast taken care of?" description="Start once, make it a weekly routine, or let us handle your mornings all month." />
            <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} selected={selectedPlan === plan.id} onSelect={() => setSelectedPlan(plan.id)} onStart={() => openCheckout(plan.id)} />
              ))}
            </div>
            <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-brand-deep/65"><ShieldCheck className="size-4" /> No account needed before purchase. Choose what feels right.</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <SectionIntro eyebrow="WHY MAKE IT A ROUTINE?" title="Healthy mornings are easier when they&apos;re already planned." />
          <div className="mt-12 grid gap-px overflow-hidden border border-brand-deep/15 bg-brand-deep/15 md:grid-cols-3">
            {[
              ["01", "Less thinking", "You don&apos;t have to decide what breakfast will be every morning."],
              ["02", "Less preparation", "No shopping, cutting or preparing."],
              ["03", "More consistency", "Your breakfast routine arrives at your doorstep."],
            ].map(([number, title, text]) => <div className="bg-brand-cream p-7 lg:p-10" key={number}><p className="text-sm font-bold text-brand-green">{number}</p><h3 className="mt-8 font-display text-3xl text-brand-deep">{title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-brand-ink/65">{text}</p></div>)}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 bg-brand-deep px-5 py-20 text-primary-foreground lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionIntro dark eyebrow="THE EASY PART" title="Choose your breakfast. We&apos;ll handle the rest." description="A simple start to a better morning." />
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                ["01", "Choose your breakfast", "Pick what you want delivered."],
                ["02", "Choose your routine", "Try once, choose 6 days, or choose 26 days."],
                ["03", "We deliver", "Fresh breakfast arrives at your doorstep."],
              ].map(([number, title, text]) => <div className="border-t border-primary-foreground/20 pt-5" key={number}><p className="text-sm font-bold text-brand-sage">{number}</p><h3 className="mt-8 font-display text-3xl">{title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/65">{text}</p></div>)}
            </div>
            <Button className="mt-12 bg-brand-sage text-brand-deep hover:bg-primary-foreground" onClick={() => openCheckout()}>
              Start my breakfast <ArrowRight />
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <SectionIntro eyebrow="DELIVERY, WITHOUT THE DRAMA" title="Fresh breakfast without the morning work." description="Every order is prepared fresh, packed carefully, and sent to your doorstep." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {operationalBenefits.map(([Icon, title, text]) => <div className="border-l-2 border-brand-green px-5 py-1" key={title}><Icon className="size-5 text-brand-green" /><h3 className="mt-5 font-semibold text-brand-deep">{title}</h3><p className="mt-2 text-sm leading-6 text-brand-ink/65">{text}</p></div>)}
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-t border-brand-deep/10 bg-white/45 px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <SectionIntro eyebrow="GOOD TO KNOW" title="Questions, answered." description="Still deciding? Here are the things customers usually want to know first." />
            <div className="divide-y divide-brand-deep/15 border-y border-brand-deep/15">
              {[
                ["Do I need to create an account?", "No. You can check out as a guest. We only ask for the details needed to deliver your breakfast."],
                ["Can I try it just once?", "Yes. One-time is the lowest-friction way to try us. If you love the routine, choose a plan next time."],
                ["How do plans work?", "Choose 6 delivery days for a week or 26 delivery days for the month. Your plan and delivery details are shown clearly before you confirm."],
                ["Need help with an order?", "WhatsApp us at 9780035199 and we&apos;ll help you with the next step."],
              ].map(([question, answer]) => <details className="group py-5" key={question}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-deep [&::-webkit-details-marker]:hidden"><span>{question}</span><ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="max-w-xl pt-4 text-sm leading-6 text-brand-ink/65">{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="bg-brand-green px-5 py-20 text-primary-foreground lg:px-10 lg:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div><p className="text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground/70">A better morning starts here</p><h2 className="mt-4 max-w-2xl font-display text-5xl leading-[1] sm:text-6xl">Tomorrow morning starts today.</h2><p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">Choose your breakfast. Choose your routine. We&apos;ll take care of the rest.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row"><Button className="bg-brand-deep text-primary-foreground hover:bg-brand-deep/85" onClick={() => openCheckout()}>Get my breakfast <ArrowRight /></Button><a className="inline-flex h-10 items-center justify-center gap-2 px-4 text-sm font-semibold text-primary-foreground hover:underline" href={whatsappMessage("Hi My Healthy Platter, I am interested in ordering breakfast.")} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /> WhatsApp us</a></div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-cream px-5 py-10 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs text-brand-ink/60 sm:flex-row"><p className="font-bold tracking-[0.13em] text-brand-deep">MY HEALTHY PLATTER</p><p>Fresh breakfast without the morning work.</p><a href={`tel:${storefrontConfig.phone}`} className="font-semibold text-brand-deep">{storefrontConfig.phone}</a></div></footer>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-brand-deep/15 bg-brand-cream/95 p-3 shadow-soft backdrop-blur-md sm:hidden">
        <a href={whatsappMessage("Hi My Healthy Platter, I need help with my order.")} target="_blank" rel="noreferrer" className="inline-flex h-11 w-12 shrink-0 items-center justify-center border border-brand-deep/20 text-brand-deep" aria-label="WhatsApp support"><WhatsAppIcon className="size-5" /></a>
         <Button className="h-11 flex-1 bg-brand-deep text-primary-foreground hover:bg-brand-green" onClick={() => setCartOpen(true)}>{cartCount > 0 ? `View my order · ${formatPrice(cartSubtotal)}` : "Order my breakfast"} <ShoppingBag /></Button>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} cartCount={cartCount} cartSubtotal={cartSubtotal} updateQuantity={updateQuantity} onCheckout={() => { setCartOpen(false); setCheckoutStep(1); setCheckoutOpen(true); }} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} step={checkoutStep} plan={currentPlan} cart={cart} selectedProducts={selectedProducts} selectedProductIds={selectedProductIds} toggleProduct={toggleProduct} updateQuantity={updateQuantity} cartSubtotal={cartSubtotal} onPlanChange={setSelectedPlan} deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} dateLabel={dateLabel} customer={customer} updateCustomer={updateCustomer} nextStep={nextStep} previousStep={previousStep} savings={planSavings} />
    </div>
  );
}

function FoodStillLife() {
  return <div className="relative mx-auto aspect-[0.96] w-full max-w-[560px] overflow-hidden border border-brand-deep/10 bg-brand-sage/55 p-5 sm:p-8"><div className="absolute right-6 top-6 z-10 border border-brand-deep/15 bg-brand-cream/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-deep">Fresh from the kitchen</div><div className="relative flex h-full items-center justify-center"><div className="absolute bottom-0 left-1/2 h-[14%] w-[85%] -translate-x-1/2 rounded-[50%] bg-brand-deep/10 blur-xl" /><div className="relative mt-8 grid w-[92%] grid-cols-2 gap-3 sm:gap-5"><FoodImage type="fruit" alt="Fresh cut fruit bowl" /><FoodImage type="sprouts" alt="Colourful sprout bowl" /><FoodImage type="juice" alt="Fresh green detox juice" /><FoodImage type="veggies" alt="Sautéed seasonal vegetables" /></div></div><p className="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep/60 sm:bottom-8 sm:left-8">Breakfast, prepared for you</p></div>;
}

function FoodImage({ type, alt }: { type: "fruit" | "sprouts" | "juice" | "veggies"; alt: string }) {
  const image = { fruit: fruitAsset.url, sprouts: sproutsAsset.url, juice: juiceAsset.url, veggies: veggiesAsset.url }[type];
  return <div className="relative aspect-square overflow-hidden border border-brand-deep/10 bg-brand-cream shadow-soft"><img src={image} alt={alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.6A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="M9.1 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.6.7c.5 1 1.3 1.7 2.3 2.2l.7-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5 0 .7-.3 1.3-.8 1.6-.4.3-1 .3-1.5.1-2.8-.9-5-3.1-5.9-5.9-.2-.5-.2-1.1.1-1.4l.8-.8Z" /></svg>;
}

function SectionIntro({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
  return <div className={cn("max-w-2xl", dark ? "text-primary-foreground" : "text-brand-deep")}><p className={cn("text-xs font-bold uppercase tracking-[0.18em]", dark ? "text-brand-sage" : "text-brand-green")}>{eyebrow}</p><h2 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">{title}</h2>{description && <p className={cn("mt-5 max-w-lg text-base leading-7", dark ? "text-primary-foreground/65" : "text-brand-ink/65")}>{description}</p>}</div>;
}

function ProductCard({ product, onAdd, onPlan, selected }: { product: Product; onAdd: () => void; onPlan: () => void; selected: boolean }) {
  return <article className={cn("group border bg-brand-cream transition-colors", selected ? "border-brand-green" : "border-brand-deep/15")}><FoodImage type={product.visual} alt={`${product.name} breakfast`} /><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-2xl text-brand-deep">{product.name}</h3>{selected && <Check className="mt-1 size-4 shrink-0 text-brand-green" />}</div><p className="mt-3 min-h-[72px] text-sm leading-6 text-brand-ink/65">{product.description}</p><div className="space-y-2 border-t border-brand-deep/10 pt-4 text-xs text-brand-ink/60"><p><span className="font-bold text-brand-deep">Ingredients</span> {product.ingredients}</p><p><span className="font-bold text-brand-deep">Portion</span> {product.portion}</p></div><p className="mt-5 text-sm font-bold text-brand-deep">{formatPrice(product.price)}</p><div className="mt-4 flex flex-col gap-2"><Button className="w-full bg-brand-deep text-primary-foreground hover:bg-brand-green" onClick={onAdd}>{selected ? "Added to order" : "Add to order"} <Plus /></Button><Button variant="ghost" className="w-full text-brand-deep hover:bg-brand-sage" onClick={onPlan}>Make it a plan <ArrowRight /></Button></div></div></article>;
}

function PlanCard({ plan, selected, onSelect, onStart }: { plan: (typeof plans)[number]; selected: boolean; onSelect: () => void; onStart: () => void }) {
  const savings = getSavings(plan);
  const perDelivery = getPlanPerDelivery(plan);
  return <article className={cn("relative flex flex-col border bg-brand-cream p-6 transition-all lg:p-8", selected ? "border-2 border-brand-green shadow-soft" : "border-brand-deep/15")}><button className="absolute inset-0 z-0 cursor-pointer text-left" aria-label={`Select ${plan.name}`} onClick={onSelect} /><div className="relative z-10 flex h-full flex-col"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-green">{plan.eyebrow}</p><h3 className="mt-3 font-display text-3xl text-brand-deep">{plan.name}</h3></div>{plan.badge && <span className="border border-brand-green/30 bg-brand-sage px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-deep">{plan.badge}</span>}</div><p className="mt-5 text-sm text-brand-ink/75">{plan.description}</p><p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-brand-deep/50">Best for</p><p className="mt-2 min-h-[40px] text-sm leading-6 text-brand-ink/65">{plan.bestFor}</p><div className="mt-7 border-t border-brand-deep/10 pt-5"><p className="font-display text-3xl text-brand-deep">{formatPrice(plan.price)}</p>{perDelivery && <p className="mt-1 text-xs text-brand-ink/60">{formatPrice(perDelivery)} / breakfast</p>}{savings && savings.percentage > 0 && <p className="mt-2 text-xs font-bold text-brand-green">Save {savings.percentage}%</p>}</div><Button className={cn("relative mt-7 w-full", selected ? "bg-brand-deep text-primary-foreground hover:bg-brand-green" : "bg-brand-sage text-brand-deep hover:bg-brand-green hover:text-primary-foreground")} onClick={(event) => { event.stopPropagation(); onStart(); }}>{plan.cta} <ArrowRight /></Button></div></article>;
}

function CheckoutDialog({ open, onOpenChange, step, plan, selectedProducts, selectedProductIds, toggleProduct, onPlanChange, deliveryDate, setDeliveryDate, dateLabel, customer, updateCustomer, nextStep, previousStep, savings }: { open: boolean; onOpenChange: (open: boolean) => void; step: CheckoutStep; plan: (typeof plans)[number]; selectedProducts: Product[]; selectedProductIds: string[]; toggleProduct: (id: string) => void; onPlanChange: (id: PlanId) => void; deliveryDate: Date | undefined; setDeliveryDate: (date: Date | undefined) => void; dateLabel: string; customer: { name: string; mobile: string; address: string; pin: string; landmark: string; window: string }; updateCustomer: (key: keyof typeof customer, value: string) => void; nextStep: () => void; previousStep: () => void; savings: ReturnType<typeof getSavings> }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-brand-deep/15 bg-brand-cream p-0 text-brand-ink"><div className="border-b border-brand-deep/10 px-5 pb-5 pt-6 sm:px-8"><DialogHeader className="text-left"><DialogTitle className="font-display text-3xl text-brand-deep">Complete your order</DialogTitle><DialogDescription className="text-brand-ink/60">No account needed. We&apos;ll show the full cost before payment.</DialogDescription></DialogHeader><div className="mt-6 grid grid-cols-3 gap-2">{[[1, "Breakfast"], [3, "Delivery"], [5, "Review"]].map(([value, label]) => <div key={label as string} className="flex items-center gap-2 text-xs font-bold"><span className={cn("flex size-6 items-center justify-center rounded-full border", step >= (value as number) ? "border-brand-green bg-brand-green text-primary-foreground" : "border-brand-deep/20 text-brand-ink/40")}>{step > (value as number) ? <Check className="size-3" /> : value}</span><span className={cn(step >= (value as number) ? "text-brand-deep" : "text-brand-ink/40")}>{label}</span></div>)}</div></div><div className="px-5 py-6 sm:px-8">{step === 1 && <CheckoutProducts selectedProductIds={selectedProductIds} toggleProduct={toggleProduct} />}{step === 2 && <CheckoutPlan plan={plan} onPlanChange={onPlanChange} />}{step === 3 && <CheckoutDate deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} dateLabel={dateLabel} />}{step === 4 && <CheckoutDetails customer={customer} updateCustomer={updateCustomer} />}{step === 5 && <CheckoutReview plan={plan} selectedProducts={selectedProducts} dateLabel={dateLabel} customer={customer} savings={savings} />}</div><div className="flex flex-col-reverse gap-2 border-t border-brand-deep/10 px-5 py-4 sm:flex-row sm:justify-between sm:px-8"><Button variant="ghost" className="text-brand-deep" onClick={step === 1 ? () => onOpenChange(false) : previousStep}>{step === 1 ? "Keep browsing" : "Back"}</Button><Button className="bg-brand-deep text-primary-foreground hover:bg-brand-green" onClick={nextStep}>{step === 5 ? "Payment setup pending" : step === 4 ? "Review my order" : "Continue"}{step < 5 && <ArrowRight />}</Button></div></DialogContent></Dialog>;
}

function CheckoutProducts({ selectedProductIds, toggleProduct }: { selectedProductIds: string[]; toggleProduct: (id: string) => void }) { return <div><CheckoutHeading step="01" title="What would you like?" description="Choose one or more breakfasts for your order." /><div className="mt-6 grid gap-3 sm:grid-cols-2">{products.map((product) => <button key={product.id} onClick={() => toggleProduct(product.id)} className={cn("flex items-center gap-3 border p-3 text-left transition-colors", selectedProductIds.includes(product.id) ? "border-brand-green bg-brand-sage/55" : "border-brand-deep/15 hover:border-brand-green/50")}><div className="size-16 shrink-0 overflow-hidden border border-brand-deep/10"><img src={{ fruit: fruitAsset.url, sprouts: sproutsAsset.url, juice: juiceAsset.url, veggies: veggiesAsset.url }[product.visual]} alt="" className="size-full object-cover" /></div><span className="flex-1"><span className="block font-semibold text-brand-deep">{product.name}</span><span className="mt-1 block text-xs text-brand-ink/55">{formatPrice(product.price)}</span></span>{selectedProductIds.includes(product.id) ? <Check className="size-4 text-brand-green" /> : <Plus className="size-4 text-brand-ink/45" />}</button>)}</div></div>; }

function CheckoutPlan({ plan, onPlanChange }: { plan: (typeof plans)[number]; onPlanChange: (id: PlanId) => void }) { return <div><CheckoutHeading step="02" title="Your routine" description="Choose what feels right. You can start once." /><div className="mt-6 space-y-3">{plans.map((option) => <button key={option.id} onClick={() => onPlanChange(option.id)} className={cn("flex w-full items-start gap-3 border p-4 text-left", plan.id === option.id ? "border-brand-green bg-brand-sage/55" : "border-brand-deep/15")}><span className={cn("mt-0.5 flex size-4 shrink-0 rounded-full border p-0.5", plan.id === option.id ? "border-brand-green" : "border-brand-deep/30")}>{plan.id === option.id && <span className="size-full rounded-full bg-brand-green" />}</span><span className="flex-1"><span className="flex flex-wrap items-center gap-2 font-semibold text-brand-deep">{option.name}{option.badge && <span className="text-[10px] uppercase tracking-[0.1em] text-brand-green">{option.badge}</span>}</span><span className="mt-1 block text-sm text-brand-ink/60">{option.description}</span></span><span className="text-sm font-bold text-brand-deep">{formatPrice(option.price)}</span></button>)}</div></div>; }

function CheckoutDate({ deliveryDate, setDeliveryDate, dateLabel }: { deliveryDate: Date | undefined; setDeliveryDate: (date: Date | undefined) => void; dateLabel: string }) { return <div><CheckoutHeading step="03" title="Choose your first delivery date" description="Pick the morning you want your breakfast routine to begin." /><div className="mt-8"><Label className="text-brand-deep">First delivery</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="mt-2 h-12 w-full justify-start border-brand-deep/20 bg-transparent text-left font-normal text-brand-deep"><CalendarDays className="mr-2 size-4" />{dateLabel}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className="pointer-events-auto p-3" /></PopoverContent></Popover></div></div>; }

function CheckoutDetails({ customer, updateCustomer }: { customer: { name: string; mobile: string; address: string; pin: string; landmark: string; window: string }; updateCustomer: (key: keyof typeof customer, value: string) => void }) { const field = (key: keyof typeof customer, label: string, placeholder: string, type = "text") => <div><Label htmlFor={key} className="text-brand-deep">{label}</Label><Input id={key} type={type} value={customer[key]} onChange={(event) => updateCustomer(key, event.target.value)} placeholder={placeholder} className="mt-2 border-brand-deep/20 bg-transparent" /></div>; return <div><CheckoutHeading step="04" title="Delivery details" description="Only the details needed to get breakfast to you." /><div className="mt-6 grid gap-4 sm:grid-cols-2">{field("name", "Name", "Your name")}{field("mobile", "Mobile / WhatsApp", "10-digit mobile number", "tel")}{<div className="sm:col-span-2"><Label htmlFor="address" className="text-brand-deep">Address</Label><Textarea id="address" value={customer.address} onChange={(event) => updateCustomer("address", event.target.value)} placeholder="Flat, building, street" className="mt-2 border-brand-deep/20 bg-transparent" /></div>}{field("pin", "Area / PIN", "PIN code")}{field("landmark", "Landmark", "Nearby landmark (optional)")}{<div className="sm:col-span-2"><Label className="text-brand-deep">Preferred delivery window</Label><Select value={customer.window} onValueChange={(value) => updateCustomer("window", value)}><SelectTrigger className="mt-2 border-brand-deep/20 bg-transparent"><SelectValue placeholder="Choose a window (optional)" /></SelectTrigger><SelectContent><SelectItem value="early-morning">Early morning</SelectItem><SelectItem value="morning">Morning</SelectItem></SelectContent></Select></div>}</div></div>; }

function CheckoutReview({ plan, selectedProducts, dateLabel, customer, savings }: { plan: (typeof plans)[number]; selectedProducts: Product[]; dateLabel: string; customer: { name: string; mobile: string; address: string; pin: string; landmark: string; window: string }; savings: ReturnType<typeof getSavings> }) { const offerDiscount = getOfferDiscount(plan); const total = plan.price === null ? null : Math.max(plan.price - offerDiscount + (storefrontConfig.deliveryFee ?? 0), 0); return <div><CheckoutHeading step="05" title="Review your order" description="Here is everything before payment is connected." /><div className="mt-6 space-y-3 border-y border-brand-deep/15 py-5 text-sm"><div><p className="font-semibold text-brand-deep">Chosen breakfasts</p><p className="mt-1 text-brand-ink/60">{selectedProducts.map((product) => product.name).join(" · ")}</p></div><div className="flex justify-between gap-4 border-t border-brand-deep/10 pt-3"><span>{plan.name} · {plan.deliveries} {plan.deliveries === 1 ? "delivery" : "deliveries"}</span><span className="font-semibold">{formatPrice(plan.price)}</span></div>{savings && savings.amount > 0 && <div className="flex justify-between gap-4 text-brand-green"><span>Plan savings included</span><span>-{formatPrice(savings.amount)}</span></div>}{offerDiscount > 0 && <div className="flex justify-between gap-4 text-brand-green"><span>{storefrontConfig.offer.label}</span><span>-{formatPrice(offerDiscount)}</span></div>}<div className="flex justify-between gap-4"><span>{storefrontConfig.deliveryLabel}</span><span>{storefrontConfig.deliveryFee === null ? "To be confirmed" : formatPrice(storefrontConfig.deliveryFee)}</span></div><div className="flex justify-between gap-4 border-t border-brand-deep/15 pt-4 text-base font-bold text-brand-deep"><span>Total</span><span>{total === null ? "Price pending" : formatPrice(total)}</span></div></div><div className="grid gap-3 bg-brand-sage/45 p-4 text-xs text-brand-ink/70"><p><span className="font-bold text-brand-deep">First delivery:</span> {dateLabel}</p><p><span className="font-bold text-brand-deep">Deliver to:</span> {customer.name}, {customer.address}, {customer.pin}</p></div><div className="mt-5 flex gap-3 border border-brand-green/25 bg-brand-sage/45 p-4 text-sm text-brand-deep"><CircleHelp className="mt-0.5 size-4 shrink-0" /><p>Payment is being connected next. This review does not create an order or charge you.</p></div></div>; }

function CheckoutHeading({ step, title, description }: { step: string; title: string; description: string }) { return <div><p className="text-xs font-bold tracking-[0.16em] text-brand-green">{step}</p><h3 className="mt-2 font-display text-3xl text-brand-deep">{title}</h3><p className="mt-2 text-sm text-brand-ink/60">{description}</p></div>; }