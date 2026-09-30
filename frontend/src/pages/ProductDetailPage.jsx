import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Package, Star, Heart, ShoppingBag, Zap,
  Truck, RotateCcw, ShieldCheck, ChevronRight,
  Minus, Plus, Tag, Layers, Calendar, Share2, Check
} from 'lucide-react';
import { getProductById, getProducts } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductById(id)
      .then((d) => setProduct(d.data.product))
      .catch((e) => setError(e.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getProducts({ limit: 4, page: 1 })
      .then((d) => setRelated(d.data.products.filter((p) => p._id !== id).slice(0, 4)))
      .catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 400));
    setAdding(false);
    addToCart(product, qty);
  };

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', wishlisted ? 'info' : 'success');
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32 bg-slate-50 min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error || !product) return (
    <div className="py-20 px-4 bg-slate-50 min-h-screen">
      <ErrorMessage message={error} onRetry={() => navigate('/products')} />
    </div>
  );

  const stockBadge =
    product.stock === 0
      ? { label: 'Out of Stock', cls: 'badge-danger', dot: 'bg-red-500' }
      : product.stock <= 5
      ? { label: `Only ${product.stock} left`, cls: 'badge-warning', dot: 'bg-amber-500' }
      : { label: 'In Stock', cls: 'badge-success', dot: 'bg-green-500' };

  const rating = 3.5 + ((id?.charCodeAt(0) || 65) % 3) * 0.5;
  const reviewCount = 48 + ((id?.charCodeAt(1) || 48) % 100);
  const addedDate = new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const TABS = ['Description', 'Details', 'Shipping'];

  return (
    <div className="bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-indigo-600 transition-colors font-medium">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-indigo-600 transition-colors font-medium">Products</Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-semibold truncate max-w-48">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 mb-12">

          {/* LEFT: Image Gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md group">
              {product.image ? (
                <img src={product.image} alt={product.name} id="product-main-image"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div className={`w-full h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 ${product.image ? 'hidden' : 'flex'}`}>
                <Package size={72} className="text-indigo-200" />
              </div>

              {/* Top actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button onClick={toggleWishlist} id="wishlist-btn"
                  className={`w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                    wishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-500 hover:text-red-500'
                  }`} aria-label="Wishlist">
                  <Heart size={17} className={wishlisted ? 'fill-white' : ''} />
                </button>
                <button className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all hover:scale-110" aria-label="Share">
                  <Share2 size={16} />
                </button>
              </div>

              {/* Stock badge */}
              <div className="absolute top-4 left-4">
                <span className={stockBadge.cls}>{stockBadge.label}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[product.image, product.image, product.image].filter(Boolean).map((img, i) => (
                <div key={i} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  i === 0 ? 'border-indigo-500' : 'border-transparent hover:border-indigo-300'
                }`}>
                  <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {!product.image && (
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center">
                  <Package size={20} className="text-indigo-300" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">

            {/* Category + Rating */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                SheryStore
              </span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={13}
                    className={s <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
                ))}
                <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)} ({reviewCount} reviews)</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-black text-indigo-600">${parseFloat(product.price).toFixed(2)}</span>
              <span className="text-base text-slate-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full">
                Save 17%
              </span>
            </div>

            {/* Short description */}
            <p className="text-slate-600 leading-relaxed mb-6 text-sm">{product.description}</p>

            <div className="w-full h-px bg-slate-100 mb-6" />

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-2 h-2 rounded-full ${stockBadge.dot}`} />
              <span className="text-sm font-semibold text-slate-800">
                {product.stock === 0 ? 'Currently unavailable' : `${product.stock} units available`}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-700 mb-3">Quantity</p>
                <div className="inline-flex items-center rounded-xl border border-slate-200 overflow-hidden">
                  <button className="qty-btn" id="qty-minus"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1} aria-label="Decrease">
                    <Minus size={14} />
                  </button>
                  <div className="w-14 h-10 flex items-center justify-center text-sm font-bold text-slate-900 bg-white border-x border-slate-200">
                    {qty}
                  </div>
                  <button className="qty-btn" id="qty-plus"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock} aria-label="Increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button id="add-to-cart" onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm">
                {adding ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
                ) : (
                  <><ShoppingBag size={17} />{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</>
                )}
              </button>
              <button id="buy-now" onClick={() => addToast('Checkout coming soon!', 'info')}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-4 px-6 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50 text-sm">
                <Zap size={17} /> Buy Now
              </button>
            </div>

            {/* Perks */}
            <div className="space-y-3.5 pt-5 border-t border-slate-100">
              {[
                { Icon: Truck,       title: 'Free Delivery',     desc: 'Orders above $50 ship free' },
                { Icon: RotateCcw,   title: '30-Day Returns',    desc: 'No hassle return policy' },
                { Icon: ShieldCheck, title: 'Secure Checkout',   desc: 'Encrypted payment processing' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm mb-12 overflow-hidden">
          <div className="flex border-b border-slate-100 px-6 gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} id={`tab-${t.toLowerCase()}`}
                onClick={() => setActiveTab(t)}
                className={`tab-btn whitespace-nowrap ${activeTab === t ? 'tab-active' : 'tab-inactive'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="p-6 lg:p-8 animate-fade-in">
            {activeTab === 'Description' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-900">About This Product</h3>
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
                <p className="text-slate-600 leading-relaxed">
                  This product meets the highest quality standards and has been carefully curated for our customers.
                  Each item undergoes rigorous quality checks before listing.
                </p>
              </div>
            )}
            {activeTab === 'Details' && (
              <div className="max-w-lg divide-y divide-slate-100">
                {[
                  { Icon: Tag,      label: 'Price',       value: `$${parseFloat(product.price).toFixed(2)}` },
                  { Icon: Layers,   label: 'Stock',       value: `${product.stock} units available` },
                  { Icon: Calendar, label: 'Listed On',   value: addedDate },
                  { Icon: ShieldCheck, label: 'Condition', value: 'Brand New' },
                  { Icon: Truck,    label: 'Shipping',    value: 'Standard & Express Available' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center py-3.5 gap-3">
                    <Icon size={15} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-500 w-36">{label}</span>
                    <span className="text-sm font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Shipping' && (
              <div className="max-w-lg space-y-3">
                {[
                  { Icon: Truck,    title: 'Standard Shipping', detail: '5–7 business days', extra: 'FREE on orders over $50' },
                  { Icon: Zap,      title: 'Express Shipping',  detail: '1–2 business days',  extra: '$9.99' },
                  { Icon: RotateCcw,title: 'Free Returns',      detail: 'Within 30 days',     extra: 'Free return label included' },
                ].map(({ Icon, title, detail, extra }) => (
                  <div key={title} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{detail}</p>
                      <p className="text-xs font-bold text-indigo-600 mt-1">{extra}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">You May Also Like</h2>
                <p className="text-sm text-slate-500 mt-1">More great products from our store</p>
              </div>
              <Link to="/products" className="btn-secondary text-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
