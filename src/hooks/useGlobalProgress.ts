import { useContext } from "react";
import { GlobalProgressContext, GlobalProgressSetContext } from "@/providers/GlobalProgressProvider";

export function useGlobalProgressValue () {

  const globalProgress = useContext(GlobalProgressContext);

  return {
    globalProgress,
  };
}

export function useSetGlobalProgress () {

  const setGlobalProgress = useContext(GlobalProgressSetContext);

  if (!setGlobalProgress) {
    throw new Error("The GlobalProgressProvider is missing.");
  }

  return {
    setGlobalProgress,
  };
}

export function useGlobalProgress () {

  const { globalProgress } = useGlobalProgressValue();
  const { setGlobalProgress } = useSetGlobalProgress();

  return {
    globalProgress,
    setGlobalProgress
  };
}