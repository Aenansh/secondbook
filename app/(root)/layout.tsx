import { getCurrentUser } from "@/actions/user.actions";
import { FloatingDock } from "@/components/ui/floating-dock";
import { navigations } from "@/constants";
import AccountProvider from "@/contexts/AccountProvider";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");
  const navs = navigations(currentUser.accountId);

  return (
    <>
      <AccountProvider>
        <main className="relative">
          <div className="fixed z-100">
            <FloatingDock
              items={navs}
              desktopClassName="mx-auto my-5 fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
              mobileClassName="mx-5 my-3 fixed bottom-6 z-50"
            />
          </div>

          <div>{children}</div>
          <Toaster />
        </main>
      </AccountProvider>
    </>
  );
}
