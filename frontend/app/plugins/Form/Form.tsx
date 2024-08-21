"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form as ShadcnForm } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny, ZodSchema } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import "./styles.css";

interface FormContextType {
  setSchema: React.Dispatch<React.SetStateAction<ZodSchema<ZodTypeAny>>>;
  isSubmitting: boolean;
}

interface Response {
  error?: string;
  success?: string;
  status?: number;
}

export const FormContext = createContext<FormContextType | null>(null);

interface FormProps {
  children: ReactNode;
  onSubmit: (data: any) => Promise<Response>;
  item?: any;
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
  method = "post",
  action = "",
  enctype = "application/x-www-form-urlencoded",
  idPrefix = null,
  redirect = null,
  style,
  className,
}) => {
  const router = useRouter();

  const [schema, setSchema] = useState<ZodSchema<any>>(z.object({}));

  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: item,
  });

  useEffect(() => {
    if (item) {
      methods.reset(item);
    }
  }, [item, methods]);

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    const submissionData = { ...item, ...data };
    const response: Response = await onSubmit(submissionData);

    const error = response?.error;
    const success = response?.success;
    const status = response?.status;

    if (error) {
      toast.error(error);
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
