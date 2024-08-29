"use server";

import { z } from "zod";
import { emailSchema } from "@/app/plugins/Form/schemas";
import axiosInstance from "@/lib/api";

interface FormData {
  uuid: string;
  name: string;
  email: string;
  city: string;
  address: string;
  vat_no: string;
  product: string;
  max_response_time: number;
  max_resolution_time: number;
  is_accepted: boolean;
}

const updateCompanySchema = z.object({
  uuid: z.string(),
  name: z.string(),
  email: emailSchema,
  city: z.string(),
  address: z.string(),
  vat_no: z.string(),
  product: z.string(),
  max_response_time: z.number(),
  max_resolution_time: z.number(),
  is_accepted: z.boolean(),
});

export async function updateCompany(formData: FormData) {
  const validation = updateCompanySchema.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Missing one or more required fields",
      status: 400,
    };
  }

  const { uuid, ...data } = validation.data;

  try {
    await axiosInstance.patch(`/tickets/company/${uuid}/`, {
      ...data,
      service_level_agreement: {
        product: data.product,
        max_response_time: data.max_response_time,
        max_resolution_time: data.max_resolution_time,
        is_accepted: data.is_accepted,
      },
    });

    return {
      success: "Company updated successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while updating the company",
      status: 500,
    };
  }
}
