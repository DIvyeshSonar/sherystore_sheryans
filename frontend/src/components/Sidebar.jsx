import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  User,
  LogOut,
  ShoppingBag,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/products', label: 'Manage Products', icon: Package },
  { to: '/dashboard/products/add', label: 'Add Product', icon: PlusCircle },
  { to: '/dashboard/profile', label: 'My Profile', icon: User },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast('You have been logged out.', 'info');
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-primary/30 shadow-sm'
        : 'text-secondary-text hover:text-main-text hover:bg-gray-50'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-border/60 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-primary/30 shadow-md group-hover:scale-105 transition-transform">
            <ShoppingBag size={17} className="text-white" />
          </div>
          <span className="font-bold text-main-text text-sm tracking-tight">
            Shery<span className="text-primary">Store</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-secondary-text hover:text-main-text transition-colors"
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
        <p className="text-xs font-bold text-muted-text uppercase tracking-widest px-3.5 mb-3">
          Main Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={navLinkClass}
            onClick={onClose}
            id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-2 border-t border-slate-200/60">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3.5 mb-3">
            Store
          </p>
          <Link
            to="/products"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            id="sidebar-view-store"
          >
            <ArrowUpRight size={17} />
            View Store
          </Link>
        </div>
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-slate-200/60 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-2xl border border-slate-200/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 shadow-sm">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          id="sidebar-logout"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed left-0 top-0 bottom-0 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          />
          {/* Sidebar panel */}
          <aside className="w-64 bg-white flex flex-col animate-slide-up shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
