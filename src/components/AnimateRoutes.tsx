import { AnimatePresence } from 'framer-motion';
import { Routes, useLocation } from 'react-router-dom';

export default function AnimateRoutes({ children }: React.PropsWithChildren) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
}
