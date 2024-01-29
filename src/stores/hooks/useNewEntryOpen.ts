import { useStore } from "@/stores/store";

export const useNewEntryOpen = () => {
  const newEntryOpen = useStore((state) => state.newEntryOpen);
  const setNewEntryOpen = useStore((state) => state.setNewEntryOpen);

  return { newEntryOpen, setNewEntryOpen };
};
