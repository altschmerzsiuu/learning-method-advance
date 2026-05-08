// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import BerandaScreen      from './screens/BerandaScreen';
import MateriListScreen    from './screens/MateriListScreen';
import MateriDetailScreen  from './screens/MateriDetailScreen';
import QuizScreen      from './screens/QuizScreen';
import HasilQuizScreen from './screens/HasilQuizScreen';

import LatihanScreen   from './screens/LatihanScreen';
import LatihanSoalScreen from './screens/LatihanSoalScreen';
import HasilLatihanScreen from './screens/HasilLatihanScreen';

import GamesScreen     from './screens/GamesScreen';
import TTTSetupScreen  from './screens/TTTSetupScreen';
import TTTGameScreen   from './screens/TTTGameScreen';
import TTTHasilScreen  from './screens/TTTHasilScreen';
import SusunStrukturScreen from './screens/SusunStrukturScreen';
import SusunHasilScreen from './screens/SusunHasilScreen';

import ProfilScreen    from './screens/ProfilScreen';
import EditProfilScreen from './screens/EditProfilScreen';

import TentangScreen   from './screens/TentangScreen';
import OnboardingScreen from './screens/OnboardingScreen';

import LoginScreen     from './screens/LoginScreen';
import RegisterScreen  from './screens/RegisterScreen';
import ProtectedRoute  from './components/auth/ProtectedRoute';
import { Toast }      from './components/ui';
import BadgeToast      from './components/profil/BadgeToast';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/beranda" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
        <Route path="/tentang" element={<TentangScreen />} />
        
        <Route path="/beranda" element={<ProtectedRoute><BerandaScreen /></ProtectedRoute>} />
        
        <Route path="/materi" element={<ProtectedRoute><MateriListScreen /></ProtectedRoute>} />
        <Route path="/materi/:topikId" element={<ProtectedRoute><MateriDetailScreen /></ProtectedRoute>} />
        <Route path="/materi/:topikId/quiz" element={<ProtectedRoute><QuizScreen /></ProtectedRoute>} />
        <Route path="/materi/:topikId/hasil" element={<ProtectedRoute><HasilQuizScreen /></ProtectedRoute>} />
        
        <Route path="/latihan" element={<ProtectedRoute><LatihanScreen /></ProtectedRoute>} />
        <Route path="/latihan/soal" element={<ProtectedRoute><LatihanSoalScreen /></ProtectedRoute>} />
        <Route path="/latihan/hasil" element={<ProtectedRoute><HasilLatihanScreen /></ProtectedRoute>} />
        
        <Route path="/games" element={<ProtectedRoute><GamesScreen /></ProtectedRoute>} />
        <Route path="/games/think-tac-toe/setup" element={<ProtectedRoute><TTTSetupScreen /></ProtectedRoute>} />
        <Route path="/games/think-tac-toe/main" element={<ProtectedRoute><TTTGameScreen /></ProtectedRoute>} />
        <Route path="/games/think-tac-toe/hasil" element={<ProtectedRoute><TTTHasilScreen /></ProtectedRoute>} />
        <Route path="/games/susun-struktur" element={<ProtectedRoute><SusunStrukturScreen /></ProtectedRoute>} />
        <Route path="/games/susun-struktur/hasil" element={<ProtectedRoute><SusunHasilScreen /></ProtectedRoute>} />
        
        <Route path="/profil" element={<ProtectedRoute><ProfilScreen /></ProtectedRoute>} />
        <Route path="/profil/edit" element={<ProtectedRoute><EditProfilScreen /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <AppRoutes />
      <Toast />
      <BadgeToast />
    </BrowserRouter>
  );
}
