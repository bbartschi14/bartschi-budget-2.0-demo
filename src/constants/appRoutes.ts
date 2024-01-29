// Base type information - add new routes here
type AppRouteData = {
  transactions: {
    path: "/transactions";
    params: undefined;
  };
  budgets: {
    path: "/budgets";
    params: undefined;
  };
  categories: {
    path: "/categories";
    params: undefined;
  };
  graphs: {
    path: "/graphs";
    params: undefined;
  };

  "[id]": {
    path: ({ id }: { id: string }) => string;
    params: undefined;
  };
};

export type AppRoute = keyof AppRouteData;

export type AppRoutePaths = {
  [K in AppRoute]: AppRouteData[K]["path"];
};

export type AppRouteParams = {
  // Search params should all be optional
  [K in AppRoute]: Partial<AppRouteData[K]["params"]>;
};

// Runtime route information - include new route mappings here once added to `AppRouteData`
export const appRoutes: { [K in AppRoute]: AppRouteData[K]["path"] } = {
  transactions: "/transactions",
  budgets: "/budgets",
  categories: "/categories",
  graphs: "/graphs",
  "[id]": ({ id }: { id: string }) => `/${id}`,
};
