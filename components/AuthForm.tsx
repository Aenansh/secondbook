"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { createUserAccount, loginUser } from "@/actions/user.actions";
import OTPModal from "./OTPModal";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formtype: FormType) => {
  return z.object({
    username:
      formtype === "sign-up"
        ? z.string().min(5).max(255)
        : z.string().optional(),
    email: z.email(),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must contain one uppercase, one lowercase, one number, and one special character."
      ),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountId, setAccountId] = useState(null);
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError("");
    try {
      const user =
        type === "sign-up"
          ? await createUserAccount({
              username: values.username || "",
              email: values.email,
              password: values.password,
            })
          : await loginUser({ email: values.email, password: values.password });
      setAccountId(user.accountId);
      console.log(user.accountId);
    } catch (error: any) {
      setError(error.message + " " + "Failed to login!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full py-10 md:py-20 px-2 flex flex-1 justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8"
          >
            <h1 className="text-[34px] leading-[42px] font-bold text-center text-light-100 md:text-left">
              {type === "sign-in" ? "Welcome Back" : "Create your account"}
            </h1>
            {type === "sign-up" && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex h-[78px] flex-col justify-center rounded-xl border border-gray-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
                        <FormLabel className="text-[#1f1f1f] pt-2 text-[14px] leading-[20px] w-full">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            {...field}
                            className="border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-[14px] leading-[20px]"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-500 text-[14px] leading-[20px] ml-4" />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-[78px] flex-col justify-center rounded-xl border border-gray-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
                    <FormLabel className="text-[#1f1f1f] pt-2 text-[14px] leading-[20px] w-full">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-[14px] leading-[20px]"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-500 text-[14px] leading-[20px] ml-4" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-[78px] flex-col justify-center rounded-xl border border-gray-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
                    <FormLabel className="text-[#1f1f1f] pt-2 text-[14px] leading-[20px] w-full">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="border-none shadow-none p-0 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-[14px] leading-[20px]"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-500 text-[14px] leading-[20px] ml-4" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-[#1f1f1f] hover:bg-[#373737] transition-all rounded-full font-medium text-[14px] leading-[20px] h-[66px]"
              disabled={loading}
            >
              {type === "sign-in" ? "Login" : "Create account"}
              {loading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>
            {error && (
              <p className="text-[14px] leading-[20px] font-normal mx-auto w-fit rounded-xl bg-orange-950/5 px-8 py-4 text-center text-red-700">
                *{error}
              </p>
            )}
            <div className="text-[14px] leading-[20px] flex justify-center">
              <p className="text-gray-700">
                {type == "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="ml-1 font-medium text-blue-500"
              >
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </form>
        </Form>
      </div>
      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
