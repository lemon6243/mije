import React, { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  objectPosition?: string;
}

/**
 * 이미지 주소가 비어있거나 로드 실패 시,
 * #161616 배경의 4:5 비율 빈 칸 중앙에 #2A2A2A 색상의 세리프 "MIJE'"를 표시합니다.
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  objectPosition = 'center',
}) => {
  const [hasError, setHasError] = useState(false);

  const isEmpty = !src || src.trim() === '';

  if (isEmpty || hasError) {
    return (
      <div
        className={`w-full h-full bg-[#161616] flex items-center justify-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-serif-luxury text-xs sm:text-sm tracking-[0.22em] text-[#2A2A2A]">
          MIJE&apos;
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setHasError(true)}
      style={{ objectPosition }}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};
export default ProductImage;
