import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStateProvider } from "./context/GlobalStateProvider";
import RootLayout from "./components/layout/RootLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PageLoader from "./components/ui/PageLoader";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const MenuPage = lazy(() => import("./pages/MenuPage"));

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStateProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </GlobalStateProvider>
    </BrowserRouter>
  );
};

export default App;
