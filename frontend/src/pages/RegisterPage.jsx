import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag, ShieldCheck, Zap, Package } from 'lucide-react';
import { register } from '../services/authService';
import { useToast } from '../context/ToastContext';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const STRENGTH_CONFIG = [
  { label: 'Very Weak', color: 'bg-red-500' },
  { label: 'Weak', color: 'bg-amber-500' },
  { label: 'Fair', color: 'bg-yellow-400' },
  { label: 'Strong', color: 'bg-emerald-500' },
  { label: 'Very Strong', color: 'bg-green-600' },
];

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { addToast } = useToast();
  const navigate = useNavigate();

  const strength = form.password ? getPasswordStrength(form.password) : -1;
  const strengthConfig = strength >= 0 ? STRENGTH_CONFIG[strength] : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Password must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password)) newErrors.password = 'Password must contain a number';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      addToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 animate-fade-in">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#7C3AED 0%,#4F46E5 100%)' }}>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/8 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingBag size={19} />
          </div>
          <span className="font-black text-xl tracking-tight">SheryStore</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-black leading-tight mb-4 tracking-tight">
            Join Thousands of Happy Shoppers
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-6">
            Create your free account to save items to your cart, manage products, and enjoy fast checkout.
          </p>
          <div className="space-y-3">
            {[
              { Icon: ShieldCheck, text: 'Instant JWT Authentication' },
              { Icon: Package,     text: 'Interactive Shopping Cart' },
              { Icon: Zap,         text: 'Full Admin Privileges' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={13} />
                </div>
                <span className="text-sm text-white/80 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 bg-white/12 rounded-2xl p-4 border border-white/15">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0">
            SC
          </div>
          <div>
            <p className="text-sm font-bold">Sheryians Coding School</p>
            <p className="text-xs text-white/55">Authentication & CRUD Assignment</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-12 bg-slate-50 transition-colors">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {apiError && (
            <div className="mb-5 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium" role="alert">
              {apiError}
            </div>
          )}

          {/* Admin Demo Credentials Box */}
          <div className="mb-5 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-600" /> Admin Credentials Info
              </span>
              <Link
                to="/login"
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all active:scale-95 text-[11px]"
              >
                Go to Sign In
              </Link>
            </div>
            <div className="space-y-0.5 font-mono text-slate-700">
              <p><span className="text-slate-400 font-sans">Email:</span> admin@sherystore.com</p>
              <p><span className="text-slate-400 font-sans">Password:</span> Admin@1234</p>
            </div>
            <p className="mt-2 text-[11px] text-indigo-700/80 leading-relaxed font-sans border-t border-indigo-200/60 pt-1.5">
              🔒 <strong>Note:</strong> Only this Admin account has access to the Admin Panel (<code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-800">/dashboard</code>). New registrations are assigned the Customer role.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-name" name="name" type="text"
                  placeholder="John Doe"
                  value={form.name} onChange={handleChange}
                  autoComplete="name" required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${errors.name ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-email" name="email" type="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  autoComplete="email" required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password" required
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${errors.password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>}

              {/* Password strength indicator */}
              {form.password && strengthConfig && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength - 1 ? strengthConfig.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Strength: <span className="font-semibold text-slate-700">{strengthConfig.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-confirm" name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={handleChange}
                  autoComplete="new-password" required
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${errors.confirmPassword ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm justify-center mt-2 shadow-md shadow-indigo-600/20"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
