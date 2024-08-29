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
  assignee: string | null;
  level: number;
  due_date: Date;
  solution?: string;
  note: string;
  oldLevel: number;
}

const updateScheme = z.object({
  uuid: z.string(),
  subject: z.string(),
  description: z.string(),
  company: z.string(),
  priority: z.string(),
  status: z.string(),
  assignee: z.string().nullable(),
  level: z.number(),
  due_date: z.date(),
  solution: z.string().optional(),
  note: z.string(),
  oldLevel: z.number(),
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

  if (data.status === "closed" && !data.solution) {
    return {
      error: "Solution is required for closed tickets",
      status: 400,
    };
  }

  if (data.assignee === "unassigned") {
    data.assignee = null;
  }

  if (data.level !== data.oldLevel && !data.note) {
    return {
      error: "Note is required when changing ticket level",
      status: 400,
    };
  }

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

interface CreateSolutionFormData {
  ticket_uuid: string;
  error: string;
}

const createSolutionScheme = z.object({
  ticket_uuid: z.string(),
  error: z.string(),
});

export async function createSolution(formData: CreateSolutionFormData) {
  const validation = createSolutionScheme.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Mangler en eller flere felter",
      status: 400,
    };
  }

  const data = validation.data;

  try {
    await axiosInstance.post(`/tickets/solutions/`, data);

    return {
      success: "Solution has been added!",
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
