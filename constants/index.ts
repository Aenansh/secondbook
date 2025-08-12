export const navigations = (accountId: string) => {
  return [
    {
      title: "Browse",
      icon: "/assets/icons/browse.svg",
      href: "/",
    },
    {
      title: "Search",
      icon: "/assets/icons/search.svg",
      href: "/search",
    },
    {
      title: "Upload",
      icon: "/assets/icons/upload.svg",
      href: `/upload/${accountId}`,
    },
    {
      title: "Profile",
      icon: "/assets/icons/user.svg",
      href: `/profile/${accountId}`,
    },
  ];
};
