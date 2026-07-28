"use client";
import React from "react";
import { motion } from "motion/react";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";



const transition = {
  type: "spring" as const,
  mass: 1,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Button
        // transition={{ duration: 0.3 }}
        className="text-xs md:text-sm cursor-pointer text-foreground hover:opacity-[0.9] rounded-2xl"
        variant="ghost"
        size="lg"
      >
        {item}
      </Button>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-primary-foreground/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/20 shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-border shadow-input flex justify-center space-x-4 px-8 py-6 "
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src?: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2 hover:bg-card/20 rounded-2xl items-center">
      <Image
        src={src!}
        width={200}
        height={200}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl h-35"
      />
      <div className="p-2">
        <h4 className="text-xl font-bold mb-1 text-foreground">
          {title}
        </h4>
        <p className="text-sm max-w-40 h-32 text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black "
    >
      {children}
    </a>
  );
};
