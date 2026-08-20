import React from "react";
import { cn } from "@/lib/utils";

export const TimelineAnimation = ({
  children,
  animationNum = 1,
  timelineRef,
  as: Component = "div",
  className,
  ...props
}) => {
  return (
    <Component
      className={cn("transition-all duration-500 ease-out", className)}
      style={{
        animationDelay: `${animationNum * 80}ms`,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default TimelineAnimation;
