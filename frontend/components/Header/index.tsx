"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { IoSunnyOutline } from "react-icons/io5";
import axios from "axios";
import UserMenu from "./UserMenu";
import { Input } from "../ui/input";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
          }
        }
      );
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
    if (query.length > 2) {
      getSearchResults(query);
    }
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
        <div>
          <Input
            type="search"
            placeholder="Søg..."
            value={query}
            onChange={handleQueryChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[100px] lg:w-[300px]"
          />
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Toggle dark or light mode"
          className="rounded-full"
        >
          <IoSunnyOutline size={20} />
        </Button>
        <UserMenu user={user} />
      </div>
    </div>
  );
}
