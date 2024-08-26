import { useEffect, useContext, useRef, useMemo } from "react";
import { string, z } from "zod";
import { FormContext } from "./Form";
import { typeSchemas } from "./schemas";

type TypeSchemas = keyof typeof typeSchemas;

interface useRegisterFieldProps {
  name: string;
  label: string;
  type: string;
  required: boolean;
  customSchema?: string;
}

export const useRegisterField = ({
  name,
  label,
  type,
  required,
  customSchema,
}: useRegisterFieldProps) => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "useRegisterField must be used within a FormContext.Provider"
    );
  }

  const { setSchema } = context;

  const memoizedSchema = useMemo(() => {
    let newFieldSchema: any =
      typeSchemas[customSchema as TypeSchemas] ||
      typeSchemas[type as TypeSchemas] ||
      z.any();

    if (required) {
      newFieldSchema = newFieldSchema.min(1, {
        message: `${label} er påkrævet`,
      });
    }

    if (newFieldSchema._def.typeName === "ZodAny") {
      console.warn(
        `No schema found for field type "${type}". Field will not be validated.`
      );
    }
    return { [name]: newFieldSchema };
  }, [name, type, required, label, customSchema]);

  useEffect(() => {
    setSchema((prev: any) => {
      const currentSchema = prev.shape[name];

      if (
        currentSchema &&
        currentSchema._def.typeName === memoizedSchema[name]._def.typeName
      ) {
        return prev;
      }

      return z.object({
        ...prev.shape,
        ...memoizedSchema,
      });
    });
  }, [memoizedSchema, name, setSchema]);
};
