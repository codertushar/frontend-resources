
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Library from './pages/Library';
import LearningPath from './pages/LearningPath';
import ResourceDetail from './pages/ResourceDetail';
import { useCanonical } from './hooks/useCanonical';

import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';

// Use '/' for dev and Vercel, '/frontend-resources' for GitHub Pages
const basename = import.meta.env.PROD && !import.meta.env.VITE_VERCEL ? '/frontend-resources' : '/';

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
          <Route path="/resource/*" element={<ResourceDetail />} />
        </Routes>
      </Layout>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Router basename={basename}>
          <AppContent />
        </Router>
        <Analytics />
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
