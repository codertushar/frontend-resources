
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
        <Router>
          <AppContent />
        </Router>
        <Analytics />
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
