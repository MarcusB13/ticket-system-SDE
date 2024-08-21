import { z } from "zod";

const emailSchema = z.string().email({ message: "Indtast gyldig e-mail" });

const passwordSchema = z
  .string()
  .min(8, { message: "Password skal mindst være 8 bogstaver" })
  .max(100, { message: "Password må ikke gå over 100 bogstaver" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password skal indholde mindst et stor bogstav, et lille bogstav, et tal og et symbol",
  });

export const postalCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, "Ugyldigt postnummer");
export const usernameSchema = z
  .string()
  .min(3, "Brugernavn skal være mindst 3 bogstaver")
  .max(20, "Brugernavn må ikke være over 20 bogstaver")
  .regex(/^[a-zA-Z0-9]+$/, "Brugernavn må kun indholde bogstaver og tal");

export const typeSchemas = {
  email: emailSchema,
  password: passwordSchema,
  url: z.string().url("Invalid URL"),
  text: z.string(),
  number: z.coerce.number(),
  checkbox: z.boolean(),
  select: z.string(),
  radio: z.string(),
  textarea: z.string(),
  date: z.date(),
  time: z.string(),
  datetime: z.date(),
  file: z.string(),
  image: z.string(),
  video: z.string(),
  audio: z.string(),
  tel: z.string(),
};
