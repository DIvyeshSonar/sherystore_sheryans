import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, AlertTriangle, XCircle, Plus, ArrowRight } from 'lucide-react';
import { getProducts } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Fetch all products to calculate stats — no pagination (high limit)
        const data = await getProducts({ limit: 1000 });
        setProducts(data.data.products);
      } catch {
        // silently fail — stats just show 0
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Calculate statistics from actual product data (not fake APIs)
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 5).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  const recentProducts = products.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome header */}
      <div>
        <h2 className="text-xl font-bold text-main-text mb-1">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-secondary-text text-sm">Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Products"
            value={stats.total}
            icon={Package}
            color="primary"
            description="All products in store"
          />
          <StatCard
            title="Available"
            value={stats.inStock}
            icon={CheckCircle}
            color="success"
            description="Stock > 5 units"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            icon={AlertTriangle}
            color="warning"
            description="1–5 units remaining"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={XCircle}
            color="danger"
            description="0 units remaining"
          />
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/products/add" className="btn-primary text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
        <Link to="/dashboard/products" className="btn-secondary text-sm inline-flex items-center gap-2">
          Manage Products <ArrowRight size={16} />
        </Link>
      </div>

      {/* Recent products */}
      {!loading && recentProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-main-text">Recent Products</h3>
            <Link
              to="/dashboard/products"
              className="text-sm text-primary hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card divide-y divide-border overflow-hidden">
            {recentProducts.map((product) => {
              const stockStatus =
                product.stock === 0
                  ? 'badge-danger'
                  : product.stock <= 5
                  ? 'badge-warning'
                  : 'badge-success';
              const stockLabel =
                product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock';

              return (
                <div key={product._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-primary/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-main-text truncate">{product.name}</p>
                    <p className="text-xs text-secondary-text">${parseFloat(product.price).toFixed(2)}</p>
                  </div>
                  <span className={stockStatus}>{stockLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
