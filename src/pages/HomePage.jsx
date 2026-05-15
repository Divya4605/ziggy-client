import { useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import {
  Mic,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Star,
  UtensilsCrossed,
  Zap,
  Brain,
  Volume2,
  Leaf,
} from "lucide-react";
import FoodCard from "../components/ui/FoodCard";

const CATEGORIES = [
  { icon: <UtensilsCrossed size={22} />, name: "Pizza" },
  { icon: <Zap size={22} />, name: "Burger" },
  { icon: <Leaf size={22} />, name: "Healthy" },
  { icon: <Star size={22} />, name: "Indian" },
  { icon: <TrendingUp size={22} />, name: "Sushi" },
  { icon: <Brain size={22} />, name: "Dessert" },
];

const HomePage = () => {
  const { foodData, updateQuantity, setTogg } = useContext(GlobalStateContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const TRENDING = useMemo(() => {
    if (!foodData || foodData.length === 0) return [];

    const uniqueCategories = new Set();
    const trendingItems = [];

    for (const item of foodData) {
      if (!uniqueCategories.has(item.Category)) {
        uniqueCategories.add(item.Category);
        trendingItems.push(item);
      }
      if (trendingItems.length === 4) break;
    }

    if (trendingItems.length < 4) {
      for (const item of foodData) {
        if (!trendingItems.some((t) => t.FoodID === item.FoodID)) {
          trendingItems.push(item);
          if (trendingItems.length === 4) break;
        }
      }
    }

    return trendingItems;
  }, [foodData]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchValue.trim()) {
        navigate("/menu", { state: { search: searchValue } });
      }
    }
  };

  const handleCategoryClick = (category) => {
    navigate("/menu", { state: { category: category } });
  };

  return (
    <div className="w-full bg-white font-sans">
      {/* ── HERO ── */}
      <section className="w-full min-h-[88vh] flex flex-col justify-center items-center border-b border-border relative px-6">
        <div className="max-w-[740px] w-full text-center">
          <p className="text-xs font-semibold text-brand uppercase tracking-[0.15em] mb-5">
            Voice-Powered Food Delivery
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.05] tracking-tight mb-8">
            Discover the best
            <br />
            food in <span className="text-brand">your city</span>
          </h1>

          {/* Search bar */}
          <div className="w-full max-w-[680px] mx-auto bg-white border border-border rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-2 flex items-center gap-2 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:border-[#d4d4d0] transition-all">
            <div className="hidden sm:flex items-center gap-2 px-3 border-r border-border shrink-0">
              <div className="w-2 h-2 rounded-full bg-brand" />
              <span className="text-sm font-medium text-muted whitespace-nowrap">
                Current Location
              </span>
            </div>
            <input
              type="text"
              placeholder="Search for restaurants, cuisine or a dish..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-ink placeholder:text-subtle px-3 py-2"
            />
            <button
              onClick={() => setTogg(true)}
              className="h-10 w-10 shrink-0 rounded-lg bg-brand flex items-center justify-center text-white hover:bg-[#9a2008] transition-colors"
              title="Order with your voice"
            >
              <Mic size={16} />
            </button>
          </div>

          {/* Trending quick-links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-subtle text-xs font-semibold uppercase tracking-widest">
              Trending:
            </span>
            {TRENDING.map((item) => (
              <div
                key={item.FoodID}
                onClick={() => handleCategoryClick(item.Category)}
                className="cursor-pointer"
              >
                {" "}
                {/* Added cursor-pointer */}
                <span className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:border-brand hover:text-brand bg-white transition-colors">
                  {item.Category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { n: "500+", l: "Restaurants", icon: <TrendingUp size={14} /> },
              { n: "20 min", l: "Delivery", icon: <Clock size={14} /> },
              { n: "50k+", l: "Customers", icon: <Users size={14} /> },
              { n: "4.8", l: "Rating", icon: <Star size={14} /> },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4">
                <span className="text-subtle">{s.icon}</span>
                <div>
                  <p className="font-display text-xl font-bold text-ink">
                    {s.n}
                  </p>
                  <p className="text-[10px] font-semibold text-subtle uppercase tracking-widest">
                    {s.l}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING SECTION ── */}
      <section className="max-w-[1300px] mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs font-semibold text-brand uppercase tracking-[0.15em] mb-2">
              Trending
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
              Popular in your city
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink transition-colors"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRENDING.map((item) => (
            <FoodCard
              key={item.FoodID}
              item={item}
              onQuantityChange={(item, delta) => updateQuantity(item.FoodID, delta)}
            />
          ))}
        </div>

        <Link to="/menu" className="md:hidden mt-6 block">
          <button className="w-full py-3 border border-border rounded-xl text-sm font-semibold text-ink hover:bg-surface transition-colors flex items-center justify-center gap-2">
            See Full Menu <ArrowRight size={14} />
          </button>
        </Link>
      </section>

      {/* ── CATEGORIES SECTION ── */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-[1300px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
              What are you craving?
            </h2>
            <p className="text-muted text-sm max-w-[380px] mx-auto">
              Browse by category and find exactly what you&apos;re looking for.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <div onClick={() => handleCategoryClick(cat.name)} key={cat.name}>
                <div className="bg-white border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:border-brand/40 hover:shadow-[0_4px_16px_rgba(184,38,9,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-muted group-hover:text-brand group-hover:bg-[#fef2f2] transition-colors border border-border">
                    {cat.icon}
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOICE USP SECTION ── */}
      <section className="max-w-[1300px] mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dark Card */}
          <div className="bg-ink rounded-2xl p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mb-8">
                <Mic size={20} className="text-white" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">
                Just say the word.
                <br />
                We&apos;ll do the rest.
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-[380px]">
                Our AI voice assistant &quot;Ziggy&quot; understands natural
                language. Say &quot;I want a large pepperoni pizza&quot; and
                it&apos;s done.
              </p>
              <Link to="/menu">
                <button className="flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-[#9a2008] transition-colors">
                  Try the Menu <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {[
              {
                step: "01",
                icon: <Mic size={16} />,
                title: "Tap the Mic",
                desc: "Find the floating microphone icon visible on every page of the app.",
              },
              {
                step: "02",
                icon: <Brain size={16} />,
                title: "Speak Naturally",
                desc: '"I\'m craving spicy noodles and a cold coke" — just like talking to a friend.',
              },
              {
                step: "03",
                icon: <Volume2 size={16} />,
                title: "Confirm & Relax",
                desc: "Ziggy builds your cart instantly. Confirm and track your order in real-time.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-xl border border-border bg-white flex items-center justify-center text-brand font-display font-bold text-sm shrink-0 group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-200">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold text-ink mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
