import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasFirstImage = product.images && product.images.length > 0 && !!product.images[0];
  const hasSecondImage = product.images && product.images.length > 1 && !!product.images[1];

  // Determine total remaining stock
  const totalStock = product.options.reduce((sum, opt) => sum + opt.stock, 0);
  const isSoldOut = totalStock <= 0;

  const targetPath =
    product.type === 'handmade'
      ? `/handmade/${product.slug}`
      : `/ready-made/${product.slug}`;

  return (
    <article className="group flex flex-col">
      <Link
        to={targetPath}
        className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`${product.name}, 가격 ${product.price.toLocaleString()}원`}
      >
        {/* 4:5 Fixed Aspect Ratio Container */}
        <div className="relative w-full aspect-[4/5] bg-[#161616] overflow-hidden border border-[#2A2A2A]/40 transition-colors duration-300 group-hover:border-[#2A2A2A]">
          {hasFirstImage ? (
            <>
              {/* Primary Image */}
              <img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isHovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
                }`}
                loading="lazy"
              />

              {/* Secondary Hover Image (if available) */}
              {hasSecondImage && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} 상세 각도`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            /* Clean #161616 Placeholder with #2A2A2A Cormorant Garamond MIJE' */
            <ProductImage alt={product.name} />
          )}

          {/* Subtle Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
            {product.type === 'handmade' && (
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#0E0E0E]/85 border border-[#2A2A2A] text-[#C2A878] font-serif">
                {product.isLimited ? '1점 제작' : '소량 제작'}
              </span>
            )}
            {isSoldOut && (
              <span className="text-[10px] tracking-wider px-2 py-0.5 bg-[#0E0E0E]/90 border border-[#2A2A2A] text-[#6F6A63]">
                품절
              </span>
            )}
          </div>
        </div>

        {/* Info below image */}
        <div className="pt-3.5 pb-2 text-left space-y-1">
          <div className="text-[11px] text-[#9A958D] tracking-wide">
            {product.material}
          </div>
          <h3 className="text-sm text-[#EDEAE4] font-medium leading-snug line-clamp-1 group-hover:text-[#C2A878] transition-colors">
            {product.name}
          </h3>
          <div className="text-sm font-serif tracking-wide text-[#EDEAE4] pt-0.5">
            {isSoldOut ? (
              <span className="text-[#6F6A63] text-xs">품절되었습니다</span>
            ) : (
              <span>{product.price.toLocaleString()}원</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};
export default ProductCard;
