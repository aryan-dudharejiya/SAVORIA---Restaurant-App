import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { insertReservationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

// Extend the reservation schema with client-side validation
const formSchema = insertReservationSchema.extend({
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  guests: z.string().min(1, "Please select number of guests"),
});

const Reservation = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      date: "",
      time: "",
      guests: "",
      notes: "", // This needs to be a string (not null or undefined)
    },
  });
  
  const reservation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/reservations", data);
    },
    onSuccess: () => {
      setConfirmationOpen(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to make reservation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    reservation.mutate(values);
  };
  
  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    
    // Lunch hours: 11:00 AM to 2:00 PM
    for (let hour = 11; hour <= 14; hour++) {
      const time = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
      const value = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      slots.push({ label: time, value });
      
      // Add 30 minute intervals
      if (hour !== 14) {
        const halfHourTime = hour <= 12 ? `${hour}:30 AM` : `${hour - 12}:30 PM`;
        const halfHourValue = hour < 10 ? `0${hour}:30` : `${hour}:30`;
        slots.push({ label: halfHourTime, value: halfHourValue });
      }
    }
    
    // Dinner hours: 6:00 PM to 9:00 PM
    for (let hour = 18; hour <= 21; hour++) {
      const time = `${hour - 12}:00 PM`;
      const value = `${hour}:00`;
      slots.push({ label: time, value });
      
      // Add 30 minute intervals
      if (hour !== 21) {
        const halfHourTime = `${hour - 12}:30 PM`;
        const halfHourValue = `${hour}:30`;
        slots.push({ label: halfHourTime, value: halfHourValue });
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  // Calculate min date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];
  
  return (
    <section id="reservation" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row shadow-xl rounded-lg overflow-hidden">
            <Card className="md:w-1/2 p-0 border-0 shadow-none rounded-none order-2 md:order-1">
              <CardContent className="form-container p-8 rounded-none h-full">
                <h2 className="font-heading text-3xl font-bold mb-4 text-[#3D2C2E]">Book a Table</h2>
                <p className="text-gray-600 mb-8">
                  Reserve your table now for a memorable dining experience. We'll confirm your booking via email.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="form-field-group">
                            <FormLabel className="form-label">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="form-input" />
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
                              <Input type="email" placeholder="john@example.com" {...field} className="form-input" />
                            </FormControl>
                            <FormMessage className="form-error" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="form-field-group">
                            <FormLabel className="form-label">Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                min={today} 
                                max={maxDateString} 
                                {...field} 
                                className="form-input"
                              />
                            </FormControl>
                            <FormMessage className="form-error" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem className="form-field-group">
                            <FormLabel className="form-label">Time</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="form-select">
                                  <SelectValue placeholder="Select Time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border border-[#D1D5DB]">
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="form-error" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem className="form-field-group">
                          <FormLabel className="form-label">Number of Guests</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="form-select">
                                <SelectValue placeholder="Select Number of Guests" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border border-[#D1D5DB]">
                              <SelectItem value="1">1 Person</SelectItem>
                              <SelectItem value="2">2 People</SelectItem>
                              <SelectItem value="3">3 People</SelectItem>
                              <SelectItem value="4">4 People</SelectItem>
                              <SelectItem value="5">5 People</SelectItem>
                              <SelectItem value="6">6 People</SelectItem>
                              <SelectItem value="7+">7+ People (Please specify in notes)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="form-error" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="form-field-group">
                          <FormLabel className="form-label">Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special requests or dietary requirements?" 
                              className="form-textarea" 
                              onChange={field.onChange}
                              value={field.value || ''}
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
                      disabled={reservation.isPending}
                    >
                      {reservation.isPending ? "Booking..." : "Book Now"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div 
              className="md:w-1/2 bg-cover bg-center h-64 md:h-auto order-1 md:order-2"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80')` 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md bg-[#FFF7E6] border-[#D1D5DB] p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-[#3D2C2E] text-2xl font-semibold">Reservation Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              <div className="w-16 h-16 bg-[#D72638] rounded-full flex items-center justify-center mx-auto mb-4 mt-4 shadow-md">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <p className="mb-2 text-[#3D2C2E] text-base">Thank you for your reservation.</p>
              <p className="text-[#3D2C2E] text-base">We've sent a confirmation to your email.</p>
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

export default Reservation;
