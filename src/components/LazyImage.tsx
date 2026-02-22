import React, { useState } from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean; // Para imagens above-the-fold
  sizes?: string;
  srcSet?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  placeholder,
  onLoad,
  onError,
  priority = false,
  sizes,
  srcSet,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { trackEvent } = useAnalytics();

  const handleLoad = () => {
    setIsLoaded(true);

    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);

    // Track image load error
    trackEvent("image_error", "performance", alt);

    if (onError) onError();
  };

  // Placeholder enquanto a imagem não carrega
  const placeholderSrc =
    placeholder ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder ou imagem de erro - Mantido no DOM para permitir transição suave */}
      <img
        src={placeholderSrc}
        alt={hasError ? "Erro ao carregar imagem" : "Carregando..."}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded && !hasError ? "opacity-0" : "opacity-100"
        }`}
        style={{ filter: "blur(5px)", pointerEvents: "none" }}
      />

      {/* Imagem principal */}
      {!hasError && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;
