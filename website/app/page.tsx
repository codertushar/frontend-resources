import Script from 'next/script';
import ClientLayout from './ClientLayout';
import HomeContent from './HomeContent';
import { generateWebSiteSchema, generateCourseSchema, jsonLdScriptProps } from '../src/lib/structured-data';

export default function HomePage() {
  const websiteSchema = generateWebSiteSchema();
  const courseSchema = generateCourseSchema();

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
        <HomeContent />
      </ClientLayout>
    </>
  );
}
