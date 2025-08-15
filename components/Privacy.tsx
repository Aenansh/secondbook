"use client";

import { privacyUpdate } from "@/actions/user.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Privacy = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    try {
      await privacyUpdate(user.$id);
      toast.success(
        `Successfully made your account ${!user.privacy ? "private" : "public"}`
      );
    } catch (error) {
      toast.error("Failed to change the user privacy!");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          {user.privacy ? "Make account public" : "Make account private"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to make your account{" "}
            {user.privacy === true ? "Public" : "Private"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can always change the privacy of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[#1f1f1f]" onClick={handleClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Privacy;
