import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, Package
} from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SORTS = [
  { label: 'Newest First',       value: 'newest' },
  { label: 'Price: Low → High',  value: 'price_asc' },
  { label: 'Price: High → Low',  value: 'price_desc' },
  { label: 'Name: A → Z',        value: 'name_asc' },
];

const AVAILABILITY = [
  { label: 'All Items',     value: 'all' },
  { label: 'In Stock',      value: 'in' },
  { label: 'Low Stock',     value: 'low' },
  { label: 'Out of Stock',  value: 'out' },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debounced, setDebounced] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [avail, setAvail] = useState('all');
  const [drawer, setDrawer] = useState(false);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ search: debounced || undefined, page, limit: 12 });
      let prods = res.data.products;

      // Client sort
      if (sort === 'price_asc')  prods = [...prods].sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') prods = [...prods].sort((a, b) => b.price - a.price);
      if (sort === 'name_asc')   prods = [...prods].sort((a, b) => a.name.localeCompare(b.name));

      // Client availability filter
      if (avail === 'in')  prods = prods.filter((p) => p.stock > 5);
      if (avail === 'low') prods = prods.filter((p) => p.stock > 0 && p.stock <= 5);
      if (avail === 'out') prods = prods.filter((p) => p.stock === 0);

      setProducts(prods);
      setTotalPages(res.data.pagination.totalPages);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [debounced, page, sort, avail]);

  useEffect(() => { load(); }, [load]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Availability</p>
        <div className="space-y-1">
          {AVAILABILITY.map((a) => (
            <button key={a.value} onClick={() => { setAvail(a.value); setDrawer(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                avail === a.value ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}>
              {a.label}
              {avail === a.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Products</h1>
              <p className="text-slate-500 text-sm mt-1">
                {loading ? 'Loading...' : `${products.length} products`}
                {debounced && <span className="font-semibold text-slate-700"> for "{debounced}"</span>}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="product-search" type="search" placeholder="Search..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all"
                  aria-label="Search products" />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={13} />
                  </button>
                )}
              </div>
              {/* Sort */}
              <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}
                className="hidden sm:block py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 font-medium cursor-pointer">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {/* Mobile filter */}
              <button onClick={() => setDrawer(true)} id="filter-btn"
                className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 font-semibold transition-all">
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={14} className="text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">Filters</h3>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Active chips */}
            {(debounced || avail !== 'all') && (
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <span className="text-xs text-slate-500 font-semibold">Filters:</span>
                {debounced && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    "{debounced}" <button onClick={() => setSearch('')}><X size={11} /></button>
                  </span>
                )}
                {avail !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    {AVAILABILITY.find((a) => a.value === avail)?.label}
                    <button onClick={() => setAvail('all')}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
            ) : error ? (
              <ErrorMessage message={error} onRetry={load} />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <Package size={28} className="text-indigo-300" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {debounced ? 'No results found' : 'No products yet'}
                </h3>
                <p className="text-sm text-slate-500 mb-5 max-w-xs">
                  {debounced ? `No products match "${debounced}".` : 'Products will appear here once added.'}
                </p>
                {debounced && <button onClick={() => setSearch('')} className="btn-secondary text-sm">Clear Search</button>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} id="page-prev"
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <button key={p} onClick={() => setPage(p)} id={`page-${p}`}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            p === page
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                          }`}>
                          {p}
                        </button>
                      ))}
                    <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} id="page-next"
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setDrawer(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 shadow-2xl animate-slide-up lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900">Filters & Sort</h3>
              <button onClick={() => setDrawer(false)} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800">
                <X size={16} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sort By</p>
              <div className="grid grid-cols-2 gap-2">
                {SORTS.map((s) => (
                  <button key={s.value} onClick={() => setSort(s.value)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
                      sort === s.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <FilterContent />
            <button onClick={() => setDrawer(false)} className="btn-primary w-full mt-6 py-3 justify-center">
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
