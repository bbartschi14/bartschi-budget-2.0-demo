"use client";

import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import Panel from "@/components/Panel/Panel";
import { CategoryCard } from "@/modules/category/components/CategoryCard/CategoryCard";
import { DeleteCategoryModal } from "@/modules/category/components/DeleteCategoryModal/DeleteCategoryModal";
import { CategoryFab } from "@/modules/category/components/CategoryFab/CategoryFab";
import {
  CategorySort,
  type SortOption,
  type SortType,
  type SortValue,
} from "@/modules/category/components/CategorySort/CategorySort";
import { NewCategoryModal } from "@/modules/category/components/NewCategoryModal/NewCategoryModal";
import { type Category } from "@/server/db/shared";
import { api } from "@/trpc/react";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Space,
  Stack,
  TextInput,
  rem,
  Text,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  DotsThree,
  MagnifyingGlass,
  NotePencil,
  Trash,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { EditCategoryModal } from "@/modules/category/components/EditCategoryModal/EditCategoryModal";
import { MaxWidthBox } from "@/components/MaxWidthBox/MaxWidthBox";

const searchFilter = (
  searchText: string
): ((category: Category) => boolean) => {
  return (category: Category) => {
    const search = searchText.trim().toLowerCase();
    if (category.name && category.name.toLowerCase().includes(search)) {
      return true;
    }
    if (
      category.description &&
      category.description.toLowerCase().includes(search)
    ) {
      return true;
    }
    return false;
  };
};

const COLOR_ORDER_BY_RAINBOW = [
  "pink",
  "red",
  "orange",
  "yellow",
  "lime",
  "olive",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "grape",
  "gray",
  "dark",
];

const sortOptions: SortOption[] = [
  {
    key: "name",
    label: "Name",
    sort: (type: SortType) => {
      return (a: Category, b: Category) => {
        if (a.name && b.name) {
          if (type === "ascend") {
            return a.name > b.name ? -1 : 1;
          } else {
            return a.name < b.name ? -1 : 1;
          }
        }
        return 0;
      };
    },
  },
  {
    key: "color",
    label: "Color",
    sort: (type: SortType) => {
      return (a: Category, b: Category) => {
        if (a.color && b.color) {
          const aIndex = COLOR_ORDER_BY_RAINBOW.indexOf(
            a.color.split(".")[0] ?? ""
          );
          const aShade = Number(a.color.split(".")[1]) ?? 0;
          const bIndex = COLOR_ORDER_BY_RAINBOW.indexOf(
            b.color.split(".")[0] ?? ""
          );
          const bShade = Number(b.color.split(".")[1]) ?? 0;
          if (type === "ascend") {
            if (aIndex === bIndex) {
              return aShade < bShade ? -1 : 1;
            }
            return aIndex > bIndex ? -1 : 1;
          } else {
            if (aIndex === bIndex) {
              return aShade > bShade ? -1 : 1;
            }
            return aIndex < bIndex ? -1 : 1;
          }
        }
        return 0;
      };
    },
  },
  {
    key: "type",
    label: "Type",
    sort: (type: SortType) => {
      return (a: Category, b: Category) => {
        if (a.type && b.type) {
          if (type === "ascend") {
            return a.type > b.type ? -1 : 1;
          } else {
            return a.type < b.type ? -1 : 1;
          }
        }
        return 0;
      };
    },
  },
  {
    key: "created",
    label: "Created",
    sort: (type: SortType) => {
      return (a: Category, b: Category) => {
        if (a.createdAt && b.createdAt) {
          if (type === "ascend") {
            return a.createdAt > b.createdAt ? -1 : 1;
          } else {
            return a.createdAt < b.createdAt ? -1 : 1;
          }
        }
        return 0;
      };
    },
  },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState<SortValue>({
    ...sortOptions[0]!,
    type: "descend",
  });
  const [newOpened, { open: newOpen, close: newClose }] = useDisclosure(false);

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const { data: categories, isLoading } = api.category.get.useQuery();

  return (
    <>
      <MaxWidthBox>
        <Panel
          title="Categories"
          rightSection={
            <Group>
              <CategorySort
                value={sortValue}
                onValueChanged={setSortValue}
                options={sortOptions}
              />
              <TextInput
                value={searchText}
                onChange={(event) => setSearchText(event.currentTarget.value)}
                placeholder="Search categories"
                leftSectionPointerEvents="none"
                leftSection={<MagnifyingGlass size="50%" />}
                rightSectionPointerEvents={searchText ? "all" : "none"}
                rightSection={
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setSearchText("")}
                    p={4}
                    color="gray"
                    opacity={searchText ? 1 : 0}
                    disabled={!searchText}
                  >
                    <X size="100%" />
                  </ActionIcon>
                }
              />
            </Group>
          }
        >
          <Stack gap="xs">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} height={rem(92)} radius="md" />
                ))
              : categories
                  ?.filter(searchFilter(searchText))
                  .sort(sortValue.sort(sortValue.type))
                  .map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      searchText={searchText}
                      menuSlot={
                        <Menu
                          shadow="sm"
                          offset={4}
                          withArrow
                          arrowPosition="center"
                          position="left-start"
                        >
                          <MenuTarget>
                            <ActionIcon variant="subtle" color="gray">
                              <DotsThree size="100%" />
                            </ActionIcon>
                          </MenuTarget>
                          <MenuDropdown>
                            <MenuItem
                              onClick={() => setCategoryToEdit(category)}
                              leftSection={
                                <NotePencil size="1.25rem" weight="duotone" />
                              }
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => setCategoryToDelete(category)}
                              leftSection={
                                <Trash size="1.25rem" weight="duotone" />
                              }
                              color="red"
                            >
                              Delete
                            </MenuItem>
                          </MenuDropdown>
                        </Menu>
                      }
                    />
                  ))}
          </Stack>
        </Panel>
        <Space h="xl" />
      </MaxWidthBox>
      <NewCategoryModal opened={newOpened} onClose={newClose} />
      <DeleteCategoryModal
        onClose={() => setCategoryToDelete(null)}
        categoryToDelete={categoryToDelete}
      />
      <EditCategoryModal
        onClose={() => setCategoryToEdit(null)}
        categoryToEdit={categoryToEdit}
      />
      <CategoryFab onClick={() => newOpen()} />
    </>
  );
}
