"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appConfig } from "@/lib/appwrite/constants";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "./user.actions";

interface fileParams {
  file: File;
  title: string;
  description: string;
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({ file, title, description }: fileParams) => {
  const { databases, storage } = await createAdminClient();

  try {
    if (!file) throw new Error("No file selected!");
    if ([title, description].some((e: any) => !e?.trim())) {
      throw new Error("All fields required!");
    }
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appConfig.bucketId,
      ID.unique(),
      inputFile
    );
    const currentUser = await getCurrentUser();
    const fileDocument = {
      url: constructFileUrl(bucketFile.$id),
      name: bucketFile.name,
      isPublished: true,
      bucketFileId: bucketFile.$id,
      accountId: currentUser.accountId,
      type: getFileType(bucketFile.name).type,
      description,
      title,
      extension: getFileType(bucketFile.name).extension,
      owner: currentUser.$id,
    };

    const newPost = await databases
      .createDocument(
        appConfig.dbId,
        appConfig.fileCollId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        storage.deleteFile(appConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to post!");
      });
    return parseStringify(newPost);
  } catch (error) {
    handleError(error, "Something happened while posting...");
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const { databases } = await createAdminClient();

    const posts = await databases.listDocuments(
      appConfig.dbId,
      appConfig.fileCollId,
      [Query.equal("accountId", [userId])]
    );

    return parseStringify(posts);
  } catch (error) {
    handleError(error, "Failed to fetch all the user posts!");
  }
};

export const getAllPosts = async () => {
  try {
    const { databases } = await createAdminClient();

    const posts = await databases.listDocuments(
      appConfig.dbId,
      appConfig.fileCollId,
      [Query.notEqual("type", "avatar")]
    );

    return parseStringify(posts);
  } catch (error) {
    handleError(error, "Can't fetch the posts!");
  }
};

export const deletePost = async (post: Post) => {
  try {
    const { databases, storage } = await createAdminClient();
    await databases.deleteDocument(
      appConfig.dbId,
      appConfig.fileCollId,
      post.$id
    );
    await storage.deleteFile(appConfig.bucketId, post.bucketFileId);
  } catch (error) {
    handleError(error, "Couldn't delete the post!");
  }
};
