"use server";

import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import axiosInstance from "@/lib/api";

const createSchema = z.object({
  subject: z.string(),
  description: z.string(),
  company: z.string(),
  service_level_agreement: z.string(),
});

interface CreateTicketFormData {
  subject: string;
  description: string;
  company: string;
  service_level_agreement: string;
}

export async function createTicket(formData: CreateTicketFormData) {
  const validation = createSchema.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Missing one or more fields",
      status: 400,
    };
  }

  const data = validation.data;

  try {
    await axiosInstance.post("/tickets/create/", data);

    return {
      success: "You have created the ticket successfully!",
      status: 200,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    } else {
      console.error(error);
      return { error: "An error occured, try again.", status: 500 };
    }
  }
}
