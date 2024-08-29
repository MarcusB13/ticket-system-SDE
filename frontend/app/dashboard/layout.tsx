import React from "react";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/api";

import SideBar from "@/components/Sidebar";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  let user: User | null = null;

  try {
    const response = await axiosInstance.get("/users/current/");
    user = response.data;
  } catch (error) {
    console.error("Error while fetching user data", error);
  }

  if (!user || !user.is_active) {
    redirect("/sign-up");
  }

  return (
    <div className="relative h-full overflow-hidden bg-background">
      <SideBar user={user} />
      <main
        id="content"
        className="overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-64 bg-card"
      >
        <div className="relative flex min-h-screen flex-col">
          <Header user={user} />
          <div className="flex-1 overflow-hidden px-4 py-6 md:px-8 h-full bg-secondary">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
