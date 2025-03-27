import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  const [paddingClass, setPaddingClass] = useState("pt-0");

  // Determine if we need padding based on the current route
  useEffect(() => {
    // Home page has a full-screen hero, so doesn't need padding
    // Other pages need padding to avoid navbar overlap
    if (location === "/") {
      setPaddingClass("pt-0");
    } else {
      // Add padding top for non-home pages to ensure content doesn't get hidden by fixed navbar
      setPaddingClass("pt-20");
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${paddingClass}`}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
