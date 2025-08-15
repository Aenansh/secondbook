"use client";

import { getCurrentUser } from "@/actions/user.actions";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

declare interface AccountProps {
  accountId: string | null;
  userId: string | null;
}

const AccountContext = createContext<AccountProps | undefined>(undefined);

const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setAccountId(user.accountId);
        setUserId(user.$id);
      } catch (error) {
        toast.error("Failed to fetch user details!");
        setAccountId(null);
        setUserId(null);
      }
    };
    fetchData();
  }, []);
  const value = { accountId, userId };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("User doesn't exists!");
  }
  return context;
};

export default AccountProvider;
