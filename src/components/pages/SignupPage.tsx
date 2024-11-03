"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { signup } from "@/app/signup/actions";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    console.log(data, "FROM react hook form");

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("fullName", `${data.firstName} ${data.lastName}`);

      setIsLoading(true);

      await signup(formData);
    } catch (error: any) {
      console.error(error, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
      <Card className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="text-center p-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="h-12 w-auto mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-[#17607b]">Sign Up</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-[#17607b]">
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "First Name is required",
                })}
                placeholder="Enter your first name"
                className="mt-1 border-[#17607b] focus:ring-[#17607b] focus:border-[#17607b]"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstName.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-[#17607b]">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last Name is required" })}
                placeholder="Enter your last name"
                className="mt-1 border-[#17607b] focus:ring-[#17607b] focus:border-[#17607b]"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.lastName.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-[#17607b]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your email"
                className="mt-1 border-[#17607b] focus:ring-[#17607b] focus:border-[#17607b]"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-[#17607b]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="Create a password"
                className="mt-1 border-[#17607b] focus:ring-[#17607b] focus:border-[#17607b]"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <Button
              className="w-full bg-[#17607b] hover:bg-[#134b61] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-[#17607b]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#17607b] hover:underline font-semibold"
            >
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
