import React, { useState, useEffect } from 'react';
import { X, Sparkles, Tag, DollarSign, Layers, Image as ImageIcon, Upload, Trash2, Link as LinkIcon } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

export default function ProductModal({ isOpen, onClose, onSave, editingProduct, productsCount }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Electrical & Lights',
    buyingPrice: '',
    retailPrice: '',
    stock: 10,
    unit: 'piece',
    image: ''
  });

  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url'

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        buyingPrice: editingProduct.buyingPrice?.toString() || '',
        retailPrice: editingProduct.retailPrice?.toString() || '',
        stock: editingProduct.stock?.toString() || '10',
        image: editingProduct.image || ''
      });
    } else {
      setFormData({
        code: `SHA-${101 + productsCount}`,
        name: '',
        category: 'Electrical & Lights',
        buyingPrice: '',
        retailPrice: '',
        stock: '10',
        unit: 'piece',
        image: ''
      });
    }
  }, [editingProduct, productsCount, isOpen]);

  if (!isOpen) return null;

  const buying = parseFloat(formData.buyingPrice) || 0;
  const retail = parseFloat(formData.retailPrice) || 0;
  const margin = retail - buying;
  const marginPct = buying > 0 ? ((margin / buying) * 100).toFixed(0) : 0;

  // File upload reader
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Image size is too large. Please select an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target?.result || '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Please fill out Product Code and Name.');
      return;
    }

    onSave({
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      category: formData.category,
      buyingPrice: parseFloat(formData.buyingPrice) || 0,
      retailPrice: parseFloat(formData.retailPrice) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      unit: formData.unit || 'piece',
      image: formData.image || ''
    });

    onClose();
  };

  const handleAutoCode = () => {
    setFormData(prev => ({ ...prev, code: `SHA-${101 + productsCount + Math.floor(Math.random() * 50)}` }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-500" />
              {editingProduct ? `Edit Product (${editingProduct.code})` : 'Add New Auto Product'}
            </h3>
            <p className="text-xs text-slate-400">Fill details to register or update product & photo</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Product Image Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-rose-500" /> Product Image
              </label>

              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                    imageTab === 'upload' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                    imageTab === 'url' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" /> Web URL
                </button>
              </div>
            </div>

            {/* Preview Box or Upload Input */}
            {formData.image ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center h-36">
                <img
                  src={formData.image}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {imageTab === 'upload' ? (
                  <label className="border-2 border-dashed border-slate-700 hover:border-rose-500/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-900/50 hover:bg-slate-900">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-300">Click to upload photo</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP up to 3MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste image URL (e.g., https://...)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder:text-slate-600 font-mono"
                    />
                    <p className="text-[10px] text-slate-500">Provide a direct link to an online image of the auto part.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code & Category */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Code *
              </label>
              <div className="flex">
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SHA-101"
                  className="w-full bg-slate-950 border border-slate-700 rounded-l-xl px-3 py-2 text-xs sm:text-sm text-white font-mono uppercase focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAutoCode}
                  title="Auto Generate"
                  className="bg-slate-800 hover:bg-slate-700 border border-l-0 border-slate-700 px-3 rounded-r-xl text-slate-300 text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., LED Projector Fog Lamp 12V Dual Color"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Buying Price & Retail Price */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Buying Price (Cost) Rs. *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.buyingPrice}
                onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                placeholder="Shop cost"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Retail Price (Rate) Rs. *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.retailPrice}
                onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                placeholder="Customer rate"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Stock & Unit & Margin Preview */}
          <div className="grid grid-cols-2 gap-3.5 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Stock Qty *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Projected Margin</span>
              <span className={`font-mono font-bold text-sm ${margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {margin >= 0 ? `+Rs. ${margin.toLocaleString()}` : `-Rs. ${Math.abs(margin).toLocaleString()}`} 
                <span className="text-[11px] text-slate-500 ml-1 font-sans">({marginPct}%)</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 transition"
            >
              {editingProduct ? 'Update Product' : 'Save Product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
