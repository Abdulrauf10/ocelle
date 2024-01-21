import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export interface FragmentProps<T> {
  navigate(name: T | -1): void;
}

interface FragmentViewerProps<T> {
  defaultRoute?: T;
  routes: Array<{
    name: T;
    component: React.FunctionComponent<FragmentProps<T>>;
  }>;
}

export interface FragmentViewerRef<T> {
  route?: T;
  navigate(name: T | -1): void;
}

export default React.forwardRef(function FragmentViewer<T>(
  { routes, defaultRoute }: FragmentViewerProps<T>,
  ref: React.ForwardedRef<FragmentViewerRef<T>>
) {
  const stackRef = React.useRef<T[]>([]);
  const [currentRoute, setCurrentRoute] = React.useState<T | undefined>(
    defaultRoute || routes[0]?.name
  );

  const navigate = React.useCallback(
    (name: T | -1) => {
      if (name === -1) {
        const nextRoute = stackRef.current.pop() || routes[0]?.name;
        setCurrentRoute(nextRoute);
      } else {
        setCurrentRoute(name);
        if (currentRoute) {
          stackRef.current.push(currentRoute);
        }
      }
    },
    [routes, currentRoute]
  );

  React.useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref({ navigate, route: currentRoute });
      } else {
        ref.current = { navigate, route: currentRoute };
      }
    }
  }, [navigate, currentRoute, ref]);

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {routes
          .filter((route) => route.name === currentRoute)
          .map((route) => {
            return (
              <motion.div
                key={String(route.name)}
                variants={{
                  outside: {
                    opacity: 0,
                    x: 50,
                  },
                  enter: {
                    opacity: 1,
                    x: 0,
                  },
                  exit: {
                    opacity: 0,
                    x: -50,
                  },
                }}
                initial="outside"
                animate="enter"
                exit="exit"
              >
                <route.component navigate={navigate} />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
});
