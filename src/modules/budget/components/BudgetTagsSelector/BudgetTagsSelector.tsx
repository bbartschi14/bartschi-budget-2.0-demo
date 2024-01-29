import { BudgetRecord } from "@/server/db/shared";
import classes from "./BudgetTagsSelector.module.css";
import { ActionIcon, Tooltip, rem } from "@mantine/core";
import { BUDGET_TAGS, BudgetTagOption } from "@/data/tags";

type BudgetTagsSelectorProps = {
  budget: BudgetRecord;
  onTagClick: (tag: BudgetTagOption) => void;
};

export const BudgetTagsSelector = (props: BudgetTagsSelectorProps) => {
  return (
    <ActionIcon.Group>
      {BUDGET_TAGS.map((tag) => {
        const selected = props.budget.budgetTags.some((t) => t.name === tag.id);
        return (
          <Tooltip key={tag.id} label={tag.name}>
            <ActionIcon
              className={classes.tag}
              size={rem(36)}
              variant={selected ? "filled" : "outline"}
              onClick={() => props.onTagClick(tag.id)}
            >
              <tag.Icon size={"1.25rem"} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </ActionIcon.Group>
  );
};
