import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowRight, ShieldCheck, Package, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await login({ email: form.email, password: form.password });
      addToast('Welcome back! 🎉', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 transition-colors duration-200 animate-fade-in">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#4F46E5 0%,#6D28D9 60%,#7C3AED 100%)' }}>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/8 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 right-16 w-32 h-32 bg-white/6 rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingBag size={19} />
          </div>
          <span className="font-black text-xl tracking-tight">SheryStore</span>
        </div>

        {/* Main content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-white/20">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Secure & Encrypted
          </div>
          <h2 className="text-4xl font-black leading-tight mb-5 tracking-tight">
            Welcome back to<br />SheryStore
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-8">
            Sign in to access your dashboard, manage products, and track your store performance.
          </p>
          <div className="space-y-3">
            {[
              { Icon: ShieldCheck, text: 'JWT Secure Authentication' },
              { Icon: Package,     text: 'Full Product Management' },
              { Icon: Zap,         text: 'Fast Admin Dashboard' },
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

        {/* Bottom card */}
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

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-12 bg-slate-50 transition-colors">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBag size={17} className="text-white" />
            </div>
            <span className="font-black text-slate-900 text-lg">Shery<span className="text-indigo-600">Store</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign In</h1>
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl" role="alert">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700 font-medium">{apiError}</p>
            </div>
          )}

          {/* Admin Demo Credentials Box */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-600" /> Admin Access Credentials
              </span>
              <button
                type="button"
                onClick={() => setForm({ email: 'admin@sherystore.com', password: 'Admin@1234' })}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all active:scale-95"
              >
                Auto Fill Admin
              </button>
            </div>
            <div className="space-y-1 font-mono text-slate-700">
              <p><span className="text-slate-400 font-sans">Email:</span> admin@sherystore.com</p>
              <p><span className="text-slate-400 font-sans">Password:</span> Admin@1234</p>
            </div>
            <p className="mt-2.5 text-[11px] text-indigo-700/80 leading-relaxed font-sans border-t border-indigo-200/60 pt-2">
              🔒 <strong>Note:</strong> Only this Admin account can access the Admin Dashboard (<code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-800">/dashboard</code>). Customer accounts are restricted to browsing & shopping.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email" name="email" type="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={onChange}
                  autoComplete="email" required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password} onChange={onChange}
                  autoComplete="current-password" required
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${errors.password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" id="login-submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm justify-center mt-2 shadow-md shadow-indigo-600/20">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
