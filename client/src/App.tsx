import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import MyOrders from "./pages/MyOrders";
import NotFound from "@/pages/not-found";
import { CartProvider } from "./contexts/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/reservation" component={Reservation} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/contact" component={Contact} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/track-order/:trackingId" component={TrackOrder} />
      <Route path="/my-orders" component={MyOrders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <CartProvider>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </CartProvider>
  );
}

export default App;
