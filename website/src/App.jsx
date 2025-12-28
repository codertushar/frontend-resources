
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Library from './pages/Library';
import LearningPath from './pages/LearningPath';
import ResourceDetail from './pages/ResourceDetail';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import MachineCodingPractice from './pages/MachineCodingPractice';
import { useCanonical } from './hooks/useCanonical';

import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { SubscriptionProvider } from './context/SubscriptionContext';


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
          <Route path="/practice" element={<MachineCodingPractice />} />
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
        <SubscriptionProvider>
          <Router>
            <AppContent />
          </Router>
          <Analytics />
        </SubscriptionProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
