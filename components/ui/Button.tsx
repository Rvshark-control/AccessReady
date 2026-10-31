import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "purple" | "ghost" | "dark-outline";
export type ButtonSize = "md" | "lg";

const base =
  "group/button relative inline-flex items-center justify-center gap-2 rounded-full font-bold " +
  "transition-[transform,background-color,box-shadow,color] duration-200 ease-out " +
  "motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-60 " +
  "forced-colors:border forced-colors:border-[ButtonText]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-pumpkin-500 text-night-900 shadow-glow hover:bg-pumpkin-400 hover:shadow-[0_14px_34px_-10px_rgb(255_138_42/0.75)]",
  secondary:
    "bg-white text-night-900 border-2 border-plum-200 shadow-soft hover:border-plum-500 hover:bg-plum-50",
  purple: "bg-plum-600 text-white shadow-soft hover:bg-plum-700",
  ghost: "text-plum-700 hover:bg-plum-100 hover:text-night-900",
  "dark-outline":
    "border-2 border-white/35 bg-white/8 text-cream backdrop-blur hover:border-white/70 hover:bg-white/14",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 py-2.5 text-base",
  lg: "min-h-14 px-7 py-3.5 text-lg",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** Icon after the label (decorative), nudges right on hover. */
  trailingIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  icon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      <ButtonContent icon={icon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  trailingIcon,
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      <ButtonContent icon={icon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
    </Link>
  );
}

function ButtonContent({
  icon,
  trailingIcon,
  children,
}: Pick<CommonProps, "icon" | "trailingIcon" | "children">) {
  return (
    <>
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 [&>svg]:size-5">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 transition-transform duration-200 motion-safe:group-hover/button:translate-x-1 [&>svg]:size-5"
        >
          {trailingIcon}
        </span>
      ) : null}
    </>
  );
}
