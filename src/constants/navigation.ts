import { type AppRoute } from "@/constants/appRoutes";
import { type Icon } from "@phosphor-icons/react";
import {
  ChartBar,
  ChartLine,
  CreditCard,
  PiggyBank,
  Tag,
} from "@phosphor-icons/react/dist/ssr";

const navigation: { label: string; route: AppRoute; icon: Icon }[] = [
  {
    label: "Transactions",
    route: "transactions",
    icon: CreditCard,
  },
  {
    label: "Budgets",
    route: "budgets",
    icon: PiggyBank,
  },
  {
    label: "Categories",
    route: "categories",
    icon: Tag,
  },
  {
    label: "Graphs",
    route: "graphs",
    icon: ChartBar,
  },
];

export default navigation;
