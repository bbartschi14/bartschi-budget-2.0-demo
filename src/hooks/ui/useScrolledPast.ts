import { type Ref, useEffect, useRef, useState } from "react";

function useScrolledPast<T extends HTMLDivElement>(
  amount: number
): [boolean, Ref<T>] {
  const [scrolledPast, setScrolledPast] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const current = elementRef.current;
    const handleScroll = () => {
      const isScrolledPast = current.scrollTop > amount;
      if (isScrolledPast !== scrolledPast) {
        setScrolledPast(isScrolledPast);
      }
    };

    // Add the scroll event listener to the element
    current.addEventListener("scroll", handleScroll);

    // Check against current scroll position
    handleScroll();

    // Clean up the listener when the component unmounts
    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [amount, scrolledPast]);

  return [scrolledPast, elementRef];
}

export default useScrolledPast;
