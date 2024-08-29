import { z, ZodSchema } from "zod";
import { cookies } from "next/headers";

export function validateCsrfToken(csrfTokenFromForm: string) {
  const csrfTokenCookie = cookies().get("csrfToken");

  if (!csrfTokenCookie || csrfTokenFromForm !== csrfTokenCookie.value) {
    throw new Error("Invalid CSRF token");
  }
}

function validateForm<T extends ZodSchema>(
  schema: T,
  formData: Record<string, any>
) {
  try {
    validateCsrfToken(formData.csrfToken);
  } catch (error) {
    return {
      success: false as const,
      status: 403,
      error: "Invalid CSRF token",
    };
  }

  const validation = schema.safeParse(formData);

  if (!validation.success) {
    return {
      success: false as const,
      status: 400,
      error: "Invalid form data",
      validationErrors: validation.error.errors,
    };
  }

  return {
    success: true as const,
    data: validation.data,
  };
}

type Handler<T> = (validatedData: T) => Promise<any>;

export function withValidation<T extends ZodSchema>(
  schema: T,
  handler: Handler<z.infer<T>>
) {
  return async (formData: Record<string, any>) => {
    const validationResult = validateForm(schema, formData);

    if (!validationResult.success) {
      return {
        error: validationResult.error,
        status: validationResult.status,
        validationErrors: validationResult.validationErrors,
      };
    }

    return handler(validationResult.data);
  };
}
