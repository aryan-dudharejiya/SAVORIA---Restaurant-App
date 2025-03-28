// Global Styling Constants for the application
// Following the design specification for consistent styling across components

// This file provides common styling constants that can be imported 
// and used across components for consistent styling

export const globalStyles = {
  // Border radius values for consistency
  borderRadius: {
    sm: 'rounded-sm',    // 0.125rem, 2px
    md: 'rounded-md',    // 0.375rem, 6px
    lg: 'rounded-lg',    // 0.5rem, 8px
    xl: 'rounded-xl',    // 0.75rem, 12px
    full: 'rounded-full' // 9999px, completely rounded
  },

  // Shadows for different elevations
  shadows: {
    sm: 'shadow-sm',              // Small shadow
    md: 'shadow-md',              // Medium shadow
    lg: 'shadow-lg',              // Large shadow
    xl: 'shadow-xl',              // Extra large shadow
    hover: 'shadow-hover',        // Custom hover shadow
    card: 'shadow-card',          // Card shadow
    button: 'shadow-button',      // Button shadow
  },

  // Animation transitions
  transitions: {
    fast: 'transition-all duration-200 ease-in-out',
    medium: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
    hover: 'transition-transform duration-300 hover:scale-105',
    button: 'transition-all duration-300 hover:shadow-hover transform hover:scale-[1.02]',
  },

  // Text styles for consistency
  text: {
    headingXl: 'text-h1 font-heading font-bold',
    headingLg: 'text-h2 font-heading font-semibold',
    headingMd: 'text-h3 font-heading font-medium',
    body: 'text-base font-body font-normal',
    bodyBold: 'text-base font-body font-semibold',
    small: 'text-sm font-body',
    caption: 'text-xs font-body text-gray-500',
  },

  // Color variations for primary color
  colors: {
    // Primary colors
    primary: 'text-restaurant-primary',
    primaryBg: 'bg-restaurant-primary',
    primaryHover: 'hover:bg-restaurant-primary/90',
    primaryBorder: 'border-restaurant-primary',
    
    // Secondary colors
    secondary: 'text-restaurant-secondary',
    secondaryBg: 'bg-restaurant-secondary',
    secondaryHover: 'hover:bg-restaurant-secondary/90',
    secondaryBorder: 'border-restaurant-secondary',
    
    // Accent
    accent: 'text-restaurant-accent',
    accentBg: 'bg-restaurant-accent',
    accentHover: 'hover:bg-restaurant-accent/90',
    
    // Background
    background: 'bg-restaurant-background',
    
    // Text color
    text: 'text-restaurant-text',
  },

  // Button styles
  buttons: {
    primary: 'bg-restaurant-primary text-white font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-primary/90 hover:shadow-hover transform hover:scale-105',
    secondary: 'bg-transparent border-2 border-restaurant-secondary text-restaurant-text font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-secondary/10 transform hover:scale-105',
    accent: 'bg-restaurant-accent text-white font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-accent/90 hover:shadow-hover transform hover:scale-105',
    ghost: 'bg-transparent text-restaurant-text font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-gray-100',
    outline: 'bg-transparent border border-restaurant-primary text-restaurant-primary font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-primary/5',
  },
  
  // Card styles
  cards: {
    default: 'bg-white rounded-xl shadow-card p-6 transition-all duration-300 hover:shadow-hover',
    interactive: 'bg-white rounded-xl shadow-card p-6 transition-all duration-300 hover:shadow-hover transform hover:scale-[1.02]',
    flat: 'bg-white rounded-xl p-6 border border-gray-100',
  },
  
  // Layout utilities
  layout: {
    section: 'py-16 md:py-24',
    container: 'px-4 md:px-6 lg:px-8 mx-auto max-w-7xl',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    grid2: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
  },
  
  // Images
  images: {
    rounded: 'rounded-xl overflow-hidden',
    card: 'rounded-xl overflow-hidden aspect-video object-cover',
    avatar: 'rounded-full object-cover',
    hero: 'w-full h-full object-cover object-center',
  }
};