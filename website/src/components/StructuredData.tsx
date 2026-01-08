import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://crackfrontend.in';

export const WebsiteStructuredData = (): JSX.Element => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CrackFrontend",
    "alternateName": "Crack Frontend",
    "url": BASE_URL,
    "description": "A curated collection of frontend engineering resources – from JS fundamentals to system design and interview-ready challenges.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/library?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  modifiedDate?: string;
  category: string;
  difficulty: string;
  isPremium?: boolean;
}

export const ArticleStructuredData = ({
  title,
  description,
  url,
  publishedDate,
  modifiedDate,
  category,
  difficulty,
  isPremium = false
}: ArticleStructuredDataProps): JSX.Element => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "url": `${BASE_URL}${url}`,
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "author": {
      "@type": "Organization",
      "name": "CrackFrontend"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CrackFrontend",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "articleSection": category,
    "educationalLevel": difficulty,
    "isAccessibleForFree": !isPremium,
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Frontend Development",
      "description": "Web development focusing on user interface and experience"
    },
    "teaches": title,
    "learningResourceType": "Tutorial"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps): JSX.Element => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${BASE_URL}${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface CourseStructuredDataProps {
  name: string;
  description: string;
  category: string;
  totalArticles: number;
}

export const CourseStructuredData = ({
  name,
  description,
  category,
  totalArticles
}: CourseStructuredDataProps): JSX.Element => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "CrackFrontend",
      "sameAs": BASE_URL
    },
    "educationalLevel": "Intermediate to Advanced",
    "inLanguage": "en-US",
    "numberOfCredits": totalArticles,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `PT${totalArticles}H`
    },
    "about": {
      "@type": "Thing",
      "name": category
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
