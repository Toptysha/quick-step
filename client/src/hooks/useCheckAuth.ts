import { useEffect, useState } from "react";

export const useCheckAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        setIsAdmin(res.ok);
      } catch (err) {
        setIsAdmin(false);
      }
    };

    check();
  }, []);

  return isAdmin;
};
