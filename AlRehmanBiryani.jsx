import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home,
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
} from "lucide-react";
import {
  fetchCategories,
  fetchProducts,
  calculateOrderApi,
  submitWhatsappOrderApi,
} from "./src/services/api";

// ---------------------------------------------------------------------------
// ITEM IMAGERY & BADGE MAP (For rich frontend visuals)
// ---------------------------------------------------------------------------
const PRODUCT_IMAGES = {
  1: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=400&auto=format&fit=crop",
  2: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop",
  3: "https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=400&auto=format&fit=crop",
  4: "https://images.unsplash.com/photo-1631292784640-2b24be784d5d?q=80&w=400&auto=format&fit=crop",
  5: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop",
  6: "https://images.unsplash.com/photo-1626200926749-58818e296396?q=80&w=400&auto=format&fit=crop",
  7: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
  8: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400&auto=format&fit=crop",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop";

function getProductImage(id) {
  return PRODUCT_IMAGES[id] || DEFAULT_IMAGE;
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
  const priceDisplay = item.variants && item.variants.length > 0
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
          <h3 className="text-base font-bold text-indigo-950">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
          )}
          {item.weight && (
            <p className="mt-1 text-xs font-medium text-amber-700">Weight: {item.weight}</p>
          )}
          <p className="mt-2 text-base font-extrabold text-indigo-950">
            {priceDisplay}
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <img
            src={imgUrl}
            alt={item.name}
            className="h-24 w-28 rounded-xl object-cover"
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
    <div className="relative rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="relative">
          <img
            src={imgUrl}
            alt={item.name}
            className="h-32 w-full rounded-xl object-cover sm:h-36"
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
          <p className="text-xs text-gray-400 sm:text-sm">{item.weight}</p>
        )}
      </div>
      <p className="mt-2 text-base font-extrabold text-indigo-950 sm:text-lg">
        {priceDisplay}
      </p>
    </div>
  );
}

