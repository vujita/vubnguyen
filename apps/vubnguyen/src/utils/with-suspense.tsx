import { Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react";

export const withSuspense = <T extends object>(Cmp: ComponentType<T>, fallback: ReactNode = null) => {
  return function WithSuspense(props: T) {
    const [rendered, setRendered] = useState(false);
    useEffect(() => {
      setRendered(true);
    }, []);
    if (!rendered) {
      return fallback;
    }
    return (
      <Suspense fallback={fallback}>
        <Cmp {...props} />
      </Suspense>
    );
  };
};
