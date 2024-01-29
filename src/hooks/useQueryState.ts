import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { isArray } from "lodash";

export const useQueryState = <T, U>(
  query: UseTRPCQueryResult<T, U>
): "Loading" | "Empty" | "Not Empty" => {
  if (query.isLoading) {
    return "Loading";
  }

  if (query.data && isArray(query.data) && query.data.length > 0) {
    return "Not Empty";
  }

  return "Empty";
};
