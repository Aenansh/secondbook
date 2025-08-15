"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Privacy from "./Privacy";
import { deleteAccount, logout } from "@/actions/user.actions";
import { useRouter } from "next/navigation";
import { useAccount } from "@/contexts/AccountProvider";
import { toast } from "sonner";
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
} from "./ui/alert-dialog";
import EditDetails from "./EditDetails";

// Assuming the User type is globally available
// interface User { ... }

const Settings = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  const { userId, accountId } = useAccount();

  const handleDeleteAccount = async () => {
    if (userId && accountId) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete your account? This action can't be undone."
      );
      if (isConfirmed) {
        try {
          await deleteAccount(userId, accountId);
          router.push("/sign-up");
        } catch (error) {
          toast.error("Failed to delete the account!");
        }
      }
    }
  };
  return (
    <>
      <div className="space-y-8 p-4 md:p-8 mx-auto bg-white rounded-3xl md:px-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Settings</h1>

        {/* Profile Section */}
        <div className="border-b pb-8 text-center sm:text-left">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage your public profile information.
          </p>
          <div className="space-y-4">
            {/* Responsive layout for username */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-grow">
                <p className="font-medium">Username</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
              <EditDetails formType="username" user={user} />
            </div>
            {/* Responsive layout for email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-grow">
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <EditDetails formType="email" user={user} />
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="border-b pb-8 text-center sm:text-left">
          <h2 className="text-xl font-semibold">Privacy</h2>
          <p className="text-sm text-gray-500 mb-4">
            Control who can see your profile and posts.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-grow">
              <p className="font-medium">Profile Privacy</p>
              <p className="text-sm text-gray-500">
                {user.privacy
                  ? "Your profile is private."
                  : "Your profile is public."}
              </p>
            </div>
            <div className="w-full sm:w-auto mx-auto sm:mx-0">
              <Privacy user={user} />
            </div>
          </div>
        </div>

        {/* Session Section */}
        <div className="border-b pb-8 text-center sm:text-left">
          <h2 className="text-xl font-semibold">Session</h2>
          <p className="text-sm text-gray-500 mb-4">
            End your current session.
          </p>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            Log Out
          </Button>
        </div>

        {/* Account Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold">Account</h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all of your content.
          </p>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you really want to delete your account? This action can't
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default Settings;
