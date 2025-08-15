"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { sendOTP, verifySecret } from "@/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await verifySecret({ accountId, password });
      if (session) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to verify OTP!");
    } finally {
      setLoading(false);
    }
  };
  const resendOtp = async () => {
    await sendOTP({ email });
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="space-y-4 max-w-[95%] sm:w-fit rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-white outline-none">
          <AlertDialogHeader className="flex relative justify-center">
            <AlertDialogTitle className="text-center font-bold text-[24px] leading-[36px]">
              Enter the OTP
              <Image
                src={"/assets/icons/close-dark.svg"}
                alt="close"
                width={20}
                height={20}
                onClick={() => setIsOpen(false)}
                className="absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 font-semibold text-[14px] leading-[20px]">
              We&apos;ve sent a code to
              <span className="pl-1 text-[#1f1f1f]">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-between">
              <InputOTPSlot
                index={0}
                className="text-[40px] font-medium rounded-xl ring-[#1f1f1f] shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)] text-gray-600 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
              />
              <InputOTPSlot
                index={1}
                className="text-[40px] font-medium rounded-xl ring-[#1f1f1f] shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)] text-gray-600 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
              />
              <InputOTPSlot
                index={2}
                className="text-[40px] font-medium rounded-xl ring-[#1f1f1f] shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)] text-gray-600 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
              />
              <InputOTPSlot
                index={3}
                className="text-[40px] font-medium rounded-xl ring-[#1f1f1f] shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)] text-gray-600 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
              />
              <InputOTPSlot
                index={4}
                className="text-[40px] font-medium rounded-xl ring-[#1f1f1f] shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)] text-gray-600 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
              />
              <InputOTPSlot
                index={5}
                className="text-[40px] font-medium rounded-xl ring-[#1f1f1f] shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)] text-gray-600 justify-center flex border-2 border-light-300 size-12 md:size-16 gap-5"
              />
            </InputOTPGroup>
          </InputOTP>
          <AlertDialogFooter>
            <div className="flex w-full gap-4 flex-col">
              <AlertDialogAction
                onClick={submitHandler}
                type="button"
                className="h-12 bg-[#1f1f1f] font-medium text-[14px] leading-[20px] hover:bg-[#3f3f3f] transition-all rounded-full"
              >
                Submit
                {loading && (
                  <Image
                    src={"/assets/icons/loader.svg"}
                    className="m1-2 animate-spin"
                    alt="spinner"
                    width={24}
                    height={24}
                  />
                )}
              </AlertDialogAction>
              <div className="text-center">
                Didn&apos;t get the code?
                <Button
                  onClick={resendOtp}
                  variant={"link"}
                  type="button"
                  className="pl-1 text-[#1f1f1f]"
                >
                  Click to resend
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OTPModal;
