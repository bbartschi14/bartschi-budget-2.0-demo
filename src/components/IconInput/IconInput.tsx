import classes from "./IconInput.module.css";
import {
  ActionIcon,
  CloseButton,
  Combobox,
  Group,
  Input,
  InputBase,
  Text,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

type IconInputProps = {
  value: IconKey | null;
  onChange: (value: IconKey | null) => void;
  limit: number;
};

export type IconKey = keyof typeof Icon;

function getFilteredOptions<T extends string>(
  data: T[],
  searchQuery: string,
  limit: number
) {
  const result: T[] = [];

  for (let i = 0; i < data.length; i += 1) {
    if (result.length === limit) {
      break;
    }

    if (data[i]?.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      result.push(data[i]!);
    }
  }

  return result;
}

function SelectOption({ icon }: { icon: IconKey }) {
  const CategoryIcon = Icon[icon];
  return (
    <Group gap="sm" p={2}>
      {/* @ts-expect-error - icon type incorrect*/}
      <CategoryIcon size={"1.25rem"} />
      <Text fz="sm">{icon}</Text>
    </Group>
  );
}

const AllIconKeys = Object.keys(Icon) as IconKey[];

export const IconInput = ({ value, onChange, limit }: IconInputProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const [search, setSearch] = useState("");

  const filteredOptions = getFilteredOptions(AllIconKeys, search, limit);

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      <SelectOption icon={item} />
    </Combobox.Option>
  ));

  return (
    <Input.Wrapper label="Icon">
      <Group gap="sm">
        <Combobox
          variant=""
          store={combobox}
          withinPortal={true}
          onOptionSubmit={(val) => {
            onChange(val as IconKey);
            setSearch(val);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              variant="filled"
              className={classes.left}
              component="button"
              type="button"
              pointer
              rightSection={
                value !== null ? (
                  <CloseButton
                    size="sm"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange(null);
                      setSearch("");
                    }}
                    aria-label="Clear value"
                  />
                ) : (
                  <Combobox.Chevron />
                )
              }
              // value={search}
              // onChange={(event) => {
              //   combobox.openDropdown();
              //   combobox.updateSelectedOptionIndex();
              //   setSearch(event.currentTarget.value);
              // }}
              onClick={() => combobox.openDropdown()}
              rightSectionPointerEvents={value === null ? "none" : "all"}
            >
              {value !== null ? (
                <SelectOption icon={value} />
              ) : (
                <Input.Placeholder>Select Icon</Input.Placeholder>
              )}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown className={classes.dropdown}>
            <Combobox.Search
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search icons"
              style={{ position: "sticky", top: "-4px" }}
            />
            <Combobox.Options>
              {options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <Tooltip label="View icons">
          <ActionIcon
            component="a"
            href="https://phosphoricons.com/"
            target="_blank"
            variant="subtle"
            size="lg"
            p={4}
            color="gray"
          >
            <ArrowSquareOut size={"100%"} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Input.Wrapper>
  );
};
