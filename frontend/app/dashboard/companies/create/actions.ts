"use server";

import { z } from "zod";
import { emailSchema } from "@/app/plugins/Form/schemas";
import axiosInstance from "@/lib/api";

interface FormData {
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

export async function createCompany(formData: FormData) {
  const validations = updateCompanySchema.safeParse(formData);

  if (!validations.success) {
    return {
      error: "Missing one or more required fields",
      status: 400,
    };
  }

  const data = validations.data;

  try {
    await axiosInstance.post("/tickets/companies/", {
      ...data,
      service_level_agreement: {
        product: data.product,
        max_response_time: data.max_response_time,
        max_resolution_time: data.max_resolution_time,
        is_accepted: data.is_accepted,
      },
    });

    return {
      success: "Company created successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while creating the company",

      status: 500,
    };
  }
}
