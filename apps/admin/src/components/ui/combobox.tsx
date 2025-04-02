import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";

export interface ComboBoxProps<T> {
  items: T[];
  value: string;
  onValueChange: (value: string) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  valueFn: (item: T) => string;
  displayFn: (item?: T) => string;
  filterFn?: (item: T, search: string) => boolean;
}

export function ComboBox<T>({
  items,
  value,
  onValueChange,
  onSearchChange,
  placeholder,
  valueFn,
  displayFn,
  filterFn,
}: ComboBoxProps<T>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  function findItem(value: string) {
    return items.find((item) => valueFn(item) === value);
  }

  const filteredItems = useMemo(() => {
    if (!filterFn) return items;
    return items.filter((item) => filterFn(item, search));
  }, [items, search, filterFn]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? displayFn(findItem(value)) : placeholder || "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder || "Search item..."}
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              onSearchChange?.(value);
            }}
          />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {filteredItems.map((item) => (
              <CommandItem
                key={valueFn(item)}
                value={valueFn(item)}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === valueFn(item) ? "opacity-100" : "opacity-0"
                  )}
                />
                {displayFn(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
