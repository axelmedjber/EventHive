import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/"><a className="text-gray-300 hover:text-white">About</a></Link></li>
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Careers</a></Link></li>
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Blog</a></Link></li>
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Press</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Help Center</a></Link></li>
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Contact Us</a></Link></li>
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Refunds</a></Link></li>
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Trust & Safety</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Discover</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/browse"><a className="text-gray-300 hover:text-white">Events</a></Link></li>
              <li><Link href="/browse"><a className="text-gray-300 hover:text-white">Categories</a></Link></li>
              <li><Link href="/browse"><a className="text-gray-300 hover:text-white">Cities</a></Link></li>
              <li><Link href="/browse"><a className="text-gray-300 hover:text-white">Venues</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-gray-300 hover:text-white">Facebook</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Instagram</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-base text-gray-400">&copy; 2023 EventHub, Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
