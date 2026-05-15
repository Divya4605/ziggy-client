import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "./GlobalStateContext";
import { API } from "../config/api";

// eslint-disable-next-line react/prop-types
export const GlobalStateProvider = ({ children }) => {
  const [Quantity, setQuantity] = useState(0);
  const [Togg, setTogg] = useState(false);
  const [displayCart, setDisplayCart] = useState(false);

  // Initialize from localStorage directly to avoid race conditions on mount
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("sessionId", sid);
    }
    return sid;
  });

  const [foodData, setFoodData] = useState([]);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [toastUser, setToastUser] = useState(null);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [logoutToastUser, setLogoutToastUser] = useState(null);
  const navigate = useNavigate();

  // ── Derive cart totals from foodData instead of maintaining separate state ──
  const syncCartState = useCallback(
    (data = isLoggedIn) => {
      if (!Array.isArray(data) || data.length === 0) return;

      const total = data.reduce((sum, item) => sum + (item.Quantity || 0), 0);
      setQuantity(total);
      setDisplayCart(total > 0);

      // Persist cart to localStorage for BOTH guest and logged-in users
      // This ensures that even if the server returns a static menu on refresh,
      // we can restore the user's active session cart.
      const cartToSave = data
        .filter((item) => (item.Quantity || 0) > 0)
        .map((item) => ({ food_id: item.FoodID, quantity: item.Quantity }));

      localStorage.setItem("persistentCart", JSON.stringify(cartToSave));
    },
    [isLoggedIn],
  );

  // ── Fetch food items once on mount ──────────────────────────────────────────
  const fetchFoodData = useCallback(
    async (loggedInState = isLoggedIn) => {
      try {
        const res = await fetch(API.food, {
          credentials: "include",
        });
        const data = await res.json();

        if (!Array.isArray(data)) return;

        let finalData = data;

        // Restore from local cache regardless of login status
        const savedCartStr = localStorage.getItem("persistentCart");
        if (savedCartStr) {
          const savedCart = JSON.parse(savedCartStr);

          finalData = data.map((item) => {
            const savedItem = savedCart.find(
              (g) => String(g.food_id) === String(item.FoodID),
            );

            // If the server returns 0 (static menu), use our local persistent cart
            if (savedItem && (item.Quantity || 0) === 0) {
              return { ...item, Quantity: savedItem.quantity };
            }
            return item;
          });
        }

        setFoodData(finalData);
        syncCartState(finalData, loggedInState);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    },
    [isLoggedIn, syncCartState],
  );

  // ── Session ID + user restore + initial data fetch (runs once) ─────────────
  useEffect(() => {
    setLoading(false);
    fetchFoodData(); // Uses the correctly initialized isLoggedIn state
  }, [fetchFoodData]);

  // ── Update quantity — optimistic local update, one API call ─────────────────
  const updateQuantity = useCallback(
    async (foodId, delta) => {
      // 1. Optimistically update local state so UI responds instantly
      setFoodData((prev) => {
        const updated = prev.map((item) => {
          if (item.FoodID !== foodId) return item;
          return {
            ...item,
            Quantity: Math.max(0, (item.Quantity || 0) + delta),
          };
        });
        syncCartState(updated);
        return updated;
      });

      // 2. Persist to backend
      try {
        let response;

        if (isLoggedIn && user) {
          response = await fetch(API.updateQuantity(foodId), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ quantity: delta }),
            },
          );
        } else {
          const currentItem = foodData.find((item) => item.FoodID === foodId);
          const currentQty = currentItem?.Quantity || 0;
          const newQuantity = Math.max(0, currentQty + delta);

          response = await fetch(API.sessionCart, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ sessionId, foodId, quantity: newQuantity }),
          });
        }

        if (!response.ok) fetchFoodData();
      } catch (error) {
        console.error("Error updating quantity:", error);
        fetchFoodData();
      }
    },
    [isLoggedIn, user, sessionId, foodData, syncCartState, fetchFoodData],
  );

  // ── Clear cart ──────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    try {
      if (isLoggedIn && user) {
        const itemsInCart = foodData.filter((item) => item.Quantity > 0);
        for (const item of itemsInCart) {
          await fetch(API.updateQuantity(item.FoodID), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ quantity: -item.Quantity }),
          });
        }
      } else {
        await fetch(API.clearSessionCart(sessionId), {
          method: "DELETE",
          credentials: "include",
        });
        localStorage.removeItem("persistentCart");
      }

      setFoodData((prev) => prev.map((item) => ({ ...item, Quantity: 0 })));
      setQuantity(0);
      setDisplayCart(false);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }, [isLoggedIn, user, sessionId, foodData]);

  // ── Transfer guest session cart → logged-in user ────────────────────────────
  const transferSessionCartToUser = useCallback(async () => {
    try {
      const savedCartStr = localStorage.getItem("persistentCart");
      if (savedCartStr) {
        const savedCart = JSON.parse(savedCartStr);

        // Use Promise.all to ensure all updates are sent before moving on
        await Promise.all(
          savedCart.map((item) => {
            if (item.quantity > 0) {
              return fetch(API.updateQuantity(item.food_id), {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ quantity: item.quantity }),
                },
              );
            }
            return Promise.resolve();
          }),
        );

        // We keep the guestCart in localStorage until fetchFoodData runs
        // to handle potential backend lag
      }

      await fetch(API.clearSessionCart(sessionId), {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error transferring cart:", error);
    }
  }, [sessionId]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (userData) => {
      setToastUser(userData);
      setShowLoginToast(true);

      // Set authentication state IMMEDIATELY so headers/context are correct
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");

      // Transfer items
      await transferSessionCartToUser();

      // Now fetch and finally clear the guest storage (if needed, but persistentCart handles it)
      await fetchFoodData(true);
    },
    [transferSessionCartToUser, fetchFoodData],
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (!user) return;

    // Capture name and trigger toast immediately
    const departingName = user.name;
    setLogoutToastUser({ name: departingName });
    setShowLogoutToast(true);

    // Run cleanup in background or before navigation
    await clearCart();
    localStorage.removeItem("persistentCart");

    try {
      await fetch(API.logout(user.user_id), {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    setIsLoggedIn(false);

    navigate("/");
  }, [user, clearCart, navigate]);

  const value = {
    Quantity,
    setQuantity,
    Togg,
    setTogg,
    displayCart,
    setDisplayCart,
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    loading,
    sessionId,
    logout,
    login,
    updateQuantity,
    foodData,
    fetchFoodData,
    showLoginToast,
    setShowLoginToast,
    toastUser,
    showLogoutToast,
    setShowLogoutToast,
    logoutToastUser,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};
