import { useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from "./useAuth";
import { useError } from "./useError";

export default function useSession() {
  const { me, fetchUser } = useAuth();
  const router = useRouter();
  const { setError } = useError();

  useEffect(() => {
    (async () => {
      try {
        await fetchUser();
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setError(err);
      }
    })();
  }, [setError, router, fetchUser]);

  return me;
}
