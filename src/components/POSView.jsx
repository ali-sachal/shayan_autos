import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, Receipt, CreditCard, Banknote, Smartphone, CheckCircle, ShoppingBag, Image as ImageIcon } from 'lucide-react';

export default function POSView({ products, cart, setCart, onCompleteSale }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Filter products for the POS catalog
  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
  });

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(`"${product.name}" is currently out of stock!`);
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert(`Cannot add more than available stock (${product.stock} ${product.unit || 'units'})`);
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    const prod = products.find(p => p.id === id);
    if (!item || !prod) return;

    const newQty = item.qty + delta;
    if (newQty > prod.stock) {
      alert(`Maximum stock is ${prod.stock}`);
      return;
    }

    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, qty: newQty } : i));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (cart.length > 0 && confirm('Clear all items from current invoice?')) {
      setCart([]);
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.retailPrice * item.qty), 0);
  const totalDiscount = Math.max(0, Math.min(subtotal, Number(discount) || 0));
  const grandTotal = Math.max(0, subtotal - totalDiscount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your billing cart is empty. Please select products to sell.');
      return;
    }

    onCompleteSale({
      items: [...cart],
      subtotal,
      discount: totalDiscount,
      grandTotal,
      paymentMethod
    });

    // Reset discount
    setDiscount(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Product Selection Grid */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-500" /> POS Product Selector
              </h2>
              <p className="text-xs text-slate-400">Click any item to add to the invoice</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Code or Name..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-slate-500"
            />
          </div>

          {/* Grid of Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredProducts.map(product => {
              const inStock = product.stock > 0;
              const cartItem = cart.find(i => i.id === product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`border rounded-2xl p-3 cursor-pointer transition select-none flex flex-col justify-between ${
                    inStock 
                      ? 'bg-slate-950/70 border-slate-800 hover:border-rose-500/70 hover:bg-slate-950' 
                      : 'bg-slate-950/30 border-slate-900 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex gap-2.5">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-700" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded text-[11px] border border-rose-500/20">
                          {product.code}
                        </span>
                        <span className={`text-[10px] font-semibold ${inStock ? 'text-slate-400' : 'text-rose-500'}`}>
                          {inStock ? `Stock: ${product.stock}` : 'Out'}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1 leading-snug">
                        {product.name}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-xs text-slate-400">{product.category}</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      Rs. {product.retailPrice.toLocaleString()}
                    </span>
                  </div>

                  {cartItem && (
                    <div className="mt-2 bg-rose-500/10 border border-rose-500/30 rounded-lg py-1 text-center text-rose-400 text-xs font-bold">
                      {cartItem.qty} in bill
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Invoice Register & Billing Cart */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-full">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-500" /> Current Invoice
              </h3>
              <p className="text-xs text-slate-400">Shahyan Autos POS Terminal</p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Item Rows */}
          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[350px] min-h-[160px] pr-1">
            {cart.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-center">
                <Receipt className="w-10 h-10 mb-2 text-slate-700 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-400">Invoice is currently empty</p>
                <p className="text-xs text-slate-600 mt-0.5">Click products on the left to add items</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-2">
                    <div className="font-mono text-rose-400 font-bold text-[11px]">{item.code}</div>
                    <div className="font-semibold text-white truncate max-w-[170px] leading-snug">{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Rs. {item.retailPrice.toLocaleString()} each</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Qty Counter */}
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 hover:text-white text-slate-400 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono font-bold text-white text-xs">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 hover:text-white text-slate-400 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-white w-16 text-right">
                      Rs. {(item.retailPrice * item.qty).toLocaleString()}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-slate-800 pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400 text-xs">
              <span>Subtotal</span>
              <span className="font-mono text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Discount (Rs.)</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right text-white font-mono text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
              <span className="font-bold text-slate-200">Total Payable</span>
              <span className="font-mono text-2xl font-black text-rose-500">
                Rs. {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-4 space-y-3">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  paymentMethod === 'Cash'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" /> Cash
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Online')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  paymentMethod === 'Online'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Online
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                  paymentMethod === 'Card'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Card
              </button>
            </div>

            {/* Complete Sale Action Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-900/40 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <CheckCircle className="w-5 h-5" /> Complete Sale & Print Bill
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

