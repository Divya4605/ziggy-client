import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-ink mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <img
              src="ziggy_nav_logo.png"
              alt="Ziggy"
              className="w-40 object-left"
              style={{ objectPosition: "left" }}
            />
            <p className="text-white/40 text-sm leading-relaxed max-w-[300px]">
              The world&apos;s first voice-powered food delivery experience.
              Order your favorite meals hands-free.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em]">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/menu", label: "Menu" },
                { to: "/about", label: "About" },
                { to: "/orders", label: "Orders" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/50 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-brand"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em]">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-white/50 text-sm font-medium cursor-default hover:text-white/70 transition-colors">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs uppercase tracking-widest">
            © 2026 Ziggy. All rights reserved.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1.5">
            Crafted with{" "}
            <Heart size={12} className="text-brand" fill="currentColor" /> by
            Divya Shree M
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
