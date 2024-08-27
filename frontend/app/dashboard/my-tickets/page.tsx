import React from "react";
import axiosInstance from "@/lib/api";
import Link from "next/link";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Badge from "@/components/Badge";
import { formatDate, getInitials } from "@/utils/renders";

interface TicketPagination extends Pagination {
  results: Ticket[];
}

export default async function page() {
  const ticketsResponse = await axiosInstance.get("/tickets/my-tickets/");

  const tickets: TicketPagination = ticketsResponse.data;

  return (
    <div className="rounded-md bg-card text-card-foreground p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Level</TableHead>
            <TableHead>Create Date</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.results.map((ticket) => (
            <TableRow key={ticket.uuid}>
              <TableCell className="font-bold">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        className="text-primary"
                        href={`/dashboard/my-tickets/${ticket.uuid}`}
                      >
                        {ticket.pk}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="font-medium">{ticket.subject}</TableCell>
              <TableCell className="font-medium">
                {ticket.service_level_agreement.company.name}
              </TableCell>
              <TableCell>
                {ticket.assigned ? (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(ticket.assigned.username)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  "Unassigned"
                )}
              </TableCell>
              <TableCell>
                <Badge status={ticket.status} />
              </TableCell>
              <TableCell className="text-center">{ticket.level}</TableCell>
              <TableCell>{formatDate(ticket.created_at)}</TableCell>
              <TableCell className="font-medium">
                {ticket.due_date ? formatDate(ticket.due_date) : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
