import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  asChild = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 hover:scale-105 focus:ring-primary',
    secondary: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-error text-white hover:bg-red-600 focus:ring-error'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  }
  
  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )
  
  if (asChild) {
    const child = children
    if (child && typeof child === 'object' && 'type' in child) {
      return {
        ...child,
        props: {
          ...child.props,
          className: cn(classes, child.props?.className),
          ref,
          disabled,
          ...props
        }
      }
    }
    return children
  }
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button