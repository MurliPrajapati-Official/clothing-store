import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  children?: React.ReactNode;
}

export default function SEO({
  title,
  description,
  keywords,
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  children,
}: SEOProps) {
  const { pathname } = useLocation();
  const baseUrl = 'https://uniformtrends.in';
  const canonicalUrl = `${baseUrl}${pathname === '/' ? '' : pathname}`;
  
  const siteName = 'Uniform Trends';
  const defaultImage = 'https://uniformtrends.in/images/logo.svg';
  const defaultKeywords = 'school uniforms India, best school uniforms Mumbai, corporate uniform manufacturers, hospital scrubs wholesale, uniform supplier Delhi, custom uniforms Pune, Uniform Trends';

  const finalTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content={robots} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || finalTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {children}
    </Helmet>
  );
}
