import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { insertContactMessageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";
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

const formSchema = insertContactMessageSchema;

const Contact = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { toast } = useToast();
  
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
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Restaurant Exterior" 
              className="w-full h-72 object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Restaurant Interior" 
              className="w-full h-72 object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <p className="font-accent text-primary text-3xl">Get in Touch</p>
          <h2 className="font-heading text-4xl font-bold mt-2 mb-4">Contact Us</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Have questions or feedback? We'd love to hear from you. Reach out to us using the information below.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="lg:w-1/2 p-8">
              <h3 className="font-heading text-2xl font-bold mb-6">Send us a Message</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={contactMessage.isPending}
                  >
                    {contactMessage.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-8">
                <h4 className="font-bold text-lg mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="text-primary w-5 h-5" />
                    <span className="ml-3">123 Culinary Street, Foodville, FC 98765</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-primary w-5 h-5" />
                    <span className="ml-3">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-primary w-5 h-5" />
                    <span className="ml-3">info@savoria.com</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              {/* Google Maps Integration */}
              <div className="h-full min-h-[300px] lg:min-h-0 bg-gray-200 relative">
                <iframe 
                  title="Restaurant Location"
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312717933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDA0JzI2LjIiTiA3NMKwMDAnMTQuOSJX!5e0!3m2!1sen!2sus!4v1561148939787!5m2!1sen!2sus"
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Success Modal */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Message Sent!</DialogTitle>
            <DialogDescription className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white" 
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
