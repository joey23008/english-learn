import { useRef, useEffect, useCallback } from "react";
import variables from '@/components/_variables.module.scss';

export const useFillSpaceBelow = <T extends HTMLElement>() => {
  const fillTargetRef = useRef<T | null>(null);
  const triggerFn = useCallback(() => {
    if (fillTargetRef.current) {
      const clientRect = fillTargetRef.current.getBoundingClientRect();
      const winHeight = window.innerHeight;
      let diff = winHeight - clientRect.y - Number(variables['h_header']);
      diff = diff > 168 ? diff : 168;
      fillTargetRef.current.style.height = diff + 'px';
    }
  }, [fillTargetRef]);
  
  useEffect(() => {
    triggerFn();
    window.onresize = triggerFn;
  }, [triggerFn]);

  return {
    fillTargetRef,
    triggerFn,
  };
};