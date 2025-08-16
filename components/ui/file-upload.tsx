"use client";

import { cn, getFileType } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion"; // Note: It's generally 'framer-motion', not 'motion/react'
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import Image from "next/image";
import { uploadFile } from "@/actions/file.actions";
import { useAccount } from "@/contexts/AccountProvider";
import { useRouter } from "next/navigation";
const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 0,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const fileFormSchema = () => {
  return z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters long.")
      .max(255, "Title cannot be longer than 255 characters."),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters long.")
      .max(1200, "Description cannot be longer than 1200 characters."),
  });
};

// Type definition for our state, ensuring each file has a unique ID
type UploadedFile = {
  id: string;
  file: File;
};

export const FileUpload = ({
  onChange,
  accountId,
}: {
  onChange?: (files: UploadedFile[]) => void;
  accountId: string;
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const fileSchema = fileFormSchema();
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  // Correctly handles an array of File objects and converts them
  const handleFileChange = (newFiles: File[]) => {
    if (disable) return;

    const validFile: File[] = [];
    const inValidFile: File[] = [];

    newFiles.forEach((file) => {
      const type = getFileType(file.name);
      if (!["image", "video", "audio"].includes(type.type))
        inValidFile.push(file);
      else validFile.push(file);
    });

    inValidFile.forEach((file) => {
      toast.error(
        <p className="body-2 text-red-600">
          <span className="font-semibold">{file.name}</span> is not a supported
          file type.
        </p>
      );
    });
    if (validFile.length <= 0) return;
    const newUploadedFiles = validFile.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
    }));
    const updatedFiles = [...files, ...newUploadedFiles];
    setFiles(updatedFiles);
    setDisable(true);
    onChange && onChange(updatedFiles);
  };

  const handleClick = () => {
    if (!disable) fileInputRef.current?.click();
  };

  // Correctly removes a file by its unique ID
  const removeFile = (idToRemove: string) => {
    const updatedFiles = files.filter((item) => item.id !== idToRemove);
    setFiles(updatedFiles);
    setDisable(false); // Allow uploading a new file
    onChange && onChange(updatedFiles);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange, // onDrop provides File[] which handleFileChange now correctly handles
  });
  const submitForm = async (values: z.infer<typeof fileSchema>) => {
    setLoading(true);
    try {
      const title = values.title;
      const description = values.description;
      const { file } = files[0];
      await uploadFile({ file, title, description }).then((uploadedFile) => {
        if (uploadedFile) {
          setFiles([]);
        }
        console.log("file uploaded");
        toast.success("Post created successfully!");
        router.push(`/profile/${accountId}`);
      });
    } catch (error) {
      console.log("We failed to post!", error);
      toast.error("Post creation failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-center text-[#1f1f1f] font-bold text-4xl px-4 py-5 md:py-6 md:px-5 mb-4">
        Add a new page to your book
      </h1>
      <div className="flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-center">
            Create a new post
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-center mt-2">
            Upload your image and fill in the details
          </p>
        </div>
        <div {...getRootProps()}>
          <motion.div
            onClick={handleClick}
            whileHover={!disable ? "animate" : ""}
            className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              id="file-upload-handle"
              type="file"
              onChange={(e) =>
                handleFileChange(Array.from(e.target.files || []))
              }
              className="hidden"
              disabled={disable}
            />
            <div className="relative w-full max-w-xl mx-auto">
              {files.length > 0 &&
                files.map(
                  (
                    item,
                    idx // Using 'item' which is { id, file }
                  ) => (
                    <motion.div
                      key={item.id} // Use the unique ID for the key
                      layoutId={
                        idx === 0 ? "file-upload" : "file-upload-" + idx
                      }
                      className={cn(
                        "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                        "shadow-sm"
                      )}
                    >
                      <button
                        onClick={() => removeFile(item.id)}
                        className="absolute top-2 right-2 cursor-pointer"
                      >
                        <Trash2 className="text-neutral-600" size={14} />
                      </button>
                      <div className="flex justify-between w-full items-center gap-4 mt-2">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                        >
                          {item.file.name}{" "}
                          {/* Access properties via item.file */}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                        >
                          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                        </motion.p>
                      </div>

                      <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                        >
                          {item.file.type}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                        >
                          modified{" "}
                          {new Date(
                            item.file.lastModified
                          ).toLocaleDateString()}
                        </motion.p>
                      </div>
                    </motion.div>
                  )
                )}
              {!files.length && (
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-full",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center"
                    >
                      Drop it
                      <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.p>
                  ) : (
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>
              )}

              {!files.length && (
                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-full"
                ></motion.div>
              )}
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col justify-center mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="flex flex-col gap-4 md:gap-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex h-[78px] flex-col justify-center rounded-xl border border-gray-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
                      <FormLabel className="text-[#1f1f1f] pt-2 text-[14px] leading-[20px] w-full">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="what's your post title?"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex h-[78px] flex-col justify-center rounded-xl border border-gray-300 px-4 shadow-[0px_10px_30px_0px_rgba(66,71,97,0.1)]">
                      <FormLabel className="text-[#1f1f1f] pt-2 text-[14px] leading-[20px] w-full">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="describe your post"
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
                Post
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
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};
