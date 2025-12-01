"use client";

import { motion, MotionProps } from "framer-motion";

interface AnimatedWrapperProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedWrapper({ children,
  className,
  ...motionProps 
}: AnimatedWrapperProps) {
  return (
    <motion.div
      {...motionProps}
      className={className}
    >
      {children}
    </motion.div>
  );
}
