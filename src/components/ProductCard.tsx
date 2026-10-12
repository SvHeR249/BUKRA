import React from 'react';
import { Product } from '../types/bukra';
import { ShoppingBag, Zap, Smartphone, Sun, Laptop, Coffee, Wind, Armchair } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onDirectBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onDirectBuy,
}) => {
  const installmentMonthly = Math.ceil(product.price / 3);

  const getProductIcon = (id: string) => {
    switch (id) {
      case 'prod-mara-x2':
        return <Smartphone className="w-14 h-14 text-white/90 drop-shadow-md" />;
      case 'prod-suncharge-500':
        return <Sun className="w-14 h-14 text-white/90 drop-shadow-md" />;
      case 'prod-virunga-laptop':
        return <Laptop className="w-14 h-14 text-white/90 drop-shadow-md" />;
      case 'prod-kivu-coffee-set':
        return <Coffee className="w-14 h-14 text-white/90 drop-shadow-md" />;
      case 'prod-air-purifier':
        return <Wind className="w-14 h-14 text-white/90 drop-shadow-md" />;
      default:
        return <Armchair className="w-14 h-14 text-white/90 drop-shadow-md" />;
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Product Image / Resilient Fallback Container */}
      <div className={`relative h-56 w-full bg-gradient-to-br ${product.gradientTheme} p-6 flex flex-col justify-between overflow-hidden`}>
        {/* Subtle decorative mesh overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top bar on image */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/80 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
            {product.category}
          </span>
          {product.badge && (
            <span className="text-[11px] font-semibold text-emerald-950 bg-emerald-200/95 px-2 py-0.5 rounded shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Center Artwork Icon */}
        <div className="relative z-10 flex items-center justify-center my-auto transform group-hover:scale-105 transition-transform duration-300">
          {getProductIcon(product.id)}
        </div>

        {/* Bottom SKU spec kicker */}
        <div className="relative z-10 text-[11px] font-mono text-white/70 tracking-wide">
          SKU: {product.sku}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
            <span>Kigali Merchant stock</span>
            <span aria-hidden="true">·</span>
            <span>Same-Day Kigali dispatch</span>
          </div>

          <h3 className="text-base font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.specs.slice(0, 2).map((spec, idx) => (
              <span
                key={idx}
                className="text-[11px] font-normal text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Bukra 0% Interest Installment Highlight */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-xs text-neutral-500 block">Retail Price</span>
              <span className="text-lg font-bold text-neutral-900 tabular-nums">
                {product.price.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
              </span>
            </div>

            {/* Bukra BNPL Breakdown */}
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 block flex items-center justify-end gap-1">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                Bukra 0% Interest
              </span>
              <span className="text-xs font-semibold text-neutral-800 tabular-nums">
                3× {installmentMonthly.toLocaleString()} <span className="text-[10px] font-normal text-neutral-500">RWF/mo</span>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button
              onClick={() => onDirectBuy(product)}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-98"
            >
              Pay with Bukra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
