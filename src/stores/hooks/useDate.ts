import { useStore } from "@/stores/store";

export const useDate = () => {
  const date = useStore((state) => state.date);
  const setDate = useStore((state) => state.setDate);

  const dateParams = {
    year: date.getFullYear(),
    month: date.getMonth(),
  };

  return { date, setDate, dateParams };
};
