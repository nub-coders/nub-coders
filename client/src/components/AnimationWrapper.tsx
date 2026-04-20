import { ReactNode, useEffect, useState } from "react";

interface AnimationWrapperProps {
  children: ReactNode;
  animation: "left" | "right" | "top" | "bottom" | "zoom" | "rotate";
  delay?: number;
  className?: string;
}

export default function AnimationWrapper({
  children,
  animation,
  delay = 0,
  className = "",
}: AnimationWrapperProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationMap = {
    left: "animate-entrance-left",
    right: "animate-entrance-right",
    top: "animate-entrance-top",
    bottom: "animate-entrance-bottom",
    zoom: "animate-entrance-zoom",
    rotate: "animate-entrance-rotate",
  };

  return (
    <div
      className={`${
        shouldAnimate ? animationMap[animation] : "opacity-0"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
