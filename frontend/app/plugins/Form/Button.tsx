"use client";

import React, { useState, useContext } from "react";
import { FormContext } from "./Form";
import { Button as ButtonUi } from "@/components/ui/button";

interface ButtonProps {
  text: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text = "Submit",
  className,
}) => {
  const { isSubmitting } = useContext(FormContext) || {};

  const [effect, setEffect] = useState(false);

  const handleClick = () => {
    setEffect(true);
  };

  if (isSubmitting === undefined) {
    console.error("DynamicButton must be used within a FormContext.Provider");
    return null;
  }

  return (
    <ButtonUi
      type="submit"
      onClick={handleClick}
      disabled={isSubmitting}
      style={{
        opacity: isSubmitting ? "0.5" : "1",
      }}
      className={`${effect ? "animate-btnClick" : ""} ${className}`}
      onAnimationEnd={() => setEffect(false)}
    >
      {isSubmitting ? "Indlæser..." : text}
    </ButtonUi>
  );
};
