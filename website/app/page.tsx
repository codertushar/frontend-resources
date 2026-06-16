import Script from 'next/script';
import ClientLayout from './ClientLayout';
import HomeContent from './HomeContent';
import { generateWebSiteSchema, generateCourseSchema, jsonLdScriptProps } from '../src/lib/structured-data';
import contentData from '../src/data/content.json';
import type { Article } from '../src/types/content';

const articles = contentData as Article[];

export default function HomePage() {
  const websiteSchema = generateWebSiteSchema();
  const courseSchema = generateCourseSchema();

  // Calculate category counts for server-rendered content
  const categoryCounts: Record<string, number> = {};
  articles.forEach((article) => {
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
  });

  return (
    <>
      {/* Structured data for better Google indexing */}
      <Script
        id="website-schema"
        strategy="beforeInteractive"
        {...jsonLdScriptProps(websiteSchema)}
      />
      <Script
        id="course-schema"
        strategy="beforeInteractive"
        {...jsonLdScriptProps(courseSchema)}
      />
      <ClientLayout>
        {/* Server-rendered SEO content - visible to crawlers without JavaScript */}
        <div className="sr-only-seo" aria-hidden="true">
          <h1>CrackFrontend - Ace Your Frontend Interviews</h1>
          <p>
            A curated collection of {articles.length}+ in-depth resources, real-world patterns,
            and interview-focused guides to land your dream frontend role. Master JavaScript,
            React, System Design, DSA, and coding patterns for frontend interviews at top tech companies.
          </p>
          <h2>Browse by Category</h2>
          <nav>
            <ul>
              <li><a href="/library?category=js">JavaScript Deep Dives - {categoryCounts['js'] || 0} articles</a></li>
              <li><a href="/library?category=dsa">DSA for Frontend - {categoryCounts['dsa'] || 0} articles</a></li>
              <li><a href="/library?category=machine-coding">Machine Coding - {categoryCounts['machine-coding'] || 0} articles</a></li>
              <li><a href="/library?category=system-design">System Design - {categoryCounts['system-design'] || 0} articles</a></li>
              <li><a href="/library?category=general">Browser &amp; Patterns - {categoryCounts['general'] || 0} articles</a></li>
              <li><a href="/library?category=ai">AI Engineering - {categoryCounts['ai'] || 0} articles</a></li>
            </ul>
          </nav>
          <h2>Popular Topics</h2>
          <nav>
            <ul>
              <li><a href="/library?tags=react">React Interview Questions</a></li>
              <li><a href="/library?subcategory=design-patterns">JavaScript Design Patterns</a></li>
              <li><a href="/library?tags=promises">JavaScript Promises</a></li>
              <li><a href="/library?subcategory=polyfills">JavaScript Polyfills</a></li>
              <li><a href="/library?tags=closures">Closures</a></li>
              <li><a href="/library?tags=algorithms">Algorithms for Frontend</a></li>
            </ul>
          </nav>
        </div>
        <HomeContent />
      </ClientLayout>
    </>
  );
}
