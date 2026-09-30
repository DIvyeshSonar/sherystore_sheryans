import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Menu, X, LayoutDashboard,
  LogOut, Search, User, ChevronDown, Heart, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { getProducts } from '../services/productService';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { addToast } = useToast();
  const { openCart, totalCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
        setSearchQuery('');
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await getProducts({ search: searchQuery, limit: 5, page: 1 });
        setSearchResults(res.data.products || []);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully.', 'info');
    navigate('/');
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleSearchSelect = (id) => {
    navigate(`/products/${id}`);
    setSearchFocused(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchFocused(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const showDropdown = searchFocused;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* ── Logo ───────────────────────────────── */}
          <Link to="/" id="nav-logo" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm hidden sm:block">
              Shery<span className="text-indigo-600 dark:text-indigo-400">Store</span>
            </span>
          </Link>

          {/* ── Desktop Nav ─────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1 flex-shrink-0" aria-label="Main navigation">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/products', label: 'Shop', end: false },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Search Bar ──────────────────────────── */}
          <div ref={searchRef} className="flex-1 relative max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className={`flex items-center gap-2.5 px-3.5 h-10 rounded-xl border transition-all duration-200 ${
                searchFocused
                  ? 'border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
              }`}>
                <Search size={15} className="text-slate-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  id="navbar-search"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                  autoComplete="off"
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-slide-down">
                {searchLoading ? (
                  <div className="flex items-center gap-2 px-4 py-5 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : searchQuery && searchResults.length === 0 ? (
                  <div className="px-4 py-5 text-sm text-slate-500 dark:text-slate-400 text-center">
                    No results for "<span className="font-semibold text-slate-700 dark:text-slate-200">{searchQuery}</span>"
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</p>
                    </div>
                    {searchResults.map((p) => (
                      <button key={p._id} onClick={() => handleSearchSelect(p._id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={14} className="text-slate-300" /></div>}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{p.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">${parseFloat(p.price).toFixed(2)}</p>
                        </div>
                        <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
                      </button>
                    ))}
                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                      <button onClick={handleSearchSubmit} className="text-xs text-indigo-600 font-semibold hover:underline w-full text-center py-1">
                        See all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick links</p>
                    <div className="flex flex-wrap gap-2">
                      {['All Products', 'New Arrivals', 'Popular'].map((q) => (
                        <button key={q} onClick={() => navigate('/products')}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 text-xs rounded-lg transition-colors font-medium">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right Actions ────────────────────────── */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Mobile search */}
            <button className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" id="mobile-search"
              onClick={() => { setMobileOpen(false); searchInputRef.current?.focus(); }}>
              <Search size={19} />
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              id="nav-cart-btn"
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {totalCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                <Link to="/dashboard" id="nav-dashboard"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                )}

                {/* User menu */}
                <div ref={userMenuRef} className="relative">
                  <button id="nav-user-menu" onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    aria-haspopup="true" aria-expanded={userMenuOpen}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-20 truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-scale-in">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      )}
                      <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <User size={15} /> My Profile
                      </Link>
                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" id="nav-signin"
                  className="hidden sm:flex px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" id="nav-register"
                  className="btn-primary px-4 py-2 text-sm shadow-none">
                  Get Started
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} id="mobile-menu-btn"
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-slide-down">
          {/* Mobile search */}
          <div className="px-4 pt-3 pb-2" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" id="mobile-search-input" placeholder="Search products..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
                autoComplete="off" />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <X size={14} />
                </button>
              )}
            </form>
            {searchQuery && searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
                {searchResults.slice(0, 4).map((p) => (
                  <button key={p._id} onClick={() => { handleSearchSelect(p._id); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">${parseFloat(p.price).toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="px-4 pb-4 space-y-1">
            {[{ to: '/', label: 'Home', end: true }, { to: '/products', label: 'Shop All Products', end: false }].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }>
                {label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/60'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-white'
                    }`
                  }>
                  <LayoutDashboard size={15} /> Dashboard
                </NavLink>
                )}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 space-y-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full py-2.5 justify-center">
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
