import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noIndex = false
}) => {
  const siteUrl = 'https://xperience.com.br';
  const fullTitle = title.includes('Xperience') ? title : `${title} | Xperience - Mentoria para Empreendedores`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || `${siteUrl}${window.location.pathname}`} />
      <meta property="og:site_name" content="Xperience" />
      {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />}
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Additional SEO meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Xperience" />
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR" />
      <meta name="geo.country" content="Brazil" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Xperience",
          "url": siteUrl,
          "logo": `${siteUrl}/logo.svg`,
          "description": "Programa de mentoria para empreendedores que desejam transformar suas ideias em negócios de sucesso",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR"
          },
          "sameAs": [
            "https://www.linkedin.com/company/xperience",
            "https://www.instagram.com/xperience"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
