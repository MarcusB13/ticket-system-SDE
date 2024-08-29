"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Form as ShadcnForm } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny, ZodSchema } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import { getCsrfTokenFromCookie } from "./utils";

import "./styles.css";

interface FormContextType {
  setSchema: React.Dispatch<React.SetStateAction<ZodSchema<ZodTypeAny>>>;
  isSubmitting: boolean;
}

interface Response {
  error?: string;
  success?: string;
  status?: number;
  validationErrors?: { path: string[]; message: string }[];
}

export const FormContext = createContext<FormContextType | null>(null);

interface FormProps {
  children: ReactNode;
  onSubmit?: (data: any) => Promise<Response>;
  item?: any;
  autoSave?: boolean;
  autoSaveKey?: string;
  autoSaveInterval?: number;
  method?: string;
  action?: string;
  enctype?: string;
  idPrefix?: string;
  redirect?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  item,
  autoSave = false,
  autoSaveKey = "formData",
  autoSaveInterval = 5000,
  method = "post",
  action = "",
  enctype = "application/x-www-form-urlencoded",
  idPrefix = null,
  redirect = null,
  style,
  className,
}) => {
  const router = useRouter();

  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    const token = getCsrfTokenFromCookie();
    setCsrfToken(token);
  }, []);

  const [schema, setSchema] = useState<ZodSchema<any>>(z.object({}));

  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: item,
  });

  const watchedValues = useWatch({
    control: methods.control,
    defaultValue: item,
  });

  useEffect(() => {
    if (item) {
      methods.reset(item);
    }
  }, [item, methods]);

  useEffect(() => {
    if (autoSave && autoSaveKey) {
      const savedData = localStorage.getItem(autoSaveKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const isExpired =
          Date.now() - parsedData.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
          localStorage.removeItem(autoSaveKey);
        } else {
          methods.reset(parsedData.values);
        }
      }
    }
  }, [autoSave, autoSaveKey, methods]);

  const debouncedSaveFormData = useCallback(
    debounce((values) => {
      if (autoSave && autoSaveKey) {
        const nonEmptyValues = Object.fromEntries(
          Object.entries(values).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        );

        if (Object.keys(nonEmptyValues).length > 0) {
          const dataToSave = {
            timestamp: Date.now(),
            values: nonEmptyValues,
          };
          localStorage.setItem(autoSaveKey, JSON.stringify(dataToSave));
        }
      }
    }, autoSaveInterval),
    [autoSave, autoSaveKey, autoSaveInterval]
  );

  useEffect(() => {
    if (autoSave) {
      debouncedSaveFormData(watchedValues);
    }
  }, [watchedValues, debouncedSaveFormData]);

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    if (!onSubmit) {
      return;
    }

    if (autoSaveKey) {
      localStorage.removeItem(autoSaveKey);
    }

    const submissionData = { ...item, ...data, csrfToken };
    const response: Response = await onSubmit(submissionData);

    const error = response?.error;
    const success = response?.success;
    const status = response?.status;
    const validationErrors = response?.validationErrors;

    if (error) {
      if (validationErrors) {
        validationErrors.forEach((validationError) => {
          methods.setError(validationError.path.join("."), {
            type: "server",
            message: validationError.message,
          });
        });
      } else {
        toast.error(error);
      }

      return;
    } else if (success) {
      toast.success(success);
    }

    if (status === 200) {
      if (redirect) {
        router.push(redirect);
      }

      router.refresh();
    }

    if (!item) {
      methods.reset();
    }
  };

  return (
    <FormContext.Provider
      value={{ setSchema, isSubmitting: methods.formState.isSubmitting }}
    >
      <ShadcnForm {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleFormSubmit)}
          method={item ? "patch" : method}
          action={action}
          encType={enctype}
          style={style}
          className={`form-wrapper ${className}`}
          id={idPrefix ? `form-${idPrefix}` : undefined}
        >
          {children}
        </form>
      </ShadcnForm>
    </FormContext.Provider>
  );
};
