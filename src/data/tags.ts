import { Calendar, Coins, Moon } from "@phosphor-icons/react/dist/ssr";

export const BUDGET_TAGS = [
  { id: "monthly", name: "Monthly", Icon: Moon },
  { id: "yearly", name: "Yearly", Icon: Calendar },
  { id: "savings", name: "Savings", Icon: Coins },
] as const;

export type BudgetTagOption = (typeof BUDGET_TAGS)[number]["id"];
