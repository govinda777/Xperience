import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";
export const LazyImage = ({ src, alt, className = "", placeholder, onLoad, onError, priority = false, sizes, srcSet, }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Se priority=true, carrega imediatamente
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const { trackEvent } = useAnalytics();
    useEffect(() => {
        if (priority)
            return; // Não usar Intersection Observer para imagens prioritárias
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            });
        }, {
            rootMargin: "50px", // Começar a carregar 50px antes da imagem aparecer
        });
        if (imgRef.current) {
            observer.observe(imgRef.current);
        }
        return () => observer.disconnect();
    }, [priority]);
    const handleLoad = () => {
        setIsLoaded(true);
        // Track successful image load
        trackEvent("image_loaded", "performance", alt);
        if (onLoad)
            onLoad();
    };
    const handleError = () => {
        setHasError(true);
        // Track image load error
        trackEvent("image_error", "performance", alt);
        if (onError)
            onError();
    };
    // Placeholder enquanto a imagem não carrega
    const placeholderSrc = placeholder ||
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+";
    return (_jsxs("div", { className: `relative overflow-hidden ${className}`, ref: imgRef, children: [(!isInView || !isLoaded || hasError) && (_jsx("img", { src: hasError ? placeholderSrc : placeholderSrc, alt: hasError ? "Erro ao carregar imagem" : "Carregando...", className: `absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded && !hasError ? "opacity-0" : "opacity-100"}`, style: { filter: "blur(5px)" } })), isInView && !hasError && (_jsx("img", { src: src, srcSet: srcSet, sizes: sizes, alt: alt, className: `w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`, onLoad: handleLoad, onError: handleError, loading: priority ? "eager" : "lazy", decoding: "async" })), isInView && !isLoaded && !hasError && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#F34A0D]" }) }))] }));
};
export default LazyImage;
