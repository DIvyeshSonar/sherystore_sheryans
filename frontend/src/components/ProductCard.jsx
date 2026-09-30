import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Eye, Heart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { _id, name, description, price, stock, image } = product;
  const { addToCart } = useCart();

  const stockBadge =
    stock === 0
      ? { label: 'Out of Stock', cls: 'badge-danger' }
      : stock <= 5
      ? { label: `Low Stock (${stock} left)`, cls: 'badge-warning' }
      : { label: `In Stock (${stock})`, cls: 'badge-success' };

  // Stable pseudo-rating per product
  const rating = 3.5 + ((_id?.charCodeAt(0) || 65) % 3) * 0.5;
  const fullStars = Math.floor(rating);
  const reviewCount = 24 + ((_id?.charCodeAt(2) || 50) % 80);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <article className="product-card bg-white rounded-2xl border border-slate-200/80 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-50" style={{ aspectRatio: '4/3' }}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="product-card-img w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div className={`w-full h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 ${image ? 'hidden' : 'flex'}`}>
          <Package size={32} className="text-indigo-300" />
        </div>

        {stockBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={stockBadge.cls}>{stockBadge.label}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="product-card-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-3">
          <div className="flex items-center gap-2 w-full">
            <Link
              to={`/products/${_id}`}
              id={`view-product-${_id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-md"
            >
              <Eye size={13} /> Details
            </Link>
            <button
              onClick={handleQuickAdd}
              id={`add-cart-${_id}`}
              disabled={stock === 0}
              className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md disabled:opacity-40"
            >
              <ShoppingBag size={13} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={11}
                className={s <= fullStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
            ))}
          </div>
          <span className="text-[11px] text-slate-400 ml-0.5">({reviewCount})</span>
        </div>

        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">{description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">${parseFloat(price).toFixed(2)}</span>
            <span className="text-xs text-slate-400 line-through">${(price * 1.2).toFixed(2)}</span>
          </div>
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100"
          >
            <ShoppingBag size={12} /> Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
