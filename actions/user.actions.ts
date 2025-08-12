"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appConfig } from "@/lib/appwrite/constants";
import { constructFileUrl, parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appConfig.dbId,
    appConfig.userCollId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send the OTP");
  }
};

export const createUserAccount = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendOTP({ email });

  if (!accountId) throw new Error("OTP failed!");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appConfig.dbId,
      appConfig.userCollId,
      ID.unique(),
      {
        username,
        email,
        password,
        accountId,
      }
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify the OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appConfig.dbId,
      appConfig.userCollId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to signout the user!");
  } finally {
    redirect("/sign-in");
  }
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({
      accountId: null,
      error: "User not found!",
    });
  } catch (error) {
    handleError(error, "Failed to sign in the user");
  }
};

export const updateUserAvatar = async ({
  userId,
  file,
}: {
  userId: string;
  file: File;
}) => {
  try {
    const { storage, databases } = await createAdminClient();

    // 1. Upload the new avatar file to storage
    // THE FIX: Convert ArrayBuffer to Buffer before creating the InputFile
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    const uploadedFile = await storage.createFile(
      appConfig.bucketId,
      ID.unique(),
      inputFile
    );

    // 2. Get the public URL of the uploaded file
    const avatarUrl = constructFileUrl(uploadedFile.$id);

    // 3. Update the user document with the new avatar URL
    const updatedUser = await databases.updateDocument(
      appConfig.dbId,
      appConfig.userCollId,
      userId,
      {
        avatar: avatarUrl,
        avatarId: uploadedFile.$id,
      }
    );

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error, "Failed to update avatar!");
  }
};

export const deleteAvatar = async () => {
  try {
    const { databases, storage } = await createAdminClient();
    const user = await getCurrentUser();
    await databases.updateDocument(
      appConfig.dbId,
      appConfig.userCollId,
      user.$id,
      {
        avatar: "",
        avatarId: "",
      }
    );

    await storage.deleteFile(appConfig.bucketId, user.avatarId);
  } catch (error) {
    handleError(error, "Couldn't delete the avatar!");
  }
};

export const getUserById = async (userId: string) => {
  try {
    const { databases } = await createAdminClient();

    const user = await databases.listDocuments(
      appConfig.dbId,
      appConfig.userCollId,
      [Query.equal("accountId", [userId])]
    );

    return user.total > 0 ? parseStringify(user) : null;
  } catch (error) {
    handleError(error, "No user found!");
  }
};
