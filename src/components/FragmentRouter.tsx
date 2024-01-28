import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export interface FragmentProps<T> {
  navigate(name: T | -1, options?: { empty?: boolean }): void;
}

interface useFragmentRouterControllerProps<T> {
  defaultRoute?: T;
  routes: Array<{
    name: T;
    component: React.FunctionComponent<FragmentProps<T>>;
  }>;
}

interface useFragmentRouterControllerReturn<T> {
  routes: Array<{
    name: T;
    component: React.FunctionComponent<FragmentProps<T>>;
  }>;
  route?: T;
  navigate(name: T | -1, options?: { empty?: boolean }): void;
}

export function useFragmentRouterController<T>({
  routes,
  defaultRoute,
}: useFragmentRouterControllerProps<T>): useFragmentRouterControllerReturn<T> {
  const stackRef = React.useRef<T[]>([]);
  const [currentRoute, setCurrentRoute] = React.useState<T | undefined>(
    defaultRoute || routes[0]?.name
  );

  const navigate = React.useCallback(
    (name: T | -1, options?: { empty?: boolean }) => {
      if (name === -1) {
        const nextRoute = stackRef.current.pop();
        if (options?.empty) {
          stackRef.current = [];
        }
        if (nextRoute != null) {
          setCurrentRoute(nextRoute);
        }
      } else {
        if (options?.empty) {
          stackRef.current = [];
        }
        setCurrentRoute(name);
        if (currentRoute != null) {
          stackRef.current.push(currentRoute);
        }
      }
    },
    [currentRoute]
  );

  return {
    navigate,
    routes,
    route: currentRoute,
  };
}

interface FragmentRouterProps<T> {
  controller: useFragmentRouterControllerReturn<T>;
}

export default function FragmentRouter<T>({ controller }: FragmentRouterProps<T>) {
  return (
    <div className="overflow-x-clip overflow-y-visible">
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        {controller.routes
          .filter((route) => route.name === controller.route)
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
                <route.component navigate={controller.navigate} />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
