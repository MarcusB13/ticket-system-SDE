"use server";

import { z } from "zod";
import { typeSchemas, usernameSchema } from "../plugins/Form/schemas";
import { isRedirectError } from "next/dist/client/components/redirect";
import axiosInstance from "@/lib/api";

const signUpSchemas = z.object({
  username: usernameSchema,
  email: typeSchemas.email,
  password: typeSchemas.password,
  confirmPassword: typeSchemas.password,
});

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function signUp(formData: SignUpFormData) {
  const validation = signUpSchemas.safeParse(formData);

  if (!validation.success) {
    return {
      error: "Missing one or more fields",
      status: 400,
    };
  }

  const data = validation.data;

  try {
    await axiosInstance.post("/users/signup/", data);

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
