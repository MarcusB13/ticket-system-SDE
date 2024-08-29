"use server";

import { z } from "zod";
import { typeSchemas, usernameSchema } from "../plugins/Form/schemas";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import axiosInstance from "@/lib/api";
import { withValidation } from "../plugins/Form/withValidation";

const signInSchema = z.object({
  username: usernameSchema,
  password: typeSchemas.password,
});

export const signIn = withValidation(signInSchema, async (validatedData) => {
  try {
    const reponse = await axiosInstance.post("/users/login/", validatedData);

    const cookiesReponse = reponse.headers["set-cookie"];

    if (cookiesReponse) {
      const jwt = cookiesReponse[0]
        .split(";")
        .find((c) => c.startsWith("jwt="))
        ?.split("=")[1];

      if (jwt) {
        cookies().set("jwt", jwt);
      }
    }

    return {
      success: "You have successfully signed in!",
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
});
