"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useRegisterField } from "./useRegisterField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

interface ControlProps {
  name: string;
  type?: string;
  label: string;
  description?: string;
  error?: any;
  required?: boolean;
  options?: any[];
  placeholder?: string;
  customSchema?: string;
  defaultValue?: any;
  renderFor?: string;
  wrapperClassName?: string;
  [key: string]: any;
}

export const Control: React.FC<ControlProps> = ({
  name,
  type = "text",
  label,
  description = "",
  error,
  required = false,
  options = [],
  placeholder = "",
  customSchema,
  defaultValue,
  renderFor,
  wrapperClassName,
  ...rest
}) => {
  const { control, formState, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const { errors } = formState;

  useRegisterField({ name, type, label, required, customSchema });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const shouldRender = () => {
    if (!renderFor) return true;

    const [watchedField, watchedValue] = renderFor.split(":");
    const currentValue = watch(watchedField);

    return currentValue === watchedValue;
  };

  const renderInput = (field: any) => {
    switch (type) {
      case "select":
        return (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || options[0]?.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={option.itemClassName || ""}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return <Textarea {...field} placeholder={placeholder} {...rest} />;
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value ?? false}
              onCheckedChange={(checked) => field.onChange(checked)}
              id={name}
              {...rest}
            />
            {label && (
              <FormLabel htmlFor={name} className="form-label">
                {label}
                {required && (
                  <span className="form-required text-primary ml-1">*</span>
                )}
              </FormLabel>
            )}
          </div>
        );
      case "radio":
        return (
          <RadioGroup onValueChange={field.onChange} value={field.value}>
            {options.map((option) => (
              <FormItem key={option.value}>
                <RadioGroupItem value={option.value} id={option.value} />
                <FormLabel htmlFor={option.value}>{option.label}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );
      case "password":
        return (
          <div className="relative">
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              value={field.value || ""}
              onChange={field.onChange}
              {...rest}
            />
            <div
              className="absolute top-0 right-0 flex items-center h-full px-1"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <div className="w-6 h-6 text-card-foreground/50" />
              ) : (
                <div className="w-6 h-6 text-card-foreground/50" />
              )}
            </div>
          </div>
        );
      case "calender":
        return (
          <Calendar
            {...field}
            selected={field.value}
            onSelect={field.onChange}
            {...rest}
          />
        );
      default:
        return (
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            value={field.value || ""}
            onChange={field.onChange}
            {...rest}
          />
        );
    }
  };

  const adjustedDefaultValue = () => {
    if (type === "checkbox") {
      return defaultValue !== undefined ? defaultValue : false;
    }
    return defaultValue || (type === "select" ? options[0]?.value : "");
  };

  if (!shouldRender()) return null;

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={adjustedDefaultValue()}
      render={({ field }) => (
        <FormItem className={wrapperClassName}>
          {label && type !== "checkbox" && (
            <FormLabel htmlFor={name} className="form-label">
              {label}
              {required && (
                <span className="form-required text-primary ml-1">*</span>
              )}
            </FormLabel>
          )}
          {type !== "select" ? (
            <FormControl>{renderInput(field)}</FormControl>
          ) : (
            renderInput(field)
          )}
          {description && (
            <FormDescription className="form-description">
              {description}
            </FormDescription>
          )}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <FormMessage className="form-error">{message}</FormMessage>
            )}
          />
        </FormItem>
      )}
    />
  );
};
