import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://crackfrontend.in';

interface ArticleProps {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: ArticleProps | null;
  keywords?: string;
}

const SEO = ({
  title = 'CrackFrontend - Master Frontend Interviews',
  description = 'A curated collection of frontend engineering resources – from JS fundamentals to system design and interview-ready challenges.',
  image = '/og-image.png',
  url = '',
  type = 'website',
  article = null,
  keywords = 'frontend interview, javascript, react, system design, coding interview prep'
}: SEOProps) => {
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const fullTitle = title.includes('CrackFrontend') ? title : `${title} | CrackFrontend`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="CrackFrontend" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Article-specific tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author || 'CrackFrontend'} />
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO;
