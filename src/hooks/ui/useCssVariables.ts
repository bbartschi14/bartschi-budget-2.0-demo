import { useEffect } from "react";

/**
 * Custom React hook to sync a value to a root CSS variable.
 * Can be used in conjunction with `useElementSize` to sync a value to a CSS variable.
 *
 * @example
 * const { ref, height } = useElementSize();
 * useCssVariable(layoutCSSVariables.bottomNavHeight, `${height}px`);
 */
function useCssVariable(name: `--${string}`, value: string) {
  useEffect(() => {
    const root: HTMLElement = document.querySelector(":root")!;
    if (root) {
      root.style.setProperty(name, value);
    }
  }, [name, value]);
}

export default useCssVariable;
