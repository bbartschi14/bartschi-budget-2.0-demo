"use client";

import { usePathname } from "next/navigation";

/**
 * Gets the path segments of the current URL. E.g. if the current URL is `https://takemobi.io/profile/edit`,
 * it returns `["profile", "edit"]`. The root URL `/` returns `['']`.
 */
export const usePathSegments = () => {
  const pathname = usePathname();
  return pathname.split("/").slice(1);
};
