import React from "react";
import axiosInstance from "@/lib/api";
import { Form, Control, Button } from "@/app/plugins/Form";
import { updateCompany } from "./actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function page({ params }: Props) {
  const id = params.id;

  const companyResponse = await axiosInstance.get(`/tickets/company/${id}/`);

  const company: Company = companyResponse.data;

  return (
    <div className="flex justify-center">
      <Form
        item={{
          uuid: company.uuid,
          name: company.name,
          email: company.email,
          city: company.city,
          address: company.address,
          vat_no: company.vat_no,
          product: company.service_level_agreement.product,
          max_response_time: company.service_level_agreement.max_response_time,
          max_resolution_time:
            company.service_level_agreement.max_resolution_time,
          is_accepted: company.service_level_agreement.is_accepted,
        }}
        onSubmit={updateCompany}
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto w-3/4"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Edit company
          </h3>
          <p className="text-sm text-muted-foreground">
            Edit company details for company ID: {company.pk}
          </p>
        </div>
        <div className="p-6">
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
