export const appConfig = {
  projectId : process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  endpoint : process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  dbId: process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
  userCollId: process.env.NEXT_PUBLIC_APPWRITE_USERS_ID!,
  fileCollId: process.env.NEXT_PUBLIC_APPWRITE_FILES_ID!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
}