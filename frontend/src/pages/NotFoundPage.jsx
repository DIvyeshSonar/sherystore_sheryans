import { Link } from 'react-router-dom';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-lg">
        {/* Visual */}
        <div className="relative mb-8 inline-flex">
          <div className="text-[120px] font-black leading-none gradient-text select-none">
            404
          </div>
          <div className="absolute -top-4 -right-6 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center rotate-12">
            <ShoppingBag size={24} className="text-primary/50" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-main-text mb-3 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-secondary-text text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            id="not-found-home"
            className="btn-primary text-sm inline-flex items-center justify-center gap-2 shadow-primary py-3 px-6"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            id="not-found-back"
            className="btn-secondary text-sm inline-flex items-center justify-center gap-2 py-3 px-6"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-border/60">
          <p className="text-xs text-secondary-text mb-3 font-medium">Or browse these pages:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              { label: 'Products', to: '/products' },
              { label: 'Sign In', to: '/login' },
              { label: 'Register', to: '/register' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-primary hover:text-indigo-700 font-semibold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
