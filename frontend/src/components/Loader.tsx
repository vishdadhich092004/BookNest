import React, { useState, useEffect } from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", color = "teal" }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  const colorClasses = {
    teal: "text-teal-600",
    slate: "text-slate-600",
    white: "text-white",
  };

  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 ${
          sizeClasses[size]
        } ${
          colorClasses[color as keyof typeof colorClasses] ||
          `text-${color}-600`
        }`}
      ></div>
    </div>
  );
};

export default Loader;
