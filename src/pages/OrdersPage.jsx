/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { API } from "../config/api";
import {
  Package,
  FileText,
  CheckCircle,
  ChefHat,
  Bike,
  UtensilsCrossed,
  RefreshCw,
  Star,
  ArrowRight,
} from "lucide-react";

const OrdersPage = () => {
  const { isLoggedIn, user, foodData, updateQuantity } =
    useContext(GlobalStateContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch(API.orders(user.user_id));
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/orders" } } });
      return;
    }
    fetchOrders();
    const id = setInterval(fetchOrders, 5000);
    return () => clearInterval(id);
  }, [fetchOrders, isLoggedIn, navigate]);

  const handleReorder = async (order) => {
    for (const orderItem of order.items) {
      const foodItem = foodData.find((f) => f.FoodName === orderItem.name);
      if (foodItem) await updateQuantity(foodItem.FoodID, orderItem.quantity);
    }
    navigate("/cart");
  };

  const statusConfig = {
    placed: {
      label: "Placed",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: <FileText size={12} />,
    },
    confirmed: {
      label: "Confirmed",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <CheckCircle size={12} />,
    },
    preparing: {
      label: "Preparing",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: <ChefHat size={12} />,
    },
    "out-for-delivery": {
      label: "Out for Delivery",
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: <Bike size={12} />,
    },
    delivered: {
      label: "Delivered",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: <UtensilsCrossed size={12} />,
    },
  };

  const getStatus = (s) =>
    statusConfig[s] || {
      label: s || "Pending",
      color: "text-muted",
      bg: "bg-surface",
      border: "border-border",
      icon: <Package size={12} />,
    };

  if (!isLoggedIn) return null;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12 font-sans min-h-screen">
      <div className="mb-10">
        <p className="text-xs font-semibold text-brand uppercase tracking-[0.15em] mb-2">
          History
        </p>
        <h1 className="font-display text-4xl font-bold text-ink">Orders</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-muted">
          <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Fetching orders...</span>
        </div>
      ) : !orders.length ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-5">
            <Package size={24} className="text-subtle" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink mb-2">
            No orders yet
          </h3>
          <p className="text-muted text-sm mb-6">
            Hungry? Order something delicious from our menu.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg hover:bg-brand transition-colors flex items-center gap-2 mx-auto"
          >
            Browse Menu <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = getStatus(order.order_status);
            return (
              <div
                key={order.order_id}
                className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-subtle uppercase tracking-widest">
                      Order #{order.order_id}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-xs text-subtle">
                      {new Date(order.order_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${s.bg} ${s.color} ${s.border}`}
                  >
                    {s.icon} {s.label}
                  </span>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-2">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 text-ink">
                        <span className="text-brand font-bold text-xs">
                          {item.quantity}×
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-muted">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-surface border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-subtle bg-white border border-border px-3 py-1.5 rounded-lg">
                      {order.payment_method === "COD"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-subtle">Total </span>
                      <span className="text-sm font-bold text-ink">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-ink text-ink rounded-lg text-xs font-semibold hover:bg-ink hover:text-white transition-colors"
                    >
                      <RefreshCw size={12} /> Reorder
                    </button>
                    {order.order_status === "delivered" && (
                      <button className="flex items-center gap-1.5 px-4 py-2 border border-border text-muted rounded-lg text-xs font-semibold hover:border-brand hover:text-brand transition-colors">
                        <Star size={12} /> Rate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
