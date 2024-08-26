import React from "react";
import { Form, Control, Button } from "../plugins/Form";
import Link from "next/link";
import { signUp } from "./actions";

export default function page() {
  return (
    <div className="flex h-screen justify-center items-center">
      <Form
        onSubmit={signUp}
        redirect="/dashboard/tickets"
        className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm mb-20"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight font-bold text-2xl">
            Sign up
          </h3>
          <p className="text-sm text-muted-foreground">
            Sign up to continue to your account with username, email and
            password
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
              type="email"
              placeholder="Email"
              label="Email"
              name="email"
              required
            />
            <Control
              type="password"
              placeholder="Password"
              label="Password"
              name="password"
              required
            />
            <Control
              type="password"
              placeholder="Confirm password"
              label="Confirm password"
              name="password2"
              required
            />
            <Button text="Login" className="w-full" />
            <div className="flex justify-end">
              <Link
                href="/sign-in"
                className="text-sm text-admin-light-primaryTxt opacity-70 transition duration-150 ease-in-out hover:underline"
              >
                Har du allerede en konto?
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
