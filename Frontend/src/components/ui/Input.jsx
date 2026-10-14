import React, { useId } from "react";
import { cn } from "../../utils/cn";

/**
 * Text input with optional label, hint, error and a right-hand slot (used
 * for the show/hide password toggle).
 *
 * Previously the id was Math.random() on every render, so the label kept
 * losing its link to the field (and browser autofill got confused) as the
 * user typed. It also used border-input, which is white — borders were
 * invisible on white cards unless each page overrode them.
 */
const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      rightSlot = null,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id || autoId;
    const hintId = `${inputId}-hint`;

    const base =
      "flex h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-text-primary " +
      "placeholder:text-text-secondary/60 transition-[border-color,box-shadow] duration-200 " +
      "hover:border-primary/40 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
      "disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium";

    if (type === "checkbox" || type === "radio") {
      return (
        <input
          type={type}
          className={cn(
            "h-4 w-4 border border-border bg-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2",
            type === "radio" ? "rounded-full" : "rounded",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn("block text-sm font-medium", error ? "text-destructive" : "text-text-primary")}
          >
            {label}
            {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            type={type}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={description || error ? hintId : undefined}
            className={cn(
              base,
              rightSlot && "pr-11",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10",
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightSlot}</div>
          )}
        </div>

        {(error || description) && (
          <p id={hintId} className={cn("text-xs", error ? "text-destructive" : "text-text-secondary")}>
            {error || description}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
