import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { IoSunnyOutline } from "react-icons/io5";
import UserMenu from "./UserMenu";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
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
          <input
            type="search"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[100px] lg:w-[300px]"
            placeholder="Søg..."
          />
        </div>
        <Button size="icon" variant="ghost" className="rounded-full">
          <IoSunnyOutline size={20} />
        </Button>
        <UserMenu user={user} />
      </div>
    </div>
  );
}
