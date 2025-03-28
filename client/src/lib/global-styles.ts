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
    formElement: 'shadow-[0px_4px_10px_rgba(0,0,0,0.05)]', // Form elements shadow
  },

  // Animation transitions
  transitions: {
    fast: 'transition-all duration-200 ease-in-out',
    medium: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
    hover: 'transition-transform duration-300 hover:scale-105',
    button: 'transition-all duration-300 hover:shadow-hover transform hover:scale-[1.02]',
    buttonScale: 'transition-all duration-300 hover:shadow-hover transform hover:scale-[1.05]',
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
    formLabel: 'text-base font-semibold text-[#3D2C2E] font-[\'Poppins\']', // Form labels
    formInput: 'text-base font-normal text-[#3D2C2E] font-[\'Roboto\']', // Form input text
    formPlaceholder: 'text-[#9CA3AF] font-normal', // Placeholder text
    formHelper: 'text-sm text-gray-500 font-[\'Roboto\']', // Helper text for forms
    formError: 'text-sm text-[#D72638] font-[\'Roboto\']', // Error text for forms
    formButton: 'text-base font-semibold font-[\'Poppins\']', // Button text in forms
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
    
    // Form specific colors
    formBg: 'bg-[#FAF5E9]', // Light beige for form backgrounds
    formInputBg: 'bg-[#F7F7F7]', // Light gray for input backgrounds
    formInputWarmBg: 'bg-[#FFF3E3]', // Warm beige for premium input backgrounds
    formInputBorder: 'border-[#D1D5DB] border-[1.5px]', // Subtle border for inputs
    formInputFocusBorder: 'focus:border-[#D72638]', // Primary color border on focus 
    formInputFocusShadow: 'focus:shadow-[0_0_5px_rgba(215,38,56,0.4)]', // Glow effect on focus
    formInputHoverBorder: 'hover:border-[#D72638]/50', // Hover effect for borders
    formInputShadow: 'shadow-[0_2px_4px_rgba(0,0,0,0.05)]', // Subtle shadow for inputs
    formPlaceholder: 'placeholder:text-[#9CA3AF] placeholder:font-normal', // Lighter shade for placeholders
    formPrimaryButton: 'bg-[#D72638] hover:bg-[#D72638]/90', // Deep red for primary buttons
    formSecondaryButton: 'bg-[#FF914D] hover:bg-[#FF914D]/90', // Warm orange for secondary buttons
    formLabelText: 'text-[#3D2C2E] font-[\'Poppins\'] font-semibold', // Label text style
    formInputText: 'text-[#3D2C2E] font-[\'Roboto\']' // Input text style
  },

  // Button styles
  buttons: {
    primary: 'bg-restaurant-primary text-white font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-primary/90 hover:shadow-hover transform hover:scale-105',
    secondary: 'bg-transparent border-2 border-restaurant-secondary text-restaurant-text font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-secondary/10 transform hover:scale-105',
    accent: 'bg-restaurant-accent text-white font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-accent/90 hover:shadow-hover transform hover:scale-105',
    ghost: 'bg-transparent text-restaurant-text font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-gray-100',
    outline: 'bg-transparent border border-restaurant-primary text-restaurant-primary font-heading font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:bg-restaurant-primary/5',
    
    // Form specific buttons
    formPrimary: `bg-[#D72638] text-white font-semibold font-['Poppins'] rounded-lg px-6 py-3 
                 min-h-[50px] text-base shadow-[0_2px_4px_rgba(215,38,56,0.3)] 
                 transition-all duration-300 hover:bg-[#D72638]/90 hover:shadow-lg 
                 transform hover:scale-105 active:translate-y-0.5 active:shadow-inner`,
    formSecondary: `bg-[#FF914D] text-white font-semibold font-['Poppins'] rounded-lg px-6 py-3 
                   min-h-[50px] text-base shadow-[0_2px_4px_rgba(255,145,77,0.3)] 
                   transition-all duration-300 hover:bg-[#FF914D]/90 hover:shadow-lg 
                   transform hover:scale-105 active:translate-y-0.5 active:shadow-inner`,
    formOutline: `bg-transparent border-2 border-[#FF914D] text-[#FF914D] font-semibold font-['Poppins'] 
                 rounded-lg px-6 py-3 min-h-[50px] text-base 
                 transition-all duration-300 hover:bg-[#FF914D]/10 hover:shadow-[0_2px_4px_rgba(255,145,77,0.2)]
                 transform hover:scale-105 active:translate-y-0.5`,
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
  },
  
  // Form styles
  forms: {
    container: 'bg-[#FAF5E9] rounded-lg p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.07)]',
    fieldGroup: 'mb-5 last:mb-0',
    label: 'block mb-2 text-base font-semibold text-[#3D2C2E] font-[\'Poppins\']',
    input: `w-full rounded-lg border border-[#D1D5DB] border-[1.5px] bg-[#FFF3E3] 
            px-4 py-3 min-h-[50px] text-[#3D2C2E] text-base font-['Roboto']
            placeholder:text-[#9CA3AF] placeholder:font-normal
            shadow-[0_2px_4px_rgba(0,0,0,0.05)]
            focus:border-[#D72638] focus:outline-none focus:shadow-[0_0_5px_rgba(215,38,56,0.4)]
            hover:border-[#D72638]/50
            transition-all duration-300`,
    select: `w-full rounded-lg border border-[#D1D5DB] border-[1.5px] bg-[#FFF3E3] 
            px-4 py-3 min-h-[50px] text-[#3D2C2E] text-base font-['Roboto']
            shadow-[0_2px_4px_rgba(0,0,0,0.05)]
            focus:border-[#D72638] focus:outline-none focus:shadow-[0_0_5px_rgba(215,38,56,0.4)]
            hover:border-[#D72638]/50
            transition-all duration-300`,
    textarea: `w-full rounded-lg border border-[#D1D5DB] border-[1.5px] bg-[#FFF3E3] 
              px-4 py-3 min-h-[120px] text-[#3D2C2E] text-base font-['Roboto']
              placeholder:text-[#9CA3AF] placeholder:font-normal
              shadow-[0_2px_4px_rgba(0,0,0,0.05)]
              focus:border-[#D72638] focus:outline-none focus:shadow-[0_0_5px_rgba(215,38,56,0.4)]
              hover:border-[#D72638]/50
              transition-all duration-300 resize-y`,
    checkbox: `rounded-sm border-2 border-[#D1D5DB] text-[#D72638] 
              focus:ring-[#D72638] focus:ring-offset-0
              shadow-[0_1px_2px_rgba(0,0,0,0.05)]
              transition-all duration-200
              cursor-pointer h-5 w-5`,
    radio: `border-2 border-[#D1D5DB] text-[#D72638] 
           focus:ring-[#D72638] focus:ring-offset-0
           shadow-[0_1px_2px_rgba(0,0,0,0.05)]
           transition-all duration-200
           cursor-pointer h-5 w-5`,
    error: 'mt-1.5 text-sm text-[#D72638] font-[\'Roboto\']',
    helper: 'mt-1.5 text-sm text-gray-500 font-[\'Roboto\']',
    primaryButton: `bg-[#D72638] text-white font-semibold rounded-lg 
                   px-6 py-3 min-h-[50px] 
                   font-['Poppins'] text-base
                   shadow-[0_2px_4px_rgba(215,38,56,0.3)]
                   transition-all duration-300 
                   hover:bg-[#D72638]/90 hover:shadow-lg 
                   transform hover:scale-105
                   active:translate-y-0.5 active:shadow-inner`,
    secondaryButton: `bg-[#FF914D] text-white font-semibold rounded-lg 
                     px-6 py-3 min-h-[50px] 
                     font-['Poppins'] text-base
                     shadow-[0_2px_4px_rgba(255,145,77,0.3)]
                     transition-all duration-300 
                     hover:bg-[#FF914D]/90 hover:shadow-lg 
                     transform hover:scale-105
                     active:translate-y-0.5 active:shadow-inner`,
    outlineButton: `bg-transparent border-2 border-[#FF914D] text-[#FF914D] 
                   font-semibold rounded-lg 
                   px-6 py-3 min-h-[50px] 
                   font-['Poppins'] text-base
                   transition-all duration-300 
                   hover:bg-[#FF914D]/10 hover:shadow-[0_2px_4px_rgba(255,145,77,0.2)]
                   transform hover:scale-105
                   active:translate-y-0.5`,
  }
};