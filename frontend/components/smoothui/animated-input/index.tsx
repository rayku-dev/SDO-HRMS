"use client";

import { cubicBezier, motion } from "motion/react";
import { useRef, useState, useId } from "react";

const LABEL_TRANSITION = {
  duration: 0.28,
  ease: cubicBezier(0.4, 0, 0.2, 1),
  // material easing
};

export type AnimatedInputProps = {
  value?: string;
  defaultValue?: string;
  type?: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  required?: boolean;
  minLength?: number;
};

export default function AnimatedInput({
  value,
  defaultValue = "",
  type = "text",
  onChange,
  label,
  placeholder = "",
  disabled = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  icon,
  required,
  minLength,
}: AnimatedInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const val = isControlled ? value : internalValue;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = !!val || isFocused;
  const inputId = useId();

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span className="-translate-y-1/2 absolute top-1/2 left-3">{icon}</span>
      )}
      <input
        className={`peer w-full rounded-sm border bg-background px-3 py-2 text-sm outline-none transition focus:ring-1 focus:ring-primary ${
          icon ? "pl-10" : ""
        } ${inputClassName}`}
        disabled={disabled}
        id={inputId}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          if (!isControlled) {
            setInternalValue(e.target.value);
          }
          onChange?.(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={isFloating ? placeholder : ""}
        ref={inputRef}
        type={type}
        value={val}
        required={required}
        minLength={minLength}
      />
      <motion.label
        animate={
          isFloating
            ? {
                y: -27,
                scale: 0.85,
                color: "var(--color-brand)",
                borderColor: "var(--color-brand)",
              }
            : { y: 0, scale: 1, color: "#6b7280" }
        }
        className={`-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 origin-left rounded-sm border border-transparent bg-background px-1 text-foreground transition-all ${labelClassName}`}
        htmlFor={inputId}
        style={{
          zIndex: 2,
        }}
        transition={LABEL_TRANSITION}
      >
        {label}
      </motion.label>
    </div>
  );
}
