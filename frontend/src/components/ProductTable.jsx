import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Package } from 'lucide-react';

// Product table for the admin Manage Products page
const ProductTable = ({ products, onDelete, loading }) => {
  if (loading) {
    // Show skeleton rows while loading
    return (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <TableHeader />
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-6 py-4"><div className="skeleton h-4 w-48" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-4 w-20" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-4 w-16" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-5 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-4 w-24" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <TableHeader />
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white">
            {products.map((product) => {
              const stockStatus =
                product.stock === 0
                  ? { label: 'Out of Stock', className: 'badge-danger' }
                  : product.stock <= 5
                  ? { label: 'Low Stock', className: 'badge-warning' }
                  : { label: 'In Stock', className: 'badge-success' };

              return (
                <tr key={product._id} className="hover:bg-slate-50/80 transition-colors bg-white">
                  {/* Product name + image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200/60">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[220px]">{product.description}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-slate-600 font-medium">{product.stock}</td>

                  <td className="px-6 py-4">
                    <span className={stockStatus.className}>{stockStatus.label}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="View product"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        to={`/dashboard/products/${product._id}/edit`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit product"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader = () => (
  <tr className="bg-slate-50 border-b border-slate-200/80">
    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
      Product
    </th>
    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
      Price
    </th>
    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
      Stock
    </th>
    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
      Status
    </th>
    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
      Actions
    </th>
  </tr>
);

export default ProductTable;
