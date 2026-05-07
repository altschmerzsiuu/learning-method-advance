// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import HomeScreen      from './screens/HomeScreen';
import MateriScreen    from './screens/MateriScreen';
import QuizScreen      from './screens/QuizScreen';
import HasilQuizScreen from './screens/HasilQuizScreen';
import LatihanScreen   from './screens/LatihanScreen';
import GameSetupScreen from './screens/GameSetupScreen';
import GameScreen      from './screens/GameScreen';
import GameHasilScreen from './screens/GameHasilScreen';
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
        <Route path="/latihan/think-tac-toe"        element={<GameSetupScreen />} />
        <Route path="/latihan/think-tac-toe/main"   element={<GameScreen />} />
        <Route path="/latihan/think-tac-toe/hasil"  element={<GameHasilScreen />} />
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
