import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
export const SEOHead = ({ title, description, keywords, ogImage, canonical, noIndex = false, }) => {
    const siteUrl = "https://xperience.com.br";
    const fullTitle = title.includes("Xperience")
        ? title
        : `${title} | Xperience - Mentoria para Empreendedores`;
    return (_jsxs(Helmet, { children: [_jsx("title", { children: fullTitle }), _jsx("meta", { name: "description", content: description }), keywords && _jsx("meta", { name: "keywords", content: keywords }), _jsx("meta", { property: "og:title", content: fullTitle }), _jsx("meta", { property: "og:description", content: description }), _jsx("meta", { property: "og:type", content: "website" }), _jsx("meta", { property: "og:url", content: canonical || `${siteUrl}${window.location.pathname}` }), _jsx("meta", { property: "og:site_name", content: "Xperience" }), ogImage && (_jsx("meta", { property: "og:image", content: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}` })), _jsx("meta", { name: "twitter:card", content: "summary_large_image" }), _jsx("meta", { name: "twitter:title", content: fullTitle }), _jsx("meta", { name: "twitter:description", content: description }), ogImage && (_jsx("meta", { name: "twitter:image", content: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}` })), canonical && _jsx("link", { rel: "canonical", href: canonical }), noIndex && _jsx("meta", { name: "robots", content: "noindex, nofollow" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("meta", { name: "author", content: "Xperience" }), _jsx("meta", { name: "language", content: "pt-BR" }), _jsx("meta", { name: "geo.region", content: "BR" }), _jsx("meta", { name: "geo.country", content: "Brazil" }), _jsx("script", { type: "application/ld+json", children: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "Xperience",
                    url: siteUrl,
                    logo: `${siteUrl}/logo.svg`,
                    description: "Programa de mentoria para empreendedores que desejam transformar suas ideias em negócios de sucesso",
                    address: {
                        "@type": "PostalAddress",
                        addressCountry: "BR",
                    },
                    sameAs: [
                        "https://www.linkedin.com/company/xperience",
                        "https://www.instagram.com/xperience",
                    ],
                }) })] }));
};
export default SEOHead;
