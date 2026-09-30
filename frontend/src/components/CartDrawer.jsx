import { Link } from 'react-router-dom';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalCount, clearCart } = useCart();
  const { addToast } = useToast();

  if (!isCartOpen) return null;

  const shippingCost = subtotal > 50 || cartItems.length === 0 ? 0 : 9.99;
  const grandTotal = subtotal + shippingCost;

  const handleCheckout = () => {
    addToast('🎉 Order placed successfully! Thank you for shopping with SheryStore.', 'success');
    clearCart();
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-colors border-l border-slate-100 dark:border-slate-800">

          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Your Cart</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              id="close-cart-btn"
              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 rounded-3xl flex items-center justify-center mb-4">
                  <ShoppingBag size={36} className="text-indigo-400 dark:text-indigo-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                  Looks like you haven't added any items to your shopping cart yet.
                </p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-xs shadow-md shadow-indigo-600/20"
                >
                  Explore Products <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3.5 p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-all group"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700/50">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-slate-900">
                        <Package size={20} className="text-indigo-300 dark:text-indigo-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-l-lg transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-r-lg transition-colors disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shippingCost === 0 ? <span className="text-green-600 dark:text-green-400 font-bold">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                id="cart-checkout-btn"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-xs"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                <ShieldCheck size={13} className="text-green-500" /> Guaranteed 256-bit SSL Encrypted Checkout
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
