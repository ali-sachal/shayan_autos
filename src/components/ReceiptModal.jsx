import React from 'react';
import { Printer, X } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, sale }) {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
        
        {/* Receipt Container */}
        <div id="thermal-receipt" className="bg-white text-black p-5 rounded-2xl font-mono text-xs shadow-inner">
          
          {/* Header */}
          <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
            <h2 className="text-base font-black tracking-wider uppercase text-black">
              SHAHYAN AUTOS
            </h2>
            <p className="text-[10px] text-gray-700">Auto Parts, Tuning & Electricals</p>
            <p className="text-[10px] text-gray-600 font-bold">Instagram: @shayan_autos741</p>
            
            <div className="flex justify-between text-[10px] mt-2.5 text-gray-600 border-t border-gray-200 pt-1.5">
              <span>{sale.invoice}</span>
              <span>{new Date(sale.timestamp).toLocaleDateString()} {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left my-2">
            <thead>
              <tr className="border-b border-gray-300 text-[10px] text-gray-700">
                <th className="py-1">Item [Code]</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sale.items.map((item, idx) => (
                <tr key={idx} className="text-[10px]">
                  <td className="py-1 pr-1">
                    <div className="font-bold text-black">{item.name}</div>
                    <div className="text-[9px] text-gray-500">[{item.code}]</div>
                  </td>
                  <td className="py-1 text-center font-bold">{item.qty}</td>
                  <td className="py-1 text-right text-gray-700">Rs. {item.retailPrice}</td>
                  <td className="py-1 text-right font-bold text-black">Rs. {item.retailPrice * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Totals */}
          <div className="border-t border-dashed border-gray-400 pt-2 space-y-1 text-right text-[11px]">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>Rs. {sale.subtotal.toLocaleString()}</span>
            </div>
            
            {sale.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Discount:</span>
                <span>-Rs. {sale.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between font-black text-sm border-t border-gray-300 pt-1 text-black">
              <span>TOTAL DUE:</span>
              <span>Rs. {sale.grandTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-[10px] text-gray-600 pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{sale.paymentMethod}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[9px] text-gray-500 mt-4 pt-2 border-t border-dashed border-gray-400 leading-tight">
            <p className="font-bold text-gray-700">Thank you for visiting Shahyan Autos!</p>
            <p className="mt-0.5">Goods once sold can be exchanged within 3 days with receipt.</p>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="flex gap-2.5 mt-5 pt-3 border-t border-slate-800">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition"
          >
            <Printer className="w-4 h-4" /> Print Thermal Receipt
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

