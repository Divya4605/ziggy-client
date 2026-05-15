/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CheckCircle, LogOut } from "lucide-react";

const Toast = ({ type = "login", userName, onDone }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Good Morning";
    if (h >= 12 && h < 17) return "Good Afternoon";
    if (h >= 17 && h < 21) return "Good Evening";
    return type === "login" ? "Welcome" : "Hello";
  };

  const firstName = userName ? userName.split(" ")[0] : "there";

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => setLeaving(true), 400);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  const isLogin = type === "login";

  return (
    <div
      className={`fixed inset-0 z-3000 flex items-center justify-center transition-opacity duration-400 ${
        visible && !leaving ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-xs" />
      <div
        className={`relative bg-white rounded-4xl p-10 max-w-[400px] w-full mx-6 shadow-2xl text-center transform transition-all duration-500 ease-out ${
          visible && !leaving
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-8"
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border ${
            isLogin
              ? "bg-green-50 border-green-100"
              : "bg-surface border-border"
          }`}
        >
          {isLogin ? (
            <CheckCircle size={36} className="text-green-500" />
          ) : (
            <LogOut size={36} className="text-ink" />
          )}
        </div>

        <h2 className="font-display text-3xl font-bold text-ink mb-3">
          {isLogin ? `${getGreeting()}, ${firstName}` : "Signed out"}
        </h2>

        <p className="text-muted text-sm leading-relaxed px-4">
          {isLogin
            ? "You have successfully signed in. Welcome back to Ziggy."
            : `${getGreeting()}, ${firstName}. We look forward to seeing you again.`}
        </p>

        <div className="mt-8 h-1 w-full bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ease-linear ${
              visible ? "w-full" : "w-0"
            } ${isLogin ? "bg-brand" : "bg-ink"}`}
            style={{ transitionDuration: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
