
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Library from './pages/Library';
import LearningPath from './pages/LearningPath';
import ResourceDetail from './pages/ResourceDetail';
import { useCanonical } from './hooks/useCanonical';

import { ThemeProvider } from './context/ThemeContext';

const basename = import.meta.env.PROD ? '/frontend-resources' : '/';

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
      <Router basename={basename}>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
