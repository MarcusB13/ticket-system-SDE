"use server";

import { z } from "zod";
import { typeSchemas, usernameSchema } from "../plugins/Form/schemas";
import { isRedirectError } from "next/dist/client/components/redirect";
import axiosInstance from "@/lib/api";

const signUpSchemas = z.object({
  username: usernameSchema,
  email: typeSchemas.email,
  password: typeSchemas.password,
  password2: typeSchemas.password,
});

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
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

  if (data.password !== data.password2) {
    return {
      error: "Passwords do not match",
      status: 400,
    };
  }

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
