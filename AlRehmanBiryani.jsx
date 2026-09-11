import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home,
  Utensils,
  Truck,
  Info,
  MapPin,
  Phone,
  ShoppingCart,
  Menu,
  Search,
  ArrowRight,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  Loader2,
  Facebook,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  Award,
  HelpCircle,
  Send,
  Calendar,
  Users,
} from "lucide-react";
import {
  fetchCategories,
  fetchProducts,
  calculateOrderApi,
  submitWhatsappOrderApi,
} from "./src/services/api";

// ---------------------------------------------------------------------------
// AI-GENERATED & HIGH-RES PRODUCT IMAGERY
// ---------------------------------------------------------------------------
const PRODUCT_IMAGES = {
  1: "/images/biryani-hero.png",
  2: "/images/biryani-hero.png",
  3: "/images/pulao-dish.png",
  4: "/images/pulao-dish.png",
  5: "/images/zarda-dessert.png",
  6: "https://images.unsplash.com/photo-1626200926749-58818e296396?q=80&w=400&auto=format&fit=crop",
  7: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
  8: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400&auto=format&fit=crop",
};

function getProductImage(id) {
  return PRODUCT_IMAGES[id] || "/images/biryani-hero.png";
}

function getBadgeText(product) {
  if (!product.tags) return null;
  if (product.tags.includes("hot-selling")) return "Hot Selling";
  if (product.tags.includes("chef-special")) return "Chef's Special";
  if (product.tags.includes("trending")) return "Trending";
  if (product.tags.includes("popular")) return "Popular";
  return null;
}

const CATEGORY_BANNER_TEXT = {
  biryani: "BIRYANI",
  pulao: "PULAO",
  desserts: "DESSERTS",
  "side-orders": "SIDE ORDERS",
};

// ---------------------------------------------------------------------------
// DAIG CATERING PACKAGES
// ---------------------------------------------------------------------------
const DAIG_PACKAGES = [
  {
    id: "daig-chicken-biryani",
    name: "Chicken Biryani Daig (10 KG)",
    servings: "35-40 Persons",
    price: 12500,
    priceLabel: "Rs. 12,500",
    description: "Full traditional copper daig prepared with 10kg premium basmati rice and tender chicken boti.",
    image: "/images/daig-catering.png",
  },
  {
    id: "daig-beef-pulao",
    name: "Special Beef Pulao Daig (12 KG)",
    servings: "40-45 Persons",
    price: 15500,
    priceLabel: "Rs. 15,500",
    description: "Rich yakhni slow-cooked beef pulao daig with tender meat chunks and whole spices.",
    image: "/images/pulao-dish.png",
  },
  {
    id: "daig-special-zarda",
    name: "Special Sweet Zarda Daig (8 KG)",
    servings: "40 Persons",
    price: 6500,
    priceLabel: "Rs. 6,500",
    description: "Saffron fragrant sweet zarda rice topped with dry fruits, cherries and coconut.",
    image: "/images/zarda-dessert.png",
  },
];

// ---------------------------------------------------------------------------
// SMALL UI COMPONENTS
// ---------------------------------------------------------------------------

function Badge({ children }) {
  return (
    <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-[11px] font-bold text-indigo-950 shadow-sm z-10">
      {children}
    </span>
  );
}

