import { useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarRange, SlidersHorizontal } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerHeading,
} from "@/components/shared/GenericDrawer";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UNCATEGORIZED_ID, UNTAGGED_ID } from "@/lib/statsHelper";
import type { Account } from "@/models/Account";
import type { Category } from "@/models/Category";
import type { StatisticsFilters as StatisticsFilterState } from "@/models/Statistics";
import type { Tag } from "@/models/Tag";

interface StatisticsFiltersProps {
  filters: StatisticsFilterState;
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
  onChange: (filters: StatisticsFilterState) => void;
}

interface FilterOption {
  id: number;
  label: string;
  icon?: string;
}

export default function StatisticsFilters({
  filters,
  accounts,
  categories,
  tags,
  onChange,
}: StatisticsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<StatisticsFilterState>(() => cloneFilters(filters));

  const accountOptions = accounts
    .filter((account): account is Account & { accountId: number } => account.accountId !== undefined)
    .map((account) => ({ id: account.accountId, label: account.name, icon: "💳" }));
  const categoryOptions = [
    { id: UNCATEGORIZED_ID, label: "Uncategorized" },
    ...categories
      .filter((category): category is Category & { categoryId: number } => category.categoryId !== undefined)
      .map((category) => ({
        id: category.categoryId,
        label: category.name ?? "Unnamed category",
        icon: category.icon,
      })),
  ];
  const tagOptions = [
    { id: UNTAGGED_ID, label: "Untagged" },
    ...tags
      .filter((tag): tag is Tag & { tagId: number } => tag.tagId !== undefined)
      .map((tag) => ({ id: tag.tagId, label: tag.name ?? "Unnamed tag" })),
  ];

  const activeFilters = [
    ...getActiveFilters(filters.accountIds, accountOptions, "account"),
    ...getActiveFilters(filters.categoryIds, categoryOptions, "category"),
    ...getActiveFilters(filters.tagIds, tagOptions, "tag"),
  ];

  const openFilters = () => {
    setDraft(cloneFilters(filters));
    setIsOpen(true);
  };

  const customRangeIsComplete = draft.range !== "custom"
    || Boolean(draft.customFrom && draft.customTo);

  return (
    <section aria-label="Statistics filters" className="min-w-0 space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full min-w-0 justify-between font-normal"
        onClick={openFilters}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarRange />
          <span className="truncate">{formatRangeLabel(filters)}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <SlidersHorizontal />
          {activeFilters.length > 0 && (
            <Badge className="min-w-5 justify-center px-1 py-0">
              {activeFilters.length}
            </Badge>
          )}
        </span>
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="overflow-hidden">
          <DrawerHeading className="border-b">
            <div>
              <h2 className="font-semibold">Filter statistics</h2>
              <p className="mt-1 text-sm text-muted-foreground">
              Match any value in a group and every active group.
              </p>
            </div>
          </DrawerHeading>

          <div className="min-w-0 space-y-6 overflow-x-hidden px-5 pb-5">
            <DateRangeSection
              filters={draft}
              onChange={setDraft}
            />
            <MultiSelectSection
              title="Accounts"
              options={accountOptions}
              selectedIds={draft.accountIds}
              onChange={(accountIds) => setDraft({ ...draft, accountIds })}
              emptyMessage="No accounts available"
            />
            <MultiSelectSection
              title="Categories"
              options={categoryOptions}
              selectedIds={draft.categoryIds}
              onChange={(categoryIds) => setDraft({ ...draft, categoryIds })}
            />
            <MultiSelectSection
              title="Tags"
              options={tagOptions}
              selectedIds={draft.tagIds}
              onChange={(tagIds) => setDraft({ ...draft, tagIds })}
            />
          </div>

          <div className="sticky bottom-0 mt-auto grid shrink-0 grid-cols-2 gap-2 border-t bg-background px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDraft({
                  ...draft,
                  range: "30d",
                  customFrom: undefined,
                  customTo: undefined,
                  accountIds: [],
                  categoryIds: [],
                  tagIds: [],
                });
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              disabled={!customRangeIsComplete}
              onClick={() => {
                onChange(draft);
                setIsOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

interface DateRangeSectionProps {
  filters: StatisticsFilterState;
  onChange: (filters: StatisticsFilterState) => void;
}

function DateRangeSection({ filters, onChange }: DateRangeSectionProps) {
  const selectedRange: DateRange | undefined = filters.customFrom
    ? {
        from: fromDateKey(filters.customFrom),
        to: filters.customTo ? fromDateKey(filters.customTo) : undefined,
      }
    : undefined;

  const handlePresetChange = (range: StatisticsFilterState["range"]) => {
    if (range !== "custom" || filters.customFrom) {
      onChange({ ...filters, range });
      return;
    }

    const today = new Date();
    onChange({
      ...filters,
      range,
      customFrom: toDateKey(subDays(today, 29)),
      customTo: toDateKey(today),
    });
  };

  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-sm font-semibold">Date range</legend>
      <Select value={filters.range} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-full" aria-label="Date range preset">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="lastMonth">Previous month</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {filters.range === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full min-w-0 justify-start text-left font-normal"
            >
              <CalendarRange />
              <span className="truncate">
                {formatCustomRange(filters.customFrom, filters.customTo)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-auto max-w-[calc(100vw-2rem)] overflow-hidden p-0"
          >
            <Calendar
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={(range) => {
                onChange({
                  ...filters,
                  customFrom: range?.from ? toDateKey(range.from) : undefined,
                  customTo: range?.to ? toDateKey(range.to) : undefined,
                });
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      )}
    </fieldset>
  );
}

interface MultiSelectSectionProps {
  title: string;
  options: FilterOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  emptyMessage?: string;
}

function MultiSelectSection({
  title,
  options,
  selectedIds,
  onChange,
  emptyMessage = "No options available",
}: MultiSelectSectionProps) {
  const idPrefix = title.toLowerCase().replaceAll(" ", "-");

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold">
        {title}
        {selectedIds.length > 0 && (
          <span className="ml-2 font-normal text-muted-foreground">
            {selectedIds.length} selected
          </span>
        )}
      </legend>

      {options.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="min-w-0 overflow-hidden rounded-xl border">
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const optionId = `${idPrefix}-${option.id}`;

            return (
              <Label
                htmlFor={optionId}
                key={option.id}
                className="flex min-h-10 min-w-0 cursor-pointer items-center gap-3 border-b px-3 py-2.5 last:border-b-0 hover:bg-accent"
              >
                <Checkbox
                  id={optionId}
                  checked={isSelected}
                  onCheckedChange={() => {
                    onChange(
                      isSelected
                        ? selectedIds.filter((id) => id !== option.id)
                        : [...selectedIds, option.id],
                    );
                  }}
                />
                {option.icon && <span aria-hidden="true">{option.icon}</span>}
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </Label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

function cloneFilters(filters: StatisticsFilterState): StatisticsFilterState {
  return {
    ...filters,
    accountIds: [...filters.accountIds],
    categoryIds: [...filters.categoryIds],
    tagIds: [...filters.tagIds],
  };
}

function getActiveFilters(
  selectedIds: number[],
  options: FilterOption[],
  group: "account" | "category" | "tag",
) {
  const groupKey = `${group}Ids` as "accountIds" | "categoryIds" | "tagIds";
  const optionMap = new Map(options.map((option) => [option.id, option]));

  return selectedIds.map((id) => ({
    id,
    label: optionMap.get(id)?.label ?? `Unknown ${group}`,
    group: groupKey,
  }));
}

function formatRangeLabel(filters: StatisticsFilterState) {
  if (filters.range === "7d") return "Last 7 days";
  if (filters.range === "30d") return "Last 30 days";
  if (filters.range === "lastMonth") return "Previous month";
  return formatCustomRange(filters.customFrom, filters.customTo);
}

function formatCustomRange(from?: string, to?: string) {
  if (!from) return "Choose custom dates";
  if (!to) return format(fromDateKey(from), "dd MMM yyyy");
  return `${format(fromDateKey(from), "dd MMM yyyy")} – ${format(fromDateKey(to), "dd MMM yyyy")}`;
}

function toDateKey(value: Date) {
  return format(value, "yyyy-MM-dd");
}

function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
