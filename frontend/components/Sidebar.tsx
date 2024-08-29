import React from "react";
import { Button } from "./ui/button";
import NavLink from "./NavLink";
import { FaList, FaUsers } from "react-icons/fa";
import { FiChevronsLeft } from "react-icons/fi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBulbFilled } from "react-icons/tb";

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const lowAccess = user.role === "user";
  const isAdmin = user.role === "admin";

  return (
    <aside className="fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh md:w-64">
      <div className="absolute inset-0 transition-[opacity] delay-100 duration-700 h-0 opacity-0 w-full bg-black md:hidden"></div>
      <div className="relative flex h-full w-full flex-col">
        <div className="flex h-16 flex-none items-center gap-4 bg-background p-4 sticky top-0 justify-between px-4 py-3 shadow md:px-4">
          <h1 className="text-lg font-semibold text-center w-full">
            Ticket System
          </h1>
        </div>
        <div
          data-collapesed="false"
          className="group border-b bg-background transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none h-full flex-1 overflow-auto max-h-0 py-0 md:max-h-screen md:py-2"
        >
          <nav className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {!lowAccess ? (
              <>
                <NavLink
                  to="/dashboard/tickets"
                  className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
                >
                  <div className="mr-2">
                    <FaList size={18} />
                  </div>
                  Tickets
                </NavLink>
                <NavLink
                  to="/dashboard/assigned-tickets"
                  className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
                >
                  <div className="mr-2">
                    <FaList size={18} />
                  </div>
                  Assigned Tickets
                </NavLink>
                <NavLink
                  to="/dashboard/users"
                  className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
                >
                  <div className="mr-2">
                    <FaUsers size={18} />
                  </div>
                  Users
                </NavLink>
                <NavLink
                  to="/dashboard/solutions"
                  className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
                >
                  <div className="mr-2">
                    <TbBulbFilled size={18} />
                  </div>
                  Solutions
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard/create"
                  className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
                >
                  <div className="mr-2">
                    <FaList size={18} />
                  </div>
                  Create Ticket
                </NavLink>
                <NavLink
                  to="/dashboard/my-tickets"
                  className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
                >
                  <div className="mr-2">
                    <FaList size={18} />
                  </div>
                  See my tickets
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink
                to="/dashboard/companies"
                className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-secondary-foreground shadow-sm hover:bg-secondary text-base h-12 justify-start text-wrap rounded-none px-6 from-primary to-primary/70 [&.active]:bg-gradient-to-r [&.active]:text-white"
              >
                <div className="mr-2">
                  <HiBuildingOffice2 size={18} />
                </div>
                Companies
              </NavLink>
            )}
          </nav>
        </div>
        <Button
          size="icon"
          variant="outline"
          aria-label="Collapse sidebar"
          className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
        >
          <FiChevronsLeft className={`h-5 w-5`} />
        </Button>
      </div>
    </aside>
  );
}