function ProductCard({ item, onSelect, layout = "grid" }) {
  const badge = getBadgeText(item);
  const imgUrl = getProductImage(item.id);
  const priceDisplay =
    item.variants && item.variants.length > 0
      ? `From Rs. ${item.basePrice}`
      : `Rs. ${item.basePrice}`;

  if (layout === "row") {
    return (
      <div className="relative flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-5 last:border-b-0">
        <div className="flex-1 pr-2">
          {badge && (
            <span className="mb-2 inline-block rounded-full bg-yellow-400 px-3 py-1 text-[11px] font-bold text-indigo-950">
              {badge}
            </span>
          )}
          <h3 className="text-base font-extrabold text-indigo-950">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
          )}
          {item.weight && (
            <p className="mt-1 text-xs font-semibold text-amber-700">Portion: {item.weight}</p>
          )}
          <p className="mt-2 text-base font-black text-indigo-950">{priceDisplay}</p>
        </div>
        <div className="relative flex-shrink-0">
          <img
            src={imgUrl}
            alt={item.name}
            className="h-24 w-28 rounded-xl object-cover shadow-xs border border-gray-100"
          />
          <button
            onClick={() => onSelect(item)}
            aria-label={`Add ${item.name}`}
            className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-md transition-transform active:scale-90 hover:bg-yellow-300"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-white p-3 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="relative">
          <img
            src={imgUrl}
            alt={item.name}
            className="h-32 w-full rounded-xl object-cover sm:h-36 shadow-xs"
          />
          {badge && <Badge>{badge}</Badge>}
          <button
            onClick={() => onSelect(item)}
            aria-label={`Add ${item.name}`}
            className="absolute -bottom-3 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-md transition-transform active:scale-90 hover:bg-yellow-300"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
        <h3 className="mt-4 text-sm font-extrabold text-indigo-950 sm:text-base">
          {item.name}
        </h3>
        {item.weight && (
          <p className="text-xs text-gray-500 sm:text-sm">{item.weight}</p>
        )}
      </div>
      <p className="mt-2 text-base font-black text-indigo-950 sm:text-lg">
        {priceDisplay}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN MULTI-PAGE APPLICATION
// ---------------------------------------------------------------------------

export default function AlRehmanBiryani() {
  // Navigation State: 'home' | 'catering' | 'about' | 'contact' | 'faq'
  const [currentPage, setCurrentPage] = useState("home");

  // Backend Data State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Menu Filters
  const [activeTab, setActiveTab] = useState("biryani");
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState([
    { id: 2, quantity: 1, variant: "single" },
    { id: 7, quantity: 2 },
  ]);
  const [cartSummary, setCartSummary] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Variant Selector Modal
  const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);

  // Checkout Modal
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Daig Booking State
  const [daigName, setDaigName] = useState("");
  const [daigPhone, setDaigPhone] = useState("");
  const [daigDate, setDaigDate] = useState("");
  const [selectedDaigId, setSelectedDaigId] = useState("daig-chicken-biryani");
  const [daigQty, setDaigQty] = useState(1);

  // Order Tracker State
  const [trackPhone, setTrackPhone] = useState("");
  const [trackedOrderResult, setTrackedOrderResult] = useState(null);

  const topRef = useRef(null);

  // 1. Initial Load: Fetch categories & products from backend
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [catData, prodData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(catData || []);
        setProducts(prodData || []);
        if (catData && catData.length > 0) {
          setActiveTab(catData[0].id);
        }
      } catch (err) {
        console.error("Error loading menu data:", err);
        setError("Failed to load menu. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Synchronize Cart with Express backend
  useEffect(() => {
    async function updateCartSummary() {
      if (cartItems.length === 0) {
        setCartSummary(null);
        return;
      }
      try {
        const summary = await calculateOrderApi(cartItems);
        setCartSummary(summary);
      } catch (err) {
        console.error("Cart calculation error:", err);
      }
    }
    updateCartSummary();
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleProductSelect = (product) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProductForVariant(product);
    } else {
      addToCart(product.id, null);
    }
  };

  const addToCart = (productId, variantName) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === productId && (item.variant || null) === (variantName || null)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        const newItem = { id: productId, quantity: 1 };
        if (variantName) newItem.variant = variantName;
        return [...prev, newItem];
      }
    });
    setSelectedProductForVariant(null);
  };

  const updateQuantity = (id, variant, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id && (item.variant || null) === (variant || null)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please fill in all required delivery details.");
      return;
    }
    try {
      setIsSubmittingOrder(true);
      const res = await submitWhatsappOrderApi({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        items: cartItems,
      });
      setOrderSuccessData(res);
      if (res.url) {
        window.open(res.url, "_blank");
      }
    } catch (err) {
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleDaigBooking = (e) => {
    e.preventDefault();
    const pkg = DAIG_PACKAGES.find((p) => p.id === selectedDaigId);
    const message = `*Daig Booking Inquiry — Al Rehman Biryani Kharadar*\n\nName: ${daigName}\nPhone: ${daigPhone}\nEvent Date: ${daigDate}\nItem: ${daigQty}x ${pkg.name}\nTotal Estimated: Rs. ${pkg.price * daigQty}\n\nPlease confirm booking!`;
    const url = `https://wa.me/923142961604?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackPhone.trim()) return;
    setTrackedOrderResult({
      status: "Out for Delivery 🛵",
      estimatedTime: "20-30 Mins",
      riderName: "Kashif (Rider #4)",
      phone: trackPhone,
      items: cartSummary?.items || [{ name: "Chicken Biryani Box", quantity: 2 }],
      address: "Kharadar, Karachi",
    });
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query, products]);

  const categoryItems = useMemo(() => {
    return products.filter(
      (p) => p.category.toLowerCase() === activeTab.toLowerCase()
    );
  }, [products, activeTab]);

  const popularItems = useMemo(() => {
    return products.filter((p) => p.tags && p.tags.includes("popular"));
  }, [products]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50 font-sans text-indigo-950 pb-16 md:pb-0">
      {/* Announcement bar */}
      <div className="bg-yellow-400 py-2 text-center text-xs font-extrabold sm:text-sm shadow-sm flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-red-700 animate-pulse" />
        <span>Online Daig & Box Delivery Without Advance All Over Karachi</span>
      </div>

      {/* Main Header with Clean Navigation */}
      <header className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <div
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-50 text-[10px] font-black text-indigo-950 shadow-sm">
              A.R<br />Biryani
            </div>
            <div>
              <h1 className="text-base font-black text-indigo-950">Al Rehman Biryani</h1>
              <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                Kharadar, Karachi (Open Now)
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-extrabold text-indigo-950">
            <button
              onClick={() => setCurrentPage("home")}
              className={`hover:text-yellow-600 transition-colors ${currentPage === "home" ? "text-amber-700 underline underline-offset-4 font-black" : ""}`}
            >
              Menu
            </button>
            <button
              onClick={() => setCurrentPage("catering")}
              className={`hover:text-yellow-600 transition-colors ${currentPage === "catering" ? "text-amber-700 underline underline-offset-4 font-black" : ""}`}
            >
              Daig Catering
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`hover:text-yellow-600 transition-colors ${currentPage === "about" ? "text-amber-700 underline underline-offset-4 font-black" : ""}`}
            >
              Our Heritage
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`hover:text-yellow-600 transition-colors ${currentPage === "contact" ? "text-amber-700 underline underline-offset-4 font-black" : ""}`}
            >
              Locations & Contact
            </button>
            <button
              onClick={() => setCurrentPage("faq")}
              className={`hover:text-yellow-600 transition-colors ${currentPage === "faq" ? "text-amber-700 underline underline-offset-4 font-black" : ""}`}
            >
              Track Order / FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="tel:03142961604"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50 text-indigo-950 border border-yellow-200 hover:bg-yellow-100 transition-colors"
              title="Call 0314 2961604"
            >
              <Phone size={18} />
            </a>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-md hover:bg-yellow-300 transition-transform active:scale-95"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-black text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* PAGE 1: HOME & MENU PAGE */}
      {currentPage === "home" && (
        <div>
          {/* Hero Banner with Custom AI Generated Biryani Image */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-indigo-950 to-amber-900 text-white px-4 py-12 md:py-16">
            <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left space-y-4">
                <span className="inline-block rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-black text-indigo-950">
                  🔥 Original Kharadar Taste Since 1998
                </span>
                <h1 className="text-3xl sm:text-5xl font-black leading-tight text-yellow-300">
                  Karachi's Signature Daig Biryani & Pulao
                </h1>
                <p className="text-sm sm:text-base text-gray-200 max-w-lg leading-relaxed">
                  Experience authentic slow-cooked basmati rice, tender chicken & beef chunks, aromatic spices, and traditional zarda — delivered fresh to your doorstep without advance payment!
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById("menu-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-black text-indigo-950 shadow-lg hover:bg-yellow-300 transition-all flex items-center gap-2"
                  >
                    <span>Explore Menu</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage("catering")}
                    className="rounded-full border-2 border-yellow-400 px-6 py-3 text-sm font-black text-yellow-300 hover:bg-yellow-400/10 transition-all flex items-center gap-2"
                  >
                    <Utensils size={16} />
                    <span>Daig Catering</span>
                  </button>
                </div>
              </div>

              {/* AI Generated Biryani Photography Hero */}
              <div className="relative flex-1 flex justify-center">
                <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full border-4 border-yellow-400 p-2 shadow-2xl bg-amber-900/40">
                  <img
                    src="/images/biryani-hero.png"
                    alt="Authentic Karachi Biryani"
                    className="h-full w-full rounded-full object-cover shadow-inner hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-3 -right-2 rounded-2xl bg-yellow-400 px-4 py-2 shadow-xl text-indigo-950 font-black text-xs text-center border-2 border-white">
                    100% Fresh Daily Daig
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Category Navbar */}
          <div id="menu-section" className="sticky top-[65px] z-20 bg-yellow-400 px-3 py-3 shadow-md border-b border-yellow-500">
            <div className="mx-auto max-w-6xl flex items-center gap-2">
              <button
                aria-label="Filter"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-indigo-950 shadow-sm"
              >
                <Menu size={16} />
              </button>
              <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveTab(cat.id);
                      setQuery("");
                    }}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-extrabold transition-all ${
                      activeTab === cat.id && !query
                        ? "bg-white text-indigo-950 shadow-md scale-105"
                        : "text-indigo-950/80 hover:bg-yellow-300"
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mx-auto max-w-6xl px-4 pt-6">
            <div className="flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-white px-4 py-3 shadow-sm focus-within:border-yellow-500">
              <Search size={18} className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Chicken Biryani, Beef Pulao, Zarda..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* MAIN MENU CONTENT */}
          <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 size={36} className="animate-spin text-yellow-500 mb-3" />
                <p className="text-sm font-bold text-gray-600">Loading fresh menu...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                <p className="font-bold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* SEARCH RESULTS */}
                {searchResults ? (
                  <section>
                    <h2 className="mb-3 text-lg font-extrabold">
                      Results for "{query}" ({searchResults.length})
                    </h2>
                    {searchResults.length === 0 ? (
                      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                        <p className="text-sm text-gray-500">No dishes match "{query}".</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        {searchResults.map((item) => (
                          <ProductCard
                            key={item.id}
                            item={item}
                            onSelect={handleProductSelect}
                            layout="row"
                          />
                        ))}
                      </div>
                    )}
                  </section>
                ) : (
                  <>
                    {/* POPULAR DISHES WITH AI PHOTOGRAPHY */}
                    {activeTab === "biryani" && popularItems.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                              <span>🔥</span> Popular Favorites
                            </h2>
                            <p className="text-xs text-gray-500">Most ordered dishes in Karachi right now</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          {popularItems.map((item) => (
                            <ProductCard
                              key={item.id}
                              item={item}
                              onSelect={handleProductSelect}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* CATEGORY MENU SECTION */}
                    <section>
                      <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-6 shadow-sm mb-4">
                        <div>
                          <h2
                            className="text-3xl font-black tracking-wide text-indigo-950 sm:text-4xl"
                            style={{ WebkitTextStroke: "1px #C81E3A" }}
                          >
                            {CATEGORY_BANNER_TEXT[activeTab] || "MENU"}
                          </h2>
                          <p className="mt-1 text-xs font-extrabold text-indigo-950">
                            Freshly prepared in traditional copper daigs
                          </p>
                        </div>
                        <img
                          src={getProductImage(categoryItems[0]?.id || 1)}
                          alt="Category Banner"
                          className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-white object-cover shadow-lg rotate-6"
                        />
                      </div>

                      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        {categoryItems.map((item) => (
                          <ProductCard
                            key={item.id}
                            item={item}
                            onSelect={handleProductSelect}
                            layout="row"
                          />
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </main>
        </div>
      )}

      {/* PAGE 2: DAIG CATERING & BULK BOOKING PAGE */}
      {currentPage === "catering" && (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-in fade-in">
          {/* Catering Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-indigo-950 to-amber-950 text-white p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-indigo-950">
                  🎉 Special Events & Weddings
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-yellow-300">
                  Online Daig Booking Karachi
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 max-w-lg leading-relaxed">
                  Book full 10KG & 12KG copper daigs for Weddings, Niyaz, Corporate Lunches, and Family Gatherings. No advance payment required for Karachi delivery!
                </p>
              </div>
              <img
                src="/images/daig-catering.png"
                alt="Traditional Daig Catering"
                className="h-44 w-44 rounded-2xl object-cover border-4 border-yellow-400 shadow-xl"
              />
            </div>
          </div>

          {/* Daig Package Cards */}
          <div>
            <h2 className="text-xl font-black text-indigo-950 mb-4">Standard Daig Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DAIG_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="h-40 w-full rounded-xl object-cover shadow-xs"
                  />
                  <div>
                    <h3 className="text-base font-black text-indigo-950">{pkg.name}</h3>
                    <p className="text-xs font-bold text-amber-700 mt-0.5">Serves: {pkg.servings}</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{pkg.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-lg font-black text-indigo-950">{pkg.priceLabel}</span>
                    <button
                      onClick={() => {
                        setSelectedDaigId(pkg.id);
                        const el = document.getElementById("daig-form");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="rounded-xl bg-yellow-400 px-4 py-2 text-xs font-black text-indigo-950 shadow hover:bg-yellow-300"
                    >
                      Book This Daig
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instant Daig Booking Form */}
          <div id="daig-form" className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-xl font-black text-indigo-950 mb-1">Instant Daig Booking Form</h2>
            <p className="text-xs text-gray-500 mb-6">Fill in details to get an instant WhatsApp quote and booking confirmation.</p>

            <form onSubmit={handleDaigBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={daigName}
                    onChange={(e) => setDaigName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">WhatsApp Phone *</label>
                  <input
                    required
                    type="tel"
                    value={daigPhone}
                    onChange={(e) => setDaigPhone(e.target.value)}
                    placeholder="0314 2961604"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">Event Date *</label>
                  <input
                    required
                    type="date"
                    value={daigDate}
                    onChange={(e) => setDaigDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-950 mb-1">Select Daig Package *</label>
                  <select
                    value={selectedDaigId}
                    onChange={(e) => setSelectedDaigId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400 bg-white"
                  >
                    {DAIG_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.priceLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">Number of Daigs</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={daigQty}
                  onChange={(e) => setDaigQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 text-sm font-black text-white shadow-lg hover:bg-green-700 transition-all"
              >
                <MessageSquare size={18} />
                <span>Send Daig Booking Request to WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAGE 3: HERITAGE & ABOUT US PAGE */}
      {currentPage === "about" && (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-in fade-in">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-black text-indigo-950">
              Est. Kharadar, Karachi
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-indigo-950">The Heritage of Al Rehman Biryani</h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              From a small kitchen in historic Kharadar to serving thousands across Karachi every day, our commitment to slow wood-fire cooking remains unchanged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Utensils size={24} />
              </div>
              <h3 className="text-base font-black text-indigo-950">Traditional Copper Daigs</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every batch of biryani and pulao is slow-dum-cooked in authentic copper daigs over low wood flames for deep aromatic spices.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-black text-indigo-950">No Advance Payment</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We believe in total trust and customer satisfaction. All box orders and full daig deliveries are pay-on-delivery all over Karachi.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                <Award size={24} />
              </div>
              <h3 className="text-base font-black text-indigo-950">100% Fresh Daily</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We never reuse yesterday's food. Fresh hand-slaughtered meat and premium basmati rice are cooked fresh every morning.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: LOCATIONS & CONTACT PAGE (AUTHENTIC REAL CONTACT DETAILS) */}
      {currentPage === "contact" && (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-in fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-indigo-950">Visit or Contact Us</h1>
            <p className="text-xs text-gray-500">We deliver all over Karachi from our primary branch in Kharadar Chowk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Real Contact Card */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
              <h2 className="text-xl font-black text-indigo-950">Main Kharadar Branch</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-yellow-600 shrink-0 mt-1" />
                  <div>
                    <p className="font-extrabold text-indigo-950 text-sm">Official Location & Address</p>
                    <p className="text-gray-600 mt-0.5 leading-relaxed">
                      Gk-7/73, Hajra Manzil, Nakhuda Street, Near Kharadar Chowk, Kharadar, Karachi, Sindh, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-yellow-600 shrink-0 mt-1" />
                  <div>
                    <p className="font-extrabold text-indigo-950 text-sm">Direct Phone Numbers</p>
                    <p className="text-gray-600 mt-0.5">
                      <strong>Mobile / WhatsApp:</strong> 0314 2961604<br />
                      <strong>Landline:</strong> 021 32532454 / 0300 2424844
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-yellow-600 shrink-0 mt-1" />
                  <div>
                    <p className="font-extrabold text-indigo-950 text-sm">Kitchen & Delivery Hours</p>
                    <p className="text-gray-600 mt-0.5">Open 7 Days a Week: 11:00 AM – 12:00 Midnight</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/923142961604"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 text-xs font-black text-white shadow hover:bg-green-700"
                >
                  <MessageSquare size={16} />
                  <span>Order via WhatsApp (0314 2961604)</span>
                </a>
                <a
                  href="tel:03142961604"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3.5 text-xs font-black text-indigo-950 shadow hover:bg-yellow-300"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Interactive Location Card */}
            <div className="rounded-3xl bg-gradient-to-br from-yellow-100 to-amber-200 p-8 shadow-xl border border-yellow-300 flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-indigo-950 px-3 py-1 text-xs font-black text-yellow-300">
                  Karachi Instant Delivery Network
                </span>
                <h3 className="text-2xl font-black text-indigo-950 mt-4">We Deliver All Over Karachi</h3>
                <p className="text-xs text-indigo-900 mt-2 leading-relaxed">
                  Fast hot delivery to Kharadar, Tower, Saddar, Defense (DHA), Clifton, PECHS, Gulshan-e-Iqbal, Nazimabad, North Nazimabad, Malir, Korangi, Bahadurabad, and all areas of Karachi.
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 backdrop-blur-xs p-4 mt-6 border border-white shadow-xs">
                <p className="text-xs font-black text-indigo-950">Delivery Rate Structure:</p>
                <p className="text-xs text-gray-600 mt-1">Rs. 100 flat delivery rate. <span className="font-bold text-green-700">FREE Delivery on orders above Rs. 1000!</span> Pay Cash on Delivery.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: TRACK ORDER & FAQ PAGE */}
      {currentPage === "faq" && (
        <div className="mx-auto max-w-4xl px-4 py-8 space-y-8 animate-in fade-in">
          {/* Order Tracker Section */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100">
            <h2 className="text-xl font-black text-indigo-950 mb-1 flex items-center gap-2">
              <Truck size={22} className="text-yellow-600" />
              <span>Track Your Active Order</span>
            </h2>
            <p className="text-xs text-gray-500 mb-4">Enter your mobile phone number to check current rider delivery status.</p>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                required
                type="tel"
                value={trackPhone}
                onChange={(e) => setTrackPhone(e.target.value)}
                placeholder="Enter Phone Number (e.g. 03142961604)"
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="rounded-2xl bg-yellow-400 px-6 py-3 text-xs font-black text-indigo-950 shadow hover:bg-yellow-300"
              >
                Track Now
              </button>
            </form>

            {trackedOrderResult && (
              <div className="mt-6 rounded-2xl bg-green-50 p-4 border border-green-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-indigo-950 text-sm">Status:</span>
                  <span className="font-bold bg-green-600 text-white px-3 py-1 rounded-full">{trackedOrderResult.status}</span>
                </div>
                <p><span className="text-gray-500">Estimated Arrival:</span> {trackedOrderResult.estimatedTime}</p>
                <p><span className="text-gray-500">Kharadar Kitchen Dispatch:</span> Confirmed</p>
              </div>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-indigo-950">Frequently Asked Questions</h2>

            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-100 space-y-1">
                <h3 className="text-sm font-black text-indigo-950">How long does delivery take in Karachi?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hot box orders are dispatched directly from Kharadar and delivered within 30 to 45 minutes across Karachi. Daig orders should ideally be booked 3 to 4 hours in advance.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-100 space-y-1">
                <h3 className="text-sm font-black text-indigo-950">Do I need to pay any advance for Daig delivery?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  No! Al Rehman Biryani provides online daig delivery all over Karachi without any advance payment. You pay cash on delivery when your order arrives.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-100 space-y-1">
                <h3 className="text-sm font-black text-indigo-950">Is delivery free for online orders?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Delivery is completely FREE for all orders above Rs. 1000 PKR. For orders below Rs. 1000 PKR, a standard flat fee of Rs. 100 applies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1 md:hidden flex justify-around items-center shadow-lg">
        <button
          onClick={() => setCurrentPage("home")}
          className={`flex flex-col items-center py-1 text-[10px] font-bold ${currentPage === "home" ? "text-amber-700 font-black" : "text-gray-500"}`}
        >
          <Home size={18} />
          <span>Menu</span>
        </button>
        <button
          onClick={() => setCurrentPage("catering")}
          className={`flex flex-col items-center py-1 text-[10px] font-bold ${currentPage === "catering" ? "text-amber-700 font-black" : "text-gray-500"}`}
        >
          <Utensils size={18} />
          <span>Catering</span>
        </button>
        <button
          onClick={() => setCurrentPage("about")}
          className={`flex flex-col items-center py-1 text-[10px] font-bold ${currentPage === "about" ? "text-amber-700 font-black" : "text-gray-500"}`}
        >
          <Info size={18} />
          <span>Heritage</span>
        </button>
        <button
          onClick={() => setCurrentPage("contact")}
          className={`flex flex-col items-center py-1 text-[10px] font-bold ${currentPage === "contact" ? "text-amber-700 font-black" : "text-gray-500"}`}
        >
          <MapPin size={18} />
          <span>Contact</span>
        </button>
        <button
          onClick={() => setCurrentPage("faq")}
          className={`flex flex-col items-center py-1 text-[10px] font-bold ${currentPage === "faq" ? "text-amber-700 font-black" : "text-gray-500"}`}
        >
          <Truck size={18} />
          <span>Tracker</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white px-4 py-8 border-t border-gray-100 mt-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-yellow-400 bg-yellow-50 text-[10px] font-black text-indigo-950">
              A.R
            </div>
            <h3 className="mt-3 text-lg font-black text-indigo-950">Al Rehman Biryani</h3>
            <p className="text-xs text-gray-500 mt-1">Kharadar Chowk, Karachi, Pakistan</p>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-bold text-indigo-950">Phone / WhatsApp:</span> 0314 2961604</p>
            <p><span className="font-bold text-indigo-950">Landline:</span> 021 32532454 / 0300 2424844</p>
            <p><span className="font-bold text-indigo-950">Address:</span> Gk-7/73, Hajra Manzil, Nakhuda Street, Kharadar, Karachi</p>
          </div>

          <div className="text-xs text-gray-400">
            © 2026 Al Rehman Biryani Kharadar Karachi. All rights reserved.
          </div>
        </div>
      </footer>

      {/* VARIANT SELECTION MODAL */}
      {selectedProductForVariant && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-indigo-950">{selectedProductForVariant.name}</h3>
                <p className="text-xs text-gray-500">Select portion size:</p>
              </div>
              <button
                onClick={() => setSelectedProductForVariant(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {selectedProductForVariant.variants.map((v) => (
                <button
                  key={v.name}
                  onClick={() => addToCart(selectedProductForVariant.id, v.name)}
                  className="flex w-full items-center justify-between rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 transition-all hover:border-yellow-400 hover:bg-yellow-50"
                >
                  <span className="font-extrabold text-indigo-950">{v.label}</span>
                  <span className="font-black text-amber-700">Rs. {v.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-yellow-400 px-5 py-4 text-indigo-950">
              <div className="flex items-center gap-2">
                <ShoppingCart size={22} />
                <h2 className="text-lg font-black">Your Cart ({cartCount})</h2>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-indigo-950 shadow-xs"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingCart size={48} className="text-gray-300 mb-2" />
                  <p className="text-base font-extrabold text-indigo-950">Your cart is empty</p>
                  <p className="text-xs text-gray-500 mt-1">Add some delicious Biryani to get started!</p>
                </div>
              ) : (
                <>
                  {cartSummary && (
                    <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs">
                      {cartSummary.subtotal >= cartSummary.freeDeliveryThreshold ? (
                        <p className="font-bold text-green-700 flex items-center gap-1">
                          <CheckCircle2 size={16} /> 🎉 You qualify for FREE Karachi Delivery!
                        </p>
                      ) : (
                        <p className="font-semibold text-amber-900">
                          Add <span className="font-black">Rs. {cartSummary.freeDeliveryThreshold - cartSummary.subtotal}</span> more for FREE Delivery!
                        </p>
                      )}
                    </div>
                  )}

                  {cartSummary?.items.map((lineItem) => (
                    <div
                      key={`${lineItem.id}-${lineItem.variant || "default"}`}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-xs"
                    >
                      <img
                        src={getProductImage(lineItem.id)}
                        alt={lineItem.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 px-3">
                        <h4 className="text-xs font-bold text-indigo-950">{lineItem.name}</h4>
                        {lineItem.variantLabel && (
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {lineItem.variantLabel}
                          </span>
                        )}
                        <p className="text-xs font-black text-amber-700 mt-1">
                          Rs. {lineItem.lineTotal}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(lineItem.id, lineItem.variant, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-indigo-950 shadow-xs"
                        >
                          {lineItem.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold">{lineItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(lineItem.id, lineItem.variant, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-indigo-950 shadow-xs"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {cartItems.length > 0 && cartSummary && (
              <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-indigo-950">Rs. {cartSummary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-indigo-950">
                      {cartSummary.deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `Rs. ${cartSummary.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-indigo-950 pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-amber-700">Rs. {cartSummary.total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-indigo-950 shadow-lg hover:bg-yellow-300"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT & WHATSAPP MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            {orderSuccessData ? (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-indigo-950">Order Sent to WhatsApp!</h3>
                <p className="text-xs text-gray-600">
                  Your order has been formatted and sent directly to Al Rehman Biryani WhatsApp.
                </p>

                <div className="space-y-2 pt-2">
                  <a
                    href={orderSuccessData.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-sm font-extrabold text-white shadow"
                  >
                    <MessageSquare size={18} />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-black text-indigo-950">Delivery Details</h3>
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0314 2961604"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">Delivery Address in Karachi *</label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House/Flat No, Street, Area, Karachi"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>

                  {cartSummary && (
                    <div className="rounded-xl bg-yellow-50 p-3 border border-yellow-200 text-xs flex justify-between font-black text-indigo-950">
                      <span>Total (Pay on Delivery):</span>
                      <span className="text-amber-700">Rs. {cartSummary.total}</span>
                    </div>
                  )}

                  <button
                    disabled={isSubmittingOrder}
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-indigo-950 shadow hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Preparing WhatsApp Message...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare size={18} />
                        <span>Confirm & Order via WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
