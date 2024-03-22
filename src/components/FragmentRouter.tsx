import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export interface FragmentProps<T> {
  state: any;
  navigate(name: T | -1, options?: { state: any; replace?: boolean }): void;
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
  state?: any;
  navigate(name: T | -1, options?: { state: any; replace?: boolean }): void;
}

export function useFragmentRouterController<T>({
  routes,
  defaultRoute,
}: useFragmentRouterControllerProps<T>): useFragmentRouterControllerReturn<T> {
  const stackRef = React.useRef<{ route: T; state: any }[]>([]);
  const [currentState, setCurrentState] = React.useState<any>();
  const [currentRoute, setCurrentRoute] = React.useState<T | undefined>(
    defaultRoute || routes[0]?.name
  );

  const navigate = React.useCallback(
    (name: T | -1, options?: { state: any; replace?: boolean }) => {
      if (name === -1) {
        const item = stackRef.current.pop();
        if (item != null) {
          setCurrentRoute(item.route);
          setCurrentState(item.state);
        }
      } else {
        setCurrentRoute(name);
        setCurrentState(options?.state);
        if (currentRoute != null && !options?.replace) {
          stackRef.current.push({
            route: currentRoute,
            state: options?.state,
          });
        }
      }
    },
    [currentRoute]
  );

  return {
    navigate,
    routes,
    route: currentRoute,
    state: currentState,
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
                <route.component navigate={controller.navigate} state={controller.state} />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
