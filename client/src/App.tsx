import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import EventDetails from "@/pages/EventDetails";
import CreateEvent from "@/pages/CreateEvent";
import Dashboard from "@/pages/Dashboard";
import MyTickets from "@/pages/MyTickets";
import Profile from "@/pages/Profile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, createContext, useContext } from "react";
import { User } from "@shared/schema";

// User context to manage authentication state
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (user: User) => {
    setUser(user);
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      <TooltipProvider>
        <Navbar />
        <main className="min-h-[calc(100vh-64px-240px)]">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/browse" component={Browse} />
            <Route path="/events/:id" component={EventDetails} />
            <Route path="/create-event" component={CreateEvent} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/my-tickets" component={MyTickets} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </TooltipProvider>
    </AuthContext.Provider>
  );
}

export default App;
