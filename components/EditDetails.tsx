"use client";

import { changeEmail, changeUsername } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

type EditType = "username" | "email";

const EditDetails = ({
  formType,
  user,
}: {
  formType: EditType;
  user: User;
}) => {
  const [value, setValue] = useState(
    formType === "username" ? user.username : user.email
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleValue = async () => {
    console.log(value);
    try {
      if (formType === "username") await changeUsername(user, value);
      else await changeEmail(user, value);
    } catch (error) {
      toast.error("Failed to change the details!");
    } finally {
      setIsOpen(false)
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Edit {formType === "username" ? "Username" : "Email"}
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">
                {formType === "email" ? "Email" : "Username"}
              </Label>
              <Input
                id="name-1"
                name="name"
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleValue}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditDetails;
