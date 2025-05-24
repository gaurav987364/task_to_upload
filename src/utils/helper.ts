import type { StepsTypes } from "./types";

export const Steps : StepsTypes[] = [
    {
        label:"Info",
        href:"/formlayout/info",
        success:true,
    },
    {
        label:"Address",
        href:"/formlayout/address",
        success:false,
    },
    {
        label:"Thanks",
        href:"/formlayout/review",
        success:false,
    },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    wait: number
  ): ((...args: Parameters<F>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<F>): void => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    };
};