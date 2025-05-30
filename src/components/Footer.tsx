
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <Radio className="h-6 w-6" />
              <span>Soundmaster</span>
            </Link>
            <p className="text-slate-300 text-sm">
              Professional sound services for events, parties, weddings, and more. Making your special moments sound perfect since 2005.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-300 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/live-radio" className="text-slate-300 hover:text-primary transition-colors">
                  Live Radio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/party-sound" className="text-slate-300 hover:text-primary transition-colors">
                  Party Sound
                </Link>
              </li>
              <li>
                <Link to="/services/karaoke-sound" className="text-slate-300 hover:text-primary transition-colors">
                  Karaoke Sound
                </Link>
              </li>
              <li>
                <Link to="/services/wedding-sound" className="text-slate-300 hover:text-primary transition-colors">
                  Wedding Sound
                </Link>
              </li>
              <li>
                <Link to="/live-lesson" className="text-slate-300 hover:text-primary transition-colors">
                  Live Lessons
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-slate-300">123 Sound Street, Music City, MC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-300">info@soundmaster.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="outline" className="border-white text-white hover:bg-primary hover:text-white hover:border-primary">
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} Soundmaster. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/terms" className="text-slate-400 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-slate-400 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-slate-400 hover:text-primary text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
