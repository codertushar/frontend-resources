import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Library from './pages/LibraryRefactored';
import LearningPath from './pages/LearningPath';
import ResourceDetail from './pages/ResourceDetail';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import MachineCodingList from './pages/MachineCodingList';
import { useCanonical } from './hooks/useCanonical';

import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Lazy load MachineCodingDetail to isolate Sandpack's React instance
const MachineCodingDetail = lazy(() => import('./pages/MachineCodingDetail'));


function AppContent() {
  useCanonical();
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/practice" element={<MachineCodingList />} />
          <Route path="/practice/:questionId" element={
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading editor...</div>}>
              <MachineCodingDetail />
            </Suspense>
          } />
          <Route path="/resource/*" element={<ResourceDetail />} />
        </Routes>
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
