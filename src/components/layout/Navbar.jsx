import { useState, useEffect, useRef, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import {
  Search,
  ShoppingBag,
  LogOut,
  User,
  Package,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { displayCart, isLoggedIn, user, logout, foodData } =
    useContext(GlobalStateContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const cartItemCount = foodData
    ? foodData.reduce((total, item) => total + (item.Quantity || 0), 0)
    : 0;

  const [isCartBumping, setIsCartBumping] = useState(false);
  const prevCartCount = useRef(cartItemCount);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (cartItemCount > prevCartCount.current) {
      setIsCartBumping(true);
      const timer = setTimeout(() => setIsCartBumping(false), 300);
      return () => clearTimeout(timer);
    }
    prevCartCount.current = cartItemCount;
  }, [cartItemCount]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      if (searchValue.trim()) {
        navigate("/menu", { state: { search: searchValue } });
        setSearchValue("");
      }
    }
  };

  const getInitials = () => {
    if (!user || !user.name) return "?";
    const names = user.name.split(" ");
    if (names.length > 1) return (names[0][0] + names[1][0]).toUpperCase();
    return user.name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const navLinkStyles = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-200 ${
      isActive
        ? "text-brand after:w-full after:bg-brand"
        : "text-muted hover:text-ink after:w-0 hover:after:w-full hover:after:bg-border"
    }`;

  return (
    <div className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-8">
          <Link to="/" className="shrink-0">
            <img src="ziggy_nav_logo.png" alt="Ziggy" className="h-8 w-auto" />
          </Link>

          {/* Search */}
          <div className="hidden lg:flex items-center gap-2.5 bg-surface border border-border rounded-lg px-3.5 py-2 w-72 transition-all focus-within:bg-white focus-within:border-brand/50 focus-within:shadow-[0_0_0_3px_rgba(184,38,9,0.08)]">
            <Search size={15} className="text-subtle shrink-0" />
            <input
              type="text"
              placeholder="Search dishes, restaurants..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder:text-subtle font-medium"
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={navLinkStyles}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkStyles}>
            About
          </NavLink>
          <NavLink to="/menu" className={navLinkStyles}>
            Menu
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/orders" className={navLinkStyles}>
              Orders
            </NavLink>
          )}
        </nav>

        {/* Right: Cart + Account */}
        <div className="flex items-center gap-3">
          {displayCart && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition-all duration-300 ${
                  isCartBumping
                    ? "bg-[#fef2f2] text-brand scale-110 shadow-sm"
                    : isActive
                      ? "bg-[#fef2f2] text-brand"
                      : "text-muted hover:bg-surface hover:text-ink"
                }`
              }
            >
              <ShoppingBag
                size={18}
                className={`transition-transform duration-300 ${isCartBumping ? "scale-110" : "scale-100"}`}
              />
              {cartItemCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white transition-transform duration-300 ${isCartBumping ? "scale-125" : "scale-100"}`}
                >
                  {cartItemCount}
                </span>
              )}
            </NavLink>
          )}

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-lg hover:bg-surface transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center select-none">
                  {getInitials()}
                </div>
                <ChevronDown size={14} className="text-subtle" />
              </button>

              {showDropdown && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white border border-border shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-surface">
                    <p className="text-xs font-semibold text-ink truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-subtle truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-surface transition-colors cursor-pointer text-sm text-ink">
                      <User size={14} className="text-subtle" /> Profile
                    </div>
                  </Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)}>
                    <div className="px-4 py-2.5 flex items-center gap-3 hover:bg-surface transition-colors cursor-pointer text-sm text-ink">
                      <Package size={14} className="text-subtle" /> My Orders
                    </div>
                  </Link>
                  <div className="border-t border-surface">
                    <div
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors cursor-pointer text-sm"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} /> Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 text-sm font-semibold bg-ink text-white rounded-lg hover:bg-brand transition-colors">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
