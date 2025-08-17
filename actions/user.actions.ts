"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appConfig } from "@/lib/appwrite/constants";
import { constructFileUrl, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
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
  const { databases, account } = await createAdminClient();
  const existingUser = await getUserByEmail(email);
  const name = username;
  const newUser = await account.create(ID.unique(), email, password, name);

  const accountId = await sendOTP({ email });

  if (!accountId) throw new Error("OTP failed!");

  if (!existingUser) {
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
      const { account } = await createAdminClient();
      const verifyPassword = await account.createEmailPasswordSession(
        email,
        password
      );
      if (!verifyPassword) throw new Error("Incorrect Password!");
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
  path,
}: {
  userId: string;
  file: File;
  path: string;
}) => {
  try {
    const { storage, databases } = await createAdminClient();

    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);
    const userDoc = await getUserById(userId);

    if (userDoc.avatarId)
      await storage.deleteFile(appConfig.bucketId, userDoc.avatarId);
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
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error, "Failed to update avatar!");
  }
};

export const deleteAvatar = async (path: string) => {
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
    revalidatePath(path);
  } catch (error) {
    handleError(error, "Couldn't delete the avatar!");
  }
};

export const getUserByAccount = async (userId: string) => {
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
export const getUserById = async (userId: string) => {
  try {
    const { databases } = await createAdminClient();

    const user = await databases.listDocuments(
      appConfig.dbId,
      appConfig.userCollId,
      [Query.equal("$id", [userId])]
    );

    return user.total > 0 ? parseStringify(user) : null;
  } catch (error) {
    handleError(error, "No user found!");
  }
};

export const deleteAccount = async (userId: string, accountId: string) => {
  console.log("--- Attempting to delete account ---");
  console.log(`Received Document ID (userId): ${userId}`);
  console.log(`Received Auth ID (accountId): ${accountId}`);

  if (!userId || !accountId) {
    handleError(null, "Error: Missing userId or accountId.");
    return;
  }

  try {
    const { users, databases, storage } = await createAdminClient();

    // --- Step 1: Find and delete all posts and their associated files ---
    console.log("Step 1: Finding and deleting user posts and files...");
    const userPosts = await databases.listDocuments(
      appConfig.dbId,
      appConfig.fileCollId,
      [Query.equal("owner", userId)]
    );

    if (userPosts.documents.length > 0) {
      const deletePromises = userPosts.documents.map(async (post) => {
        try {
          await databases.deleteDocument(
            appConfig.dbId,
            appConfig.fileCollId,
            post.$id
          );
          if (post.bucketFileId) {
            await storage.deleteFile(appConfig.bucketId, post.bucketFileId);
          }
        } catch (error) {
          console.warn(
            `Could not delete post ${post.$id} or its file. Continuing...`
          );
        }
      });
      await Promise.all(deletePromises);
    }
    console.log("Step 1: Complete.");

    // --- Step 2: Delete the user's database document ---
    console.log("Step 2: Deleting user document...");
    await databases.deleteDocument(
      appConfig.dbId,
      appConfig.userCollId,
      userId
    );
    console.log("Step 2: Complete.");

    // --- Step 3: Delete the user from the Auth service ---
    console.log("Step 3: Deleting auth user...");
    await users.delete(accountId);
    console.log("Step 3: Complete.");

    console.log("--- Account deleted successfully. ---");
    return { success: true };
  } catch (error) {
    handleError(
      error,
      `Failed during account deletion process for user ${accountId}.`
    );
  }
};

export const privacyUpdate = async (userId: string, path: string) => {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.listDocuments(
      appConfig.dbId,
      appConfig.userCollId,
      [Query.equal("$id", userId)]
    );
    await databases.updateDocument(
      appConfig.dbId,
      appConfig.userCollId,
      userId,
      {
        privacy: !user.documents[0].privacy,
      }
    );
    revalidatePath(path);
  } catch (error) {
    handleError(error, "Failed to change the privacy settings!");
  }
};

export const changeUsername = async (
  user: User,
  newName: string,
  path: string
) => {
  try {
    const { databases, users } = await createAdminClient();

    await databases.updateDocument(
      appConfig.dbId,
      appConfig.userCollId,
      user.$id,
      { username: newName }
    );
    await users.updateName(user.accountId, newName);
    revalidatePath(path);
  } catch (error) {
    handleError(error, "failed to change the username!");
  }
};

export const changeEmail = async (
  user: User,
  newEmail: string,
  path: string
) => {
  try {
    const { databases, users, account } = await createAdminClient();
    // if (!password) throw new Error("Password is required!");
    await users.updateEmail(user.accountId, newEmail);
    await databases.updateDocument(
      appConfig.dbId,
      appConfig.userCollId,
      user.$id,
      { email: newEmail }
    );
    revalidatePath(path);
  } catch (error) {
    handleError(error, "failed to change the username!");
  }
};
