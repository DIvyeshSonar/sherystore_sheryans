import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getProducts, deleteProduct } from '../services/productService';
import { useToast } from '../context/ToastContext';
import ProductTable from '../components/ProductTable';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import Button from '../components/Button';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); // The product pending deletion
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(data.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open delete confirmation modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  // Confirmed delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(productToDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      addToast(`"${productToDelete.name}" has been deleted.`, 'success');
      setProductToDelete(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-main-text mb-1">Products</h2>
          <p className="text-secondary-text text-sm">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          to="/dashboard/products/add"
          className="btn-primary text-sm inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Content */}
      {error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : !loading && products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to get started."
          action={
            <Link to="/dashboard/products/add" className="btn-primary text-sm">
              Add Product
            </Link>
          }
        />
      ) : (
        <ProductTable
          products={products}
          loading={loading}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Delete Product"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setProductToDelete(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deleteLoading}
            >
              Delete Product
            </Button>
          </>
        }
      >
        <p className="text-sm text-secondary-text leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-main-text">&ldquo;{productToDelete?.name}&rdquo;</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ManageProductsPage;
