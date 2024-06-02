"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/sign-up", {
        email: data?.email,
        username: data?.username,
        password: data?.password,
      });
      router.replace(`/verify-code/${data?.email}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Welcome to NextCrud
          </h1>
          <p className="mb-4">Sign-up to create your account</p>
        </div>
        <Form {...form} className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...field}
                    name="username"
                    className="border-slate-800 focus:outline-none"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    name="email"
                    className="border-slate-800 focus:outline-none"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...field}
                    name="password"
                    type="password"
                    className="border-slate-800 focus:outline-none"
                  />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-8">
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
