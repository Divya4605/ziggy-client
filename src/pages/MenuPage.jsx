import ItemsGrid from "../components/features/ItemsGrid";

const MenuPage = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Minimal Editorial Header */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <p className="text-xs font-semibold text-brand uppercase tracking-[0.15em] mb-3">
            Our Menu
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
            What would you like today?
          </h1>
          <p className="text-muted text-base mt-3 max-w-[480px] leading-relaxed">
            Freshly prepared dishes from the best local kitchens. Filter,
            search, and add to cart instantly.
          </p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <ItemsGrid />
      </div>
    </div>
  );
};

export default MenuPage;
