import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Package, ShieldCheck, Zap, Truck, RotateCcw,
  Headphones, Star, TrendingUp, Sparkles, ChevronRight
} from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const PERKS = [
  { icon: Truck,        title: 'Free Delivery',    desc: 'On all orders over $50',         bg: 'bg-blue-50',   ic: 'text-blue-600' },
  { icon: RotateCcw,    title: '30-Day Returns',   desc: 'Hassle-free return policy',      bg: 'bg-green-50',  ic: 'text-green-600' },
  { icon: ShieldCheck,  title: 'Secure Payments',  desc: 'JWT encrypted checkout',         bg: 'bg-violet-50', ic: 'text-violet-600' },
  { icon: Headphones,   title: '24/7 Support',     desc: 'Always here to help you',        bg: 'bg-amber-50',  ic: 'text-amber-600' },
];

const CATS = [
  { icon: '🛍️', name: 'All Products' },
  { icon: '⚡', name: 'Electronics' },
  { icon: '👗', name: 'Fashion' },
  { icon: '🌿', name: 'Organic' },
  { icon: '🏃', name: 'Sports' },
  { icon: '📚', name: 'Books' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8, page: 1 })
      .then((d) => setProducts(d.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(160deg,#EEF2FF 0%,#F5F3FF 45%,#F8FAFC 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/80 border border-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-sm">
                <Sparkles size={12} className="text-amber-500" />
                Premium E-Commerce Experience
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 leading-[1.08] mb-5 tracking-tight">
                Shop Smarter,<br />
                <span className="gradient-text">Live Better</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                Discover thousands of premium products with lightning-fast search,
                secure checkout, and an experience you'll love.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/products" id="hero-shop"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/25 text-sm">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link to="/register" id="hero-register"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all text-sm">
                  Create Free Account
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-7 mt-10 pt-8 border-t border-slate-200/60">
                {[['10K+','Products'], ['50K+','Customers'], ['4.9★','Rating']].map(([val, lbl]) => (
                  <div key={lbl} className="text-center">
                    <p className="text-2xl font-black text-slate-900">{val}</p>
                    <p className="text-xs text-slate-500 font-medium">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual card */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50" />

                <div className="relative bg-white rounded-3xl border border-slate-100 shadow-xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Store Overview</p>
                      <p className="text-xs text-slate-500">Live dashboard</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[11px] font-bold text-green-700">Live</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Products',    value: '48', bg: 'bg-indigo-50', ic: 'text-indigo-600', Icon: Package },
                      { label: 'In Stock',    value: '41', bg: 'bg-green-50',  ic: 'text-green-700',  Icon: ShieldCheck },
                      { label: 'Low Stock',   value: '5',  bg: 'bg-amber-50',  ic: 'text-amber-700',  Icon: Zap },
                      { label: 'Trending',    value: '12', bg: 'bg-violet-50', ic: 'text-violet-700', Icon: TrendingUp },
                    ].map(({ label, value, bg, ic, Icon }) => (
                      <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                          <Icon size={15} className={ic} />
                        </div>
                        <p className={`text-xl font-black ${ic}`}>{value}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{label}</p>
                      </div>
                    ))}
                  </div>

                  <Link to="/dashboard"
                    className="flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-2xl border border-indigo-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Package size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Admin Dashboard</p>
                        <p className="text-xs text-slate-500">Manage products</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2.5 animate-slide-up flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Top Rated</p>
                    <p className="text-[10px] text-slate-500">4.9 / 5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Strip ───────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap flex-shrink-0">Browse:</span>
            {CATS.map((c) => (
              <Link key={c.name} to="/products"
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-slate-700 text-sm font-semibold whitespace-nowrap transition-all duration-200">
                <span>{c.icon}</span>{c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-3">
                <TrendingUp size={11} /> Featured Collection
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Best Products</h2>
              <p className="text-slate-500 text-sm mt-1">Handpicked products loved by our customers</p>
            </div>
            <Link to="/products" id="home-view-all"
              className="btn-secondary text-sm flex-shrink-0">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Package size={28} className="text-indigo-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">No products yet</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">Add products from the dashboard to see them here.</p>
              <Link to="/dashboard" className="btn-primary text-sm">Go to Dashboard</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────────────── */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl px-8 py-12 lg:py-14"
            style={{ background: 'linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)' }}>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 right-32 w-36 h-36 bg-white/5 rounded-full" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Sparkles size={11} /> Limited Time
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-white mb-2">New to SheryStore?</h2>
                <p className="text-indigo-200 text-sm max-w-md">Create your free account and get instant access to exclusive deals, fast checkout, and personalized recommendations.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link to="/register" id="promo-cta"
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all text-sm shadow-lg">
                  Create Free Account <ArrowRight size={14} />
                </Link>
                <Link to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 active:scale-95 transition-all text-sm border border-white/20">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ─────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-3">
              <ShieldCheck size={11} /> Why Choose Us
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Shopping Made Easy</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Premium quality, secure payments, and fast delivery.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((p) => (
              <div key={p.title}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 text-center">
                <div className={`w-14 h-14 ${p.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <p.icon size={24} className={p.ic} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
