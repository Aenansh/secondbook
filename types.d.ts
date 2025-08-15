declare interface User {
  username: string;
  email: string;
  avatar: string;
  privacy: boolean;
  accountId: string;
  $id: string;
  avatarId: string;
}


declare interface Post {
  title: string;
  description: string;
  url: string;
  $id: string;
  type: string;
  owner: User;
  bucketFileId: string;
  name: string;
}