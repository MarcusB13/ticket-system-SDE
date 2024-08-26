import React from "react";
import { PiCirclesFourFill } from "react-icons/pi";
import { FaHourglassStart, FaLock, FaTrash } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import axiosInstance from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Priorities = "Low" | "Medium" | "High";

type Status = "New" | "Closed" | "Pending" | "Deleted";

interface TicketDetails {
  totalTicketsCount: number;
  deletedTicektsCount: number;
  inProgressTicketsCount: number;
  closedTicketsCount: number;
}

export default async function page() {
  const [ticketDetailsResponse, allTicketsResponse] = await Promise.all([
    axiosInstance.get("/tickets/details/"),
    axiosInstance.get("/tickets/all/"),
  ]);

  const ticketDetails: TicketDetails = ticketDetailsResponse.data;
  const allTickets = allTicketsResponse.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 rounded-md bg-card text-card-foreground p-6 flex">
          <div className="rounded-full h-16 w-16 bg-blue-100 flex items-center justify-center">
            <PiCirclesFourFill size={30} className="text-blue-500" />
          </div>
          <div className="flex flex-col justify-center ml-3">
            <span className="font-extrabold text-lg">
              {ticketDetails.totalTicketsCount}
            </span>
            <p className="text-card-foreground/60 text-sm">Total Tickets</p>
          </div>
        </div>
        <div className="col-span-1 rounded-md bg-card text-card-foreground p-6 flex">
          <div className="rounded-full h-16 w-16 bg-yellow-100 flex items-center justify-center">
            <FaHourglassStart size={25} className="text-yellow-500" />
          </div>
          <div className="flex flex-col justify-center ml-3">
            <span className="font-extrabold text-lg">
              {ticketDetails.inProgressTicketsCount}
            </span>
            <p className="text-card-foreground/60 text-sm">Pending Tickets</p>
          </div>
        </div>
        <div className="col-span-1 rounded-md bg-card text-card-foreground p-6 flex">
          <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center">
            <FaLock size={25} className="text-green-500" />
          </div>
          <div className="flex flex-col justify-center ml-3">
            <span className="font-extrabold text-lg">
              {ticketDetails.closedTicketsCount}
            </span>
            <p className="text-card-foreground/60 text-sm">Closed Tickets</p>
          </div>
        </div>
        <div className="col-span-1 rounded-md bg-card text-card-foreground p-6 flex">
          <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center">
            <FaTrash size={25} className="text-red-500" />
          </div>
          <div className="flex flex-col justify-center ml-3">
            <span className="font-extrabold text-lg">
              {ticketDetails.deletedTicektsCount}
            </span>
            <p className="text-card-foreground/60 text-sm">Deleted Tickets</p>
          </div>
        </div>
      </div>
      <div className="rounded-md bg-card text-card-foreground p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Requested by</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link className="text-primary" href="/dashboard/tickets/">
                        #35653
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="font-medium">Marcus Bager</TableCell>
              <TableCell className="font-medium">Support for theme</TableCell>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>KH</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div className="bg-orange-100 h-8 flex justify-center items-center rounded-xl">
                  <span className="text-orange-400 font-bold">Medium</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="bg-green-100 h-8 flex justify-center items-center rounded-xl">
                  <span className="text-green-400 font-bold">New</span>
                </div>
              </TableCell>
              <TableCell className="text-center">1</TableCell>
              <TableCell>01/01/2021</TableCell>
              <TableCell className="font-medium">01/01/2021</TableCell>
              <TableCell className="flex justify-center">
                <BsThreeDots size={20} className="text-card-foreground/30" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
