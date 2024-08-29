import React from "react";
import axiosInstance from "@/lib/api";
import { redirect } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

export default async function page() {
  const userResponse = await axiosInstance.get("/users/current/");

  const user: User = userResponse.data;

  if (!user) {
    return redirect("/sign-up");
  }

  if (user.role !== "admin") {
    return redirect("/dashboard/tickets");
  }

  const companiesResponse = await axiosInstance.get("/tickets/companies/");

  const companies: Company[] = companiesResponse.data;

  return (
    <div className="rounded-md bg-card text-card-foreground p-6">
      <div className="mb-6">
        <Link href="/dashboard/companies/create">
          <Button>
            <FaPlus className="mr-2" />
            Create company
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>VAT number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.uuid}>
              <TableCell className="font-bold">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        className="text-primary"
                        href={`/dashboard/companies/${company.uuid}`}
                      >
                        {company.pk}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell className="font-medium">{company.email}</TableCell>
              <TableCell>{company.city}</TableCell>
              <TableCell>{company.address}</TableCell>
              <TableCell className="font-medium">{company.vat_no}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
