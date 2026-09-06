import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface FaviconWithFallbackProps {
  domain: string;
  faviconUrl?: string;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FaviconWithFallback: React.FC<FaviconWithFallbackProps> = ({
  domain,
  faviconUrl,
  title,
  className = 'w-auto h-5 object-contain',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  // Extract clean initial letters from domain or title
  const getInitials = () => {
    if (!domain) {
      return title ? title.slice(0, 2).toUpperCase() : 'W';
    }
    const cleanDomain = domain.replace(/^www\./i, '');
    const parts = cleanDomain.split('.');
    if (parts.length > 0 && parts[0]) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return cleanDomain.slice(0, 2).toUpperCase();
  };

  // Color generator based on domain name
  const getGradientClass = () => {
    const charCode = (domain || 'default').charCodeAt(0) % 5;
    switch (charCode) {
      case 0:
        return 'from-[#D3FF69]/20 to-emerald-500/20 text-[#D3FF69] border-[#D3FF69]/30';
      case 1:
        return 'from-[#97C8EC]/20 to-blue-500/20 text-[#97C8EC] border-[#97C8EC]/30';
      case 2:
        return 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30';
      case 3:
        return 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'from-[#53FFA9]/20 to-teal-500/20 text-[#53FFA9] border-[#53FFA9]/30';
    }
  };

  const containerSizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  if (faviconUrl && !hasError) {
    return (
      <img
        src={faviconUrl}
        alt={title || domain || 'Favicon'}
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback stylish avatar display
  const initials = getInitials();
  const gradientClass = getGradientClass();

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${gradientClass} border flex items-center justify-center font-caption font-extrabold tracking-wider shrink-0 shadow-inner ${containerSizes[size]}`}
      title={domain || title}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <Globe className="w-3.5 h-3.5 opacity-80" />
      )}
    </div>
  );
};
