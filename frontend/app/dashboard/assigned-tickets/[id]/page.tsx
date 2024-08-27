import React from "react";
import axiosInstance from "@/lib/api";
import { Form, Control, Button } from "@/app/plugins/Form";
import { updateTicket } from "../../tickets/[id]/actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function page({ params }: Props) {
  const id = params?.id;

  const [userResponse, ticketResponse, companiesResponse] = await Promise.all([
    axiosInstance.get("/users/current/"),
    axiosInstance.get(`/tickets/${id}/`),
    axiosInstance.get("/tickets/companies/"),
  ]);

  const currentUser: User = userResponse.data;
  const ticket: Ticket = ticketResponse.data;
  const companies: Company[] = companiesResponse.data;

  return (
    <div className="flex justify-center">
      <Form
        item={{
          uuid: ticket.uuid,
          subject: ticket.subject,
          description: ticket.description,
          assignee: ticket.assigned?.uuid,
          company: ticket.service_level_agreement.company.uuid,
          priority: ticket.priority,
          status: ticket.status,
          level: ticket.level,
          due_date: ticket.due_date ? new Date(ticket.due_date) : null,
        }}
        onSubmit={updateTicket}
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto w-2/4"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Edit ticket
          </h3>
          <p className="text-sm text-muted-foreground">
            Edit ticket details for ticket ID: {ticket.pk}
          </p>
        </div>
        <div className="p-6 pt-0">
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
              options={companies.map((company) => ({
                label: company.name,
                value: company.uuid,
              }))}
            />
            <Control
              type="select"
              name="priority"
              label="Priority"
              options={[
                {
                  label: "Low",
                  value: "low",
                  itemClassName: "!text-yellow-400",
                },
                {
                  label: "Medium",
                  value: "medium",
                  itemClassName: "!text-orange-400",
                },
                {
                  label: "High",
                  value: "high",
                  itemClassName: "!text-red-400",
                },
              ]}
            />
            <Control
              type="select"
              name="status"
              label="Status"
              options={[
                {
                  label: "New",
                  value: "new",
                  itemClassName: "!text-green-400",
                },
                {
                  label: "Pending",
                  value: "pending",
                  itemClassName: "!text-yellow-400",
                },
                {
                  label: "Closed",
                  value: "closed",
                  itemClassName: "!text-blue-400",
                },
                {
                  label: "Deleted",
                  value: "deleted",
                  itemClassName: "!text-red-400",
                },
              ]}
            />
            <Control
              type="select"
              name="assignee"
              label="Assignee"
              options={[
                { label: "Unassigned", value: null },
                { label: "Me", value: currentUser.uuid },
              ]}
            />
            <Control type="number" name="level" label="Level" required />
            <Control type="calender" name="due_date" label="Due date" />
            <Button text="Gem" className="w-full" />
          </div>
        </div>
      </Form>
    </div>
  );
}
