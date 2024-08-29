"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { createSolution } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SolutionDialogProps {
  ticket_uuid: string;
  renderFor: string;
}

export default function SolutionDialog({
  ticket_uuid,
  renderFor,
}: SolutionDialogProps) {
  const router = useRouter();
  const { watch } = useFormContext();

  const [errorTitle, setErrorTitle] = useState("");

  const shouldRender = () => {
    if (!renderFor) return true;

    const [watchedField, watchedValue] = renderFor.split(":");
    const currentValue = watch(watchedField);

    return currentValue === watchedValue;
  };

  const handleCreateSolution = async () => {
    const formData = {
      ticket_uuid,
      error: errorTitle,
    };

    const reponse = await createSolution(formData);

    if (reponse.error) {
      toast.error(reponse.error);
      return;
    } else if (reponse.success) {
      toast.success(reponse.success);
    }

    router.refresh();
  };

  if (!shouldRender()) return null;

  return (
    <Dialog>
      <DialogTrigger className="inline-flex !mt-4 items-center justify-center whitespace-nowrap rounded-md w-full text-sm font-medium bg-green-400 text-primary-foreground hover:bg-green-400/90 h-10 px-4 py-2 transition-colors ring-offset-background">
        Add to known solutions
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to known solutions</DialogTitle>
          <DialogDescription className="flex flex-col">
            <div className="space-y-2 my-4">
              <Label htmlFor="error-title">
                Error title
                <span className="text-primary ml-1">*</span>
              </Label>
              <Input
                type="text"
                id="error-title"
                placeholder="Write a title for the error"
                value={errorTitle}
                onChange={(e) => setErrorTitle(e.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={handleCreateSolution}
              className="ml-auto bg-green-400 hover:bg-green-400/90 text-primary-foreground"
            >
              Add solution
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
