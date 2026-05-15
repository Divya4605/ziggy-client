/* eslint-disable react/prop-types */
import { Plus, Minus } from "lucide-react";

const FoodCard = ({ item, onQuantityChange }) => {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      <div className="aspect-4/3 overflow-hidden bg-surface">
        <img
          src={item.ImageName}
          alt={item.FoodName}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300/f5f5f4/a8a29e?text=No+Image";
          }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-ink leading-snug">
            {item.FoodName}
          </h3>
          <span className="shrink-0 text-[10px] font-semibold text-subtle bg-surface px-2 py-0.5 rounded uppercase tracking-wide">
            {item.Category}
          </span>
        </div>

        <p className="text-sm font-bold text-brand mb-2">
          ₹{parseFloat(item.Price).toFixed(2)}
        </p>

        <p className="text-xs text-muted line-clamp-2 leading-relaxed flex-1 mb-4">
          {item.Description}
        </p>

        <div className="mt-auto">
          {item.Quantity > 0 ? (
            <div className="flex items-center justify-between border border-border rounded-lg overflow-hidden">
              <button
                className="w-10 h-9 flex items-center justify-center text-ink hover:bg-surface transition-colors active:scale-90"
                onClick={() => onQuantityChange(item, -1)}
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-ink">
                {item.Quantity}
              </span>
              <button
                className="w-10 h-9 flex items-center justify-center text-ink hover:bg-surface transition-colors active:scale-90"
                onClick={() => onQuantityChange(item, 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="w-full h-9 bg-ink text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand transition-colors"
              onClick={() => onQuantityChange(item, 1)}
            >
              <Plus size={13} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
