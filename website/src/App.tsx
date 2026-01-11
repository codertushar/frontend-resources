import { lazy, Suspense, type LazyExoticComponent, type ComponentType, type ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './views/Home';
import { useCanonical } from './hooks/useCanonical';

import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Type for lazy-loaded page components
type LazyPage = LazyExoticComponent<ComponentType<object>>;

// Lazy load pages for better initial load performance (code splitting)
const Library: LazyPage = lazy(() => import('./views/LibraryRefactored'));
const ResourceDetail: LazyPage = lazy(() => import('./views/ResourceDetail'));
const Pricing: LazyPage = lazy(() => import('./views/Pricing'));
const Admin: LazyPage = lazy(() => import('./views/Admin'));
const MachineCodingList: LazyPage = lazy(() => import('./views/MachineCodingList'));
const MachineCodingDetail: LazyPage = lazy(() => import('./views/MachineCodingDetail'));
const About: LazyPage = lazy(() => import('./views/About'));
const Contact: LazyPage = lazy(() => import('./views/Contact'));
const Privacy: LazyPage = lazy(() => import('./views/Privacy'));
const Terms: LazyPage = lazy(() => import('./views/Terms'));

// Loading fallback component
const PageLoader = (): ReactElement => (
  <div style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);


function AppContent(): ReactElement {
  useCanonical();
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/practice" element={<MachineCodingList />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/practice/:questionId" element={<MachineCodingDetail />} />
            <Route path="/resource/*" element={<ResourceDetail />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

function App(): ReactElement {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ProgressProvider>
          <SubscriptionProvider>
            <Router>
              <AppContent />
            </Router>
            <Analytics />
          </SubscriptionProvider>
        </ProgressProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
