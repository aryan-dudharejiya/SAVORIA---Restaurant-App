import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { insertContactMessageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { MapPin, Phone, Mail, CheckCircle, Clock, Calendar, ExternalLink, MessageSquare } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const formSchema = insertContactMessageSchema;

const Contact = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });
  
  const contactMessage = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setConfirmationOpen(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    contactMessage.mutate(values);
  };
  
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="text-primary border-primary/30 mb-2">
            CONTACT US
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            We'd love to hear from you. Whether you have a question about menu items, reservations, or anything else, our team is ready to assist you.
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Our Location</h3>
              <p className="text-gray-600 mb-4">Visit us at our restaurant</p>
              <p className="font-medium">123 Gourmet Avenue, Culinary District</p>
              <p className="text-gray-500">New York, NY 10001</p>
              <a 
                href="https://goo.gl/maps/JTekZQmNkVpd5Z3B6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline mt-4 text-sm"
              >
                View on Google Maps <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
              <p className="text-gray-600 mb-4">We're open all week</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Thursday</span>
                  <span>11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Friday - Saturday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>10:00 AM - 9:00 PM</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Contact Info</h3>
              <p className="text-gray-600 mb-4">Reach out to us directly</p>
              <p className="font-medium">Phone: (123) 456-7890</p>
              <p className="mb-2">Email: info@savoria.com</p>
              <a 
                href="tel:+1234567890" 
                className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mt-2 hover:bg-primary/20 transition-colors"
              >
                Call Now
              </a>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-xl overflow-hidden shadow-xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-8 lg:p-12 form-container"
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="text-primary h-5 w-5" />
                <h3 className="font-bold text-2xl text-[#3D2C2E]">Send us a Message</h3>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="form-field-group">
                        <FormLabel className="form-label">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} className="form-input" />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="form-field-group">
                        <FormLabel className="form-label">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email address" {...field} className="form-input" />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="form-field-group">
                        <FormLabel className="form-label">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="form-textarea min-h-[150px]" 
                            onChange={field.onChange}
                            value={field.value}
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage className="form-error" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="btn-form-primary w-full"
                    disabled={contactMessage.isPending}
                  >
                    {contactMessage.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative h-full min-h-[450px] overflow-hidden"
            >
              {/* Google Maps Integration */}
              <iframe 
                title="Restaurant Location"
                className="w-full h-full border-0 absolute inset-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.2199949108625!2d-73.99775222346896!3d40.72175577138602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25985d35f4f01%3A0x47dd391da3b2916d!2sGramercy%20Tavern!5e0!3m2!1sen!2sus!4v1743074345458!5m2!1sen!2sus"
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              <div className="absolute top-4 right-4 bg-white px-4 py-2 shadow-lg rounded-md text-sm">
                <strong className="text-primary">Savoria Restaurant</strong><br/>
                <span className="text-gray-600">Famous for exquisite dining</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Success Modal */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md bg-[#FFF7E6] border-[#D1D5DB] p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-[#3D2C2E] text-2xl font-semibold">Message Sent!</DialogTitle>
            <DialogDescription className="text-center">
              <div className="w-16 h-16 bg-[#D72638] rounded-full flex items-center justify-center mx-auto mb-4 mt-4 shadow-md">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-[#3D2C2E] text-base">Thank you for reaching out. We'll get back to you as soon as possible.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <Button 
              className="btn-form-primary" 
              onClick={() => setConfirmationOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
