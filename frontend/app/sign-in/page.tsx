import React from "react";
import { Form, Control, Button } from "../plugins/Form";
import Link from "next/link";
import { signIn } from "./actions";

export default function page() {
  return (
    <div className="flex h-screen justify-center items-center">
      <Form
        onSubmit={signIn}
        redirect="/dashboard/tickets"
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm mb-20"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Sign in
          </h3>
          <p className="text-sm text-muted-foreground">
            Sign in to your account with username and password to continue
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <Control
              type="text"
              placeholder="Username"
              label="Username"
              name="username"
              customSchema="username"
              required
            />
            <Control
              type="password"
              placeholder="Password"
              label="Password"
              name="password"
              required
            />
            <Button text="Login" className="w-full" />
            <div className="flex justify-end">
              <Link
                href="/sign-up"
                className="text-sm text-admin-light-primaryTxt opacity-70 transition duration-150 ease-in-out hover:underline"
              >
                Mangler du en konto?
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
