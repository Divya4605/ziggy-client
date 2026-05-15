import { useContext, useEffect, Suspense, lazy } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingCartButton from "../ui/FloatingCartButton";
import Toast from "../ui/Toast";

// Lazy-loaded features
const VoiceAssistant = lazy(() => import("../features/VoiceAssistant"));

const RootLayout = () => {
  const {
    showLoginToast,
    setShowLoginToast,
    toastUser,
    showLogoutToast,
    setShowLogoutToast,
    logoutToastUser,
  } = useContext(GlobalStateContext);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

      <main className="grow">
        <Outlet />
      </main>

      {!isAuthPage && (
        <Suspense fallback={null}>
          <VoiceAssistant />
        </Suspense>
      )}

      {!isAuthPage && <Footer />}
      <FloatingCartButton />

      {showLoginToast && toastUser && (
        <Toast
          type="login"
          userName={toastUser.name}
          onDone={() => setShowLoginToast(false)}
        />
      )}
      {showLogoutToast && logoutToastUser && (
        <Toast
          type="logout"
          userName={logoutToastUser.name}
          onDone={() => setShowLogoutToast(false)}
        />
      )}
    </div>
  );
};

export default RootLayout;
