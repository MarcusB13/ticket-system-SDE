"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  to?: string;
  children: React.ReactNode;
  activeClass?: string;
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavLink({
  to = "/",
  children,
  activeClass = "active",
  className = "",
  active,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(to);

  const combinedClassName =
    `${className} ${isActive || active ? activeClass : ""}`.trim();

  return (
    <Link href={to} onClick={onClick} className={combinedClassName}>
      {children}
    </Link>
  );
}
