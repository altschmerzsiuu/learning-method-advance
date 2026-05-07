// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import HomeScreen      from './screens/HomeScreen';
import MateriScreen    from './screens/MateriScreen';
import QuizScreen      from './screens/QuizScreen';
import HasilQuizScreen from './screens/HasilQuizScreen';
import LatihanScreen   from './screens/LatihanScreen';
import LatihanSoalScreen from './screens/LatihanSoalScreen';
import HasilLatihanScreen from './screens/HasilLatihanScreen';
import GameSetupScreen from './screens/GameSetupScreen';
import GameScreen      from './screens/GameScreen';
import GameHasilScreen from './screens/GameHasilScreen';
import ProgressScreen  from './screens/ProgressScreen';
import ProfilScreen    from './screens/ProfilScreen';
import EditProfilScreen from './screens/EditProfilScreen';

import LoginScreen     from './screens/LoginScreen';
import RegisterScreen  from './screens/RegisterScreen';
import ProtectedRoute  from './components/auth/ProtectedRoute';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/belajar" element={<Navigate to="/home" replace />} />
        <Route path="/belajar/:topikId" element={<ProtectedRoute><MateriScreen /></ProtectedRoute>} />
        
        <Route path="/quiz/:topikId" element={<ProtectedRoute><QuizScreen /></ProtectedRoute>} />
        <Route path="/quiz/:topikId/hasil" element={<ProtectedRoute><HasilQuizScreen /></ProtectedRoute>} />
        
        <Route path="/latihan" element={<ProtectedRoute><LatihanScreen /></ProtectedRoute>} />
        <Route path="/latihan/soal" element={<ProtectedRoute><LatihanSoalScreen /></ProtectedRoute>} />
        <Route path="/latihan/soal/hasil" element={<ProtectedRoute><HasilLatihanScreen /></ProtectedRoute>} />
        
        <Route path="/latihan/think-tac-toe" element={<ProtectedRoute><GameSetupScreen /></ProtectedRoute>} />
        <Route path="/latihan/think-tac-toe/main" element={<ProtectedRoute><GameScreen /></ProtectedRoute>} />
        <Route path="/latihan/think-tac-toe/hasil" element={<ProtectedRoute><GameHasilScreen /></ProtectedRoute>} />
        
        <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><ProfilScreen /></ProtectedRoute>} />
        <Route path="/profil/edit" element={<ProtectedRoute><EditProfilScreen /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

import BadgeToast      from './components/profil/BadgeToast';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <AppRoutes />
      <BadgeToast />
    </BrowserRouter>
  );
}
