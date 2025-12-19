import * as React from "react";
import { cn } from '../lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon: Icon, label, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                            Icon && "pl-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
