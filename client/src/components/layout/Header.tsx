import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, X, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useLanguage } from "@/lib/translation/LanguageContext";

const Header = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();

  // Create a simple language selector for English and French
  const LanguageSelectorControl = () => {
    const handleLanguageChange = (lang: string) => {
      console.log(`Language change in Header to ${lang}`);
      setLanguage(lang);
    };
    
    return (
      <select 
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-transparent border-none text-sm cursor-pointer outline-none hover:text-primary focus:ring-0"
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    );
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              EventHub
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link
                href="/events"
                className={`text-foreground hover:text-primary font-medium ${
                  location === "/events" ? "text-primary" : ""
                }`}
              >
                Browse Events
              </Link>
              <Link
                href="/create"
                className={`text-foreground hover:text-primary font-medium ${
                  location === "/create" ? "text-primary" : ""
                }`}
              >
                Create Event
              </Link>
              <Link
                href="/dashboard"
                className={`text-foreground hover:text-primary font-medium ${
                  location === "/dashboard" ? "text-primary" : ""
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Desktop Search, Language & Auth */}
          <div className="flex items-center space-x-4">
            {/* Mobile search trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Desktop search */}
            <div className="hidden md:flex items-center bg-muted rounded-full pl-4 pr-2 py-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                type="text"
                placeholder="Search events"
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-40 lg:w-56 p-0 h-auto"
              />
            </div>
            
            {/* Language Selector with badge - same component used in mobile and desktop */}
            <div className="hidden md:flex items-center px-3 py-1 bg-primary/5 rounded-md border border-primary/20 ml-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">
                    {currentLanguage === 'fr' ? 'FR' : 'EN'}
                  </span>
                </div>
                <LanguageSelectorControl />
              </div>
            </div>

            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="hidden sm:inline-flex"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden ml-2"
                  aria-label="Open Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through EventHub
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Language Selector with current language indicator */}
                  <div className="mb-4 p-3 bg-primary/5 rounded-md border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Language</h3>
                      <div className="px-2 py-0.5 bg-primary/10 rounded text-xs font-semibold">
                        {currentLanguage === 'fr' ? 'FR' : 'EN'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <LanguageSelectorControl />
                    </div>
                  </div>
                  <Link href="/events">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                          new KeyboardEvent('keydown', { key: 'Escape' })
                        );
                      }}
                    >
                      Browse Events
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                          new KeyboardEvent('keydown', { key: 'Escape' })
                        );
                      }}
                    >
                      Create Event
                    </Button>
                  </Link>
                  {user ? (
                    <>
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                              new KeyboardEvent('keydown', { key: 'Escape' })
                            );
                          }}
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          logout();
                          document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                            new KeyboardEvent('keydown', { key: 'Escape' })
                          );
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                              new KeyboardEvent('keydown', { key: 'Escape' })
                            );
                          }}
                        >
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                              new KeyboardEvent('keydown', { key: 'Escape' })
                            );
                          }}
                        >
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className={`md:hidden px-6 pb-4 ${isSearchOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center bg-muted rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            type="text"
            placeholder="Search events"
            className="bg-transparent border-none focus:outline-none focus:ring-0 w-full p-0 h-auto"
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 h-8 w-8"
            onClick={() => setIsSearchOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
