import React from 'react';

interface SectionTitleProps {
  en: string;
  ko?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  en,
  ko,
  description,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 sm:mb-14 ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      <span className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl tracking-[0.16em] uppercase text-[#EDEAE4] block">
        {en}
      </span>
      {ko && (
        <span className="text-xs sm:text-sm text-[#C2A878] tracking-widest mt-1 block font-medium">
          {ko}
        </span>
      )}
      {description && (
        <p className="text-xs sm:text-sm text-[#9A958D] mt-3 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <div
        className={`h-[1px] w-10 bg-[#C2A878]/50 mt-4 ${
          isCenter ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
};
export default SectionTitle;
