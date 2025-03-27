import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold font-heading mb-4">Savoria</h3>
            <p className="mb-4 text-gray-300">
              Experience the art of fine dining with our exquisite dishes prepared by world-class chefs.
            </p>
            <div className="flex space-x-4">
              <button className="text-white hover:text-primary transition" aria-label="Facebook">
                <Facebook />
              </button>
              <button className="text-white hover:text-primary transition" aria-label="Instagram">
                <Instagram />
              </button>
              <button className="text-white hover:text-primary transition" aria-label="Twitter">
                <Twitter />
              </button>
              <button className="text-white hover:text-primary transition" aria-label="Mail">
                <Mail />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-white transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-gray-300 hover:text-white transition">
                  Reservation
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-white transition">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Monday - Thursday: 11:00 AM - 10:00 PM</li>
              <li>Friday - Saturday: 11:00 AM - 11:30 PM</li>
              <li>Sunday: 10:00 AM - 10:00 PM</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">Newsletter</h4>
            <p className="mb-4 text-gray-300">
              Subscribe to our newsletter for special offers and updates.
            </p>
            <form className="flex" onSubmit={handleSubscribe}>
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                className="rounded-r-none bg-white text-gray-900"
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 rounded-l-none"
              >
                <Mail size={18} />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Savoria Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
