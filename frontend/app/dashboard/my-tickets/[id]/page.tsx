import React from "react";
import axiosInstance from "@/lib/api";
import { Form, Control, Button } from "@/app/plugins/Form";

interface Props {
  params: {
    id: string;
  };
}

export default async function page({ params }: Props) {
  const id = params.id;

  const ticketResponse = await axiosInstance.get(`/tickets/${id}/`);

  const ticket: Ticket = ticketResponse.data;

  return (
    <div className="flex justify-center">
      <Form
        item={{
          subject: ticket.subject,
          description: ticket.description,
          company: ticket.service_level_agreement.company.name,
          assignee: ticket.assigned?.username ?? "Unassigned",
        }}
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto w-1/3 my-20"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            My ticket
          </h3>
          <p className="text-sm text-muted-foreground">
            View ticket details for ticket ID: {ticket.pk}
          </p>
        </div>
        <div className="p-6 pt-4">
          <div className="space-y-6">
            <Control
              type="text"
              placeholder="Subject"
              label="Subject"
              name="subject"
              required
              disabled
            />
            <Control
              type="textarea"
              placeholder="Description"
              label="Description"
              name="description"
              required
              disabled
            />
            <Control
              type="text"
              name="company"
              label="Company"
              required
              disabled
            />
            <Control
              type="text"
              name="assignee"
              label="Assignee"
              required
              disabled
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
