"use server";

import { z } from "zod";
import { typeSchemas, usernameSchema } from "../plugins/Form/schemas";
import { isRedirectError } from "next/dist/client/components/redirect";
import axiosInstance from "@/lib/api";

const signInSchema = z.object({
  username: usernameSchema,
  password: typeSchemas.password,
});

interface SignUpFormData {
  username: string;
  password: string;
}

export async function signIn(formData: SignUpFormData) {
  const validation = signInSchema.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Missing one or more fields",
      status: 400,
    };
  }

  const data = validation.data;

  try {
    await axiosInstance.post("/users/login/", data);

    return {
      success: "You have successfully signed up!",
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
