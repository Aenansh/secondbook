import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { appConfig } from "./appwrite/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) =>
   JSON.parse(JSON.stringify(value));

export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return { type: "other", extension: "" };

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "ogg", "flac"];

  if (imageExtensions.includes(extension)) return { type: "image", extension };
  if (videoExtensions.includes(extension)) return { type: "video", extension };
  if (audioExtensions.includes(extension)) return { type: "audio", extension };

  return { type: "other", extension };
};

export const constructFileUrl = (bucketFileId: string) => {
  console.log("projectId", appConfig.projectId)
  return `${appConfig.endpoint}/storage/buckets/${appConfig.bucketId}/files/${bucketFileId}/view?project=${appConfig.projectId}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${appConfig.endpoint}/storage/buckets/${appConfig.bucketId}/files/${bucketFileId}/download?project=${appConfig.projectId}`;
};