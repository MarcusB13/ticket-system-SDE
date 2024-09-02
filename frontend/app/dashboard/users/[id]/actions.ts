"use server";

import { z } from "zod";
import { usernameSchema, emailSchema } from "@/app/plugins/Form/schemas";
import axiosInstance from "@/lib/api";

interface FormData {
  uuid: string;
  username: string;
  email: string;
  role: string;
  company: string;
  is_active: boolean;
  isCurrentUser: boolean;
}

const updateUserScheme = z.object({
  uuid: z.string(),
  username: usernameSchema,
  email: emailSchema,
  role: z.string(),
  company: z.array(z.object({ label: z.string(), value: z.string() })),
  is_active: z.boolean(),
  isCurrentUser: z.boolean(),
});

export async function updateUser(formData: FormData) {
  const validation = updateUserScheme.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Missing one or more fields",
      status: 400,
    };
  }

  const { uuid, ...data } = validation.data;

  try {
    if (data.isCurrentUser) {
      await axiosInstance.patch("/users/update/", data);
    } else {
      const company = data.company.map((company) => company.value);

      await axiosInstance.patch(`/users/${uuid}/`, {
        ...data,
        company,
      });
    }

    return {
      success: "User updated successfully!",
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
