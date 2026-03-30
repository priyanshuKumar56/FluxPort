import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safe to import in Client Components: only registers in the browser.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export {};

