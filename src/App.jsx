// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import HomeScreen      from './screens/HomeScreen';
import MateriScreen    from './screens/MateriScreen';
import QuizScreen      from './screens/QuizScreen';
import HasilQuizScreen from './screens/HasilQuizScreen';
import LatihanScreen   from './screens/LatihanScreen';
import DuelSetupScreen from './screens/DuelSetupScreen';
import DuelGameScreen  from './screens/DuelGameScreen';
import DuelHasilScreen from './screens/DuelHasilScreen';
import ProgressScreen  from './screens/ProgressScreen';
import ProfilScreen    from './screens/ProfilScreen';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"                    element={<Navigate to="/belajar" replace />} />
        <Route path="/belajar"             element={<HomeScreen />} />
        <Route path="/belajar/:topikId"    element={<MateriScreen />} />
        <Route path="/quiz/:topikId"       element={<QuizScreen />} />
        <Route path="/quiz/:topikId/hasil" element={<HasilQuizScreen />} />
        <Route path="/latihan"             element={<LatihanScreen />} />
        <Route path="/latihan/duel"        element={<DuelSetupScreen />} />
        <Route path="/latihan/duel/main"   element={<DuelGameScreen />} />
        <Route path="/latihan/duel/hasil"  element={<DuelHasilScreen />} />
        <Route path="/progress"            element={<ProgressScreen />} />
        <Route path="/profil"              element={<ProfilScreen />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <AppRoutes />
    </BrowserRouter>
  );
}
