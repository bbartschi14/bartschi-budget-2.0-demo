"use client";

import { type AppRouteParams, type AppRoute } from "@/constants/appRoutes";
import { useSearchParams } from "next/navigation";

/**
 * Wraps `useSearchParams` to use type definitions.
 * `route` parameter included to ensure typed usage
 */ // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used for type inference
export const useAppSearchParams = <TRoute extends AppRoute>(route: TRoute) => {
  const searchParams = useSearchParams();
  const allParams = Object.fromEntries(searchParams?.entries() ?? {});
  return allParams as AppRouteParams[TRoute];
};
