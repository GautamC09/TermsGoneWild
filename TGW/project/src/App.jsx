import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ResultsPage from './components/ResultsPage';
import HowItWorksPage from './components/HowItWoks';
import SummaryPage from './components/SummaryPage';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {  
  return (
    <div className="min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<><HeroSection /><FeaturesSection /></>} />
        <Route path="/features" element={<FeaturesSection />} /> 
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;