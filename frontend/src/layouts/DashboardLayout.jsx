import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

// Map route paths to human-readable page titles
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/products': 'Manage Products',
  '/dashboard/products/add': 'Add Product',
  '/dashboard/profile': 'Profile',
};

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Find the current page title — fall back for dynamic routes like /dashboard/products/:id/edit
  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.includes('/edit') ? 'Edit Product' : 'Dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="md:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-base font-semibold text-slate-900">{pageTitle}</h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
