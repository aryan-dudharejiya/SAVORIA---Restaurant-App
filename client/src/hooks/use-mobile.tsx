import * as React from "react";

// Define breakpoints for consistent responsive behavior
export const BREAKPOINTS = {
  MOBILE: 640, // sm: Small mobile devices
  TABLET: 1024, // lg: Tablets and smaller laptops
};

// Hook to check if viewport is mobile size
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.TABLET);
    };

    // Check immediately
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return !!isMobile;
}

// Hook to get more specific screen size information
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState({
    isMobile: false, // <640px
    isTablet: false, // 640px-1024px
    isDesktop: false, // >1024px
  });

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < BREAKPOINTS.MOBILE,
        isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET,
        isDesktop: width >= BREAKPOINTS.TABLET,
      });
    };

    // Check immediately
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize;
}
