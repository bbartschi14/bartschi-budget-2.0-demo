import { useEffect, useState } from "react";

function useWindowScrolledPast(amount: number): boolean {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolledPast = window.scrollY > amount;
      if (isScrolledPast !== scrolledPast) {
        setScrolledPast(isScrolledPast);
      }
    };

    // Add the scroll event listener to the element
    window.addEventListener("scroll", handleScroll);

    // Check against current scroll position
    handleScroll();

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [amount, scrolledPast]);

  return scrolledPast;
}

export default useWindowScrolledPast;
