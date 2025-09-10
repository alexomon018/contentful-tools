import React from "react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            onClick,
            className,
            children,
            isLoading = false,
            ...props
        },
        ref
    ) => {
        return (
            <button
                className={`${className} inline-block rounded-xl bg-primary px-4 py-2 text-black hover:bg-primary-dark transition`}
                onClick={isLoading ? undefined : onClick}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <div className="min-w-28">Loading</div>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export {Button};
