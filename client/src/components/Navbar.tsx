import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, user, login, logout } = useAuth();
  const { toast } = useToast();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" });
  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await apiRequest("POST", "/api/users/login", loginFormData);
      const userData = await res.json();
      login(userData);
      setLoginDialogOpen(false);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await apiRequest("POST", "/api/users/signup", signupFormData);
      const userData = await res.json();
      login(userData);
      setSignupDialogOpen(false);
      toast({
        title: "Signup successful",
        description: `Welcome to EventHub, ${userData.name}!`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <nav className="bg-white border-b border-gray-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary font-bold text-2xl cursor-pointer">EventHub</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/browse">
                <a className={`nav-link ${location === '/browse' ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  Browse Events
                </a>
              </Link>
              <Link href="/create-event">
                <a className={`nav-link ${location === '/create-event' ? 'nav-link-active' : 'nav-link-inactive'}`}>
                  Create Event
                </a>
              </Link>
              {isAuthenticated && (
                <Link href="/my-tickets">
                  <a className={`nav-link ${location === '/my-tickets' ? 'nav-link-active' : 'nav-link-inactive'}`}>
                    My Tickets
                  </a>
                </Link>
              )}
              {isAuthenticated && (
                <Link href="/dashboard">
                  <a className={`nav-link ${location === '/dashboard' ? 'nav-link-active' : 'nav-link-inactive'}`}>
                    Dashboard
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search events" 
                className="pl-10 pr-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm" 
              />
            </div>
            {isAuthenticated ? (
              <div className="flex items-center">
                <Link href="/profile">
                  <a className="mr-4 text-text hover:text-accent">
                    {user?.name}
                  </a>
                </Link>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setSignupDialogOpen(true)}
                >
                  Sign Up
                </Button>
                <Button 
                  variant="ghost"
                  className="ml-4 text-text hover:text-accent"
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Log In
                </Button>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/browse">
              <a 
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location === '/browse' 
                    ? 'border-secondary text-secondary bg-secondary/5' 
                    : 'border-transparent text-text hover:bg-gray-50'
                }`}
              >
                Browse Events
              </a>
            </Link>
            <Link href="/create-event">
              <a 
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location === '/create-event' 
                    ? 'border-secondary text-secondary bg-secondary/5' 
                    : 'border-transparent text-text hover:bg-gray-50'
                }`}
              >
                Create Event
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/my-tickets">
                <a 
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location === '/my-tickets' 
                      ? 'border-secondary text-secondary bg-secondary/5' 
                      : 'border-transparent text-text hover:bg-gray-50'
                  }`}
                >
                  My Tickets
                </a>
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/dashboard">
                <a 
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location === '/dashboard' 
                      ? 'border-secondary text-secondary bg-secondary/5' 
                      : 'border-transparent text-text hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </a>
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-medium">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-text">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
                <Button 
                  variant="ghost"
                  className="ml-auto"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex justify-around px-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignupDialogOpen(true);
                  }}
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginDialogOpen(true);
                  }}
                >
                  Log In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to EventHub</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={loginFormData.username}
                  onChange={(e) => setLoginFormData({ ...loginFormData, username: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginFormData.password}
                  onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </DialogFooter>
          </form>
          <div className="mt-4 text-center text-sm">
            <span>Don't have an account? </span>
            <button
              className="text-accent hover:underline"
              onClick={() => {
                setLoginDialogOpen(false);
                setSignupDialogOpen(true);
              }}
            >
              Sign up
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Signup Dialog */}
      <Dialog open={signupDialogOpen} onOpenChange={setSignupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up for EventHub</DialogTitle>
            <DialogDescription>
              Create an account to discover and create events.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignupSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="Enter your name"
                  value={signupFormData.name}
                  onChange={(e) => setSignupFormData({ ...signupFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupFormData.email}
                  onChange={(e) => setSignupFormData({ ...signupFormData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  placeholder="Choose a username"
                  value={signupFormData.username}
                  onChange={(e) => setSignupFormData({ ...signupFormData, username: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Choose a password"
                  value={signupFormData.password}
                  onChange={(e) => setSignupFormData({ ...signupFormData, password: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={signupFormData.confirmPassword}
                  onChange={(e) => setSignupFormData({ ...signupFormData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </DialogFooter>
          </form>
          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <button
              className="text-accent hover:underline"
              onClick={() => {
                setSignupDialogOpen(false);
                setLoginDialogOpen(true);
              }}
            >
              Log in
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
