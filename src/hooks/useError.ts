import { useCallback, useContext } from "react";
import { ErrorContext, ErrorSetContext } from "@/providers/ErrorProvider";
import { FetchError } from "@/lib/FetchError";

export function useError () {

  const error = useContext(ErrorContext);
  const setError = useContext(ErrorSetContext);
  
  if (!setError) {
    throw new Error("The setError is missing.");
  }

  const tmpSetError = useCallback((error: Error | null) => {

    let serialized = null;
    if (error) {
      serialized = { 
        message:  error.message, 
        stack: error.stack, 
        name: error.name,
        status: error instanceof FetchError ? error.status : undefined,
        request: error instanceof FetchError ? error.request : undefined,
      };
    }
    setError(serialized);
  }, [setError]);

  return {
    error,
    setError: tmpSetError,
  };
}