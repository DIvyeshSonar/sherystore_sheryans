import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, DollarSign, Layers, Image, AlignLeft } from 'lucide-react';
import { createProduct } from '../services/productService';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

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
      newErrors.image = 'Image must be a valid URL (starting with http/https)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image: form.image || undefined,
      });
      addToast('Product created successfully!', 'success');
      navigate('/dashboard/products');
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        addToast(err.response?.data?.message || 'Failed to create product', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-main-text mb-1">Add New Product</h2>
        <p className="text-secondary-text text-sm">Fill in the details to add a product to your store.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <Input
            id="product-name"
            name="name"
            type="text"
            label="Product Name"
            placeholder="e.g. Wireless Bluetooth Headphones"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            leftIcon={Package}
            required
          />

          <div>
            <label htmlFor="product-description" className="label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              placeholder="Describe the product..."
              value={form.description}
              onChange={handleChange}
              className={`input resize-none ${errors.description ? 'input-error' : ''}`}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-danger" role="alert">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="product-price"
              name="price"
              type="number"
              label="Price ($)"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              error={errors.price}
              leftIcon={DollarSign}
              min="0"
              step="0.01"
              required
            />

            <Input
              id="product-stock"
              name="stock"
              type="number"
              label="Stock Quantity"
              placeholder="0"
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
            id="product-image"
            name="image"
            type="url"
            label="Image URL (optional)"
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChange={handleChange}
            error={errors.image}
            leftIcon={Image}
          />

          {/* Image preview */}
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
              Create Product
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

export default AddProductPage;
