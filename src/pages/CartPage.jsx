/* eslint-disable no-undef */
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { API, RAZORPAY_KEY } from "../config/api";
import {
  ShoppingCart,
  Banknote,
  CreditCard,
  X,
  ArrowRight,
  Loader2,
  Shield,
  Minus,
} from "lucide-react";

const CartPage = () => {
  const { isLoggedIn, user, foodData, updateQuantity } =
    useContext(GlobalStateContext);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const itemsInCart = foodData.filter((item) => item.Quantity > 0);
    setCartItems(itemsInCart);
    const totalPrice = itemsInCart.reduce(
      (sum, item) => sum + parseFloat(item.Price) * item.Quantity,
      0,
    );
    setTotal(totalPrice);
  }, [foodData]);

  useEffect(() => {
    if (window.location.hash === "#payment-modal" && isLoggedIn)
      setShowPaymentModal(true);
  }, [isLoggedIn]);

  const handleIncreaseQuantity = async (item) =>
    await updateQuantity(item.FoodID, 1);
  const handleDecreaseQuantity = async (item) => {
    if (item.Quantity > 1) await updateQuantity(item.FoodID, -1);
    else await handleRemoveItem(item);
  };
  const handleRemoveItem = async (item) =>
    await updateQuantity(item.FoodID, -item.Quantity);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    setShowPaymentModal(true);
    window.location.hash = "payment-modal";
  };

  const handleCOD = async () => {
    setShowPaymentModal(false);
    window.location.hash = "";
    setLoading(true);
    try {
      const res = await fetch(API.createOrder, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.user_id,
          amount: total,
          items: cartItems,
          paymentMethod: "COD",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderMessage("Order placed! Your food will be delivered soon.");
        setShowOrderPopup(true);
        for (const item of cartItems)
          await updateQuantity(item.FoodID, -item.Quantity);
        setTimeout(() => setShowOrderPopup(false), 3000);
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleUPI = async () => {
    setShowPaymentModal(false);
    window.location.hash = "";
    setLoading(true);
    try {
      const res = await fetch(API.createOrder, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.user_id,
          amount: total,
          items: cartItems,
          paymentMethod: "UPI",
        }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to create order");
      if (!window.Razorpay) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = res;
          s.onerror = rej;
          document.body.appendChild(s);
        });
      }
      const options = {
        key: RAZORPAY_KEY,
        amount: total * 100,
        currency: "INR",
        name: "Ziggy",
        description: "Food Order Payment",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          const vRes = await fetch(API.verifyPayment, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderId: data.orderId }),
          });
          const vData = await vRes.json();
          if (vData.success) {
            setOrderMessage("Payment successful! Order placed.");
            setShowOrderPopup(true);
            for (const item of cartItems)
              await updateQuantity(item.FoodID, -item.Quantity);
            setTimeout(() => setShowOrderPopup(false), 3000);
            navigate("/orders");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "var(--color-brand)" },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => {
        alert(`Payment failed: ${r.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans min-h-screen relative overflow-x-hidden">
      {/* Toast */}
      {showOrderPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-2000 bg-ink text-white px-6 py-3.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          {orderMessage}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center p-4"
          id="payment-modal"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              setShowPaymentModal(false);
              window.location.hash = "";
            }}
          />
          <div className="relative w-full max-w-[400px] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Select Payment
                </h3>
                <p className="text-xs text-subtle mt-0.5">
                  Total: ₹{total.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  window.location.hash = "";
                }}
                className="p-1.5 rounded-lg hover:bg-surface transition-colors text-subtle"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <button
                className="w-full py-4 px-5 bg-surface hover:bg-border border border-border rounded-xl flex items-center gap-4 transition-all duration-150 disabled:opacity-50"
                onClick={handleCOD}
                disabled={loading}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <Banknote size={18} className="text-ink" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-ink text-sm">
                    Cash on Delivery
                  </div>
                  <div className="text-xs text-subtle mt-0.5">
                    Pay when your order arrives
                  </div>
                </div>
              </button>
              <button
                className="w-full py-4 px-5 bg-surface hover:bg-border border border-border rounded-xl flex items-center gap-4 transition-all duration-150 disabled:opacity-50"
                onClick={handleUPI}
                disabled={loading}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <CreditCard size={18} className="text-ink" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-ink text-sm">
                    UPI / Card / NetBanking
                  </div>
                  <div className="text-xs text-subtle mt-0.5">
                    Instant secure payment via Razorpay
                  </div>
                </div>
              </button>
            </div>
            <div className="px-6 pb-4 flex items-center justify-center gap-1.5 text-subtle text-xs">
              <Shield size={11} /> Secured by Razorpay
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 sm:mb-12">
        <p className="text-[10px] sm:text-xs font-bold text-brand uppercase tracking-[0.2em] mb-2">
          Your Order
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink">
          Cart
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-5">
            <ShoppingCart size={24} className="text-subtle" />
          </div>
          <h3 className="font-display text-xl font-bold text-ink mb-2">
            Your cart is empty
          </h3>
          <p className="text-muted text-sm mb-6">
            Add some dishes from our menu to get started.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg hover:bg-brand transition-colors flex items-center gap-2 mx-auto"
          >
            Browse Menu <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.FoodID}
                className="bg-white border border-border rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow w-full"
              >
                <img
                  src={item.ImageName}
                  alt={item.FoodName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-surface shrink-0 border border-border"
                />
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-sm sm:text-base font-semibold text-ink truncate">
                    {item.FoodName}
                  </h3>
                  <p className="text-sm font-bold text-brand mt-0.5">
                    ₹{parseFloat(item.Price).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 shrink-0">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
                    <button
                      className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors"
                      onClick={() => handleDecreaseQuantity(item)}
                    >
                      <Minus size={12} className="text-ink" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-ink">
                      {item.Quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <span className="text-base font-bold text-ink leading-none">
                        +
                      </span>
                    </button>
                  </div>
                  <div className="text-right shrink-0 min-w-[72px] hidden sm:block">
                    <p className="text-[10px] text-subtle font-bold uppercase tracking-widest">
                      Subtotal
                    </p>
                    <p className="text-sm font-bold text-ink">
                      ₹{(parseFloat(item.Price) * item.Quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  className="p-1.5 text-[#d4d4d0] hover:text-red-500 transition-colors"
                  onClick={() => handleRemoveItem(item)}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-6 sticky top-24">
              <h3 className="font-display text-base font-bold text-ink mb-6">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-display text-xl font-bold text-ink">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                id="checkout-btn"
                className="w-full mt-6 py-3 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-[#9a2008] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Checkout <ArrowRight size={14} />
                  </>
                )}
              </button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-subtle text-[11px]">
                <Shield size={11} /> Secured by Razorpay
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
