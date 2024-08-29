import React from "react";
import axiosInstance from "@/lib/api";
import { Form, Control, Button } from "@/app/plugins/Form";
import { notFound } from "next/navigation";
import { updateUser } from "./actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function page({ params }: Props) {
  const id = params.id;

  let user: User | null = null;
  let isCurrentUser: boolean = false;
  let companies: Company[] = [];

  const currentUserResponse = await axiosInstance.get("/users/current/");

  const currentUser: User = currentUserResponse.data;

  if (currentUser.uuid !== id) {
    const userResponse = await axiosInstance.get(`/users/${id}/`);

    user = userResponse.data;
  } else {
    user = currentUser;
    isCurrentUser = true;
  }

  if (!user) {
    notFound();
  }

  const isAdmin = currentUser.role === "admin";

  if (isAdmin) {
    const companiesResponse = await axiosInstance.get("/tickets/companies/");
    companies = companiesResponse.data;
  }

  return (
    <div className="flex justify-center">
      <Form
        item={{
          ...user,
          company: user.company[0]?.uuid,
          isCurrentUser,
        }}
        onSubmit={updateUser}
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto w-3/4"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Edit user
          </h3>
          <p className="text-sm text-muted-foreground">
            Edit user details for user ID: {user.pk}
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-6">
            <div className="gap-2 grid grid-cols-2">
              <Control
                type="username"
                placeholder="Username"
                label="Username"
                name="username"
                required
              />
              <Control
                type="text"
                placeholder="Email"
                label="Email"
                name="email"
                required
                disabled
                customSchema="email"
              />
            </div>
            <Control
              type="select"
              name="role"
              label="Role"
              options={[
                "admin",
                "user",
                "supporter",
                "it-supporter",
                "developer",
              ].map((role) => ({
                label: role.charAt(0).toUpperCase() + role.slice(1),
                value: role,
              }))}
              disabled={!isAdmin}
            />
            {isAdmin && (
              <>
                <Control
                  type="select"
                  name="company"
                  label="Company"
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.uuid,
                  }))}
                />
                <Control type="checkbox" name="is_active" label="Active" />
              </>
            )}
            <Button text="Save" className="w-full" />
          </div>
        </div>
      </Form>
    </div>
  );
}
