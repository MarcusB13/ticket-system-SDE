import React from "react";
import axiosInstance from "@/lib/api";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/utils/renders";

interface SolutionPagination extends Pagination {
  results: Solution[];
}

export default async function page() {
  const solutionsResponse = await axiosInstance.get("/tickets/solutions/");

  const solutions: SolutionPagination = solutionsResponse.data;

  return (
    <div className="rounded-md bg-card text-card-foreground p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Error Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-center w-36">Created By</TableHead>
            <TableHead>Create Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solutions.results.map((solution) => (
            <TableRow key={solution.uuid}>
              <TableCell className="font-bold">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        className="text-primary"
                        href={`/dashboard/tickets/${solution.solution_ticket.uuid}`}
                      >
                        {solution.pk}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="font-medium">{solution.error}</TableCell>
              <TableCell className="font-medium">
                {solution.solution_ticket.subject}
              </TableCell>
              <TableCell className="flex justify-center">
                {solution.created_by ? (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(solution.created_by.username)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  "Unassigned"
                )}
              </TableCell>
              <TableCell>{formatDate(solution.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
