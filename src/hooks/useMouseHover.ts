import { useRef, useEffect, useState } from "react";

export const useMouseHover = () => {
  const ref = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    function handleOnMouseEnter() {
      setIsHover(true);
    }
    function handleOnMouseLeave() {
      setIsHover(false);
    }
    if (ref.current) {
      const current = ref.current;
      current.addEventListener("mouseenter", handleOnMouseEnter);
      current.addEventListener("mouseleave", handleOnMouseLeave);
      return () => {
        current.removeEventListener("mouseenter", handleOnMouseEnter);
        current.removeEventListener("mouseleave", handleOnMouseLeave);
      };
    }
  }, [ref, setIsHover]);

  return {
    ref,
    isHover,
  };
};