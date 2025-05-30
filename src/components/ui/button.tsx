
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-dark hover:shadow-md active:translate-y-0.5 duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:translate-y-0.5 duration-200",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground shadow-sm hover:shadow-md active:translate-y-0.5 duration-200",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:translate-y-0.5 duration-200",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground duration-200",
        link: "text-primary underline-offset-4 hover:underline duration-200",
        success: "bg-success text-white shadow-sm hover:bg-success/90 hover:shadow-md active:translate-y-0.5 duration-200",
        gradient: "bg-gradient-to-r from-primary to-primary-light text-white shadow-sm hover:shadow-md hover:brightness-105 active:translate-y-0.5 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-sm hover:bg-white/20 hover:shadow-md active:translate-y-0.5 duration-200",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20 shadow-sm hover:shadow-md active:translate-y-0.5 duration-200",
        accent: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/80 hover:shadow-md active:translate-y-0.5 duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-md px-2.5 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-10 text-base",
        "2xl": "h-14 rounded-lg px-12 text-lg",
      },
      rounded: {
        default: "rounded-md",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
