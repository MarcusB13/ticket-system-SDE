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
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { formatDate } from "@/utils/renders";

interface UserPagination extends Pagination {
  results: User[];
}

export default async function page() {
  const [usersResponse, currentUserResponse] = await Promise.all([
    axiosInstance.get("/users/all/"),
    axiosInstance.get("/users/current/"),
  ]);

  const users: UserPagination = usersResponse.data;
  const currentUser: User = currentUserResponse.data;

  return (
    <div className="rounded-md bg-card text-card-foreground p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Create Date</TableHead>
            <TableHead className="text-center">Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.results.map((user) => (
            <TableRow key={user.uuid}>
              <TableCell className="font-bold">
                {user.role === "admin" || user.uuid === currentUser.uuid ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className="text-primary"
                          href={`/dashboard/users/${user.uuid}`}
                        >
                          {user.pk}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  user.pk
                )}
              </TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="flex justify-center">
                {user.is_active ? (
                  <BsFillCheckCircleFill color="#94cf7c" size={16} />
                ) : (
                  <AiFillCloseCircle color="#ff7762" size={16} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
