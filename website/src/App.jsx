import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import { useCanonical } from './hooks/useCanonical';

import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Lazy load pages for better initial load performance (code splitting)
const Library = lazy(() => import('./pages/LibraryRefactored'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Admin = lazy(() => import('./pages/Admin'));
const MachineCodingList = lazy(() => import('./pages/MachineCodingList'));
const MachineCodingDetail = lazy(() => import('./pages/MachineCodingDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div>Loading...</div>
  </div>
);


function AppContent() {
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

function App() {
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
