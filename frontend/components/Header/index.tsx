"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import UserMenu from "./UserMenu";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Ticket[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const getSearchResults = async (query: string) => {
    try {
      const jwt = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tickets/search/?query=${query}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Token ${jwt}`,
          },
        }
      );
      setSearchResults(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQueryChange = (query: string) => {
    setQuery(query);
    if (query.length > 2) {
      setOpen(true);
      getSearchResults(query);
    } else {
      setOpen(false);
      setSearchResults([]);
    }
  };

  const getStatusColor = (status: string): string => {
    let color = "";

    switch (status) {
      case "new":
        color = "!bg-green-100";
        break;
      case "pending":
        color = "!bg-blue-100";
        break;
      case "closed":
        color = "!bg-yellow-100";
        break;
      case "deleted":
        color = "!bg-red-100";
        break;
      default:
        color = "!bg-gray-100";
        break;
    }

    return color;
  };

  return (
    <div className="flex h-16 flex-none items-center gap-4 bg-background p-4 md:px-8 shadow">
      <nav className="hidden items-center space-x-4 md:flex lg:space-x-6">
        <Link
          href="/admin/dashboard"
          className="text-xl font-bold transition-colors hover:text-primary "
        >
          Tickets
        </Link>
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <Command className="overflow-visible bg-transparent">
          <CommandPrimitive.Input
            placeholder="Search..."
            value={query}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onValueChange={handleQueryChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[100px] lg:w-[300px]"
          />
          <div className="relative">
            <CommandList>
              {open && searchResults.length > 0 ? (
                <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                  <CommandGroup className="h-full overflow-auto">
                    {searchResults.map((result, index) => (
                      <CommandItem
                        key={result.uuid}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          setQuery("");
                          setOpen(false);
                          router.push(`/dashboard/tickets/${result.uuid}`);
                        }}
                        className={
                          "curser-pointer " + getStatusColor(result.status)
                        }
                      >
                        {result.subject}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              ) : null}
            </CommandList>
          </div>
        </Command>
        <UserMenu user={user} />
      </div>
    </div>
  );
}
