import React from "react";
import { redirect } from "next/navigation";
import axiosInstance from "@/lib/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

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

  if (user?.role === "user") {
    redirect("/dashboard/create");
  }

  return children;
}
