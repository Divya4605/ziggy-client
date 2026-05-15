import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { Search, X, Leaf } from "lucide-react";
import FoodCard from "../ui/FoodCard";

const ItemsPage = () => {
  const { foodData, updateQuantity } = useContext(GlobalStateContext);
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || "All",
  );
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(location.state?.search || "");
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    if (location.state) {
      setSelectedCategory(location.state.category || "All");
      setSearchQuery(location.state.search || "");
    }
  }, [location.state]);

  useEffect(() => {
    if (foodData.length > 0) {
      const uniqueCategories = [
        "All",
        ...new Set(foodData.map((item) => item.Category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [foodData]);

  let filteredItems = foodData;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.FoodName.toLowerCase().includes(q) ||
        (item.Category && item.Category.toLowerCase().includes(q)) ||
        (item.Description && item.Description.toLowerCase().includes(q)),
    );
  }

  if (selectedCategory !== "All") {
    filteredItems = filteredItems.filter(
      (item) => item.Category === selectedCategory,
    );
  }

  if (vegOnly) {
    const nonVegKeywords = [
      "chicken",
      "mutton",
      "fish",
      "prawn",
      "egg",
      "meat",
      "beef",
      "pork",
    ];
    filteredItems = filteredItems.filter((item) => {
      const text = (
        item.FoodName +
        " " +
        (item.Description || "") +
        " " +
        item.Category
      ).toLowerCase();
      return !nonVegKeywords.some((kw) => text.includes(kw));
    });
  }

  const handleQuantityChange = async (item, delta) => {
    await updateQuantity(item.FoodID, delta);
  };

  return (
    <div id="items">
      {/* Filters Row */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                selectedCategory === category
                  ? "bg-ink text-white"
                  : "bg-surface text-muted hover:bg-border hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search + Veg Toggle Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
            />
            <input
              type="text"
              placeholder="Search for a dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg py-2.5 pl-10 pr-10 text-sm font-medium text-ink outline-none focus:border-brand/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,38,9,0.08)] transition-all placeholder:text-subtle"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle hover:text-ink transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all shrink-0 ${
              vegOnly
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-surface border-border text-muted hover:border-[#d4d4d0]"
            }`}
          >
            <Leaf
              size={14}
              className={vegOnly ? "text-green-600" : "text-subtle"}
            />
            Veg Only
            <div
              className={`w-8 h-4 rounded-full transition-colors relative ${vegOnly ? "bg-green-500" : "bg-[#d4d4d0]"}`}
            >
              <div
                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${vegOnly ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-5">
            <Search size={24} className="text-subtle" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink mb-2">
            No dishes found
          </h3>
          <p className="text-muted text-sm mb-6">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setVegOnly(false);
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg hover:bg-brand transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.FoodID}
              item={item}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
