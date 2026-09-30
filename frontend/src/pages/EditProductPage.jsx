import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Package, DollarSign, Layers, Image } from 'lucide-react';
import { getProductById, updateProduct } from '../services/productService';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Pre-fill form with existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        const product = data.data.product;
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          stock: String(product.stock),
          image: product.image || '',
        });
      } catch {
        addToast('Product not found', 'error');
        navigate('/dashboard/products');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate, addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.price) newErrors.price = 'Price is required';
    else if (isNaN(form.price) || parseFloat(form.price) < 0) newErrors.price = 'Price must be a positive number';
    if (!form.stock && form.stock !== '0') newErrors.stock = 'Stock is required';
    else if (isNaN(form.stock) || parseInt(form.stock) < 0) newErrors.stock = 'Stock must be a non-negative number';
    if (form.image && !/^https?:\/\/.+/.test(form.image)) {
      newErrors.image = 'Image must be a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image: form.image || undefined,
      });
      addToast('Product updated successfully!', 'success');
      navigate('/dashboard/products');
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        addToast(err.response?.data?.message || 'Failed to update product', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-main-text mb-1">Edit Product</h2>
        <p className="text-secondary-text text-sm">Update the product details below.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <Input
            id="edit-name"
            name="name"
            type="text"
            label="Product Name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            leftIcon={Package}
            required
          />

          <div>
            <label htmlFor="edit-description" className="label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-danger" role="alert">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="edit-price"
              name="price"
              type="number"
              label="Price ($)"
              value={form.price}
              onChange={handleChange}
              error={errors.price}
              leftIcon={DollarSign}
              min="0"
              step="0.01"
              required
            />
            <Input
              id="edit-stock"
              name="stock"
              type="number"
              label="Stock Quantity"
              value={form.stock}
              onChange={handleChange}
              error={errors.stock}
              leftIcon={Layers}
              min="0"
              step="1"
              required
            />
          </div>

          <Input
            id="edit-image"
            name="image"
            type="url"
            label="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
            error={errors.image}
            leftIcon={Image}
          />

          {form.image && /^https?:\/\/.+/.test(form.image) && (
            <div className="rounded-lg overflow-hidden border border-border aspect-video bg-gray-50">
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button type="submit" variant="primary" loading={loading} className="flex-1 py-2.5">
              Save Changes
            </Button>
            <Link to="/dashboard/products" className="btn-secondary py-2.5 px-4 text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
