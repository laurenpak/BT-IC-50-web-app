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
import { login } from "@/app/login/actions";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data, "FROM react hook form");

    try {
      const formData = new FormData();
      formData.append("username", `${data.username}`);
      formData.append("password", data.password);

      setIsLoading(true);

      await login(formData);
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
          <h1 className="text-2xl font-bold text-[#17607b]">Log In</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-[#17607b]">
                Username
              </Label>
              <Input
                id="username"
                {...register("username", { required: "Username is required" })}
                placeholder="Enter your username"
                className="mt-1 border-[#17607b] focus:ring-[#17607b] focus:border-[#17607b]"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message?.toString()}
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
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
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
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-[#17607b]">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#17607b] hover:underline font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
