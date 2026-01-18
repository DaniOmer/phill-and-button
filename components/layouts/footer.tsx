"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 xl:px-0 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-xl font-amsterdam font-semibold text-white hover:text-gray-300 transition-colors"
            >
              Phill & Button
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Marque de vêtements haut de gamme. Élégance et qualité pour votre
              garde-robe.
            </p>
            {/* Social Media */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/#faqs"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Service Client
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Retours
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Guide des tailles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-gray-400 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-400">
                  123 Avenue de la Mode
                  <br />
                  75001 Paris, France
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400 flex-shrink-0" />
                <a
                  href="tel:+33123456789"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:contact@phillandbutton.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  contact@phillandbutton.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Phill & Button. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Conditions
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
