import React from "react";
import { Form, Control, Button } from "@/app/plugins/Form";
import axiosInstance from "@/lib/api";
import { createTicket } from "./actions";
import { notFound } from "next/navigation";

export default async function page() {
  let user: User | null = null;

  try {
    const response = await axiosInstance.get("/users/current/");
    user = response.data;
  } catch (error) {
    console.error("Error while fetching user data", error);
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="flex justify-center">
      <Form
        item={{
          service_level_agreement:
            user.company[0]?.service_level_agreement?.uuid,
        }}
        onSubmit={createTicket}
        redirect="/dashboard/my-tickets"
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm my-20"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Create ticket
          </h3>
          <p className="text-sm text-muted-foreground">
            Fill in the form below to create a new ticket
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <Control
              type="text"
              placeholder="Subject"
              label="Subject"
              name="subject"
              required
            />
            <Control
              type="textarea"
              placeholder="Description"
              label="Description"
              name="description"
              required
            />
            <Control
              type="select"
              name="company"
              label="Company"
              options={user.company.map((company) => ({
                value: company.uuid,
                label: company.name,
              }))}
            />
            <Button text="Create" className="w-full" />
          </div>
        </div>
      </Form>
    </div>
  );
}
