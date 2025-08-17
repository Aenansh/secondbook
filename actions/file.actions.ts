"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appConfig } from "@/lib/appwrite/constants";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";

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

    // --- Step 1: Find all users with public profiles ---
    const publicUsersResponse = await databases.listDocuments(
      appConfig.dbId,
      appConfig.userCollId, // Your users collection ID
      [
        Query.equal("privacy", [false]), // Find users where privacy is false
      ]
    );

    const publicUserIds = publicUsersResponse.documents.map((user) => user.$id);

    // If no public users are found, return an empty array immediately.
    if (publicUserIds.length === 0) {
      return { documents: [] };
    }

    // --- Step 2: Fetch posts created by those public users ---
    const publicPosts = await databases.listDocuments(
      appConfig.dbId,
      appConfig.fileCollId, // Your posts collection ID
      [
        // Find posts where the 'owner' ID is in our list of public user IDs
        Query.equal("owner", publicUserIds),
        Query.notEqual("type", "avatar"), // Optional: exclude avatars
      ]
    );

    return parseStringify(publicPosts);
  } catch (error) {
    console.error("Failed to fetch public posts:", error);
    return { documents: [] };
  }
};

export const deletePost = async (post: Post, path: string) => {
  try {
    const { databases, storage } = await createAdminClient();
    await databases.deleteDocument(
      appConfig.dbId,
      appConfig.fileCollId,
      post.$id
    );
    await storage.deleteFile(appConfig.bucketId, post.bucketFileId);
    revalidatePath(path);
  } catch (error) {
    handleError(error, "Couldn't delete the post!");
  }
};

export const getPostById = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();

    const post = await databases.listDocuments(
      appConfig.dbId,
      appConfig.fileCollId,
      [Query.equal("$id", postId)]
    );

    return post.total > 0 ? post.documents[0] : null;
  } catch (error) {
    handleError(error, `Failed to fetch the post ${postId}`);
  }
};
