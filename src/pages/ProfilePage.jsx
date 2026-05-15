/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { API } from "../config/api";
import {
  User,
  Mail,
  Phone,
  Shield,
  Mic,
  Package,
  FileText,
  CheckCircle,
  ChefHat,
  Bike,
  UtensilsCrossed,
  LogOut,
  ArrowRight,
} from "lucide-react";

const ProfilePage = () => {
  const { isLoggedIn, user, logout } = useContext(GlobalStateContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    try {
      const res = await fetch(API.orders(user.user_id));
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      console.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
      return;
    }
    fetchUserOrders();
  }, [fetchUserOrders, isLoggedIn, navigate]);

  const statusConfig = {
    placed: {
      label: "Placed",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: <FileText size={11} />,
    },
    confirmed: {
      label: "Confirmed",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <CheckCircle size={11} />,
    },
    preparing: {
      label: "Preparing",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: <ChefHat size={11} />,
    },
    "out-for-delivery": {
      label: "Out for Delivery",
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: <Bike size={11} />,
    },
    delivered: {
      label: "Delivered",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: <UtensilsCrossed size={11} />,
    },
  };

  const getStatus = (s) =>
    statusConfig[s] || {
      label: s || "Pending",
      color: "text-muted",
      bg: "bg-surface",
      border: "border-border",
      icon: <Package size={11} />,
    };

  if (!isLoggedIn) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 font-sans min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-10 border-b border-border">
        <div className="w-16 h-16 rounded-xl bg-ink text-white text-xl font-bold flex items-center justify-center shrink-0 select-none">
          {initials}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="font-display text-2xl font-bold text-ink">
            {user?.name}
          </h1>
          <p className="text-muted text-sm mt-0.5">{user?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            <span className="text-[10px] font-semibold text-subtle bg-surface border border-border px-2.5 py-1 rounded uppercase tracking-wider">
              Member since 2026
            </span>
            <span className="text-[10px] font-semibold text-subtle bg-surface border border-border px-2.5 py-1 rounded uppercase tracking-wider">
              {orders.length} orders
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {["profile", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "text-ink border-ink"
                : "text-subtle border-transparent hover:text-muted"
            }`}
          >
            {tab === "profile" ? "Account" : "Orders"}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Full Name",
                value: user?.name,
                icon: <User size={14} />,
              },
              {
                label: "Email Address",
                value: user?.email,
                icon: <Mail size={14} />,
              },
              {
                label: "Phone",
                value: "Not provided",
                icon: <Phone size={14} />,
              },
              {
                label: "Account Type",
                value: "Customer (Voice Enabled)",
                icon: <Shield size={14} />,
              },
            ].map((info, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-subtle">
                  {info.icon}
                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    {info.label}
                  </label>
                </div>
                <p className="text-sm font-semibold text-ink truncate">
                  {info.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <Mic size={16} className="text-brand" />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Voice Assistant
                </p>
                <p className="text-xs text-muted">
                  Hands-free ordering is active
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">
                Active
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted">
              <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-xl">
              <Package size={24} className="text-subtle mx-auto mb-3" />
              <p className="text-muted text-sm mb-4">No orders yet</p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-ink text-white text-xs font-semibold rounded-lg hover:bg-brand transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => {
                const s = getStatus(order.order_status);
                return (
                  <div
                    key={order.order_id}
                    className="border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">
                          #{order.order_id}
                        </span>
                        <span className="text-xs text-subtle">
                          {new Date(order.order_date).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[10px] font-semibold ${s.bg} ${s.color} ${s.border}`}
                      >
                        {s.icon} {s.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-bold text-ink">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
