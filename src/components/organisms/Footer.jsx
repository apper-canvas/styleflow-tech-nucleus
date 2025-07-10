import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold font-display">
                Style<span className="text-primary">Flow</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover the latest fashion trends and express your unique style with our curated collection of premium clothing and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/category/men" className="block text-gray-300 hover:text-white transition-colors">
                Men's Fashion
              </Link>
              <Link to="/category/women" className="block text-gray-300 hover:text-white transition-colors">
                Women's Fashion
              </Link>
              <Link to="/category/kids" className="block text-gray-300 hover:text-white transition-colors">
                Kids' Collection
              </Link>
              <Link to="/category/beauty" className="block text-gray-300 hover:text-white transition-colors">
                Beauty & Personal Care
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Size Guide
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Shipping Info
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Returns & Exchanges
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Facebook" size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Instagram" size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Twitter" size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Youtube" size={18} />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Stay updated with our latest collections and exclusive offers.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300 text-sm">
          <p>&copy; 2024 StyleFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;