import React from 'react';
import { Tag, ShoppingCart, BarChart3, Instagram, Wrench, ShieldCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, cartCount, onOpenAdmin, isAdminUnlocked }) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/40 text-white">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                Shahyan <span className="text-rose-500">Autos</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-500/20">
                <ShieldCheck className="w-3 h-3" /> Verified Shop
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>Auto Parts & Tuning</span>
              <span>•</span>
              <a 
                href="https://www.instagram.com/shayan_autos741?psln=b2VqdWtqd2U4M2V3" 
                target="_blank" 
                rel="noreferrer"
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition font-medium"
              >
                <Instagram className="w-3.5 h-3.5" />
                @shayan_autos741
              </a>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400/50'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Rate Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 relative ${
              activeTab === 'pos'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400/50'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">POS Counter</span>
            {cartCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-1.5 py-0.2 rounded-full font-mono">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAdmin}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400/50'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Panel</span>
            {isAdminUnlocked && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </nav>

      </div>
    </header>
  );
}

