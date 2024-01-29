"use client";

import {
  type AppRouteParams,
  type AppRoute,
  type AppRoutePaths,
  appRoutes,
} from "@/constants/appRoutes";
import { type NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import queryString from "query-string";

type DynamicKey = {
  [K in AppRoute]: AppRoutePaths[K] extends (...args: infer U) => string
    ? K
    : never;
}[AppRoute];

type StaticKey = Exclude<AppRoute, DynamicKey>;

type StaticRouteArgs = {
  [K in StaticKey]: { path: K; params?: AppRouteParams[K] };
}[StaticKey];

type DynamicRouteArgs = {
  [K in DynamicKey]: {
    path: K;
    segments: Parameters<AppRoutePaths[K]>[0];
    params?: AppRouteParams[K];
  };
}[DynamicKey];

type BuildAppPathArgs = StaticRouteArgs | DynamicRouteArgs;

// Dynamic route type guard
function isDynamicRoute(args: BuildAppPathArgs): args is DynamicRouteArgs {
  return typeof args === "object" && "segments" in args;
}

/** Creates a path to navigate to, restricted to defined appRoutes and params */
export const buildAppPath = (args: BuildAppPathArgs) => {
  const query = queryString.stringify(args.params ?? {});

  let route = appRoutes[args.path] as string | Function;
  if (isDynamicRoute(args)) {
    route = typeof route === "function" ? route(args.segments) : route;
  }
  if (typeof route === "string") {
    return `${route}${query ? `?${query}` : ""}`;
  } else {
    throw new Error("Invalid route");
  }
};

type UseAppRouterType = {
  push: (options?: NavigateOptions) => void;
  back: () => void;
};

/** Wraps `useRouter` to only allow defined appRoutes and params */
export const useAppRouter = (args: BuildAppPathArgs): UseAppRouterType => {
  const router = useRouter();

  const push = (options?: NavigateOptions) => {
    router.push(buildAppPath(args), options);
  };

  return {
    push,
    back: () => router.back(),
  };
};
