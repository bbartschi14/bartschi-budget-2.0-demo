"use client";

import { type AppRoute, type AppRouteParams } from "@/constants/appRoutes";
import { useAppSearchParams } from "@/hooks/navigation/useAppSearchParams";
import { type NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";

/**
 * Utility hook to update search params for a given route
 * without overriding existing params
 */
export const useUpdateAppSearchParams = <TRoute extends AppRoute>(
  route: TRoute
) => {
  const originalParams = useAppSearchParams(route);
  const router = useRouter();
  const pathname = usePathname();

  return (
    params: AppRouteParams[TRoute],
    options?: NavigateOptions | undefined
  ) => {
    const mergedParams = { ...originalParams, ...params };
    const query = queryString.stringify(mergedParams ?? {});
    const path = `${pathname}${query ? `?${query}` : ""}`;
    router.push(path, options);
  };
};
