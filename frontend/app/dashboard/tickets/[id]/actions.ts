"use server";

import { z } from "zod";
import axiosInstance from "@/lib/api";

interface FormData {
  uuid: string;
  subject: string;
  description: string;
  company: string;
  priority: string;
  status: string;
  assignee: string;
  level: number;
  due_date: Date;
}

const updateScheme = z.object({
  uuid: z.string(),
  subject: z.string(),
  description: z.string(),
  company: z.string(),
  priority: z.string(),
  status: z.string(),
  assignee: z.string(),
  level: z.number(),
  due_date: z.date(),
});

export async function updateTicket(formData: FormData) {
  const validation = updateScheme.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Mangler en eller flere felter",
      status: 400,
    };
  }

  const { uuid, ...data } = validation.data;

  try {
    const response = await axiosInstance.post(`/tickets/${uuid}/`, data);

    const ticket = response.data;

    if (!ticket) {
      return {
        error: "Ticket not found",
        status: 404,
      };
    }

    return {
      success: "Ticket has been updated!",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
      status: 500,
    };
  }
}
