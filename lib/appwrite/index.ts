"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appConfig } from "./constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appConfig.endpoint)
    .setProject(appConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
     return redirect("/sign-in");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appConfig.endpoint)
    .setProject(appConfig.projectId)
    .setKey(appConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
