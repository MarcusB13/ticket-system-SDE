import React from "react";
import { Form, Control, Button } from "@/app/plugins/Form";
import { createCompany } from "./actions";

export default function page() {
  return (
    <div className="flex justify-center">
      <Form
        onSubmit={createCompany}
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto w-3/4"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Create company
          </h3>
          <p className="text-sm text-muted-foreground">
            Fill in the form below to create a new company.
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-6">
            <div className="gap-2 grid grid-cols-2">
              <Control
                type="text"
                placeholder="Name"
                label="Name"
                name="name"
                required
              />
              <Control
                type="text"
                placeholder="Email"
                label="Email"
                name="email"
                required
                customSchema="email"
              />
            </div>
            <div className="gap-2 grid grid-cols-2">
              <Control
                type="text"
                placeholder="City"
                label="City"
                name="city"
                required
              />
              <Control
                type="text"
                placeholder="Address"
                label="Address"
                name="address"
                required
              />
            </div>
            <div className="gap-2 grid grid-cols-2">
              <Control
                type="text"
                placeholder="Vat number"
                label="Vat number"
                name="vat_no"
                required
              />
              <Control
                type="text"
                placeholder="Product"
                label="Product"
                name="product"
                required
              />
            </div>
            <div className="gap-2 grid grid-cols-2">
              <Control
                type="number"
                placeholder="Max response time"
                label="Max response time"
                name="max_response_time"
                required
              />
              <Control
                type="number"
                placeholder="Max resolution time"
                label="Max resolution time"
                name="max_resolution_time"
                required
              />
            </div>
            <Control
              type="checkbox"
              placeholder="Is accepted"
              label="Is accepted"
              name="is_accepted"
            />
            <Button text="Save" className="w-full" />
          </div>
        </div>
      </Form>
    </div>
  );
}
