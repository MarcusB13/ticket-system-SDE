import React from "react";

import SideBar from "@/components/Sidebar";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <SideBar />
      <main
        id="content"
        className="overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 md:ml-64 h-full"
      >
        <div className="relative flex h-full flex-col">
          <Header />
          <div className="flex-1 overflow-hidden px-4 py-6 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
