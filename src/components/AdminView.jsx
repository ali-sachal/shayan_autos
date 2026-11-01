import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Download, Upload, 
  DollarSign, TrendingUp, ShoppingBag, Layers, AlertTriangle, 
  PieChart as PieIcon, BarChart2, Clock, Image as ImageIcon 
} from 'lucide-react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CATEGORIES } from '../data/initialProducts';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function AdminView({ 
  products, 
  salesHistory, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onExportData,
  onImportData
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Calculate today's sales
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysSales = useMemo(() => {
    return salesHistory.filter(s => s.timestamp.slice(0, 10) === todayStr);
  }, [salesHistory, todayStr]);

  const dailyRevenue = useMemo(() => {
    return todaysSales.reduce((acc, s) => acc + s.grandTotal, 0);
  }, [todaysSales]);

  const dailyProfit = useMemo(() => {
    return todaysSales.reduce((acc, s) => acc + s.profit, 0);
  }, [todaysSales]);

  const totalAllTimeRevenue = useMemo(() => {
    return salesHistory.reduce((acc, s) => acc + s.grandTotal, 0);
  }, [salesHistory]);

  const totalAllTimeProfit = useMemo(() => {
    return salesHistory.reduce((acc, s) => acc + s.profit, 0);
  }, [salesHistory]);

  const totalAllTimeCost = Math.max(0, totalAllTimeRevenue - totalAllTimeProfit);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesQuery = p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [products, searchTerm, selectedCategory]);

  // Category Pie Graph Data
  const pieChartData = useMemo(() => {
    const catSales = {};
    
    // Calculate from sales
    salesHistory.forEach(sale => {
      sale.items.forEach(item => {
        catSales[item.category] = (catSales[item.category] || 0) + (item.retailPrice * item.qty);
      });
    });

    // If no sales yet, show current stock inventory distribution
    if (Object.keys(catSales).length === 0) {
      products.forEach(p => {
        catSales[p.category] = (catSales[p.category] || 0) + (p.retailPrice * p.stock);
      });
    }

    const labels = Object.keys(catSales);
    const data = Object.values(catSales);
    const backgroundColors = [
      '#e11d48', // rose-600
      '#f59e0b', // amber-500
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#8b5cf6', // purple-500
      '#ec4899', // pink-500
      '#06b6d4'  // cyan-500
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Sales (Rs.)',
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: '#0f172a',
          borderWidth: 2,
        }
      ]
    };
  }, [salesHistory, products]);

  // Bar Chart Data (Revenue vs Cost vs Profit)
  const barChartData = useMemo(() => {
    return {
      labels: ['Gross Revenue', 'Buying Cost', 'Net Profit'],
      datasets: [
        {
          label: 'Amount in Rs.',
          data: [totalAllTimeRevenue, totalAllTimeCost, totalAllTimeProfit],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
          borderRadius: 8,
        }
      ]
    };
  }, [totalAllTimeRevenue, totalAllTimeCost, totalAllTimeProfit]);

  return (
    <div className="space-y-8">
      
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Daily Sale */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Today's Daily Sale
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono mt-3">
            Rs. {dailyRevenue.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Live daily revenue
          </span>
        </div>

        {/* Daily Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Today's Net Profit
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-400 font-mono mt-3">
            Rs. {dailyProfit.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">
            Retail price minus buying price
          </span>
        </div>

        {/* Daily Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Today's Invoices
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono mt-3">
            {todaysSales.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">
            Completed transactions
          </span>
        </div>

        {/* Total Inventory */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono mt-3">
            {products.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">
            Active SKU inventory catalog
          </span>
        </div>

      </div>

      {/* Analytics Charts (Pie Graph & Comparison Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales by Category PIE GRAPH */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-rose-500" /> Sales by Category (Pie Graph)
              </h3>
              <p className="text-xs text-slate-400">
                Visual breakdown of sales by category
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[300px] p-2">
            <div className="w-full max-w-[320px] max-h-[300px]">
              <Doughnut 
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#cbd5e1', font: { size: 11 } }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Revenue vs Cost Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-500" /> Financial Performance
              </h3>
              <p className="text-xs text-slate-400">
                Total Revenue vs Buying Cost vs Net Profit
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[300px] p-2">
            <div className="w-full max-h-[300px]">
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { 
                      ticks: { color: '#94a3b8' }, 
                      grid: { color: '#1e293b' } 
                    },
                    x: { 
                      ticks: { color: '#cbd5e1' }, 
                      grid: { display: false } 
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Product Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-500" /> Product & Price Manager
            </h3>
            <p className="text-xs text-slate-400">
              Manage product codes, buying prices, and retail rates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAddProduct}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-rose-900/30 transition"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>

            <button
              onClick={onExportData}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Backup JSON
            </button>

            <label className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Restore
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={onImportData}
              />
            </label>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code or product name..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-slate-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Photo</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Buying Price</th>
                <th className="py-3.5 px-4 text-right">Retail Rate</th>
                <th className="py-3.5 px-4 text-right">Profit / Unit</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const profitUnit = p.retailPrice - p.buyingPrice;
                  const marginPct = p.buyingPrice > 0 ? ((profitUnit / p.buyingPrice) * 100).toFixed(0) : 100;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-4">
                        {p.image ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600 flex-shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-400">
                        {p.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        Rs. {p.buyingPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                        Rs. {p.retailPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs">
                        <span className="text-emerald-400 font-semibold">+Rs. {profitUnit.toLocaleString()}</span>
                        <span className="text-slate-500 text-[10px] block font-sans font-semibold">({marginPct}%)</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                          p.stock <= 5 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Sales Log Activity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" /> Sales Activity & Invoice History
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {salesHistory.length} sales recorded
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Total Bill</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {salesHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500">
                    No transactions recorded yet. Complete sales in POS billing to populate this log.
                  </td>
                </tr>
              ) : (
                salesHistory.slice(0, 50).map(s => {
                  const dateStr = new Date(s.timestamp).toLocaleString();
                  const itemsStr = s.items.map(i => `${i.qty}x ${i.code}`).join(', ');

                  return (
                    <tr key={s.invoice} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-mono font-bold text-rose-400">
                        {s.invoice}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                        {dateStr}
                      </td>
                      <td className="py-2.5 px-4 text-white truncate max-w-[220px]" title={itemsStr}>
                        {itemsStr}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">
                        {s.paymentMethod}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                        Rs. {s.grandTotal.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-emerald-400 font-bold">
                        +Rs. {s.profit.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