function SectionBanner({ text, images }) {
  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 border-red-400 bg-gradient-to-b from-yellow-300 to-yellow-400 px-6 py-5 shadow-sm">
      <h2
        className="text-3xl font-black tracking-wide text-indigo-950 sm:text-4xl"
        style={{ WebkitTextStroke: "1px #C81E3A" }}
      >
        {text}
      </h2>
      <div className="flex -space-x-4">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-14 w-14 rotate-6 rounded-xl border-2 border-white object-cover shadow-md sm:h-16 sm:w-16"
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN APP COMPONENT
// ---------------------------------------------------------------------------

export default function AlRehmanBiryani() {
  // Backend data state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active filter state
  const [activeTab, setActiveTab] = useState("biryani");
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([
    { id: 2, quantity: 1, variant: "single" },
    { id: 7, quantity: 2 },
  ]);
  const [cartSummary, setCartSummary] = useState(null);
  const [isCalculatingCart, setIsCalculatingCart] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Variant Modal state
  const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);

  // Checkout Modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const topRef = useRef(null);

  // 1. Initial Load: Fetch categories & products from backend REST API
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
        console.error("Error connecting to backend API:", err);
        setError("Failed to load menu from server. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Synchronize Cart calculation with Express backend POST /api/orders/calculate
  useEffect(() => {
    async function updateCartSummary() {
      if (cartItems.length === 0) {
        setCartSummary(null);
        return;
      }
      try {
        setIsCalculatingCart(true);
        const summary = await calculateOrderApi(cartItems);
        setCartSummary(summary);
      } catch (err) {
        console.error("Cart calculation error:", err);
      } finally {
        setIsCalculatingCart(false);
      }
    }

    updateCartSummary();
  }, [cartItems]);

  // Total item count in cart
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Product Selection (direct add or open variant selector)
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
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id && (item.variant || null) === (variant || null)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id, variant) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && (item.variant || null) === (variant || null))
      )
    );
  };

  // WhatsApp Order Submission
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
      // Open WhatsApp deep link in new tab
      if (res.url) {
        window.open(res.url, "_blank");
      }
    } catch (err) {
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleFinishOrder = () => {
    setCartItems([]);
    setOrderSuccessData(null);
    setCheckoutModalOpen(false);
    setCartDrawerOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
  };

  // Filtered Products for current view
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

  const activeCategoryObj = categories.find((c) => c.id === activeTab);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50 font-sans text-indigo-950">
      {/* Announcement bar */}
      <div className="bg-yellow-400 py-2 text-center text-xs font-bold sm:text-sm shadow-sm flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-red-700 animate-pulse" />
        <span>Online Daig Delivery Without Advance All Over Karachi</span>
      </div>

      {/* Browser-style top bar */}
      <div className="flex items-center gap-2 bg-yellow-300 px-3 py-2">
        <Home size={18} className="shrink-0 text-indigo-950" />
        <div className="flex flex-1 items-center gap-2 rounded-full bg-yellow-100/80 px-3 py-1.5 text-xs font-semibold text-indigo-900 sm:text-sm">
          alrehmanbiryani.com.pk (REST API Connected)
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-400 bg-white text-[10px] font-black leading-tight text-indigo-950 shadow-sm">
            A.R
            <br />
            Biryani
          </div>
          <div>
            <h1 className="text-base font-extrabold leading-none text-indigo-950">Al Rehman Biryani</h1>
            <span className="text-[11px] font-bold text-green-600 flex items-center gap-1 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping inline-block"></span>
              Kharadar, Karachi (Open)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:03142961604"
            aria-label="Call"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50 text-indigo-950 border border-yellow-200 hover:bg-yellow-100 transition-colors"
          >
            <Phone size={18} />
          </a>

          {/* Cart Toggle Button */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-md hover:bg-yellow-300 transition-transform active:scale-95"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-extrabold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero banner */}
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 px-4 py-8 text-center shadow-inner">
          <p dir="rtl" className="text-2xl font-black text-indigo-950 sm:text-3xl">
            الرحمٰن بریانی کھارادر (ٹاور)
          </p>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-indigo-950/80">
            Karachi's Original Daig Biryani & Pulao
          </p>
          <div className="mt-6 flex items-end justify-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=300&auto=format&fit=crop"
              alt="Chicken Pulao"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
            />
            <img
              src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=300&auto=format&fit=crop"
              alt="Chicken Biryani"
              className="h-28 w-28 -translate-y-2 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32"
            />
            <img
              src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=300&auto=format&fit=crop"
              alt="Aloo Biryani"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
            />
          </div>
        </div>
      </div>

      {/* Sticky category navigation */}
      <div className="sticky top-[65px] z-10 mt-4 flex items-center gap-2 bg-yellow-400 px-3 py-3 shadow-md">
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
        <button
          aria-label="Scroll categories"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-indigo-950"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full border-2 border-yellow-400 bg-white px-4 py-2.5 shadow-sm focus-within:border-yellow-500">
          <Search size={18} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Chicken Biryani, Pulao, Kheer..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500"
            >
              <X size={14} />
            </button>
          ) : (
            <button
              aria-label="Submit search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="space-y-8 px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 size={36} className="animate-spin text-yellow-500 mb-3" />
            <p className="text-sm font-bold text-gray-600">Loading fresh menu from server...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p className="font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* SEARCH RESULTS MODE */}
            {searchResults ? (
              <section>
                <h2 className="mb-3 text-lg font-extrabold">
                  Results for "{query}" ({searchResults.length})
                </h2>
                {searchResults.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="text-sm text-gray-500">
                      No dishes found matching "{query}".
                    </p>
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
                {/* Popular items section — shown when on Biryani tab */}
                {activeTab === "biryani" && popularItems.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔥</span>
                      <h2 className="text-xl font-extrabold">Popular Items</h2>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Most ordered Karachi favorites
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
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

                {/* Category section */}
                <section>
                  <SectionBanner
                    text={
                      CATEGORY_BANNER_TEXT[activeTab] ||
                      activeCategoryObj?.banner?.text ||
                      "MENU"
                    }
                    images={categoryItems.slice(0, 2).map((i) => getProductImage(i.id))}
                  />
                  <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
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

        {/* SEO / Brand story */}
        <section className="rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100/60 p-5 border border-yellow-200">
          <h2 className="text-lg font-black leading-snug text-indigo-950">
            Savor the Best Biryani in Karachi – Direct Online Ordering from Al Rehman Biryani
          </h2>
          {showMore && (
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              For generations, Al Rehman Biryani has served Kharadar and all of
              Karachi with slow-cooked daig-style biryani, made fresh daily with
              premium basmati rice, tender meats, and signature aromatic spices.
              We offer instant delivery without advance payment everywhere in Karachi!
            </p>
          )}
          <button
            onClick={() => setShowMore((s) => !s)}
            className="mt-3 flex items-center gap-1 text-xs font-extrabold text-indigo-950 hover:underline"
          >
            {showMore ? "Show Less" : "Show More"}
            {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white px-4 py-8 border-t border-gray-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-yellow-400 bg-yellow-50 text-[10px] font-black text-indigo-950">
          A.R
        </div>
        <h3 className="mt-3 text-lg font-extrabold text-indigo-950">Al Rehman Biryani</h3>
        <div className="mt-3 space-y-1.5 text-xs text-gray-600">
          <p>
            <span className="font-bold text-indigo-950">Phone: </span>
            0314 2961604
          </p>
          <p>
            <span className="font-bold text-indigo-950">Email: </span>
            rehmanbiryani@gmail.com
          </p>
          <p>
            <span className="font-bold text-indigo-950">Address: </span>
            Gk-7/73, Hajra Manzil, Nakhuda Street, Kharadar, Karachi
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:opacity-90"
          >
            <Facebook size={18} />
          </a>
        </div>
        <p className="mt-6 text-[11px] text-gray-400">
          © 2026 Al Rehman Biryani. Connected with REST API & Express backend.
        </p>
      </footer>

      {/* Floating mobile action buttons */}
      <button
        onClick={() => setMobileSearchOpen((s) => !s)}
        aria-label="Toggle search"
        className="fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-xl border-2 border-white hover:bg-yellow-300"
      >
        <Search size={20} />
      </button>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-indigo-950 shadow-xl border-2 border-white hover:bg-yellow-300"
      >
        <ChevronUp size={20} />
      </button>

      {/* Mobile search popover */}
      {mobileSearchOpen && (
        <div className="fixed bottom-20 left-5 z-30 w-72 rounded-2xl bg-white p-3 shadow-2xl border border-gray-100">
          <div className="flex items-center gap-2 rounded-full border border-yellow-400 px-3 py-2 bg-gray-50">
            <Search size={16} className="text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      /* VARIANT SELECTION MODAL */
      {/* --------------------------------------------------------------------- */}
      {selectedProductForVariant && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-indigo-950">
                  {selectedProductForVariant.name}
                </h3>
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

      {/* --------------------------------------------------------------------- */}
      /* SHOPPING CART DRAWER */
      {/* --------------------------------------------------------------------- */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-yellow-400 px-5 py-4 text-indigo-950">
              <div className="flex items-center gap-2">
                <ShoppingCart size={22} />
                <h2 className="text-lg font-black">Your Order ({cartCount})</h2>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-indigo-950 shadow-xs"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingCart size={48} className="text-gray-300 mb-2" />
                  <p className="text-base font-extrabold text-indigo-950">Your cart is empty</p>
                  <p className="text-xs text-gray-500 mt-1">Add some delicious Biryani to get started!</p>
                </div>
              ) : (
                <>
                  {/* Delivery Progress Bar */}
                  {cartSummary && (
                    <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs">
                      {cartSummary.subtotal >= cartSummary.freeDeliveryThreshold ? (
                        <p className="font-bold text-green-700 flex items-center gap-1">
                          <CheckCircle2 size={16} /> 🎉 You qualify for FREE Karachi Delivery!
                        </p>
                      ) : (
                        <p className="font-semibold text-amber-900">
                          Add <span className="font-extrabold">Rs. {cartSummary.freeDeliveryThreshold - cartSummary.subtotal}</span> more for FREE Delivery!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Calculated Line Items */}
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

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(lineItem.id, lineItem.variant, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-indigo-950 shadow-xs"
                        >
                          {lineItem.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold">
                          {lineItem.quantity}
                        </span>
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

            {/* Cart Footer / Summary */}
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
                      {cartSummary.deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `Rs. ${cartSummary.deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-indigo-950 pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-amber-700">Rs. {cartSummary.total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-indigo-950 shadow-lg hover:bg-yellow-300 transition-all active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      /* CHECKOUT & WHATSAPP MODAL */
      {/* --------------------------------------------------------------------- */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            {orderSuccessData ? (
              /* ORDER SUCCESS SCREEN */
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-indigo-950">Order Sent to WhatsApp!</h3>
                <p className="text-xs text-gray-600">
                  Your order details have been calculated by the backend API and sent directly to Al Rehman Biryani WhatsApp.
                </p>

                <div className="rounded-2xl bg-gray-50 p-4 text-left border border-gray-100 text-xs space-y-2">
                  <p className="font-extrabold text-indigo-950">Order Summary:</p>
                  <p><span className="text-gray-500">Name:</span> {customerName}</p>
                  <p><span className="text-gray-500">Phone:</span> {customerPhone}</p>
                  <p><span className="text-gray-500">Address:</span> {customerAddress}</p>
                  <p className="font-black text-amber-700 pt-2 border-t border-gray-200">
                    Total: Rs. {orderSuccessData.summary.total}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={orderSuccessData.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-sm font-extrabold text-white shadow-md hover:bg-green-700"
                  >
                    <MessageSquare size={18} />
                    <span>Open WhatsApp Chat</span>
                  </a>

                  <button
                    onClick={handleFinishOrder}
                    className="w-full rounded-2xl bg-gray-100 py-3 text-xs font-bold text-gray-700 hover:bg-gray-200"
                  >
                    Close & Clear Order
                  </button>
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM */
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-black text-indigo-950">Complete Delivery Details</h3>
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-indigo-950 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ali Ahmed"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-indigo-950 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 03001234567"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-indigo-950 mb-1">
                      Delivery Address in Karachi *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House/Flat No, Street, Area, Karachi"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 resize-none"
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
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-indigo-950 shadow-md hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending to WhatsApp...</span>
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
