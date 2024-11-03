"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const { data: userData, error } = await supabase
    .from("users")
    .select("username,email")
    .eq("username", data.username)
    .single();

  if (error) {
    return { error };
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password: data.password,
  });

  if (authError) {
    return { authError };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
