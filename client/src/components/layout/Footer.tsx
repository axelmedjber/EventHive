import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EventHub</h3>
            <p className="opacity-80 mb-6">
              Discover and create unforgettable experiences with the leading event platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Use EventHub</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/events" className="hover:text-primary transition-colors">How it works</Link></li>
              <li><Link href="/create" className="hover:text-primary transition-colors">Create an event</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">EventHub Pro</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Success stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Find Events</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/events" className="hover:text-primary transition-colors">Browse events</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Calendar</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Locations</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Online events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Support</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/events" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Contact us</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Privacy policy</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Terms of service</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="opacity-80 mb-4 md:mb-0">© 2023 EventHub. All rights reserved.</p>

          <div className="flex space-x-6">
            <Link href="/events" className="text-white opacity-80 hover:opacity-100 transition-opacity">Privacy</Link>
            <Link href="/events" className="text-white opacity-80 hover:opacity-100 transition-opacity">Terms</Link>
            <Link href="/events" className="text-white opacity-80 hover:opacity-100 transition-opacity">Cookies</Link>
            <Link href="/events" className="text-white opacity-80 hover:opacity-100 transition-opacity">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
