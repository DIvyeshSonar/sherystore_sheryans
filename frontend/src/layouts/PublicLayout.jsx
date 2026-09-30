import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import { ShoppingBag, Mail, Twitter, Instagram, Facebook, Github, ArrowRight } from 'lucide-react';

const Footer = () => (
  <footer className="bg-main-text text-white">
    {/* Newsletter */}
    <div className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Stay in the loop</h3>
            <p className="text-white/60 text-sm">Get notified about new products and exclusive deals.</p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <div className="flex-1 relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="footer-newsletter"
                type="email"
                placeholder="Enter your email"
                className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary hover:bg-indigo-600 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>

    {/* Main footer links */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4 group" id="footer-logo">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag size={17} className="text-white" />
            </div>
            <span className="font-bold text-base">
              Shery<span className="text-primary-light">Store</span>
            </span>
          </Link>
          <p className="text-white/50 text-xs leading-relaxed max-w-xs">
            A modern e-commerce platform built with React, Node.js, MongoDB and JWT authentication.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[
              { icon: Twitter, label: 'Twitter', id: 'footer-twitter' },
              { icon: Instagram, label: 'Instagram', id: 'footer-instagram' },
              { icon: Facebook, label: 'Facebook', id: 'footer-facebook' },
              { icon: Github, label: 'GitHub', id: 'footer-github' },
            ].map(({ icon: Icon, label, id }) => (
              <a
                key={id}
                href="#"
                id={id}
                aria-label={label}
                className="w-8 h-8 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <Icon size={14} className="text-white/70 hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm font-bold mb-4">Shop</h4>
          <ul className="space-y-2.5">
            {['All Products', 'New Arrivals', 'Best Sellers', 'Deals & Offers', 'Categories'].map((item) => (
              <li key={item}>
                <Link
                  to="/products"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-bold mb-4">Account</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Sign In', to: '/login' },
              { label: 'Register', to: '/register' },
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'My Profile', to: '/dashboard/profile' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm font-bold mb-4">Help</h4>
          <ul className="space-y-2.5">
            {['FAQ', 'Shipping Policy', 'Returns & Exchanges', 'Contact Us', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/40 text-xs">
          &copy; {new Date().getFullYear()} SheryStore. Built for Sheryians Coding School.
        </p>
        <div className="flex items-center gap-6">
          {['Terms', 'Privacy', 'Cookies'].map((item) => (
            <a key={item} href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// Layout for all public-facing pages (Home, Products, Login, Register)
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
