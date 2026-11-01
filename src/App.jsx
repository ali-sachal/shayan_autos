import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import Header from './components/Header';
import CatalogView from './components/CatalogView';
import POSView from './components/POSView';
import AdminView from './components/AdminView';
import ProductModal from './components/ProductModal';
import ReceiptModal from './components/ReceiptModal';
import AdminAuthModal from './components/AdminAuthModal';
import { Instagram, Phone, ShieldCheck } from 'lucide-react';

export default function App() {
  // Products state with localStorage persistence
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shahyan_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure default images are attached if missing
        return parsed.map(p => {
          if (!p.image) {
            const match = INITIAL_PRODUCTS.find(ip => ip.code === p.code || ip.id === p.id);
            if (match?.image) return { ...p, image: match.image };
          }
          return p;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Sales history state
  const [salesHistory, setSalesHistory] = useState(() => {
    const saved = localStorage.getItem('shahyan_sales');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // UI Navigation & Cart
  const [activeTab, setActiveTab] = useState('catalog');
  const [cart, setCart] = useState([]);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [latestSale, setLatestSale] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shahyan_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shahyan_sales', JSON.stringify(salesHistory));
  }, [salesHistory]);

  // Open Admin Handler
  const handleOpenAdmin = () => {
    if (isAdminUnlocked) {
      setActiveTab('admin');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdminUnlocked(true);
    setIsAuthModalOpen(false);
    setActiveTab('admin');
  };

  // Complete Sale Handler
  const handleCompleteSale = (saleData) => {
    // Generate invoice id
    const invoice = `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    
    // Calculate total buying cost
    const totalBuyingCost = saleData.items.reduce((sum, item) => sum + (item.buyingPrice * item.qty), 0);
    const profit = saleData.grandTotal - totalBuyingCost;

    const completedSale = {
      ...saleData,
      invoice,
      profit,
      timestamp: new Date().toISOString()
    };

    // Deduct stock from products
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartItem = saleData.items.find(item => item.id === prod.id);
        if (cartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartItem.qty)
          };
        }
        return prod;
      });
    });

    // Add to sales history
    setSalesHistory(prev => [completedSale, ...prev]);

    // Clear cart
    setCart([]);

    // Open receipt modal
    setLatestSale(completedSale);
    setIsReceiptModalOpen(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (productData) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === productData.id);
      if (exists) {
        return prev.map(p => p.id === productData.id ? productData : p);
      } else {
        return [productData, ...prev];
      }
    });
  };

  // Edit product
  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    const p = products.find(i => i.id === productId);
    if (!p) return;
    if (confirm(`Are you sure you want to delete "${p.name}" (${p.code})?`)) {
      setProducts(prev => prev.filter(item => item.id !== productId));
    }
  };

  // Export JSON
  const handleExportData = () => {
    const backup = {
      store: 'Shahyan Autos',
      exportDate: new Date().toISOString(),
      products,
      salesHistory
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shahyan_autos_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          if (data.salesHistory && Array.isArray(data.salesHistory)) {
            setSalesHistory(data.salesHistory);
          }
          alert('Inventory and sales data restored successfully!');
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
        onOpenAdmin={handleOpenAdmin}
        isAdminUnlocked={isAdminUnlocked}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalog' && (
          <CatalogView products={products} />
        )}

        {activeTab === 'pos' && (
          <POSView
            products={products}
            cart={cart}
            setCart={setCart}
            onCompleteSale={handleCompleteSale}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            products={products}
            salesHistory={salesHistory}
            onAddProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Shahyan Autos</span>
            <span>•</span>
            <span>Auto Parts & Bike Tuning Specialists</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://www.instagram.com/shayan_autos741?psln=b2VqdWtqd2U4M2V3"
              target="_blank"
              rel="noreferrer"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition font-medium"
            >
              <Instagram className="w-4 h-4" /> @shayan_autos741
            </a>

            <button
              onClick={handleOpenAdmin}
              className="hover:text-slate-300 transition"
            >
              {isAdminUnlocked ? 'Admin Mode Active' : 'Admin Login'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        productsCount={products.length}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={latestSale}
      />

      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

    </div>
  );
}

