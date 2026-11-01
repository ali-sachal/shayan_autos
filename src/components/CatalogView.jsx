import React, { useState, useMemo } from 'react';
import { Search, Tag, MessageCircle, CheckCircle2, XCircle, RotateCcw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

export default function CatalogView({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = 
        selectedCategory === 'All Categories' || product.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        product.name.toLowerCase().includes(term) || 
        product.code.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Search Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/60 p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Instant Rate & Code Lookup
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Check Product Code & Official Rates
          </h2>
          <p className="text-slate-300 text-sm mt-2 mb-6">
            Search any auto part by its product code (e.g., <span className="font-mono text-rose-400 font-semibold">SHA-101</span>) or name to see updated prices.
          </p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Code (e.g., SHA-101) or Product Name..."
              className="w-full bg-slate-950/90 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm sm:text-base shadow-inner placeholder:text-slate-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === category
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="text-white font-semibold">{filteredProducts.length}</span> of {products.length} products
        </span>
        {(searchTerm || selectedCategory !== 'All Categories') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
            }}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800/80">
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-600 stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-300">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any product matching "<span className="text-rose-400">{searchTerm}</span>". Please check the code or contact Shahyan Autos directly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => {
            const isAvailable = product.stock > 0;
            const whatsappMsg = `Hello Shahyan Autos, I want to inquire about Product Code: ${product.code} - ${product.name} (Rate: Rs. ${product.retailPrice.toLocaleString()}). Is it available?`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={product.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl group hover:-translate-y-1 duration-200"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-gradient-to-b from-slate-900 to-slate-950">
                        <ImageIcon className="w-10 h-10 stroke-[1.5]" />
                        <span className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Shahyan Autos</span>
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md text-rose-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-800 shadow">
                        <Tag className="w-3 h-3" /> {product.code}
                      </span>

                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 shadow">
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-500/30 shadow">
                          <XCircle className="w-3 h-3" /> Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    {/* Name and Category */}
                    <span className="text-[11px] text-rose-400 font-bold uppercase tracking-wider block mb-1">
                      {product.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-400 transition leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Pricing & Order WhatsApp */}
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-end justify-between">
                  <div className="pt-3">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                      Retail Rate
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      Rs. {product.retailPrice.toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Inquire on WhatsApp"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition shadow-lg hover:shadow-emerald-600/30"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

