import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, asChild = false, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const variants = {
            primary: "bg-[#FFDA1A] text-black hover:bg-[#e6c417] shadow-md shadow-[#FFDA1A]/20 border border-transparent font-bold",
            secondary: "bg-white text-black hover:bg-gray-50 border border-gray-200 shadow-sm font-bold",
            ghost: "hover:bg-gray-100 text-gray-600 hover:text-black font-medium",
            destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm font-bold",
            outline: "border-2 border-gray-200 bg-transparent hover:border-black hover:text-black text-gray-600 font-bold"
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
            icon: "h-10 w-10 p-2 flex items-center justify-center"
        };

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && children}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button };
