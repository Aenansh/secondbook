"use client";

import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { deleteAvatar, logout } from "@/actions/user.actions";
import { updateUserAvatar } from "@/actions/user.actions";
import { useRouter } from "next/navigation";
import ImageCropper from "./ImageCropper"; // Import the new component
import Privacy from "./Privacy";

const AvatarUpload = ({ avatar, user }: { avatar: string; user: User }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setSelectedImage(null); // Close the modal
    setIsUploading(true);
    try {
      await updateUserAvatar({ userId: user.$id, file: croppedFile });
      router.refresh();
    } catch (error) {
      console.error("Failed to upload new avatar", error);
      alert("Upload failed! Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="active:border-none outline-none">
          <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden">
            {isUploading ? (
              <Image src={"/assets/icons/loader.svg"} alt="loader" fill />
            ) : (
              <Image src={avatar} alt="profile" fill className="object-cover" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => inputRef.current?.click()}>
            {isUploading ? "Uploading..." : "Change Avatar"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={deleteAvatar} className="text-red-600">
            Delete avatar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => await logout()}
            className="text-red-600"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />

      {selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default AvatarUpload;
