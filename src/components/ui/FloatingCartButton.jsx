import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { GlobalStateContext } from "../../context/GlobalStateContext";

const FloatingCartButton = () => {
  const { foodData } = useContext(GlobalStateContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = foodData
    ? foodData.reduce((total, item) => total + (item.Quantity || 0), 0)
    : 0;

  const cartTotal = foodData
    ? foodData.reduce(
        (total, item) => total + (item.Quantity || 0) * (item.Price || 0),
        0,
      )
    : 0;

  if (
    cartItemCount === 0 ||
    location.pathname === "/cart" ||
    location.pathname === "/login"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-2000 w-full max-w-[420px] px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => navigate("/cart")}
        className="w-full bg-brand hover:bg-ink text-white p-4 rounded-2xl shadow-[0_12px_40px_rgba(184,38,9,0.25)] flex items-center justify-between transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">
              {cartItemCount} {cartItemCount === 1 ? "Item" : "Items"}
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              View Cart
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">₹{cartTotal}</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ArrowRight size={18} className="text-white" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default FloatingCartButton;
